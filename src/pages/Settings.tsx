// Settings.tsx
import Layout from '../components/Layout';
import FileImporter from '../components/FileImporter';
import { Card } from '../components/ui/Card/Card';

const Settings = () => {
	return (
		<Layout>
			<div className='mx-auto max-w-2xl p-3'>
				<h1 className='mb-3 text-xl font-medium text-neutral-100'>
					Settings
				</h1>

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
