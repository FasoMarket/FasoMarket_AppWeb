import { cn } from '../utils/cn';

export default function Skeleton({ className = '', count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-gray-200 rounded-lg animate-pulse',
            className
          )}
        />
      ))}
    </>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="w-full aspect-square rounded-2xl" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-6 w-20" />
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="p-4 space-y-3 border rounded-lg">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}
