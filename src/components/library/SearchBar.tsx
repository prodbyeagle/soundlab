import { Search } from 'lucide-react';
import { Input } from '../ui/Input/Input';

const SearchBar = () => {
	return (
		<Input
			icon={Search}
			type='text'
			placeholder='Search...'
		/>
	);
};

export default SearchBar;
