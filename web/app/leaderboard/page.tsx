import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata = {
  title: "Leaderboard",
  description:
    "The main ranking dashboard for DR-Arena — dense table, pairwise matrix, and Elo-over-time.",
};

export default function LeaderboardPage() {
  return (
    <PagePlaceholder
      kicker="The ranking dashboard"
      title="The leaderboard."
      description="Dense typographic table with confidence intervals, sparklines, and filter rail. Pairwise win-rate matrix. Elo-over-time chart with per-model toggles. The main attraction — where visitors spend 60% of their time."
      milestone="M3"
    />
  );
}
