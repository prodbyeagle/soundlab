import { LucideIcon } from 'lucide-react';

/**
 * Represents the properties for the Input component.
 */
export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	/**
	 * The label text for the input field.
	 * If not provided, the input will not display a label.
	 */
	label?: string;

	/**
	 * The icon to display within the input field.
	 * Uses Lucide icons from the 'lucide-react' library.
	 */
	icon: LucideIcon;

	/**
	 * Error message to display below the input field.
	 * If provided, indicates that the input has an error and the message will be displayed.
	 */
	error?: string;
}
