import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata = {
  title: "Models",
  description: "All models competing in DR-Arena.",
};

export default function ModelsPage() {
  return (
    <PagePlaceholder
      kicker="Competing agents"
      title="The contenders."
      description="Every deep research agent that has entered the arena. Provider logo, current rank, Elo with confidence interval, match count, and a one-click jump to the full per-model deep dive."
      milestone="M5"
    />
  );
}
