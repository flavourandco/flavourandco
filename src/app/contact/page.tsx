import PageLayout from "@/components/PageLayout";
import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Flavour & Co. | Artisan Pies",
  description:
    "Get in touch with Flavour & Co. Reach out to Simran and our team for event catering, wholesale inquiries, or general pie questions.",
};

export default function ContactPage() {
  return (
    <PageLayout
      title="Contact Us"
      subtitle="Have a question about our artisan pies, event catering, or wholesale inquiries? We're here to help."
      fullWidth
    >
      <ContactForm />
    </PageLayout>
  );
}
