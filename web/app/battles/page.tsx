import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata = {
  title: "Battles",
  description: "Browse every DR-Arena match.",
};

export default function BattlesPage() {
  return (
    <PagePlaceholder
      kicker="Match browser"
      title="Every battle, on the record."
      description="A feed of individual matches. Each card shows the two agents, the tree, the verdict, the failure tag, and the difficulty trajectory. Filter by model, tree, verdict, or failure type. Click through to the full replay."
      milestone="M6"
    />
  );
}
