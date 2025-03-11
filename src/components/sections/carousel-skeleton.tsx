import { Skeleton } from "../ui/skeleton";

// CarouselPlugin.tsx (continued)
export function CarouselSkeleton() {
  return (
    <div className="lg:container p-4 mx-auto lg:grid grid-cols-3 gap-6 rounded-xl">
      <div className="col-span-2 bg-muted/40 rounded-xl relative">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-center lg:h-[50vh] py-2">
          <Skeleton className="rounded-xl w-96 h-96" />
          <div className="mt-4 px-8 flex flex-col items-start">
            <Skeleton className="w-80 h-12 mb-4" />
            <Skeleton className="w-32 h-10" />
          </div>
        </div>
      </div>
      <div className="mt-4 lg:mt-0 flex flex-col md:flex-row lg:flex-col gap-6 w-full mx-auto">
        <div className="flex items-center gap-4 bg-muted/40 rounded-xl p-4 flex-1">
          <div className="flex flex-col items-start">
            <Skeleton className="w-48 h-8 mb-2" />
            <Skeleton className="w-32 h-6 mb-4" />
            <Skeleton className="w-24 h-10" />
          </div>
          <Skeleton className="w-40 h-40 rounded-xl" />
        </div>
        <div className="flex items-center gap-4 bg-muted/40 rounded-xl p-4 flex-1">
          <div className="flex flex-col items-start">
            <Skeleton className="w-48 h-8 mb-2" />
            <Skeleton className="w-32 h-6 mb-4" />
            <Skeleton className="w-24 h-10" />
          </div>
          <Skeleton className="w-40 h-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
