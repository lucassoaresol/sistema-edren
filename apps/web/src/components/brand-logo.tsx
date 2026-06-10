import { cn } from '@/lib/utils';

type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <span
      aria-label="EDREN Vestuario Feminino"
      className={cn('block h-8 w-40 bg-current', className)}
      role="img"
      style={{
        maskImage: 'url(/brand/edren-logo.svg)',
        maskPosition: 'center',
        maskRepeat: 'no-repeat',
        maskSize: 'contain',
        WebkitMaskImage: 'url(/brand/edren-logo.svg)',
        WebkitMaskPosition: 'center',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
      }}
    />
  );
}
