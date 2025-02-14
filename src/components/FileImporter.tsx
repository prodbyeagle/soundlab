import { useContext, useEffect, useState } from 'react';
import SoundContext from '../context/SoundContext';
import { Button } from './ui/Button/Button';
import { Plus, Trash } from 'lucide-react';
import {
	loadImportedPaths,
	importFolder,
	removeImportedPath,
} from '../lib/soundImport';

const FileImporter = () => {
	const { addSound } = useContext(SoundContext)!;
	const [importedPaths, setImportedPaths] = useState<string[]>([]);

	useEffect(() => {
		const loadPaths = async () => {
			const paths = await loadImportedPaths();
			setImportedPaths(paths);
		};

		loadPaths();
	}, []);

	return (
		<div className='flex flex-col space-y-4'>
			<p className='text-sm text-neutral-400 text-center'>
				Import MP3 or WAV files to your sound library
			</p>
			<div className='flex gap-2'>
				<Button
					className='w-full'
					content='Import'
					variant='border'
					icon={Plus}
					onClick={() => importFolder(addSound, setImportedPaths)}
				/>
			</div>
			<div className='mt-4'>
				<h3 className='mb-2 text-base text-neutral-100'>
					Already Imported Paths:
				</h3>
				<ul className='space-y-2 text-xs text-neutral-400'>
					{importedPaths.length === 0 ? (
						<li>No paths imported yet.</li>
					) : (
						importedPaths.map((path, index) => (
							<li key={index} className='flex justify-between'>
								<span>{path}</span>
								<Button
									content='Delete'
									icon={Trash}
									onClick={() =>
										removeImportedPath(
											path,
											setImportedPaths
										)
									}
								/>
							</li>
						))
					)}
				</ul>
			</div>
		</div>
	);
};

export default FileImporter;
