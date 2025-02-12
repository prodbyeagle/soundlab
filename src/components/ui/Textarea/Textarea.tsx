import React from 'react';
import { cn } from '../../../lib/cn';
import type { TextareaProps } from './Textarea.types';

export const Textarea: React.FC<TextareaProps> = ({
	label,
	error,
	className,
	...props
}) => {
	return (
		<div className={cn('w-full', className)}>
			{label && (
				<label
					htmlFor={props.id || props.name}
					className='mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-400'>
					{label}
				</label>
			)}
			<textarea
				{...props}
				className={cn(
					'w-full border border-neutral-300 bg-neutral-100 p-3 text-sm',
					'rounded-xl text-neutral-900 placeholder:text-neutral-500 focus:ring-1 focus:outline-hidden',
					'focus:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:placeholder:text-neutral-500',
					'resize-none dark:text-neutral-100 dark:focus:ring-neutral-400',
					error ? 'focus:ring-red-400 dark:focus:ring-red-400' : ''
				)}
			/>
			{error && <p className='mt-2 text-xs text-red-400'>{error}</p>}
		</div>
	);
};
