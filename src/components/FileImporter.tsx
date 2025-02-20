import { useEffect, useState } from 'react';
import { Button } from './ui/Button/Button';
import { Plus } from 'lucide-react';
import {
	getImportedPaths,
	importDirectory,
	removeImportedPath,
	recacheSounds,
} from '../lib/soundImport';
import type { Sound } from '../types/Sound';

const FileImporter = () => {
	const [importedPaths, setImportedPaths] = useState<Sound[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loadingPath, setLoadingPath] = useState<string | null>(null);

	useEffect(() => {
		const loadPaths = async () => {
			try {
				const sounds = await getImportedPaths();
				setImportedPaths(sounds);
			} catch (err) {
				console.error('Fehler beim Laden der importierten Pfade:', err);
				setError('Failed to load imported paths.');
			}
		};

		loadPaths();
	}, []);

	const handleImport = async () => {
		try {
			await importDirectory();
			const sounds = await getImportedPaths();
			setImportedPaths(sounds);
		} catch (err) {
			console.error('Fehler beim Importieren des Ordners:', err);
			setError('Failed to import folder.');
		}
	};

	const handleRemove = async (path: string) => {
		setLoadingPath(path);
		try {
			await removeImportedPath(path);
			await recacheSounds();
			const sounds = await getImportedPaths();
			setImportedPaths(sounds);
		} catch (err) {
			console.error('Fehler beim Entfernen des Ordners:', err);
			setError('Failed to remove folder.');
		} finally {
			setLoadingPath(null);
		}
	};

	return (
		<div className='flex flex-col space-y-4'>
			<h2 className='text-lg font-medium text-neutral-100'>
				Import Sounds
			</h2>
			<p className='text-sm text-neutral-400'>
				Import MP3 or WAV files to your sound library
			</p>
			{error && <p className='text-sm text-red-500'>{error}</p>}
			<Button
				className='w-full py-2'
				content='Import Folder'
				variant='border'
				icon={Plus}
				onClick={handleImport}
			/>
			<div>
				<h3 className='mb-2 text-sm font-medium text-neutral-300'>
					Imported Files
				</h3>
				<div className='max-h-135 space-y-2 overflow-y-scroll'>
					{importedPaths.length === 0 ? (
						<p className='text-center text-sm text-neutral-500'>
							No files imported yet.
						</p>
					) : (
						importedPaths.map((sound) => (
							<div
								key={sound.id}
								className='flex items-center justify-between rounded-xl bg-neutral-900/40 px-3 py-2'>
								<span
									className='truncate pr-8 text-xs text-neutral-300'
									title={sound.path}>
									{sound.name}
								</span>
								<Button
									content='Remove'
									onClick={() => handleRemove(sound.path)}
									loading={loadingPath === sound.path}
									disabled={loadingPath === sound.path}
								/>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default FileImporter;
