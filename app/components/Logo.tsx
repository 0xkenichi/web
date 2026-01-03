"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  textColor?: "dark" | "light";
  onClick?: () => void;
  variant?: "icon" | "lockup";
}

export default function Logo({ 
  size = "md", 
  showText = true, 
  className = "", 
  textColor = "dark", 
  onClick,
  variant = "icon"
}: LogoProps) {
  const router = useRouter();
  
  const sizeClasses = {
    sm: { icon: "w-6 h-6", text: "text-lg", lockup: "h-6" },
    md: { icon: "w-10 h-10", text: "text-2xl", lockup: "h-8" },
    lg: { icon: "w-16 h-16", text: "text-4xl", lockup: "h-12" },
  };

  const currentSize = sizeClasses[size];

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push("/");
    }
  };

  const LogoContent = () => {
    if (variant === "lockup" && showText) {
      return (
        <div className={`flex items-center ${className}`}>
          <Image
            src="/verba-lockup-horizontal.png"
            alt="Verba"
            width={currentSize.lockup === "h-6" ? 120 : currentSize.lockup === "h-8" ? 160 : 240}
            height={currentSize.lockup === "h-6" ? 24 : currentSize.lockup === "h-8" ? 32 : 48}
            className={currentSize.lockup}
            priority
          />
        </div>
      );
    }

    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {/* Verba Icon */}
        <div className={`${currentSize.icon} relative flex-shrink-0`}>
          <Image
            src="/verba-icon.svg"
            alt="Verba"
            width={currentSize.icon === "w-6 h-6" ? 24 : currentSize.icon === "w-10 h-10" ? 40 : 64}
            height={currentSize.icon === "w-6 h-6" ? 24 : currentSize.icon === "w-10 h-10" ? 40 : 64}
            className="w-full h-full"
            priority
          />
        </div>
        {showText && (
          <span className={`${currentSize.text} font-bold verba-gradient-text`}>
            Verba
          </span>
        )}
      </div>
    );
  };

  if (onClick || !showText) {
    return (
      <button 
        onClick={handleClick} 
        className="focus:outline-none focus:ring-2 focus:ring-[var(--verba-indigo)] rounded-lg transition-opacity hover:opacity-80"
        aria-label="Verba Home"
      >
        <LogoContent />
      </button>
    );
  }

  return (
    <Link 
      href="/" 
      className="focus:outline-none focus:ring-2 focus:ring-[var(--verba-indigo)] rounded-lg transition-opacity hover:opacity-80"
      aria-label="Verba Home"
    >
      <LogoContent />
    </Link>
  );
}
