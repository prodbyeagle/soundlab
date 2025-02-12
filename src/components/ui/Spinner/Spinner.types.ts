/**
 * Represents the properties for the Spinner component.
 */
export interface SpinnerProps {
	/**
	 * Optional additional className for custom styling of the spinner.
	 */
	className?: string;

	/**
	 * Optional size of the spinner, represented as a number.
	 * Defines the diameter of the spinner (e.g., in pixels).
	 * The width of the spinner will be half of the size (e.g., size 30 will result in a width/height of 15 pixels).
	 */
	size?: number;

	/**
	 * Optional color of the spinner.
	 * Can be a CSS color value (e.g., 'red', '#ff0000', 'rgb(255, 0, 0)').
	 */
	color?: string;

	/**
	 * Optional stroke width of the spinner's circle.
	 * A number representing the thickness of the spinner's outline.
	 * Values above 8 are not recommended.
	 */
	strokeWidth?: number;

	/**
	 * Optional speed of the spinner's rotation.
	 * A number representing the duration (in seconds) for one full rotation.
	 * The higher the number, the slower the rotation.
	 */
	speed?: number;
}
