import type { CardProps } from './Card.types';

/**
 * Card Component
 *
 * A flexible card component that can be styled with Tailwind CSS, including dark mode support via class manipulation.
 */
export const Card = ({ children, className }: CardProps) => {
	return (
		<div
			className={`rounded-xl border border-neutral-200 bg-neutral-100 p-6 dark:border-neutral-900 dark:bg-neutral-950 ${className || ''}`}>
			{children}
		</div>
	);
};
