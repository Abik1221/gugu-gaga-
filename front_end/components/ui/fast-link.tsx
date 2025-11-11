"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface FastLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
}

export function FastLink({ href, children, className, prefetch = true }: FastLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <Link 
      href={href} 
      className={className}
      prefetch={prefetch}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}