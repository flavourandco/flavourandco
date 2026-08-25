import PageLayout from "@/components/layout/PageLayout";
import ContactForm from "@/components/forms/ContactForm";
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
      subtitle="Have a question about our Indo-Australian food range, event catering, or wholesale offering? We’re here to help."
      fullWidth
    >
      <ContactForm />
    </PageLayout>
  );
}
