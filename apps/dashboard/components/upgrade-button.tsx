"use client";

import { Button } from "@repo/ui";
import { Loader2, Zap } from "lucide-react";
import { useState } from "react";
import { When } from "react-if";

interface UpgradeButtonProps {
  userId: string;
  variantId: string; // The Product ID from Lemon Squeezy Dashboard
  buttonText?: string;
  className?: string;
}

export function UpgradeButton({
  userId,
  variantId,
  buttonText = "Upgrade to Pro",
  className,
}: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = () => {
    setLoading(true);
    // Construct the checkout URL with the user_id in custom data
    // Format: https://your-store.lemonsqueezy.com/checkout/buy/:variant_id?checkout[custom][user_id]=:user_id
    const checkoutUrl = `https://your-store.lemonsqueezy.com/checkout/buy/${variantId}?checkout[custom][user_id]=${userId}`;
    window.location.href = checkoutUrl;
  };

  return (
    <Button onClick={handleCheckout} disabled={loading} className={className}>
      <When condition={loading}>
        <Loader2 className="mr-2 size-4 animate-spin" />
      </When>
      <When condition={!loading}>
        <Zap className="mr-2 size-4" />
      </When>
      {buttonText}
    </Button>
  );
}
