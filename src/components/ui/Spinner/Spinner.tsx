import { FC } from 'react';
import type { SpinnerProps } from './Spinner.types';

/**
 * Spinner component renders a customizable loading spinner using SVG.
 *
 * @param {string} className - Additional class names to apply to the SVG element.
 * @param {number} size - The size of the spinner (width and height in pixels). Default is 48.
 * @param {string} color - The color of the spinner stroke. Default is 'currentColor'.
 * @param {number} strokeWidth - The width of the spinner stroke. Default is 3.
 * @param {number} speed - The speed of the spinner animation in seconds. Default is 1.5.
 *
 * @returns {JSX.Element} The rendered SVG spinner element.
 */
export const Spinner: FC<SpinnerProps> = ({
	className = '',
	size = 48,
	color = 'currentColor',
	strokeWidth = 3,
	speed = 1.5,
}) => {
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;

	const spinnerColor = color;

	return (
		<svg
			className={className}
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
			xmlns='http://www.w3.org/2000/svg'
			style={{
				animation: `spin ${speed}s cubic-bezier(0.4, 0.0, 0.2, 1) infinite`,
			}}>
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				fill='none'
				stroke={spinnerColor}
				strokeWidth={strokeWidth}
				strokeLinecap='round'
				strokeDasharray={circumference}
				strokeDashoffset={circumference * 0.25}
			/>
			<style>
				{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
			</style>
		</svg>
	);
};
