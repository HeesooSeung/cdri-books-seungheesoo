import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind 클래스 병합 유틸.
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
