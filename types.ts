export enum GeneratedImageStatus {
  Pending = "pending",
  Complete = "complete",
}

export interface GeneratedImage {
  id: string;
  title: string;
  description: string;
  url: string;
  status: GeneratedImageStatus;
  createdAt: number;
  modifiedAt: number;
}
