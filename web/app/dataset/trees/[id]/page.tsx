import { PagePlaceholder } from "@/components/layout/page-placeholder";

// M1 placeholder — real IDs enumerated from summary.json in M7.
export function generateStaticParams() {
  return [{ id: "tree_0001" }];
}

export const dynamicParams = false;

export default async function TreeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PagePlaceholder
      kicker={`Tree · ${id}`}
      title="Tree topology viewer."
      description="Interactive D3 force-directed or radial layout. Nodes sized by content length. Hover reveals URL and title; click opens the node in a side panel. Stats panel, battles played on this tree, link to the original source."
      milestone="M7"
    />
  );
}
