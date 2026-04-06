import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata = {
  title: "About",
  description: "About DR-Arena — citation, team, contribute.",
};

export default function AboutPage() {
  return (
    <PagePlaceholder
      kicker="About the project"
      title="The team & the paper."
      description="Authors, affiliations, funding. Citation BibTeX. How to contribute a model. How to reproduce the experiments locally. Contact and collaboration links."
      milestone="M8"
    />
  );
}
