/**
 * Props for the Dialog component.
 */
export interface DialogProps {
	/**
	 * Indicates whether the dialog is open.
	 */
	isOpen: boolean;

	/**
	 * Function to call when the dialog is requested to be closed.
	 */
	onClose: () => void;

	/**
	 * Optional title for the dialog.
	 */
	title?: string;

	/**
	 * Content to be displayed inside the dialog.
	 */
	children: React.ReactNode;

	/**
	 * Optional additional class names to apply to the dialog.
	 */
	className?: string;

	/**
	 * Optional size of the shadow around the dialog.
	 */
	shadowSize?: string;
}
