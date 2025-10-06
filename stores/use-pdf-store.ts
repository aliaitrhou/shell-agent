import { create } from "zustand";

interface pdfStoreProps {
  page: number;
  chapter: string;
  semester: string;
  totalPages: number;
  updatePdfPreview: (
    data: Partial<Omit<pdfStoreProps, "updatePdfPreview">>,
  ) => void;
}

export const usePdfPreviewStore = create<pdfStoreProps>((set) => ({
  page: 1,
  chapter: "chap1.pdf",
  semester: "S3",
  totalPages: 0,
  updatePdfPreview: (
    data: Partial<
      Omit<pdfStoreProps, "setPdfPreviewInfo" | "updatePdfPreview">
    >,
  ) => set((state) => ({ ...state, ...data })),
}));
