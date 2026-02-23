"use client";

import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

type SignOutButtonProps = React.ComponentProps<"button"> & {
  callbackUrl?: string;
};

const SignOutButton = ({
  callbackUrl = "/giris",
  className,
  onClick,
  children,
  ...props
}: SignOutButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    signOut({ callbackUrl });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default SignOutButton;
