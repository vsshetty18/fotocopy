// ====================================================
// Photo Grid Component
// Reusable responsive grid for displaying a set of
// photos — used on Person detail page, Search results,
// and anywhere else a simple photo grid is needed.
// ====================================================

interface PhotoGridItem {
  id: string;
  url: string;
}

interface PhotoGridProps {
  photos: PhotoGridItem[];
  onPhotoClick?: (photo: PhotoGridItem) => void;
}

export default function PhotoGrid({ photos, onPhotoClick }: PhotoGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {photos.map((photo) => (
        <div
          key={photo.id}
          onClick={() => onPhotoClick?.(photo)}
          className="aspect-square rounded-xl overflow-hidden bg-card border border-border"
          style={{ cursor: onPhotoClick ? "pointer" : "default" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.url}
            alt="Photo"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        </div>
      ))}
    </div>
  );
}
