"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "@/components/products/ProductCard";
import { useProductStore } from "@/store/product.store";
import { BoneyardProductCardSkeleton } from "@/components/ui/BoneyardSkeleton";
import { sortProductsByCustomOrder } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export default function HomeProducts() {
  const products = useProductStore((s) => s.products);
  const isFetching = useProductStore((s) => s.isFetching);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const sectionRef = useRef<HTMLElement>(null);
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({});
  const [isInView, setIsInView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setItemsPerPage(2); // 2 products per row on mobile & tablet
      } else {
        setItemsPerPage(3); // 3 products per row on desktop
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const featuredProducts = sortProductsByCustomOrder(products.filter((p) => p.isFeatured));
  const maxIndex = Math.max(0, featuredProducts.length - itemsPerPage);

  // Clamp currentIndex when itemsPerPage changes
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [itemsPerPage, maxIndex]);

  // Trigger entrance animation once when section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // stop observing once triggered — prevents re-firing mid-animation
        }
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!isInView) return;

      gsap.from(".product-header > *", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out",
        clearProps: "opacity,transform", // remove inline styles once done so nothing stays half-faded
      });

      gsap.from(".product-card", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out",
        clearProps: "opacity,transform",
      });
    },
    { dependencies: [isInView], scope: sectionRef }
  );

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

  const updateQuantity = (productId: string, amount: number) => {
    setCartQuantities((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + amount);
      return { ...prev, [productId]: next };
    });
  };

  return (
    <section
      ref={sectionRef}
      className="bg-base-200 pt-16 pb-12 sm:pt-20 sm:pb-14 md:pt-24 md:pb-16 border-b border-secondary/15 overflow-hidden text-base-content"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="product-header mx-auto max-w-3xl text-center">
          <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-secondary">
            On the Menu
          </p>
          <h2 className="mt-4 font-fraunces text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-tight text-primary">
            Our Indo-Australian <span className="italic font-medium text-secondary">Pies</span>
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative mt-12 sm:mt-16 px-0 sm:px-12">
          {/* Slider Viewport */}
          <div
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
          {isFetching && featuredProducts.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <BoneyardProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
              }}
            >
              {featuredProducts.map((product) => {
                return (
                  <div
                    key={product.id}
                    className="shrink-0 px-1.5 sm:px-3 transition-all duration-300"
                    style={{ width: `${100 / itemsPerPage}%` }}
                  >
                    <ProductCard product={product} showBadge={false} />
                  </div>
                );
              })}
            </div>
          )}
          </div>

          {/* Navigation Buttons (Desktop only) */}
          {maxIndex > 0 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-content border border-secondary/20 transition-all hover:bg-secondary hover:text-secondary-content hover:scale-105 disabled:opacity-30 disabled:pointer-events-none sm:left-0"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                disabled={currentIndex === maxIndex}
                className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-content border border-secondary/20 transition-all hover:bg-secondary hover:text-secondary-content hover:scale-105 disabled:opacity-30 disabled:pointer-events-none sm:right-0"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Indicators / Dots */}
          {maxIndex > 0 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === idx ? "w-6 bg-secondary" : "w-1.5 bg-primary/20"
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 sm:mt-10 text-center">
          <Link
            href="/shop"
            className="inline-flex rounded-md border-2 border-primary/30 px-10 py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-primary transition-all hover:bg-primary hover:text-primary-content hover:border-primary"
          >
            Explore Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
}