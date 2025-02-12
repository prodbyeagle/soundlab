import { LucideIcon } from "lucide-react";

/**
 * Props for the ButtonGroup component.
 */
export interface ButtonGroupProps {
	/**
	 * Array of Button objects to be rendered in the ButtonGroup.
	 */
	buttons: Button[];

	/**
	 * Identifier for the currently active button.
	 */
	activeButton: string;

	/**
	 * Callback function to be called when a button is clicked.
	 * @param button - The identifier of the clicked button.
	 */
	onButtonClick: (button: string) => void;

	/**
	 * Size of the buttons in the ButtonGroup. Can be 'sm' (small), 'md' (medium), or 'lg' (large).
	 */
	size?: 'sm' | 'md' | 'lg';

	/**
	 * Additional CSS class names to apply to the ButtonGroup.
	 */
	className?: string;
}


interface Button {
	label: string;
	icon?: LucideIcon;
}