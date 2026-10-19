import { useCallback, useEffect, useRef, useState } from "react";
import type { RenderParameters } from "pdfjs-dist/types/src/display/api";
import { cn } from "@/lib/utils";
import { buttonClass } from "@/components/ui/buttonStyles";
import {
  downloadDocument,
  getDocumentSource,
  loadDocument,
  type DocumentId,
} from "./documents";
import {
  IconChevronLeft,
  IconChevronRight,
  IconClose,
  IconDownload,
  IconMinus,
  IconPlus,
} from "./icons";

type PdfStatus = "loading" | "ready" | "error";

interface ReaderState {
  status: PdfStatus;
  pageNumber: number;
  totalPages: number | null;
  zoom: number;
}

const ERROR_MESSAGE =
  "The PDF preview could not load in this browser. Use Download PDF to open the unchanged original file in a PDF reader.";

const iconButton =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-900 disabled:cursor-not-allowed disabled:opacity-40";

/**
 * Renders an original PDF page onto a canvas, fitting the page inside the
 * stage by default and re-rendering (debounced) on resize.
 */
function PdfStage({
  docId,
  pageNumber,
  totalPages,
  zoom,
  stageRef,
  canvasRef,
  onPageStep,
  onState,
  className,
}: {
  docId: DocumentId;
  pageNumber: number;
  totalPages: number | null;
  zoom: number;
  stageRef: React.RefObject<HTMLDivElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onPageStep: (delta: number) => void;
  onState: (state: ReaderState) => void;
  className?: string;
}) {
  const [ready, setReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [accessibleText, setAccessibleText] = useState("");
  const renderTaskRef = useRef<{ cancel: () => void } | null>(null);

  // Re-render (debounced) when the stage is resized.
  const [sizeVersion, setSizeVersion] = useState(0);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof ResizeObserver === "undefined") return;
    let timer: number | undefined;
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setSizeVersion((v) => v + 1), 200);
    });
    observer.observe(stage);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [stageRef]);

  useEffect(() => {
    let cancelled = false;

    renderTaskRef.current?.cancel();
    renderTaskRef.current = null;
    setReady(false);
    setHasError(false);
    onState({ status: "loading", pageNumber, totalPages: null, zoom });

    void (async () => {
      try {
        const pdf = await loadDocument(docId);
        if (cancelled) return;
        onState({
          status: "loading",
          pageNumber,
          totalPages: pdf.numPages,
          zoom,
        });

        const page = await pdf.getPage(pageNumber);
        if (cancelled) return;
        const stage = stageRef.current;
        const canvas = canvasRef.current;
        if (!stage || !canvas) return;

        const natural = page.getViewport({ scale: 1 });
        const style = getComputedStyle(stage);
        const availableWidth = Math.max(
          50,
          stage.clientWidth -
            parseFloat(style.paddingLeft) -
            parseFloat(style.paddingRight) -
            4,
        );
        const availableHeight = Math.max(
          50,
          stage.clientHeight -
            parseFloat(style.paddingTop) -
            parseFloat(style.paddingBottom) -
            4,
        );
        const fitScale = Math.min(
          availableWidth / natural.width,
          availableHeight / natural.height,
        );
        const viewport = page.getViewport({ scale: fitScale * zoom });
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.ceil(viewport.width * ratio);
        canvas.height = Math.ceil(viewport.height * ratio);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        const task = page.render({
          canvas,
          canvasContext: canvas.getContext("2d")!,
          viewport,
          transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0],
          background: "rgb(255, 255, 255)",
        } as RenderParameters);
        renderTaskRef.current = task;
        await task.promise;
        if (cancelled) return;
        renderTaskRef.current = null;
        stage.scrollTop = 0;
        stage.scrollLeft = 0;
        setReady(true);

        const text = await page.getTextContent();
        if (cancelled) return;
        setAccessibleText(
          text.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" ") || "This source page has no text content.",
        );

        onState({
          status: "ready",
          pageNumber,
          totalPages: pdf.numPages,
          zoom,
        });
      } catch (error) {
        if (cancelled) return;
        if (
          (error as { name?: string } | null)?.name ===
          "RenderingCancelledException"
        ) {
          return;
        }
        console.error("PDF rendering error:", error);
        setHasError(true);
        onState({ status: "error", pageNumber, totalPages: null, zoom });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [docId, pageNumber, zoom, sizeVersion, stageRef, canvasRef, onState]);

  useEffect(
    () => () => {
      renderTaskRef.current?.cancel();
    },
    [],
  );

  const source = getDocumentSource(docId);
  const stageLabel = hasError
    ? `${source.title}: preview unavailable`
    : totalPages === null
      ? `Original PDF: ${source.title}`
      : `Original PDF: ${source.title}, page ${pageNumber} of ${totalPages}`;

  return (
    <div
      className={cn(
        "relative flex items-start justify-start overflow-auto overscroll-contain bg-ink-100 p-4 focus-visible:outline-brand-600",
        className,
      )}
      tabIndex={0}
      role="region"
      aria-label={stageLabel}
      ref={stageRef as React.RefObject<HTMLDivElement>}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          onPageStep(-1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          onPageStep(1);
        }
      }}
    >
      {!ready && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
          <div
            className={cn(
              "flex max-w-xs items-center gap-2.5 text-center text-sm text-ink-500",
              hasError && "text-negative-600",
            )}
          >
            {!hasError && (
              <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-brand-500" />
            )}
            {hasError ? ERROR_MESSAGE : "Loading original PDF…"}
          </div>
        </div>
      )}
      <canvas
        aria-hidden="true"
        ref={canvasRef as React.RefObject<HTMLCanvasElement>}
        className={cn(
          "mx-auto shrink-0 self-start bg-white shadow-md",
          ready ? "block" : "hidden",
        )}
      />
      <div className="sr-only">{accessibleText}</div>
    </div>
  );
}

