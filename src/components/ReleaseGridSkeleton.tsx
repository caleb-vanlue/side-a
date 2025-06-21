import Card from "./Card";

interface ReleaseGridSkeletonProps {
  pageSize: number;
}

const SkeletonCard = () => (
  <Card
    className="group p-0 h-full flex flex-col bg-white/80 border-white/40 shadow-sm animate-pulse"
    padding="none"
    hover={false}
  >
    <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-200">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skeleton-shimmer" />
    </div>

    <div className="flex-1 flex flex-col mt-2 p-3">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded mb-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skeleton-shimmer" />
        </div>
        <div className="h-3 bg-gray-200 rounded w-3/4 mb-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skeleton-shimmer" />
        </div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skeleton-shimmer" />
        </div>
        <div className="flex justify-center sm:justify-start mt-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-xs text-gray-300">
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
  </Card>
);

export default function ReleaseGridSkeleton({ pageSize }: ReleaseGridSkeletonProps) {
  return (
    <>
      <style jsx global>{`
        @keyframes skeleton-shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .skeleton-shimmer {
          animation: skeleton-shimmer 1.5s ease-in-out infinite;
        }
      `}</style>

      <div className="mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/40 shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...Array(pageSize)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>

      <div className="mt-8 space-y-4 bg-white/50 backdrop-blur-[2px] p-4 rounded-lg border border-white/40 shadow-sm animate-pulse">
        <div className="flex justify-center">
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
        <div className="flex justify-center">
          <div className="h-4 bg-gray-200 rounded w-48" />
        </div>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {["First", "Previous", "Page", "Next", "Last"].map((_, index) => (
            <div key={index} className="h-9 bg-gray-200 rounded w-20" />
          ))}
        </div>
      </div>
    </>
  );
}