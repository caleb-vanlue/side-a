import { SortOption, SortOrder } from "./CollectionContext";

interface CollectionControlsProps {
  sortValue: string;
  pageSize: number;
  totalItems: number;
  sortOptions: Array<{
    value: string;
    label: string;
    sort: SortOption;
    order: SortOrder;
  }>;
  pageSizeOptions: number[];
  onSortChange: (sortValue: string) => void;
  onPageSizeChange: (size: number) => void;
}

export default function CollectionControls({
  sortValue,
  pageSize,
  totalItems,
  sortOptions,
  pageSizeOptions,
  onSortChange,
  onPageSizeChange,
}: CollectionControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between backdrop-blur-[2px] bg-white/50 p-4 rounded-lg border border-white/40 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300/60 rounded-md bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-w-[200px] shadow-sm cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Show:</label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-3 py-1.5 text-sm border border-gray-300/60 rounded-md bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm cursor-pointer"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} items
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-sm text-gray-600 font-medium">
        {totalItems.toLocaleString()} total items
      </div>
    </div>
  );
}
