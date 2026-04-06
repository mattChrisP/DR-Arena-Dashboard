import { PagePlaceholder } from "@/components/layout/page-placeholder";

// M1 placeholder: a single stub param so the static export has something to build.
// Replaced in M5 by a real generateStaticParams reading from public/data/models.json.
export function generateStaticParams() {
  return [{ id: "gpt-5-1-search" }];
}

export const dynamicParams = false;

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PagePlaceholder
      kicker={`Model · ${id}`}
      title="Per-model deep dive."
      description="Elo trajectory annotated with decisive wins and losses. Failure radar comparing this model's cognitive profile to the population average. Head-to-head bars against every opponent. Recent battles feed. Built to be screenshot-worthy for papers."
      milestone="M5"
    />
  );
}
