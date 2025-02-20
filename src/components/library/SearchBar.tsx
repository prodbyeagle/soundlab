import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input/Input';

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
	const [query, setQuery] = useState(value);

	useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(query);
		}, 100);

		return () => clearTimeout(timeout);
	}, [query, onChange]);

	return (
		<Input
			icon={Search}
			type='text'
			placeholder='Search...'
			value={query}
			onChange={(e) => setQuery(e.target.value)}
		/>
	);
};
