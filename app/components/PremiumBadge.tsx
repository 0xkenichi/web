"use client";

interface PremiumBadgeProps {
  isPremium: boolean;
}

export default function PremiumBadge({ isPremium }: PremiumBadgeProps) {
  if (!isPremium) return null;

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
      PRO
    </span>
  );
}