/**
 * Toolbar + stage + live feedback for one original PDF. Inline press previews
 * and the expanded reader share this component.
 */
export function PdfReader({
  docId,
  variant,
  lazy = false,
  showPreviewLabel = false,
  showZoom = false,
  prevLabel,
  nextLabel,
  className,
}: {
  docId: DocumentId;
  variant: "inline" | "modal";
  lazy?: boolean;
  showPreviewLabel?: boolean;
  showZoom?: boolean;
  prevLabel: string;
  nextLabel: string;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [near, setNear] = useState(!lazy);
  const [state, setState] = useState<ReaderState>({
    status: "loading",
    pageNumber: 1,
    totalPages: null,
    zoom: 1,
  });

  useEffect(() => {
    if (near) return;
    const host = hostRef.current;
    if (!host) return;
    if (!("IntersectionObserver" in window)) {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "500px" },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, [near]);

  const handleState = useCallback((next: ReaderState) => {
    setState((prev) =>
      prev.status === next.status &&
      prev.pageNumber === next.pageNumber &&
      prev.totalPages === next.totalPages &&
      prev.zoom === next.zoom
        ? prev
        : next,
    );
  }, []);

  const busy = state.status === "loading";
  const totalPages = state.totalPages;
  const changePage = (delta: number) => {
    if (busy || totalPages === null) return;
    const target = state.pageNumber + delta;
    if (target < 1 || target > totalPages) return;
    setState((prev) => ({ ...prev, pageNumber: target }));
  };
  const changeZoom = (delta: number) => {
    if (busy) return;
    setState((prev) => ({
      ...prev,
      zoom: Math.min(3, Math.max(1, prev.zoom + delta)),
    }));
  };

  const statusText =
    state.status === "error"
      ? "Unavailable"
      : totalPages === null
        ? "Loading…"
        : `${state.pageNumber} / ${totalPages}`;

  const zoomText = state.zoom === 1 ? "Fit" : `${Math.round(state.zoom * 100)}%`;
  const prevDisabled = busy || totalPages === null || state.pageNumber <= 1;
  const nextDisabled =
    busy || totalPages === null || state.pageNumber >= totalPages;

  return (
    <div
      ref={hostRef}
      className={cn(
        "min-w-0",
        variant === "modal"
          ? "flex min-h-0 flex-1 flex-col bg-ink-100"
          : "overflow-hidden border-y border-ink-200 bg-ink-100",
        className,
      )}
      data-viewer-doc={docId}
      data-rendered-page={
        state.status === "ready" ? String(state.pageNumber) : undefined
      }
    >
      <div className="flex min-h-11 items-center justify-between gap-2.5 border-b border-ink-200 bg-white px-3.5">
        {variant === "inline" ? (
          <>
            {showPreviewLabel && (
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-400">
                PDF preview
              </span>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={iconButton}
                aria-label={prevLabel}
                disabled={prevDisabled}
                onClick={() => changePage(-1)}
              >
                <IconChevronLeft className="h-4 w-4" />
              </button>
              <span
                className="min-w-16 text-center text-xs text-ink-600"
                aria-live="polite"
              >
                {statusText}
              </span>
              <button
                type="button"
                className={iconButton}
                aria-label={nextLabel}
                disabled={nextDisabled}
                onClick={() => changePage(1)}
              >
                <IconChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={iconButton}
                aria-label={prevLabel}
                disabled={prevDisabled}
                onClick={() => changePage(-1)}
              >
                <IconChevronLeft className="h-4 w-4" />
              </button>
              <span
                className="min-w-16 text-center text-xs text-ink-600"
                aria-live="polite"
              >
                {statusText}
              </span>
              <button
                type="button"
                className={iconButton}
                aria-label={nextLabel}
                disabled={nextDisabled}
                onClick={() => changePage(1)}
              >
                <IconChevronRight className="h-4 w-4" />
              </button>
            </div>
            {showZoom && (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  className={iconButton}
                  aria-label="Zoom out"
                  disabled={busy || state.zoom <= 1}
                  onClick={() => changeZoom(-0.25)}
                >
                  <IconMinus className="h-4 w-4" />
                </button>
                <span
                  className="min-w-10 text-center text-xs text-ink-600"
                  aria-live="polite"
                >
                  {zoomText}
                </span>
                <button
                  type="button"
                  className={iconButton}
                  aria-label="Zoom in"
                  disabled={busy || state.zoom >= 3}
                  onClick={() => changeZoom(0.25)}
                >
                  <IconPlus className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <PdfStage
        docId={docId}
        pageNumber={state.pageNumber}
        totalPages={state.totalPages}
        zoom={state.zoom}
        stageRef={stageRef}
        canvasRef={canvasRef}
        onPageStep={changePage}
        onState={handleState}
        className={variant === "modal" ? "min-h-0 flex-1" : "h-[538px]"}
      />
      <div className="sr-only" role="status">
        {state.status === "error"
          ? "PDF preview unavailable. The original download is still available."
          : state.status === "ready" && totalPages !== null
            ? `Page ${state.pageNumber} of ${totalPages} loaded.`
            : ""}
      </div>
    </div>
  );
}

/**
 * Shared expanded reader dialog for all five original documents. Opening a
 * document starts at page 1 in fit mode. Escape closes the dialog and focus
 * returns to the triggering control.
 */
export function ExpandedPdfReader({
  docId,
  onClose,
}: {
  docId: DocumentId;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const source = getDocumentSource(docId);

  useEffect(() => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog?.open) dialog.close();
      triggerRef.current?.focus?.({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      id="document-dialog"
      ref={dialogRef}
      aria-labelledby="dialog-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target !== dialogRef.current) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        ) {
          dialogRef.current?.close();
        }
      }}
      className="m-auto h-[calc(100dvh-3.5rem)] w-[min(1180px,calc(100vw-2rem))] max-h-[1100px] max-w-none overflow-hidden rounded-2xl border border-ink-200 bg-white p-0 text-ink-900 shadow-2xl backdrop:bg-ink-950/70 backdrop:backdrop-blur-sm open:flex open:flex-col"
    >
      <div className="flex shrink-0 items-center justify-between gap-5 border-b border-ink-200 bg-white px-6 py-4">
        <div className="min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-600">
            Original document
          </span>
          <h2
            id="dialog-title"
            className="mt-1 truncate text-lg font-semibold text-ink-900"
          >
            {source.title}
          </h2>
          <span className="text-xs text-ink-500">{source.filename}</span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            className={buttonClass("outline", "sm")}
            onClick={() => void downloadDocument(docId)}
          >
            <IconDownload className="h-4 w-4" />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
          <button
            type="button"
            className={iconButton}
            aria-label="Close PDF reader"
            onClick={() => dialogRef.current?.close()}
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>
      </div>

      <PdfReader
        key={docId}
        docId={docId}
        variant="modal"
        showZoom
        prevLabel="Previous PDF page"
        nextLabel="Next PDF page"
      />

      <div className="flex shrink-0 flex-wrap justify-between gap-5 border-t border-ink-200 px-6 py-2.5 text-[11px] text-ink-500">
        <span>Original PDF · Use the arrows to browse every page.</span>
        <span>Some source documents include blank final pages.</span>
      </div>
    </dialog>
  );
}
