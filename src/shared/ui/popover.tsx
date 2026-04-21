import * as React from 'react';
import {
  Root,
  Trigger,
  Anchor,
  Portal,
  Content,
} from '@radix-ui/react-popover';
import { cn } from '@/shared/lib/cn';

export const Popover = Root;
export const PopoverTrigger = Trigger;
export const PopoverAnchor = Anchor;

export const PopoverContent = React.forwardRef<
  React.ElementRef<typeof Content>,
  React.ComponentPropsWithoutRef<typeof Content>
>(({ className, align = 'start', sideOffset = 8, ...rest }, ref) => (
  <Portal>
    <Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 rounded-[8px] border border-surface-divider bg-white shadow-[0_8px_24px_rgba(53,60,73,0.12)]',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className,
      )}
      {...rest}
    />
  </Portal>
));
PopoverContent.displayName = 'PopoverContent';
