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
			<p className='text-sm text-neutral-400'>
				Import MP3 or WAV files to your sound library
			</p>
			<div className='flex gap-2'>
				<Button
					variant='border'
					icon={Plus}
					onClick={() => importFolder(addSound, setImportedPaths)}>
					Import
				</Button>
			</div>
			<div className='mt-4'>
				<h3 className='text-sm text-neutral-500'>
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
									variant='border'
									icon={Trash}
									onClick={() =>
										removeImportedPath(
											path,
											setImportedPaths
										)
									}
									size='sm'>
									Remove
								</Button>
							</li>
						))
					)}
				</ul>
			</div>
		</div>
	);
};

export default FileImporter;
