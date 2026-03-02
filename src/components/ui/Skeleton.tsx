export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-busy="true" />;
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-5 w-20" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-6 space-y-4">
      <Skeleton className="h-5 w-2/5" />
      <Skeleton className="h-8 w-3/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="card p-4">
      <Skeleton className="h-6 w-1/4 mb-4" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}
