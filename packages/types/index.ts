export type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
};

export type ProgramItem = { title: string; description?: string };

export type Program = {
  id: string;
  title: string;
  slug: string;
  description: string;
  day_of_week: number | null;
  start_time: string | null;
  end_time: string | null;
  location: string;
  program_items: ProgramItem[];
  active: boolean;
  featured: boolean;
  occurs_on?: string | null;
  invitation_url?: string;
  invitation_media_id?: string | null;
  is_special: boolean;
};

export type Festival = {
  id: string;
  title: string;
  slug: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  description: string;
  program: string;
  location: string;
  cover_url?: string;
  featured: boolean;
  published: boolean;
  share_text?: string;
  additional_info: string;
  upcoming: boolean;
  registration_url?: string | null;
};

export type HeadingBlock = {
  type: "heading";
  level: 2 | 3;
  text: string;
};

export type ParagraphBlock = {
  type: "paragraph";
  text: string;
};

export type ImageBlock = {
  type: "image";
  mediaId: string;
  imageSize?: "small" | "medium" | "large" | "full";
  alt?: string;
  caption?: string;
  url?: string;
  thumb_url?: string;
};

export type SplitBlock = {
  type: "split";
  imagePosition: "left" | "right";
  mediaId: string;
  imageSize?: "small" | "medium" | "large" | "full";
  text: string;
  alt?: string;
  caption?: string;
  url?: string;
  thumb_url?: string;
};

export type QuoteBlock = {
  type: "quote";
  text: string;
  attribution?: string;
};

export type YouTubeBlock = {
  type: "youtube";
  videoId: string;
  caption?: string;
};

export type GalleryMediaItem = {
  id: string;
  url: string;
  thumb_url: string;
  alt?: string;
  caption?: string;
};

export type GalleryBlock = {
  type: "gallery";
  mediaIds: string[];
  media?: GalleryMediaItem[];
};

export type ArticleBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | SplitBlock
  | QuoteBlock
  | YouTubeBlock
  | GalleryBlock;

export type Article = {
  createdAt?: any;
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: ArticleBlock[] | string;
  cover_url?: string;
  cover_media_id?: string | null;
  category: string;
  category_slug: string;
  author: string;
  status: string;
  published_at?: string | null;
  seo_title?: string;
  seo_description?: string;
};

export type Album = {
  id: string;
  title: string;
  slug: string;
  description: string;
  date?: string | null;
  cover_url?: string;
  published: boolean;
  photos?: Photo[];
};

export type Photo = {
  id: string;
  url: string;
  thumb_url: string;
  alt_text: string;
  caption: string;
};

export type DonationPurpose = {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  suggested_amounts: number[];
  featured: boolean;
};

export type SiteSettings = {
  centre_name: string;
  tagline: string;
  address_line1: string;
  address_line2: string;
  city: string;
  whatsapp_channel_url: string;
  whatsapp_contact_url: string;
  maps_url: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  twitter_url: string;
  iskcon_goa_url: string;
  hero_headline: string;
  hero_subhead: string;
  hero_support: string;
  operating_note: string;
  vision_summary: string;
  donation_external_url: string;
};

export type Homepage = {
  hero: { headline: string; subhead: string; support: string; eyebrow: string };
  settings: SiteSettings;
  current_programs: Program[];
  featured_festival: Festival | null;
  festivals: Festival[];
  announcements: { id: string; title: string; message: string; cta_label?: string; cta_url?: string }[];
  recent_articles: Article[];
  recent_albums: Album[];
  seva_options: { slug: string; title: string }[];
  donation_purposes: DonationPurpose[];
};
