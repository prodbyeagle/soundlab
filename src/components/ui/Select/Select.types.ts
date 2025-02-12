/**
 * Represents the properties for the Select component.
 *
 * @template T - The type of the value for the select options.
 */
export interface SelectProps<T> {
	/**
	 * The current selected value of the select input.
	 */
	value: T;

	/**
	 * Callback function to handle value changes.
	 * @param value - The new value selected in the dropdown.
	 */
	onChange: (value: T) => void;

	/**
	 * The list of available options for the select input.
	 * Each option includes a value of type T and a label to display in the dropdown.
	 */
	options: { value: T; label: string }[];

	/**
	 * Optional additional className for custom styling of the select component.
	 */
	className?: string;

	/**
	 * Optional placeholder text to display when no option is selected.
	 */
	placeholder?: string;
}
