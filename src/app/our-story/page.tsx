import PageLayout from "@/components/PageLayout";
import Image from "next/image";
import Link from "next/link";
import { media } from "@/lib/media";

export default function OurStoryPage() {
  return (
    <PageLayout
      title="Our Story"
      subtitle="Baking our roots into every single pie — Ash & Simran."
      fullWidth
    >
      <div className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20 items-center">
            
            {/* Story Text */}
            <div className="lg:col-span-7 text-left">
              <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                The Journey of Ash & Simran
              </p>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl text-brand-green leading-tight">
                From Plate of Origin to Your Table
              </h2>
              
              <p className="mt-6 text-base leading-relaxed text-charcoal/80 font-medium">
                Flavour & Co. is us, Ash & Simran, a husband and wife whose love of Indian cuisine inspired these unique fusion pies, showcased on Channel 7&apos;s Plate of Origin.
              </p>
              
              <p className="mt-4 text-sm leading-relaxed text-charcoal/60">
                Having grown up abroad after leaving India, we wanted our kids to grow up with the flavours we hold dear — so we baked our roots into every single pie. We set out to blend comforting Indian spiced fillings with the light, multi-layered flaky pastry of a classic Australian pie.
              </p>
              
              <p className="mt-4 text-sm leading-relaxed text-charcoal/60 font-semibold text-brand-green">
                The result? A culinary bridge between our heritage and our home here in Australia.
              </p>
              
              <p className="mt-4 text-sm leading-relaxed text-charcoal/60">
                Every pie is handcrafted in Sydney, using premium, local ingredients and slow-cooked family spices. Whether you are ordering a Butter Chicken Pie pack or grazing boxes for a gathering, we hope you taste the magic and love in every single bite.
              </p>

              <div className="mt-8">
                <Link
                  href="/shop"
                  className="inline-flex rounded-md bg-brand-green text-cream hover:bg-brand-gold hover:text-brand-green px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300"
                >
                  Explore Our Pies
                </Link>
              </div>
            </div>

            {/* Story Image */}
            <div className="lg:col-span-5 relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl border-4 border-brand-green/5">
              <Image
                src={media.about.baker}
                alt="Ash & Simran in the Kitchen"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-green/20 to-transparent" />
            </div>

          </div>
        </div>
      </div>
    </PageLayout>
  );
}
