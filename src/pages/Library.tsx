import Layout from '../components/Layout';
import Sidebar from '../components/library/Sidebar';
import SoundList from '../components/library/Soundlist';
import { useState } from 'react';
import { Dialog } from '../components/ui/Dialog/Dialog';
import { Button } from '../components/ui/Button/Button';
import { SlidersHorizontal } from 'lucide-react';

const Library = () => {
	const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

	return (
		<Layout>
			<div className='relative flex gap-4'>
				<div className='hidden lg:block'>
					<Sidebar />
				</div>

				<Dialog
					isOpen={isFilterDialogOpen}
					onClose={() => setIsFilterDialogOpen(false)}>
					<div>
						<Sidebar className='border-0' />
					</div>
				</Dialog>

				<Button
					icon={SlidersHorizontal}
					size='sm'
					onClick={() => setIsFilterDialogOpen(true)}
					className='fixed right-4 bottom-4 z-50 backdrop-blur-xs lg:hidden'></Button>

				<div className='flex-1 p-4 lg:p-6'>
					<h1 className='mb-4 text-xl font-medium lg:text-2xl'>
						Library
					</h1>
					<SoundList />
				</div>
			</div>
		</Layout>
	);
};

export default Library;
