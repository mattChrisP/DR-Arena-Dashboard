import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata = {
  title: "Methodology",
  description: "How DR-Arena works.",
};

export default function MethodologyPage() {
  return (
    <PagePlaceholder
      kicker="How it works"
      title="Three acts, one tournament."
      description="A scrollytelling walkthrough of DR-Arena's three core mechanisms: dynamic information tree construction, Deep & Wide question generation, and the adaptive evolvement loop. Prose on the left, animated figures on the right."
      milestone="M8"
    />
  );
}
