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
  }, [collectionPage, collectionSortValue, collectionPageSize]);

  useEffect(() => {
    if (activeTab === "wantlist") {
      fetchWantlist();
    }
  }, [activeTab, wantlistPage, wantlistSortValue, wantlistPageSize]);

  return (
    <>
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab("collection")}
            className={`
              px-4 sm:px-6 py-2 rounded-md font-medium transition-all duration-200 text-sm sm:text-base
              ${
                activeTab === "collection"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }
            `}
          >
            Collection
          </button>
          <button
            onClick={() => setActiveTab("wantlist")}
            className={`
              px-4 sm:px-6 py-2 rounded-md font-medium transition-all duration-200 text-sm sm:text-base
              ${
                activeTab === "wantlist"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
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
        title="My Record Collection"
        description="Browse my Discogs collection of vinyl records and wantlist"
      >
        <CollectionTabs />
      </CollectionLayout>
    </CollectionProvider>
  );
}
