import Layout from '../components/Layout';
import FileImporter from '../components/FileImporter';
import { Card } from '../components/ui/Card/Card';
import { Cog } from 'lucide-react';

const Settings = () => {
	return (
		<Layout>
			<div>
				<div className='mb-6 flex items-center space-x-2'>
					<Cog className='h-6 w-6 text-neutral-700' />
					<h1 className='text-2xl font-semibold tracking-tight'>
						Settings
					</h1>
				</div>

				<div className='space-y-6'>
					<Card>
						<h2 className='mb-4 text-center text-xl font-medium text-neutral-100'>
							Sound Library
						</h2>
						<FileImporter />
					</Card>
				</div>
			</div>
		</Layout>
	);
};

export default Settings;
