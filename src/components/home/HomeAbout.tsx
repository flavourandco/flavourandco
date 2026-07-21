"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { media } from "@/lib/media";

gsap.registerPlugin(ScrollTrigger);

export default function HomeAbout() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".about-text > *", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      gsap.from(".about-image", {
        scale: 1.08,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="overflow-hidden bg-base-100 py-24 md:py-32 border-b border-secondary/15 text-base-content">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <div className="about-text">
          <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-secondary">
            About Flavour & Co.
          </p>
          <h2 className="mt-4 font-fraunces text-[clamp(2.25rem,4.5vw,3.5rem)] font-semibold leading-[1.08] tracking-tight text-primary">
            Taste the Magic,
            <br />
            Made with <span className="italic font-medium text-secondary">Love</span>.
          </h2>
          <p className="mt-6 text-lg leading-relaxed opacity-85 font-medium">
            Flavour & Co. is us, Ash & Simran, a husband and wife whose love of Indian cuisine inspired these unique fusion pies, showcased on Channel 7&apos;s Plate of Origin.
          </p>
          <p className="mt-4 text-base leading-relaxed opacity-70">
            Having grown up abroad after leaving India, we wanted our kids to grow up with the flavours we hold dear — so we baked our roots into every single pie.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/our-story"
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-content px-6 py-3 text-[12px] font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:bg-secondary hover:text-secondary-content"
            >
              Discover Our Story
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="about-image relative aspect-[4/5] overflow-hidden rounded-3xl lg:aspect-square shadow-2xl border-4 border-primary/5">
          <Image
            src={media.about.kitchen}
            alt="Baker crafting pies with love"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}
