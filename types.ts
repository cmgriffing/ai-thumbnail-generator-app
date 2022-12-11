export enum GeneratedImageStatus {
  Processing = "processing",
  Done = "done",
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
