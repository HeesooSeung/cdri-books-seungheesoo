import * as React from 'react';

import {
  Root,
  Item,
  Header,
  Trigger,
  Content,
} from '@radix-ui/react-accordion';

import { cn } from '@/shared/lib/cn';

// Radix accordion 래퍼. Header 는 trigger 이외 요소도 배치 가능하도록 분리 export.

export const Accordion = Root;

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof Item>,
  React.ComponentPropsWithoutRef<typeof Item>
>(({ className, ...props }, ref) => (
  <Item ref={ref} className={cn(className)} {...props} />
));
AccordionItem.displayName = 'AccordionItem';

export const AccordionHeader = Header;

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof Trigger>,
  React.ComponentPropsWithoutRef<typeof Trigger>
>(({ className, children, ...props }, ref) => (
  <Trigger ref={ref} className={cn(className)} {...props}>
    {children}
  </Trigger>
));
AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof Content>,
  React.ComponentPropsWithoutRef<typeof Content>
>(({ className, children, ...props }, ref) => (
  <Content
    ref={ref}
    className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn(className)}>{children}</div>
  </Content>
));
AccordionContent.displayName = 'AccordionContent';
