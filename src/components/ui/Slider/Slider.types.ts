export interface SliderProps {
	min: number;
	max: number;
	step?: number;
	value: number;
	onChange: (value: number) => void;
	variant?: 'standard' | 'sticky' | 'non-uniform' | 'none';
	markers?: number[];
	className?: string;
	label?: string;
	disabled?: boolean;
}
