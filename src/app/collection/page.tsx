import dynamic from "next/dynamic";
import { PageLoading } from "../../components/shared";

const CollectionPageContent = dynamic(
  () => import("../../components/collection/CollectionPageContent"),
  {
    loading: () => <PageLoading />,
  }
);

export default function CollectionPage() {
  return <CollectionPageContent />;
}
