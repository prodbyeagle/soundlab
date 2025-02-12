import { useState, useEffect, useRef, JSX } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../../lib/cn';
import type { SelectProps } from './Select.types';

/**
 * A customizable Select component for choosing options.
 *
 * @param value The current selected value.
 * @param onChange The callback function triggered when the value changes.
 * @param options The available options to choose from, where each option has a `value` and `label`.
 * @param className Optional custom class name to apply to the component.
 * @param placeholder Optional placeholder text shown when no option is selected.
 * @returns A `JSX.Element` representing the Select component.
 */
export const Select = <T extends string | number>({
	value,
	onChange,
	options,
	className = '',
	placeholder = 'Select an option',
}: SelectProps<T>): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const selectRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				selectRef.current &&
				!selectRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const selectedOption = options.find((option) => option.value === value);

	return (
		<div ref={selectRef} className={cn('relative', className)}>
			<button
				type='button'
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					'relative h-full w-full rounded-lg border border-neutral-300 bg-neutral-100 px-3 py-2 text-left text-sm transition-all duration-200 dark:border-neutral-800 dark:bg-neutral-950',
					isOpen
						? 'ring-2 ring-neutral-400/20 dark:ring-neutral-600/20'
						: ''
				)}>
				<span
					className={cn(
						'mr-4 block truncate',
						!selectedOption
							? 'text-neutral-500 dark:text-neutral-400'
							: 'text-neutral-900 dark:text-neutral-100'
					)}>
					{selectedOption ? selectedOption.label : placeholder}
				</span>
				<span className='absolute inset-y-0 right-0 flex items-center pr-2'>
					<ChevronDown
						className={cn(
							'h-4 w-4 text-neutral-500 transition-transform duration-200 dark:text-neutral-400',
							isOpen ? 'rotate-180 transform' : ''
						)}
					/>
				</span>
			</button>

			{isOpen && (
				<div className='absolute z-10 mt-2 w-full'>
					<div className='relative'>
						<div className='relative rounded-lg border border-neutral-300 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-950'>
							<ul className='max-h-60 overflow-auto'>
								{options.map((option, index) => (
									<li
										key={option.value}
										onClick={() => {
											onChange(option.value);
											setIsOpen(false);
										}}
										className={cn(
											'relative cursor-pointer rounded-md px-2.5 py-2 text-sm transition-colors duration-150 select-none',
											option.value === value
												? 'border-neutral-100 bg-neutral-200 text-neutral-700 dark:border dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100'
												: 'text-neutral-900 hover:bg-neutral-200 dark:text-neutral-100 dark:hover:bg-neutral-900/50',
											index === options.length - 1
												? 'mb-0'
												: 'mb-1'
										)}>
										<div className='flex items-center justify-between'>
											<span
												className={cn(
													'block truncate',
													option.value === value
														? 'font-medium'
														: 'font-normal'
												)}>
												{option.label}
											</span>
											{option.value === value && (
												<Check className='ml-2 h-4 w-4 text-neutral-700 dark:text-neutral-400' />
											)}
										</div>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
