import { Skeleton } from "../ui/skeleton";

export default function TenantCarouselSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-80 w-[574px]" />
    </div>
  );
}
