type Props = {
  className?: string;
};

/**
 * User-provided coral wordmark. Transparent PNG is generated from `airbnb-logo.webp`
 * so the black matte in the source file does not show on the white header.
 */
export function AirbnbLogo({ className = 'h-8 w-auto max-h-8' }: Props) {
  return (
    <img
      src="/airbnb-logo-transparent.png"
      alt=""
      width={102}
      height={32}
      decoding="async"
      className={`object-contain object-left ${className}`}
    />
  );
}
