import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata = {
  title: "Dataset",
  description: "The 30 information trees used in the DR-Arena benchmark.",
};

export default function DatasetPage() {
  return (
    <PagePlaceholder
      kicker="Information trees"
      title="The dataset atlas."
      description="Thirty pre-crawled information trees covering Arts, Health, Technology, Law, Sports, and more. Topic donut, domain distribution, depth histogram. A masonry grid of tree cards with live topology thumbnails."
      milestone="M7"
    />
  );
}
