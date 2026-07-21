"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Star, Flame, Trophy, ChevronLeft, ChevronRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { media } from "@/lib/media";

gsap.registerPlugin(ScrollTrigger);

// Custom products data with category and nutritional facts
const productsWithDetails = [
  {
    id: "butter-chicken-pie",
    name: "Flavour & Co. Butter Chicken Pie",
    description: "Tender chicken pieces simmered in our signature rich, creamy butter chicken gravy, encased in golden flaky pastry.",
    price: 22.99,
    image: media.products.butterChicken,
    badge: "Plate of Origin Special",
    category: "meat",
    rating: 4.9,
    reviews: 148,
    nutrition: { cal: 520, protein: "24g", fat: "28g", carbs: "42g" }
  },
  {
    id: "samosa-pie",
    name: "Flavour & Co. Samosa Pie",
    description: "Crisp, flaky pastry loaded with spiced potatoes, green peas, and Ash & Simran's custom aromatic masala blend.",
    price: 18.99,
    image: media.products.samosaPie,
    badge: "Signature Veg",
    category: "veg",
    rating: 4.8,
    reviews: 95,
    nutrition: { cal: 410, protein: "8g", fat: "16g", carbs: "54g" }
  },
  {
    id: "lamb-keema-pie",
    name: "Flavour & Co. Keema Lamb Pie",
    description: "Slow-cooked spiced minced lamb with homemade roasted spices for a deep, authentic Indian heritage flavour.",
    price: 27.99,
    image: media.products.lambKeema,
    badge: "Best Seller",
    category: "meat",
    rating: 5.0,
    reviews: 112,
    nutrition: { cal: 580, protein: "28g", fat: "32g", carbs: "40g" }
  },
  {
    id: "mini-keema-lamb-pies",
    name: "Flavour & Co. Mini Keema Lamb Pies",
    description: "Bite-sized miniature keema lamb pies infused with heritage spices. Delivered frozen and perfect for parties.",
    price: 35.99,
    image: media.products.paneerTikka,
    badge: "10% OFF FROZEN!",
    category: "meat",
    rating: 4.8,
    reviews: 86,
    nutrition: { cal: 380, protein: "18g", fat: "22g", carbs: "30g" }
  }
];

