import {
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
} from "react-icons/tb";
import Button from "./Button";
import Card from "./Card";
import { Release, useCollection } from "./CollectionContext";
import ReleaseGridSkeleton from "./ReleaseGridSkeleton";
import LazyImage from "./LazyImage";

interface ReleaseGridProps {
  releases: Release[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  showRating?: boolean;
}

const GridKey = () => (
  <div className="mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/40 shadow-sm">
    <h3 className="text-sm font-medium text-gray-800 mb-3">Legend:</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-emerald-600 rounded"></div>
        <span className="text-gray-700">Vinyl color/variant</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
        <span className="text-gray-700">Personal notes</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex">
          <span className="text-yellow-400">★</span>
          <span className="text-gray-300">★</span>
        </div>
        <span className="text-gray-700">My rating</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-gray-600 rounded"></div>
        <span className="text-gray-700">Format info (# of LPs)</span>
      </div>
    </div>
  </div>
);

export default function ReleaseGrid({
  releases,
  loading,
  error,
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  showRating = true,
}: ReleaseGridProps) {
  const { formatArtists, getVinylColor, getFormatInfo, handleReleaseClick } =
    useCollection();

  if (loading) {
    return <ReleaseGridSkeleton pageSize={pageSize} />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-sm sm:text-base mb-4">Error: {error}</p>
        <Button variant="primary" onClick={() => onPageChange(currentPage)}>
          Retry
        </Button>
      </div>
    );
  }

  if (releases.length === 0) {
    return (
      <p className="text-gray-500 text-sm sm:text-base text-center py-12">
        No items found.
      </p>
    );
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <>
      <GridKey />

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        {releases.map((release) => {
          const vinylColor = getVinylColor(release.basic_information.formats);
          const formatInfo = getFormatInfo(release.basic_information.formats);

          return (
            <Card
              key={release.id}
              onClick={() => handleReleaseClick(release)}
              className="group p-0 h-full flex flex-col bg-white/80 hover:bg-white/90 border-white/40 shadow-sm hover:shadow-md transition-all duration-300"
              padding="none"
            >
              <div className="aspect-square relative overflow-hidden rounded-t-lg">
                {release.basic_information.cover_image &&
                release.basic_information.cover_image !== "" ? (
                  <LazyImage
                    src={release.basic_information.cover_image}
                    alt={`${release.basic_information.title} cover`}
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200 rounded-t-lg" />
              </div>

              <div className="flex-1 flex flex-col mt-2 p-3 text-center sm:text-left">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                    {release.basic_information.title}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {formatArtists(release.basic_information.artists)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {release.basic_information.year}
                  </p>
                  {formatInfo && (
                    <p className="text-xs text-gray-600 mt-1">{formatInfo}</p>
                  )}
                  {showRating && release.rating > 0 && (
                    <div className="flex justify-center sm:justify-start mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${
                            i < release.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                  {vinylColor && (
                    <div className="text-xs text-emerald-600 font-medium mt-1">
                      {vinylColor}
                    </div>
                  )}
                </div>

                <div className="mt-2 space-y-1">
                  {release.notes && (
                    <div className="text-xs text-gray-700 font-medium bg-green-50 px-2 py-1 rounded border border-green-200">
                      {typeof release.notes === "string"
                        ? release.notes
                        : "Custom notes"}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center gap-3 bg-white/50 backdrop-blur-[2px] px-4 py-3 rounded-lg border border-white/40 shadow-sm">
          <p className="text-sm text-gray-700 font-medium">
            {startItem.toLocaleString()}–{endItem.toLocaleString()} of{" "}
            {totalItems.toLocaleString()}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              aria-label="First page"
              className="flex items-center justify-center w-9 h-9 rounded-md border border-white/40 bg-white/80 text-gray-600 hover:bg-white/95 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
            >
              <TbChevronsLeft size={18} />
            </button>
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="flex items-center justify-center w-9 h-9 rounded-md border border-white/40 bg-white/80 text-gray-600 hover:bg-white/95 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
            >
              <TbChevronLeft size={18} />
            </button>

            <span className="px-4 py-2 text-sm text-gray-700 tabular-nums">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="flex items-center justify-center w-9 h-9 rounded-md border border-white/40 bg-white/80 text-gray-600 hover:bg-white/95 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
            >
              <TbChevronRight size={18} />
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="Last page"
              className="flex items-center justify-center w-9 h-9 rounded-md border border-white/40 bg-white/80 text-gray-600 hover:bg-white/95 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
            >
              <TbChevronsRight size={18} />
            </button>
          </div>
          <p className="text-xs text-gray-500">Updated daily</p>
        </div>
      )}
    </>
  );
}
