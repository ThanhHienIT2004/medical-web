export type Document = {
  document_id: string;
  title: string;
  file_url: string;
  category: string;
  uploaded_by_id: string;
  created_at: string | Date;
  updated_at?: string | Date | null;
};

export type CreateDocumentInput = {
  title: string;
  file_url: string;
  category: string;
  uploaded_by_id: string;
};

export type UpdateDocumentInput = Partial<Omit<CreateDocumentInput, "uploaded_by_id">>;

