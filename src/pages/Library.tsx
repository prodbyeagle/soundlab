import Layout from '../components/Layout';
import Sidebar from '../components/library/Sidebar';
import SoundList from '../components/library/Soundlist';

const Library = () => {
	return (
		<Layout>
			<div className='flex'>
				<Sidebar />
				<div className='flex-1 overflow-y-auto ml-4 rounded-xl border border-neutral-900 p-6'>
					<h1 className='mb-4 text-2xl font-medium'>Library</h1>
					<SoundList />
				</div>
			</div>
		</Layout>
	);
};

export default Library;
