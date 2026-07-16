// ====================================================
// Person Card Component
// Displays one person's cover photo, name, and photo
// count on the People grid page. Clicking navigates to
// that person's photo collection.
// ====================================================

import Link from "next/link";
import { User as UserIcon } from "lucide-react";
import { Person } from "@/types";

interface PersonCardProps {
  person: Person;
}

export default function PersonCard({ person }: PersonCardProps) {
  return (
    <Link
      href={`/people/${person.id}`}
      className="group flex flex-col items-center text-center"
    >
      <div className="w-full aspect-square rounded-full overflow-hidden bg-card border border-border mb-3 transition-transform duration-150 group-hover:-translate-y-1 group-hover:shadow-card">
        {person.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={person.coverUrl}
            alt={person.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-muted" />
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-foreground truncate w-full">
        {person.name}
      </p>
      <p className="text-xs text-muted">
        {person.photoCount} photo{person.photoCount === 1 ? "" : "s"}
      </p>
    </Link>
  );
}
