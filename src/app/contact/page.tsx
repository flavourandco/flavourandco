import PageLayout from "@/components/PageLayout";
import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Flavour & Co. | Artisan Fusion Pies",
  description:
    "Get in touch with Flavour & Co. Reach out to Simran and our team for event catering, wholesale inquiries, or general pie questions.",
};

export default function ContactPage() {
  return (
    <PageLayout title="Contact" fullWidth hideHeader>
      <ContactForm />
    </PageLayout>
  );
}
