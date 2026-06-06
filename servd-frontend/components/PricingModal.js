"use client";

import { useState } from "react";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import PricingSection from "./PricingSection";

export default function PricingModal({ subscriptionTier = "free", children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const canOpen = subscriptionTier === "free";

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={canOpen ? setIsModalOpen : undefined}
    >
      <DialogTrigger asChild disabled={!canOpen}>
        <button type="button" disabled={!canOpen}>
          {children}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-4xl pt-4 p-8">
        <DialogTitle className="sr-only">
          Upgrade to Pro Pricing Plans
        </DialogTitle>
        <div>
          <PricingSection subscriptionTier={subscriptionTier} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
