import { cn } from '../../../lib/cn';
import type { BadgeProps } from './Badge.types';

export const Badge = ({
	variant = 'neutral',
	icon: Icon,
	text,
}: BadgeProps) => {
	const badgeVariants = {
		neutral: {
			bg: 'bg-neutral-200 dark:bg-neutral-900',
			text: 'text-neutral-900 dark:text-neutral-300',
		},
		secondary: {
			bg: 'bg-neutral-300 dark:bg-neutral-700',
			text: 'text-neutral-900 dark:text-neutral-300',
		},
		border: {
			bg: 'bg-transparent border border-neutral-300 dark:border-neutral-700',
			text: 'text-neutral-900 dark:text-neutral-300',
		},
		danger: {
			bg: 'bg-red-100 dark:bg-red-900',
			text: 'text-red-900 dark:text-red-300',
		},
		success: {
			bg: 'bg-green-100 dark:bg-green-900',
			text: 'text-green-900 dark:text-green-300',
		},
	};

	const { bg, text: textColor } =
		badgeVariants[variant] || badgeVariants.neutral;

	return (
		<span
			className={cn(
				'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-center text-xs font-medium',
				bg,
				textColor
			)}>
			{Icon && <Icon size={14} className='mr-1' />}
			{text}
		</span>
	);
};
