export interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
}

export interface NewsArticle {
  id: number;
  title: string;
  date: string;
  excerpt?: string;
  image?: string;
}

export interface GalleryItem {
  id: number;
  caption: string;
  image: string;
  date?: string;
}

export interface DownloadFile {
  id: number;
  title: string;
  date: string;
  size?: string;
  type?: string;
}

export interface PrayerTime {
  name: string;
  time: string;
  arabic: string;
}

export interface Partner {
  id: number;
  name: string;
  url: string;
  image?: string;
}

export interface StaffMember {
  id: number;
  name: string;
  position: string;
  image?: string;
}

export interface AccreditationData {
  level: string;
  count: number;
  color: string;
}

export interface Regulation {
  id: number;
  title: string;
  number: string;
  category: string;
  url?: string;
}
