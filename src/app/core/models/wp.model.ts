// src/app/models/wp-post.model.ts

export interface WPPost {
  id: number;
  date: string;
  description?: string;
  precio?: number;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  link: string;
  categories: number[];
  _embedded?: {
    'wp:featuredmedia'?: WPFeaturedMedia[];
  };
}

export interface WPFeaturedMedia {
  source_url: string;
  alt_text: string;
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
}
// src/app/models/wp-media.model.ts

export interface WPMedia {
  id: number;
  date: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: Rendered;
  author: number;
  media_type: string;
  mime_type: string;
  source_url: string;
  media_details: MediaDetails;
  alt_text: string;
  caption: Rendered;
  description: Rendered;
  modified?: string;
  selected?: boolean;
  // Puedes añadir más campos según tus necesidades
}

export interface Rendered {
  rendered: string;
}

export interface MediaDetails {
  width?: number; // Solo para imágenes
  height?: number; // Solo para imágenes
  file: string;
  filesize: number;
  sizes?: {
    [size: string]: SizeDetails;
  };
  image_meta?: ImageMeta; // Solo para imágenes
}

export interface SizeDetails {
  file: string;
  width: number;
  height: number;
  filesize: number;
  mime_type: string;
  source_url: string;
}

export interface ImageMeta {
  aperture: string;
  credit: string;
  camera: string;
  caption: string;
  created_timestamp: string;
  copyright: string;
  focal_length: string;
  iso: string;
  shutter_speed: string;
  title: string;
  orientation: string;
  keywords: any[];
}
