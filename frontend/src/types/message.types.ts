export interface Message {
  id?: number;
  text: string;
  summary: string;
  created: string | Date;
}

export interface MessageFormData {
  text: string;
  summary: string;
}
