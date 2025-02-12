/**
 * Properties for the Gradient component.
 */
export interface GradientProps {
	/**
	 * The width of the gradient.
	 * @default "100%"
	 */
	width?: string;

	/**
	 * The height of the gradient.
	 * @default "100%"
	 */
	height?: string;

	/**
	 * The opacity of the noise overlay.
	 * @default 0.5
	 */
	noiseOpacity?: number;

	/**
	 * The intensity of the warp effect.
	 * @default 1
	 */
	warpIntensity?: number;

	/**
	 * The speed of the gradient animation.
	 * @default 1
	 */
	speed?: number;

	/**
	 * An array of colors to be used in the gradient.
	 */
	colors?: string[];

	/**
	 * Additional class names to apply to the gradient component.
	 */
	className?: string;
}

/**
 * Interface representing the properties for a shader plane component.
 */
export interface ShaderPlaneProps {
	/**
	 * The speed at which the shader plane moves.
	 */
	speed: number;

	/**
	 * An array of color values used in the shader plane.
	 */
	colors: string[];

	/**
	 * The opacity level of the noise effect in the shader plane.
	 */
	noiseOpacity: number;

	/**
	 * The intensity of the warp effect in the shader plane.
	 */
	warpIntensity: number;
}
