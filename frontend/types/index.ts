// ====================================================
// Shared TypeScript Types
// Mirrors the backend's Prisma models + API response
// shapes, so components get full type safety without
// duplicating interfaces per file.
// ====================================================

// ----------------------------------------------------
// Auth
// ----------------------------------------------------
export interface User {
  id: string;
  email: string;
  name?: string | null;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ----------------------------------------------------
// Images / Gallery
// ----------------------------------------------------
export interface ImageRecord {
  id: string;
  url: string;
  width?: number;
  height?: number;
  format?: string;
  createdAt: string;
}

export interface UploadResult {
  id: string;
  url: string;
  facesDetected: number;
}

// ----------------------------------------------------
// People (Face Grouping)
// ----------------------------------------------------
export interface Person {
  id: string;
  name: string;
  coverUrl: string | null;
  photoCount: number;
}

export interface PersonPhoto {
  id: string;
  url: string;
  createdAt: string;
}

export interface PersonDetail {
  person: { id: string; name: string };
  photos: PersonPhoto[];
}

// ----------------------------------------------------
// Search
// ----------------------------------------------------
export interface SearchResult {
  matchedPeople: { id: string; name: string }[];
  photos: { id: string; url: string; personName: string }[];
}

// ----------------------------------------------------
// Generated Images (OpenAI)
// ----------------------------------------------------
export interface GeneratedImage {
  id: string;
  prompt: string;
  url: string;
  createdAt: string;
}

// ----------------------------------------------------
// Passport Sheets
// ----------------------------------------------------
export type CopyCount = 4 | 6 | 8 | 16;

export interface PassportSheet {
  id: string;
  sheetUrl: string;
  copies: CopyCount;
}

// ----------------------------------------------------
// Resize
// ----------------------------------------------------
export type ResizePreset =
  | "instagram"
  | "linkedin"
  | "passport"
  | "square"
  | "landscape"
  | "portrait";

// ----------------------------------------------------
// Convert
// ----------------------------------------------------
export type ImageFormat = "png" | "jpg" | "jpeg" | "webp";

// ----------------------------------------------------
// Dashboard
// ----------------------------------------------------
export interface DashboardStats {
  totalImages: number;
  totalPeople: number;
  totalGeneratedImages: number;
  totalPassportSheets: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentUploads: ImageRecord[];
}

// ----------------------------------------------------
// Generic API Response Wrapper
// Matches the backend's sendSuccess()/sendError() shape.
// ----------------------------------------------------
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
