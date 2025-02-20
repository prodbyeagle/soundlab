import { useEffect, useState } from 'react';
import { getSounds } from '../../lib/soundImport';
import { SearchBar } from './SearchBar';
import { Select } from '../ui/Select/Select';
import { Button } from '../ui/Button/Button';

interface SidebarProps {
	className?: string;
	onFiltersChange: (filters: {
		search: string;
		tags: string[];
		sortBy: string;
	}) => void;
}

const sortOptions = [
	{ value: 'date', label: 'Newest' },
	{ value: 'popularity', label: 'Most Popular' },
	{ value: 'length', label: 'Length' },
];

export const Sidebar = ({ className = '', onFiltersChange }: SidebarProps) => {
	const [search, setSearch] = useState('');
	const [sortBy, setSortBy] = useState(sortOptions[0].value);
	const [availableTags, setAvailableTags] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

	useEffect(() => {
		const fetchTags = async () => {
			try {
				const sounds = await getSounds();
				const tags = [
					...new Set(sounds.flatMap((sound) => sound.tags)),
				];
				setAvailableTags(tags);
			} catch (error) {
				console.error('Error fetching tags:', error);
			}
		};

		fetchTags();
	}, []);

	useEffect(() => {
		onFiltersChange({
			search,
			tags: [...selectedTags],
			sortBy,
		});
	}, [search, selectedTags, sortBy]);

	const toggleTag = (tag: string) => {
		setSelectedTags((prev) => {
			const newSet = new Set(prev);
			newSet.has(tag) ? newSet.delete(tag) : newSet.add(tag);
			return newSet;
		});
	};

	return (
		<aside
			className={`rounded-xl border border-neutral-800 bg-neutral-950 p-4 lg:w-2xs ${className}`}>
			<h2 className='mb-4 text-xl font-medium'>Filters</h2>

			<SearchBar value={search} onChange={setSearch} />

			<div className='mt-6'>
				<h3 className='mb-3 text-sm font-medium'>Tags</h3>
				<div className='grid grid-cols-2 gap-2 sm:flex sm:flex-wrap'>
					{availableTags.length > 0 ? (
						availableTags.map((tag) => (
							<button
								key={tag}
								onClick={() => toggleTag(tag)}
								className={`w-full rounded border px-3 py-1 text-sm transition-colors duration-300 sm:w-auto ${
									selectedTags.has(tag)
										? 'border-neutral-600 bg-neutral-800'
										: 'border-neutral-800 hover:bg-neutral-900'
								}`}>
								{tag}
							</button>
						))
					) : (
						<p className='text-sm text-neutral-500'>
							No tags available
						</p>
					)}
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
						setSearch('');
						setSortBy(sortOptions[0].value);
						setSelectedTags(new Set());
					}}>
					Reset Filters
				</Button>
			</div>
		</aside>
	);
};
