import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { SliderProps } from './Slider.types';
import { cn } from '../../../lib/cn';

const valueToPercent = (value: number, min: number, max: number): number =>
	((value - min) / (max - min)) * 100;

const percentToValue = (
	percent: number,
	min: number,
	max: number,
	step: number,
	variant: string,
	isDragging: boolean,
	getClosestMarker: (value: number) => number
): number => {
	const rawValue = ((max - min) * percent) / 100 + min;
	if (variant === 'sticky' && !isDragging) return getClosestMarker(rawValue);
	return Math.round(rawValue / step) * step;
};

export const Slider: React.FC<SliderProps> = ({
	min,
	max,
	step = 1,
	value,
	onChange,
	variant = 'standard',
	markers = [],
	className = '',
	label,
	disabled = false,
}) => {
	const [isDragging, setIsDragging] = useState(false);
	const sliderRef = useRef<HTMLDivElement>(null);

	const getClosestMarker = useCallback(
		(currentValue: number): number => {
			if (!markers.length) return currentValue;
			return markers.reduce((prev, curr) =>
				Math.abs(curr - currentValue) < Math.abs(prev - currentValue)
					? curr
					: prev
			);
		},
		[markers]
	);

	const handleInteraction = useCallback(
		(clientX: number) => {
			if (disabled || !sliderRef.current) return;
			const rect = sliderRef.current.getBoundingClientRect();
			const percent = Math.max(
				0,
				Math.min(100, ((clientX - rect.left) / rect.width) * 100)
			);
			onChange(
				percentToValue(
					percent,
					min,
					max,
					step,
					variant,
					isDragging,
					getClosestMarker
				)
			);
		},
		[
			disabled,
			onChange,
			min,
			max,
			step,
			variant,
			isDragging,
			getClosestMarker,
		]
	);

	const handleMouseDown = (e: React.MouseEvent) => {
		if (disabled) return;
		setIsDragging(true);
		handleInteraction(e.clientX);
	};

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) =>
			isDragging && handleInteraction(e.clientX);
		const handleMouseUp = () => {
			if (isDragging) {
				setIsDragging(false);
				if (variant === 'sticky') onChange(getClosestMarker(value));
			}
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [
		isDragging,
		handleInteraction,
		getClosestMarker,
		onChange,
		value,
		variant,
	]);

	const getMarkerPositions = () => {
		if (variant === 'none') return [];
		if (variant === 'non-uniform' && markers.length) return markers;
		if (['standard', 'sticky'].includes(variant)) {
			const count = Math.floor((max - min) / step);
			return Array.from(
				{ length: count + 1 },
				(_, i) => min + i * step
			).filter((_, i) => i % 10 === 0);
		}
		return [];
	};

	return (
		<div className={`w-full ${className}`}>
			{label && (
				<label className='mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
					{label}
				</label>
			)}

			<div
				ref={sliderRef}
				className={`relative h-12 select-none ${disabled ? 'pointer-events-none cursor-not-allowed opacity-50' : ''}`}>
				<span className='absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2 rounded-full bg-neutral-200 dark:bg-neutral-700' />

				<div
					className='absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full bg-neutral-900 dark:bg-neutral-200'
					style={{ width: `${valueToPercent(value, min, max)}%` }}
				/>

				{getMarkerPositions().map((markerValue) => (
					<div
						key={markerValue}
						className={`absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${
							value >= markerValue
								? 'bg-neutral-900 dark:bg-neutral-200'
								: 'bg-neutral-400 dark:bg-neutral-400'
						} ${variant === 'sticky' ? 'transition-transform hover:scale-150' : ''}`}
						style={{
							left: `${valueToPercent(markerValue, min, max)}%`,
						}}
					/>
				))}

				<div
					className={`absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 border-neutral-900 bg-white shadow-sm transition-transform hover:scale-110 dark:border-neutral-200 dark:bg-neutral-900 ${
						isDragging ? 'scale-110 active:scale-120' : ''
					}`}
					style={{ left: `${valueToPercent(value, min, max)}%` }}
					onMouseDown={handleMouseDown}
					role='slider'
					aria-valuemin={min}
					aria-valuemax={max}
					aria-valuenow={value}
					tabIndex={disabled ? -1 : 0}
					onKeyDown={(e) => {
						if (disabled) return;
						const increment = e.shiftKey ? 10 : 1;
						if (e.key === 'ArrowLeft' || e.key === 'ArrowDown')
							onChange(Math.max(min, value - increment));
						if (e.key === 'ArrowRight' || e.key === 'ArrowUp')
							onChange(Math.min(max, value + increment));
					}}>
					<span
						className={cn(
							`pointer-events-none absolute bottom-full mb-2 rounded-lg border border-neutral-600/50 px-2 py-1 text-xs font-medium ${variant !== 'none' ? 'bg-neutral-950 text-neutral-100' : 'hidden'} transition duration-300 ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`
						)}
						style={{ left: '50%', transform: 'translateX(-50%)' }}>
						{value}
					</span>
				</div>
			</div>
		</div>
	);
};
