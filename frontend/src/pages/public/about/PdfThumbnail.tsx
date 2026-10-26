import { useState } from "react";
import { cn } from "@/lib/utils";
import { IconDoc } from "./icons";
import { getDocumentSource, type DocumentId } from "./documents";

/**
 * Shows the saved screenshot of a document's first page as a lightweight
 * preview, so cards do not need to render the PDF itself.
 */
export function PdfThumbnail({
  docId,
  className,
}: {
  docId: DocumentId;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const source = getDocumentSource(docId);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-white",
        className,
      )}
    >
      {failed ? (
        <div className="flex flex-col items-center gap-2 px-6 py-10 text-center text-sm text-ink-500">
          <IconDoc className="h-8 w-8 text-ink-300" />
          Preview unavailable
        </div>
      ) : (
        <img
          src={source.previewUrl}
          alt={`${source.title} — page 1 preview`}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      )}
    </div>
  );
}
