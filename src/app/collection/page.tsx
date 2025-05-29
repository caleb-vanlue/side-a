"use client";

import { useState, useEffect } from "react";
import CollectionLayout from "../../components/CollectionLayout";
import ReleaseGrid from "../../components/ReleaseGrid";
import CollectionControls from "../../components/CollectionControls";
import {
  COLLECTION_SORT_OPTIONS,
  CollectionProvider,
  PAGE_SIZE_OPTIONS,
  useCollection,
  WANTLIST_SORT_OPTIONS,
} from "../../components/CollectionContext";

function CollectionTabs() {
  const [activeTab, setActiveTab] = useState<"collection" | "wantlist">(
    "collection"
  );

  const {
    collection,
    wantlist,
    loadingCollection,
    loadingWantlist,
    collectionError,
    wantlistError,
    collectionPage,
    collectionTotalPages,
    collectionPageSize,
    collectionTotalItems,
    wantlistPage,
    wantlistTotalPages,
    wantlistPageSize,
    wantlistTotalItems,
    collectionSortValue,
    wantlistSortValue,
    setCollectionPage,
    setWantlistPage,
    fetchCollection,
    fetchWantlist,
    handleCollectionSortChange,
    handleWantlistSortChange,
    setCollectionPageSize,
    setWantlistPageSize,
  } = useCollection();

  useEffect(() => {
    fetchCollection();
  }, [
    collectionPage,
    collectionSortValue,
    collectionPageSize,
    fetchCollection,
  ]);

  useEffect(() => {
    if (activeTab === "wantlist") {
      fetchWantlist();
    }
  }, [
    activeTab,
    wantlistPage,
    wantlistSortValue,
    wantlistPageSize,
    fetchWantlist,
  ]);

  return (
    <>
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg backdrop-blur-md p-1 bg-white/50 border border-white/40 shadow-sm">
          <button
            onClick={() => setActiveTab("collection")}
            className={`
        px-4 sm:px-6 py-2 rounded-md font-medium transition-all duration-300 text-sm sm:text-base
        ${
          activeTab === "collection"
            ? "bg-white/80 text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-800 hover:bg-white/30"
        }
      `}
          >
            Collection
          </button>
          <button
            onClick={() => setActiveTab("wantlist")}
            className={`
        px-4 sm:px-6 py-2 rounded-md font-medium transition-all duration-300 text-sm sm:text-base
        ${
          activeTab === "wantlist"
            ? "bg-white/80 text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-800 hover:bg-white/30"
        }
      `}
          >
            Wantlist
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {activeTab === "collection" ? (
          <div>
            <CollectionControls
              sortValue={collectionSortValue}
              pageSize={collectionPageSize}
              totalItems={collectionTotalItems}
              sortOptions={COLLECTION_SORT_OPTIONS}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              onSortChange={handleCollectionSortChange}
              onPageSizeChange={setCollectionPageSize}
            />
            <ReleaseGrid
              releases={collection}
              loading={loadingCollection}
              error={collectionError}
              currentPage={collectionPage}
              totalPages={collectionTotalPages}
              pageSize={collectionPageSize}
              totalItems={collectionTotalItems}
              onPageChange={setCollectionPage}
              showRating={true}
            />
          </div>
        ) : (
          <div>
            <CollectionControls
              sortValue={wantlistSortValue}
              pageSize={wantlistPageSize}
              totalItems={wantlistTotalItems}
              sortOptions={WANTLIST_SORT_OPTIONS}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              onSortChange={handleWantlistSortChange}
              onPageSizeChange={setWantlistPageSize}
            />
            <ReleaseGrid
              releases={wantlist}
              loading={loadingWantlist}
              error={wantlistError}
              currentPage={wantlistPage}
              totalPages={wantlistTotalPages}
              pageSize={wantlistPageSize}
              totalItems={wantlistTotalItems}
              onPageChange={setWantlistPage}
              showRating={false}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default function CollectionPage() {
  return (
    <CollectionProvider>
      <CollectionLayout
        title="My Record Collection and Wantlist"
        description="You can learn a lot about someone from what they listen to..."
      >
        <CollectionTabs />
      </CollectionLayout>
    </CollectionProvider>
  );
}