export default function HomeProducts() {
  const sectionRef = useRef<HTMLElement>(null);
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({});
  const [isInView, setIsInView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

  const maxIndex = Math.max(0, productsWithDetails.length - itemsPerPage);

  // Clamp currentIndex when itemsPerPage changes
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [itemsPerPage, maxIndex]);

  // Auto-scroll products every 5 seconds unless hovered
  useEffect(() => {
    if (isHovered || maxIndex <= 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, maxIndex]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
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
      });

      gsap.from(".product-card", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out",
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
    setCartQuantities(prev => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + amount);
      return { ...prev, [productId]: next };
    });
  };

  return (
    <section ref={sectionRef} className="bg-base-200 py-24 md:py-32 border-b border-secondary/15 overflow-hidden text-base-content">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="product-header mx-auto max-w-3xl text-center">
          <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-secondary">
            On the Menu
          </p>
          <h2 className="mt-4 font-fraunces text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-tight text-primary">
            Our Indo-Australian <span className="italic font-medium text-secondary">Pies</span>
            <br />
            <span className="text-secondary">Delivering Sydney-Wide</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed opacity-75">
            Created by Ash & Simran, representing Flavour & Co. on Channel 7&apos;s Plate of Origin. Try our award-winning butter chicken, keema lamb, and samosa pies today!
          </p>
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
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
              }}
            >
              {productsWithDetails.map((product) => {
                const quantity = cartQuantities[product.id] || 0;

                return (
                  <div
                    key={product.id}
                    className="shrink-0 px-1.5 sm:px-3 transition-all duration-300"
                    style={{ width: `${100 / itemsPerPage}%` }}
                  >
                    <article className="product-card group flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl bg-base-100 shadow-lg hover:shadow-2xl border border-secondary/15 h-full">
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary/5">
                        {/* Badge */}
                        <div className="absolute left-2 sm:left-4 top-2 sm:top-4 z-10 rounded-full bg-primary text-primary-content border border-secondary/20 px-2 sm:px-3 py-0.5 sm:py-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider shadow-md">
                          {product.badge}
                        </div>

                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 30vw"
                        />
                        <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/10" />
                      </div>

                      <div className="flex flex-col flex-grow p-3 sm:p-6">
                        {/* Rating */}
                        <div className="flex items-center gap-1 text-[9px] sm:text-[11px] font-bold text-secondary">
                          <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
                          <span>{product.rating.toFixed(1)}</span>
                          <span className="opacity-50 font-normal hidden xs:inline">({product.reviews} reviews)</span>
                        </div>

                        {/* Title & Description */}
                        <div className="min-h-[2.75rem] sm:min-h-[3.25rem] md:min-h-[3.75rem] flex items-center mt-1 sm:mt-2">
                          <h3 className="font-trivane-retro text-sm sm:text-base md:text-lg font-black text-primary leading-tight uppercase">
                            {product.name}
                          </h3>
                        </div>
                        
                        {/* Hidden on mobile to make room for two products per row */}
                        <p className="mt-2 text-xs leading-relaxed opacity-70 flex-grow hidden sm:block">
                          {product.description}
                        </p>

                        {/* Nutritional Facts Row - Hidden on mobile */}
                        <div className="mt-4 grid grid-cols-4 gap-1.5 border-t border-b border-primary/10 py-3 text-center hidden sm:grid">
                          <div className="flex flex-col justify-center">
                            <span className="text-[10px] font-semibold opacity-50 uppercase">Cal</span>
                            <span className="text-xs font-bold text-primary flex items-center justify-center gap-0.5">
                              <Flame className="h-3 w-3 text-secondary" />
                              {product.nutrition.cal}
                            </span>
                          </div>
                          <div className="flex flex-col justify-center border-l border-primary/10">
                            <span className="text-[10px] font-semibold opacity-50 uppercase">Prot</span>
                            <span className="text-xs font-bold text-primary flex items-center justify-center gap-0.5">
                              <Trophy className="h-3 w-3 text-secondary" />
                              {product.nutrition.protein}
                            </span>
                          </div>
                          <div className="flex flex-col justify-center border-l border-primary/10">
                            <span className="text-[10px] font-semibold opacity-50 uppercase">Carbs</span>
                            <span className="text-xs font-bold text-primary">{product.nutrition.carbs}</span>
                          </div>
                          <div className="flex flex-col justify-center border-l border-primary/10">
                            <span className="text-[10px] font-semibold opacity-50 uppercase">Fat</span>
                            <span className="text-xs font-bold text-primary">{product.nutrition.fat}</span>
                          </div>
                        </div>

                        {/* Price and Interactive Add to Cart button */}
                        <div className="mt-auto pt-3 sm:pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                          <div className="flex flex-col">
                            <span className="text-[8px] sm:text-[9px] font-semibold opacity-50 uppercase tracking-wider">Per Pie</span>
                            <span className="text-base sm:text-lg font-extrabold text-primary">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>

                          {quantity === 0 ? (
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, 1)}
                              className="flex items-center justify-center gap-1 rounded-md bg-primary hover:bg-secondary hover:text-secondary-content text-primary-content px-3 sm:px-5 py-2 sm:py-2.5 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.03]"
                            >
                              <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              Add
                            </button>
                          ) : (
                            <div className="flex items-center justify-center rounded-md bg-primary text-primary-content px-2 sm:px-3 py-1 sm:py-1.5 border border-secondary/20 shadow-md">
                              <button
                                type="button"
                                onClick={() => updateQuantity(product.id, -1)}
                                className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-md hover:bg-secondary hover:text-secondary-content transition-colors"
                              >
                                <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              </button>
                              <span className="w-6 sm:w-8 text-center text-xs font-bold">{quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(product.id, 1)}
                                className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-md hover:bg-secondary hover:text-secondary-content transition-colors"
                              >
                                <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons (Desktop only) */}
          {maxIndex > 0 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-content border border-secondary/20 shadow-lg transition-all hover:bg-secondary hover:text-secondary-content hover:scale-105 disabled:opacity-30 disabled:pointer-events-none sm:left-0"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                disabled={currentIndex === maxIndex}
                className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-content border border-secondary/20 shadow-lg transition-all hover:bg-secondary hover:text-secondary-content hover:scale-105 disabled:opacity-30 disabled:pointer-events-none sm:right-0"
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
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? "w-6 bg-secondary" : "w-1.5 bg-primary/20"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
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
