import { useState } from 'react';
import SearchBar from './SearchBar';
import { Select } from '../ui/Select/Select';
import { Button } from '../ui/Button/Button';

// will be changed to real data
const categories = [
	{ id: '808', label: '808' },
	{ id: 'kick', label: 'Kick' },
	{ id: 'snare', label: 'Snare' },
	{ id: 'hihat', label: 'HiHat' },
	{ id: 'clap', label: 'Clap' },
	{ id: 'perc', label: 'Percussion' },
];

const sortOptions = [
	{ value: 'date', label: 'Newest' },
	{ value: 'popularity', label: 'Most Popular' },
	{ value: 'length', label: 'Length' },
];

interface SidebarProps {
	className?: string;
}

const Sidebar = ({ className = '' }: SidebarProps) => {
	const [sortBy, setSortBy] = useState(sortOptions[0].value);
	const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
		new Set()
	);

	const toggleCategory = (id: string) => {
		setSelectedCategories((prev) => {
			const newSet = new Set(prev);
			newSet.has(id) ? newSet.delete(id) : newSet.add(id);
			return newSet;
		});
	};

	return (
		<aside
			className={`rounded-xl border border-neutral-800 bg-neutral-950 p-4 lg:w-2xs ${className}`}>
			<h2 className='mb-4 text-xl font-medium'>Filters</h2>

			<SearchBar />

			<div className='mt-6'>
				<h3 className='mb-3 text-sm font-medium'>Categories</h3>
				<div className='grid grid-cols-2 gap-2 sm:flex sm:flex-wrap'>
					{categories.map((category) => (
						<button
							key={category.id}
							onClick={() => toggleCategory(category.id)}
							className={`w-full rounded border px-3 py-1 text-sm transition-colors duration-300 sm:w-auto ${
								selectedCategories.has(category.id)
									? 'border-neutral-600 bg-neutral-800'
									: 'border-neutral-800 hover:bg-neutral-900'
							}`}>
							{category.label}
						</button>
					))}
				</div>
			</div>

			<div className='mt-6'>
				<h3 className='mb-3 text-sm font-medium'>Sort By</h3>
				<Select
					value={sortBy}
					onChange={setSortBy}
					options={sortOptions}
				/>
			</div>

			<div className='mt-6'>
				<Button
					variant='danger'
					className='w-full'
					onClick={() => {
						setSortBy(sortOptions[0].value);
						setSelectedCategories(new Set());
					}}>
					Reset Filters
				</Button>
			</div>
		</aside>
	);
};

export default Sidebar;
