import { LucideIcon } from 'lucide-react';

/**
 * Represents the properties for the Button component.
 */
export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/**
	 * Defines the visual style of the button.
	 * - 'neutral': The default button style.
	 * - 'secondary': A secondary, less prominent style.
	 * - 'ghost': A transparent button with borders.
	 * - 'border': A button with a border but no background.
	 * - 'danger': A button that typically indicates a destructive action.
	 * - 'success': A button that represents a successful action.
	 * - 'warning': A button that warns about a potential issue.
	 * - 'link': A button styled like a link.
	 * - 'shiny': A Shiny Button.
	 */
	variant?:
		| 'neutral'
		| 'secondary'
		| 'ghost'
		| 'border'
		| 'danger'
		| 'link'
		| 'shiny';

	/**
	 * Specifies the size of the button.
	 * - 'sm': Small size button.
	 * - 'md': Medium size button.
	 * - 'lg': Large size button.
	 */
	size?: 'sm' | 'md' | 'lg';

	/**
	 * Optional icon to display within the button.
	 * Uses Lucide icons from the 'lucide-react' library.
	 */
	icon?: LucideIcon;

	/**
	 * The text content to display on the button.
	 * If not provided, the button may only display an icon.
	 */
	content?: string;

	/**
	 * Indicates whether the button is in a loading state.
	 * When true, the button may display a loading spinner or similar visual feedback.
	 */
	loading?: boolean;
}
