import { PagePlaceholder } from "@/components/layout/page-placeholder";

// M1 placeholder — real IDs come from debate logs in M6.
export function generateStaticParams() {
  return [{ id: "example" }];
}

export const dynamicParams = false;

export default async function BattleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PagePlaceholder
      kicker={`Battle · ${id}`}
      title="The replay."
      description="A scrubbable timeline of rounds. The question, the hidden checklists, both agents' answers side-by-side with checklist-match highlight overlays. Keyboard-navigable. The signature page of the dashboard."
      milestone="M6"
    />
  );
}
