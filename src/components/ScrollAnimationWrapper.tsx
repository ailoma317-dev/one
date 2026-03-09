import { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

type AnimationType = 'fade-in' | 'scale-in' | 'slide-left' | 'slide-right';

interface ScrollAnimationWrapperProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  className?: string;
  once?: boolean;
}

const animationClasses: Record<AnimationType, string> = {
  'fade-in': 'scroll-fade-in',
  'scale-in': 'scroll-scale-in',
  'slide-left': 'scroll-slide-left',
  'slide-right': 'scroll-slide-right',
};

export function ScrollAnimationWrapper({
  children,
  animation = 'fade-in',
  delay = 0,
  className,
  once = true,
}: ScrollAnimationWrapperProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.1,
    once,
  });

  return (
    <div
      ref={ref}
      className={cn(
        animationClasses[animation],
        isVisible && 'visible',
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}