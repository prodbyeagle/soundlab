import { useState } from 'react';
import { Input } from './ui/Input/Input';
import { Search } from 'lucide-react';
import { ButtonGroup } from './ui/ButtonGroup/ButtonGroup';

const icons = [
	{ name: 'Default', src: '/icon.png', category: 'Basic' },
	{ name: 'Pink', src: '/icon1.png', category: 'Colors' },
	{ name: 'Yellow', src: '/icon2.png', category: 'Colors' },
	{ name: 'Green', src: '/icon3.png', category: 'Colors' },
	{ name: 'Canada Mode', src: '/icon4.png', category: 'Special' },
	{ name: '8-Bit', src: '/8bit.png', category: 'Style' },
	{ name: 'Beach', src: '/beach.png', category: 'Nature' },
	{ name: 'ERM', src: '/erm.png', category: 'Special' },
	{ name: 'Heart', src: '/heart.png', category: 'Symbols' },
	{ name: 'Mountain', src: '/mountain.png', category: 'Nature' },
	{ name: 'Rainbow', src: '/rainbow.png', category: 'Style' },
	{ name: 'Stone', src: '/stone.png', category: 'Nature' },
	{ name: 'Tree', src: '/tree.png', category: 'Nature' },
	{ name: 'Wish', src: '/wish.png', category: 'Special' },
	{ name: 'Woahhhhh', src: '/woahhhhh.png', category: 'Special' },
];

export const IconPicker = () => {
	const [selectedIcon, setSelectedIcon] = useState<string>(() => {
		return localStorage.getItem('appIcon') || '/icon.png';
	});
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('All');

	const categories = ['All', ...new Set(icons.map((icon) => icon.category))];

	const filteredIcons = icons.filter((icon) => {
		const matchesSearch = icon.name
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const matchesCategory =
			selectedCategory === 'All' || icon.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	const handleIconSelect = (icon: string) => {
		setSelectedIcon(icon);
		localStorage.setItem('appIcon', icon);
	};

	return (
		<div className='w-full max-w-2xl space-y-4 p-4'>
			<div className='flex items-center justify-between'>
				<h3 className='text-lg font-medium text-neutral-300'>
					Select App Icon
				</h3>
				<div className='text-sm text-neutral-400'>
					{icons.length} icons available
				</div>
			</div>

			<div className='relative'>
				<Input
					icon={Search}
					type='text'
					placeholder='Search icons...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>

			<ButtonGroup
				buttons={categories.map((category) => ({
					label: category,
				}))}
				activeButton={selectedCategory}
				onButtonClick={setSelectedCategory}
			/>

			<div className='grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6'>
				{filteredIcons.map((icon) => (
					<button
						key={icon.src}
						onClick={() => handleIconSelect(icon.src)}
						className={`group relative aspect-square rounded-lg p-2 transition-all ${
							selectedIcon === icon.src
								? 'scale-105 bg-neutral-800'
								: 'bg-neutral-900 hover:bg-neutral-700'
						}`}>
						<img
							src={icon.src}
							alt={icon.name}
							className='h-full w-full rounded-md object-cover transition-transform group-hover:scale-105'
						/>
						<div className='pointer-events-none absolute bottom-20 left-1/2 z-10 -translate-x-1/2 transform rounded border border-neutral-800 bg-neutral-900 px-2 py-1 text-xs text-neutral-200 opacity-0 transition-opacity group-hover:opacity-100'>
							{icon.name}
						</div>
					</button>
				))}
			</div>

			{filteredIcons.length === 0 && (
				<div className='py-8 text-center text-neutral-400'>
					No icons found matching your search
				</div>
			)}
		</div>
	);
};

export default IconPicker;
