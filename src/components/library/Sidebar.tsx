import { useState } from 'react';
import SearchBar from './SearchBar';
import { Slider } from '../ui/Slider/Slider';
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

// will be changed to real data
const sortOptions = [
	{ value: 'date', label: 'Newest' },
	{ value: 'popularity', label: 'Most Popular' },
	{ value: 'length', label: 'Length' },
];

const Sidebar = () => {
	const [duration, setDuration] = useState(1000);
	const [sortBy, setSortBy] = useState(sortOptions[0].value);

	return (
		<aside className='h-fit w-72 rounded-xl border border-neutral-900 bg-neutral-950 p-4'>
			<h2 className='mb-4 text-xl font-medium'>Filters</h2>
			<SearchBar />

			<div className='mt-6'>
				<h3 className='mb-3 text-sm font-medium'>Categories</h3>
				<div className='flex flex-wrap gap-2'>
					{categories.map((category) => (
						<button
							key={category.id}
							className='rounded border border-neutral-900 px-3 py-1 text-sm transition-all duration-300 hover:cursor-pointer hover:bg-neutral-800'>
							{category.label}
						</button>
					))}
				</div>
			</div>

			<div className='mt-6'>
				<Slider
					variant='non-uniform'
					min={0}
					max={2000}
					value={duration}
					step={100}
					onChange={setDuration}
					className='mb-2'
					label='Duration'
				/>
				<div className='text-xs text-neutral-300'>{duration}ms</div>
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
						setDuration(1000);
						setSortBy(sortOptions[0].value);
					}}>
					Reset Filters
				</Button>
			</div>
		</aside>
	);
};

export default Sidebar;
