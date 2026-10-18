import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Cart", "Delivery details", "Payment", "Order complete"];

/** Progress indicator shared by cart → checkout → confirmation. `current` is 0-based. */
export function CheckoutSteps({ current }: { current: number }) {
  return (
    <ol aria-label="Checkout progress" className="mx-auto flex max-w-3xl items-center">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className={cn("flex items-center", i < STEPS.length - 1 && "flex-1")}>
            <div className="flex items-center gap-2.5">
              <span
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                  done && "border-forest bg-forest text-white",
                  active && "border-forest bg-forest-dark text-white",
                  !done && !active && "border-line-strong bg-white text-muted-foreground",
                )}
              >
                {done ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
              </span>
              <span className={cn("hidden text-sm sm:inline", active ? "font-semibold text-ink" : "text-muted-foreground")}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span aria-hidden className={cn("mx-3 h-px flex-1", done ? "bg-forest" : "bg-line-strong")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
