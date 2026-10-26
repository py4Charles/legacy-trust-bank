import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { DocumentInitParameters } from "pdfjs-dist/types/src/display/api";
import newsletterOneUrl from "@/docs/newsletter 1.pdf?url";
import newsletterTwoUrl from "@/docs/newsletter 2.pdf?url";
import newsletterThreeUrl from "@/docs/newsletter 3.pdf?url";
import pressReleaseOneUrl from "@/docs/press release 1.pdf?url";
import pressReleaseTwoUrl from "@/docs/press release 2.pdf?url";
import newsletterOnePreview from "@/docs/ss-pdf/newsletter-1.png";
import newsletterTwoPreview from "@/docs/ss-pdf/newsletter-2.png";
import newsletterThreePreview from "@/docs/ss-pdf/newsletter-3.png";
import pressReleaseOnePreview from "@/docs/ss-pdf/press-release-1.png";
import pressReleaseTwoPreview from "@/docs/ss-pdf/press-release-2.png";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// Run the PDF.js worker locally so the page renders the original documents
// without any third-party or remote resource.
GlobalWorkerOptions.workerSrc = workerUrl;

export type DocumentId =
  | "newsletter-1"
  | "newsletter-2"
  | "newsletter-3"
  | "press-1"
  | "press-2";

export interface SourceDocument {
  id: DocumentId;
  title: string;
  filename: string;
  url: string;
  /** Static screenshot of the document's first page, used for card previews. */
  previewUrl: string;
  pages: number;
  /** Reference file metadata shown on press cards, e.g. "3 pages · 181 KB". */
  sizeLabel?: string;
}

export const documentList: SourceDocument[] = [
  {
    id: "newsletter-1",
    title: "The Secure Touch",
    filename: "newsletter 1.pdf",
    url: newsletterOneUrl,
    previewUrl: newsletterOnePreview,
    pages: 3,
  },
  {
    id: "newsletter-2",
    title: "Bridging Tradition and Innovation",
    filename: "newsletter 2.pdf",
    url: newsletterTwoUrl,
    previewUrl: newsletterTwoPreview,
    pages: 2,
  },
  {
    id: "newsletter-3",
    title: "Quarterly Earnings · Q3 2026",
    filename: "newsletter 3.pdf",
    url: newsletterThreeUrl,
    previewUrl: newsletterThreePreview,
    pages: 2,
  },
  {
    id: "press-1",
    title: "Legacy Trust Bank Supports Flood Victims",
    filename: "press release 1.pdf",
    url: pressReleaseOneUrl,
    previewUrl: pressReleaseOnePreview,
    pages: 3,
    sizeLabel: "3 pages · 181 KB",
  },
  {
    id: "press-2",
    title: "Legacy Trust Bank Launches High-Yield Savings Account with New Features",
    filename: "press release 2.pdf",
    url: pressReleaseTwoUrl,
    previewUrl: pressReleaseTwoPreview,
    pages: 3,
    sizeLabel: "3 pages · 192 KB",
  },
];

const documentMap = new Map<DocumentId, SourceDocument>(
  documentList.map((doc) => [doc.id, doc]),
);

export function getDocumentSource(id: DocumentId): SourceDocument {
  const source = documentMap.get(id);
  if (!source) throw new Error(`Unknown document: ${id}`);
  return source;
}

const documentCache = new Map<DocumentId, Promise<PDFDocumentProxy>>();

export function loadDocument(id: DocumentId): Promise<PDFDocumentProxy> {
  let promise = documentCache.get(id);
  if (!promise) {
    promise = getDocument({
      url: getDocumentSource(id).url,
      isEvalSupported: false,
      useSystemFonts: true,
      useWasm: false,
    } as DocumentInitParameters).promise;
    documentCache.set(id, promise);
    promise.catch(() => documentCache.delete(id));
  }
  return promise;
}

export function notifyAboutPage(message: string) {
  window.dispatchEvent(new CustomEvent("about:toast", { detail: message }));
}

/** Download the unchanged original PDF bytes under their original filename. */
export async function downloadDocument(id: DocumentId): Promise<void> {
  try {
    const source = getDocumentSource(id);
    const response = await fetch(source.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${source.filename} (${response.status})`);
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = source.filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
  } catch (error) {
    console.error(error);
    notifyAboutPage(
      "The download could not be prepared. Please use the original PDF in the project package.",
    );
  }
}
