import { SlidersHorizontal } from 'lucide-react';
import { useCallback, useState } from 'react';
import { SoundList } from '../components/library/Soundlist';
import { Button } from '../components/ui/Button/Button';
import { Dialog } from '../components/ui/Dialog/Dialog';
import { Sidebar } from '../components/library/Sidebar';
import Layout from '../components/Layout';

const Library = () => {
	const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
	const [filters, setFilters] = useState({
		search: '',
		tags: [] as string[],
		sortBy: 'date',
	});

	const handleFiltersChange = useCallback(
		(newFilters: { search: string; tags: string[]; sortBy: string }) => {
			setFilters((prev) => ({ ...prev, ...newFilters }));
		},
		[]
	);

	return (
		<Layout>
			<div className='relative flex gap-4'>
				<div className='hidden lg:block'>
					<Sidebar onFiltersChange={handleFiltersChange} />
				</div>

				<Dialog
					isOpen={isFilterDialogOpen}
					onClose={() => setIsFilterDialogOpen(false)}>
					<div className='max-h-[80vh] overflow-y-auto'>
						<Sidebar
							className='border-0'
							onFiltersChange={handleFiltersChange}
						/>
					</div>
				</Dialog>

				<Button
					icon={SlidersHorizontal}
					size='sm'
					onClick={() => setIsFilterDialogOpen(true)}
					className='fixed right-4 bottom-4 z-50 shadow-lg shadow-neutral-900/20 backdrop-blur-sm lg:hidden'
				/>

				<div className='flex-1 rounded-xl border-neutral-800 sm:border sm:p-4'>
					<h1 className='mb-4 text-xl font-medium lg:text-2xl'>
						Library
					</h1>
					<SoundList
						searchQuery={filters.search}
						selectedTags={new Set(filters.tags)}
					/>
				</div>
			</div>
		</Layout>
	);
};

export default Library;
