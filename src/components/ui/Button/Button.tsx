import React, { JSX } from 'react';
import { cn } from '../../../lib/cn';
import type { ButtonProps } from './Button.types';
import { Spinner } from '../Spinner/Spinner';

export const Button: React.FC<ButtonProps> = ({
	content,
	children,
	variant = 'neutral',
	size = 'md',
	loading = false,
	icon: Icon,
	className,
	disabled,
	...props
}: ButtonProps): JSX.Element => {
	const baseStyles =
		'inline-flex h-10 items-center justify-center font-medium active:scale-[.98] transition-all ease-in-out duration-200 rounded-lg disabled:opacity-60 disabled:pointer-events-none';

	const variants = {
		neutral:
			'bg-neutral-200 text-neutral-900 hover:bg-neutral-400/50 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-900/50',
		secondary:
			'bg-neutral-300 text-neutral-900 hover:bg-neutral-600/50 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-700/50',
		ghost: 'bg-transparent text-neutral-900 hover:bg-neutral-400/50 dark:bg-transparent dark:text-neutral-100 dark:hover:bg-neutral-800/80',
		border: 'border border-neutral-300 hover:border-transparent text-neutral-900 hover:bg-neutral-400/50 dark:border-neutral-800/50 dark:text-neutral-100 dark:hover:bg-neutral-800/50',
		danger: 'bg-red-500 text-neutral-100 hover:bg-red-400 dark:bg-red-500 dark:text-neutral-100 dark:hover:bg-red-500/60',
		link: 'text-neutral-900 underline hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-400',
		shiny: 'border border-neutral-300 hover:border-transparent text-neutral-900 hover:bg-neutral-400/50 dark:border-neutral-800/50 dark:text-neutral-100 dark:hover:bg-neutral-800/50',
	};

	const sizes = {
		sm: 'px-3 py-2 text-xs',
		md: 'px-4 py-2 text-sm',
		lg: 'px-5 py-3 text-lg',
	};

	const isShiny = variant === 'shiny';

	return (
		<button
			className={cn(
				baseStyles,
				variants[variant],
				sizes[size],
				className,
				isShiny ? 'always-shiny' : ''
			)}
			disabled={disabled || loading}
			{...props}>
			{loading && <Spinner size={18} />}
			{Icon && (
				<Icon
					size={16}
					className={cn(content || children ? 'mr-2' : '')}
				/>
			)}
			{(content || children) && (
				<span className={cn(loading ? 'ml-2' : '')}>
					{content || children}
				</span>
			)}
		</button>
	);
};
