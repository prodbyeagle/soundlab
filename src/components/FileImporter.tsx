import { useContext } from 'react';
import SoundContext from '../context/SoundContext';
import { open } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';
import { Button } from './ui/Button/Button';
import { Plus, FolderPlus } from 'lucide-react';

const FileImporter = () => {
	const { addSound } = useContext(SoundContext)!;

	const importSound = async () => {
		const selected = await open({
			multiple: true,
			filters: [{ name: 'Audio', extensions: ['mp3', 'wav'] }],
		});

		if (!selected) return;

		const files = Array.isArray(selected) ? selected : [selected];

		for (const file of files) {
			try {
				const importedPath = await invoke<string>('import_file', {
					path: file,
				});
				addSound({
					name: importedPath.split('/').pop()!,
					path: importedPath,
				});
			} catch (error) {
				console.error(`Fehler beim Import der Datei ${file}:`, error);
			}
		}
	};

	const importFolder = async () => {
		const selected = await open({ directory: true });

		if (!selected) return;

		try {
			const files: string[] = await invoke('import_directory', {
				path: selected,
			});

			files.forEach((file) => {
				addSound({ name: file.split('/').pop()!, path: file });
			});
		} catch (error) {
			console.error('Fehler beim Import des Ordners:', error);
		}
	};

	return (
		<div className='flex flex-col space-y-4'>
			<p className='text-sm text-neutral-400'>
				Import MP3 or WAV files to your sound library
			</p>
			<div className='flex gap-2'>
				<Button variant='border' icon={Plus} onClick={importSound}>
					Import Sounds
				</Button>
				<Button
					variant='border'
					icon={FolderPlus}
					onClick={importFolder}>
					Import Folder
				</Button>
			</div>
		</div>
	);
};

export default FileImporter;
