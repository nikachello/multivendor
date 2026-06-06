import { ShopTestimonial } from "@/lib/types/data-types";

type Props = {
  testimonial: ShopTestimonial;
};

const TestimonialCard = ({ testimonial }: Props) => {
  const initials = testimonial.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="h-[320px] w-[320px] rounded-3xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
            {initials}
          </div>

          <div>
            <h3 className="text-base font-semibold text-foreground">
              {testimonial.name}
            </h3>

            {testimonial.position && (
              <p className="text-sm text-muted-foreground">
                {testimonial.position}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-1 text-yellow-500">
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>

        <p className="mt-4 flex-1 text-[15px] leading-7 text-muted-foreground">
          “{testimonial.testimony}”
        </p>
      </div>
    </div>
  );
};

export default TestimonialCard;
