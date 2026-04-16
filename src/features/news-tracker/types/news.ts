export interface News {
  id: string;
  created_at: string;
  name: string | null;
  live_date: string | null;
  url: string | null;
  image_thumbnail: string | null;
  translation: string | null;
}

export interface NewsView {
  id: string;
  name: string;
  live_date: string | null;
  image_thumbnail: string | null;
  url: string | null;
  translation: string | null;
  liveDateKst: string; // "YYYY.MM.DD(요일)" 형식
  isNew: boolean;
}
