"use client";

import { Button } from "./ui/button";
import PricingModal from "./PricingModal";

export default function ProLockedSection({
  isPro,
  lockText,
  ctaText = "Upgrade to Pro →",
  children,
}) {
  return (
    <div className="relative">
      <div className={!isPro ? "blur-sm pointer-events-none" : ""}>
        {children}
      </div>

      {!isPro && (
        <div className="absolute flex justify-center items-center inset-0 z-10">
          <div className="bg-white/90 border border-stone-200 text-center rounded-xl shadow-sm px-4 py-3">
            <div className="text-stone-900 text-sm font-semibold">
              🔒 {lockText}
            </div>

            <PricingModal>
              <Button
                variant="outline"
                className="text-orange-600 hover:text-orange-700"
              >
                {ctaText}
              </Button>
            </PricingModal>
          </div>
        </div>
      )}
    </div>
  );
}
