import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// 커스텀 fontSize / color 토큰이 기본 twMerge class-group 해석과 충돌하지 않도록 확장.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            't1',
            't2',
            't3',
            'h2',
            'title3',
            'b1',
            'b2',
            'body2',
            'body2b',
            'caption',
            'cap',
            'small',
            'tiny',
          ],
        },
      ],
      'text-color': [
        {
          text: [
            'brand',
            'brand-hover',
            'ink-title',
            'ink-primary',
            'ink-secondary',
            'ink-subtitle',
            'surface-white',
            'surface-light',
            'surface-gray',
            'surface-divider',
            'palette-gray',
            'palette-black',
            'danger',
          ],
        },
      ],
      'border-color': [
        {
          border: [
            'brand',
            'brand-hover',
            'ink-title',
            'ink-primary',
            'ink-secondary',
            'ink-subtitle',
            'surface-white',
            'surface-light',
            'surface-gray',
            'surface-divider',
            'palette-gray',
            'palette-black',
            'danger',
          ],
        },
      ],
      'bg-color': [
        {
          bg: [
            'brand',
            'brand-hover',
            'ink-title',
            'ink-primary',
            'ink-secondary',
            'ink-subtitle',
            'surface-white',
            'surface-light',
            'surface-gray',
            'surface-divider',
            'palette-gray',
            'palette-black',
            'danger',
          ],
        },
      ],
    },
  },
});

// Tailwind 클래스 병합 유틸.
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
