import { useState } from 'react';
import Layout from '../components/Layout';
import Sidebar from '../components/library/Sidebar';
import { SoundList } from '../components/library/Soundlist';
import { Dialog } from '../components/ui/Dialog/Dialog';
import { Button } from '../components/ui/Button/Button';
import { SlidersHorizontal } from 'lucide-react';

const Library = () => {
	const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
	const [filters, setFilters] = useState({
		search: '',
		tags: [] as string[],
		sortBy: 'date',
	});

	return (
		<Layout>
			<div className='relative flex gap-4'>
				<div className='hidden lg:block'>
					<Sidebar
						onFiltersChange={(newFilters) =>
							setFilters((prev) => ({ ...prev, ...newFilters }))
						}
					/>
				</div>

				<Dialog
					isOpen={isFilterDialogOpen}
					onClose={() => setIsFilterDialogOpen(false)}>
					<div>
						<Sidebar
							className='border-0'
							onFiltersChange={(newFilters) =>
								setFilters((prev) => ({
									...prev,
									...newFilters,
								}))
							}
						/>
					</div>
				</Dialog>

				<Button
					icon={SlidersHorizontal}
					size='sm'
					onClick={() => setIsFilterDialogOpen(true)}
					className='fixed right-4 bottom-4 z-50 backdrop-blur-xs lg:hidden'
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
