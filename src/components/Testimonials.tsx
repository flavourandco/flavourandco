const testimonials = [
  {
    quote:
      "These pies completely changed how we entertain. The butter chicken pie is absolutely divine — guests always ask where they're from.",
    author: "Sarah M.",
    role: "Food Enthusiast, Toronto",
  },
  {
    quote:
      "As someone who grew up with samosas, the samosa pie brought tears to my eyes. Authentic flavours with a beautiful modern presentation.",
    author: "Raj P.",
    role: "Chef & Restaurateur",
  },
  {
    quote:
      "We order wholesale for our café every week. Consistent quality, incredible flavour, and our customers can't get enough.",
    author: "Emily K.",
    role: "Café Owner, Vancouver",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-warm-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold">
            Testimonials
          </p>
          <h2 className="mt-4 font-serif text-4xl font-light tracking-tight text-charcoal md:text-5xl">
            Loved by Food Lovers
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote
              key={item.author}
              className="relative bg-white p-8 shadow-sm md:p-10"
            >
              <span className="font-serif text-6xl leading-none text-gold/20">
                &ldquo;
              </span>
              <p className="mt-2 text-base leading-relaxed text-stone-600">
                {item.quote}
              </p>
              <footer className="mt-6 border-t border-stone-100 pt-6">
                <p className="font-medium text-charcoal">{item.author}</p>
                <p className="mt-1 text-sm text-stone-400">{item.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
