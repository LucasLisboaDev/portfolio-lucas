import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { ArrowUpRight } from "./icons";

type Variant = "primary" | "secondary" | "inverse" | "inverse-outline";
type Size = "md" | "lg";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Show the diagonal arrow that nudges up and right on hover. */
  arrow?: boolean;
  /** Optional leading icon (for example the microphone on the Maya button). */
  icon?: ReactNode;
  /** Stretch to the full width of the parent (used on phones). */
  block?: boolean;
  className?: string;
};

type LinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

const variants: Record<Variant, string> = {
  // Dark ink pill, the main call to action
  primary: "bg-ink text-canvas hover:bg-ink/85",
  // Outlined pill that fills with ink on hover
  secondary: "border border-ink text-ink hover:bg-ink hover:text-canvas",
  // Light pill for use on dark sections
  inverse: "bg-canvas text-ink hover:bg-canvas/85",
  // Outlined pill for use on dark sections
  "inverse-outline":
    "border border-canvas/70 text-canvas hover:bg-canvas hover:text-ink",
};

const sizes: Record<Size, string> = {
  md: "px-[18px] py-2.5 text-sm",
  lg: "px-[22px] py-3.5 text-[15px]",
};

/**
 * The redesign's button. Renders a Next.js Link for internal routes, a plain
 * anchor for hashes, mail and external URLs, or a button when there is no
 * href. Every size keeps at least a 44px touch target.
 */
export default function PillButton(props: LinkProps | ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "lg",
    arrow = false,
    icon,
    block = false,
    className,
    ...rest
  } = props;

  const classes = cn(
    "group inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-medium",
    "transition-colors duration-fast ease-reveal disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    block && "w-full",
    className,
  );

  const content = (
    <>
      {icon}
      <span>{children}</span>
      {arrow && (
        <ArrowUpRight
          size={size === "lg" ? 15 : 14}
          className="transition-transform duration-fast ease-reveal group-hover:-translate-y-[3px] group-hover:translate-x-[3px]"
        />
      )}
    </>
  );

  if (typeof rest.href === "string") {
    const { href, ...anchorRest } = rest as LinkProps;
    const isInternalRoute = href.startsWith("/") && !href.startsWith("//");
    const isExternal = /^https?:\/\//.test(href);

    if (isInternalRoute) {
      return (
        <Link href={href} className={classes} {...anchorRest}>
          {content}
        </Link>
      );
    }
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...anchorRest}
      >
        {content}
      </a>
    );
  }

  const { type = "button", ...buttonRest } = rest as ButtonProps;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
