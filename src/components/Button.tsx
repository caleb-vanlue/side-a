import React from "react";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "icon";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "rounded-lg transition-all duration-200 font-medium focus:outline-none";

  const variantStyles = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95",
    secondary:
      "bg-zinc-800 bg-opacity-90 text-zinc-200 hover:bg-zinc-700 active:scale-95",
    tertiary: "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95",
    icon: "rounded-full bg-zinc-900 bg-opacity-90 text-zinc-200 hover:bg-zinc-800 active:scale-95",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3",
  };

  const iconSizeStyles = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const computedSizeStyles =
    variant === "icon" ? iconSizeStyles[size] : sizeStyles[size];

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${computedSizeStyles}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {variant === "icon" ? (
        <div className="flex items-center justify-center">
          {icon || children}
        </div>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
