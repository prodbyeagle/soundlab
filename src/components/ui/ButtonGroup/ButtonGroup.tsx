import React from 'react';
import { ButtonGroupProps } from './ButtonGroup.types';
import { cn } from '../../../lib/cn';

/**
 * A functional component that renders a group of buttons.
 *
 * @param {ButtonGroupProps} props - The properties for the ButtonGroup component.
 * @param {string[]} props.buttons - An array of button labels to be displayed.
 * @param {string} props.activeButton - The label of the currently active button.
 * @param {(button: string) => void} props.onButtonClick - The callback function to be called when a button is clicked.
 *
 * @returns {JSX.Element} The rendered ButtonGroup component.
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
	buttons,
	activeButton,
	onButtonClick,
	size = 'md',
	className = '',
}) => {
	const sizeClasses = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-5 py-2.5 text-base',
	};

	const iconSize = {
		sm: 14,
		md: 16,
		lg: 18,
	};

	return (
		<div
			className={cn(
				'mx-auto flex w-full gap-1 rounded-lg p-1',
				'border border-neutral-200 bg-neutral-100 dark:border-neutral-900 dark:bg-neutral-950',
				className
			)}>
			{buttons.map(({ label, icon: Icon }) => (
				<button
					key={label}
					onClick={() => onButtonClick(label)}
					className={cn(
						'flex flex-1 items-center justify-center gap-1 rounded-md transition-all duration-300',
						'font-medium select-none active:scale-[.98]',
						'hover:border-opacity-100 border border-transparent hover:border-neutral-300 dark:hover:border-neutral-800',
						sizeClasses[size],
						activeButton === label
							? 'bg-neutral-200 text-neutral-900 shadow-sm dark:bg-neutral-900 dark:text-neutral-100'
							: 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100'
					)}>
					{Icon && <Icon size={iconSize[size]} />}
					{label}
				</button>
			))}
		</div>
	);
};
