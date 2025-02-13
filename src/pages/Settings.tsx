// Settings.tsx
import Layout from '../components/Layout';
import FileImporter from '../components/FileImporter';

const Settings = () => {
	return (
		<Layout>
			<div className='mx-auto max-w-2xl p-6'>
				<h1 className='mb-8 text-3xl font-semibold text-neutral-100'>
					Settings
				</h1>

				<div className='space-y-8'>
					<section className='rounded-xl border border-neutral-900 bg-neutral-950 p-6'>
						<h2 className='mb-4 text-xl font-medium text-neutral-100'>
							Sound Library
						</h2>
						<FileImporter />
					</section>
				</div>
			</div>
		</Layout>
	);
};

export default Settings;
