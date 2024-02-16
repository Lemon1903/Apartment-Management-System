import { Skeleton } from "../ui/skeleton";

export function AdminPageSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between py-4">
        <Skeleton className="h-12 w-48"></Skeleton>
        <div className="flex gap-6">
          <Skeleton className="h-16 w-16" />
          <Skeleton className="h-16 w-16" />
          <Skeleton className="h-16 w-16" />
          <Skeleton className="h-16 w-16" />
        </div>
      </div>
      <Skeleton className="mb-4 w-screen max-w-3xl flex-1" />
    </div>
  );
}
