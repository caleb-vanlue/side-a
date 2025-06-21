import dynamic from "next/dynamic";
import { PageLoading } from "../../components/shared";

const PortfolioPageContent = dynamic(
  () => import("../../components/portfolio/PortfolioPageContent"),
  {
    loading: () => <PageLoading />,
  }
);

export default function PortfolioPage() {
  return <PortfolioPageContent />;
}
