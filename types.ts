export enum GeneratedImageStatus {
  Pending = "pending",
  Complete = "complete",
}

export interface GeneratedImage {
  id: string;
  title: string;
  description: string;
  urls: string[];
  status: GeneratedImageStatus;
  createdAt: number;
  modifiedAt: number;
}
