// lib/soundImport.ts
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';

export const loadImportedPaths = async (): Promise<string[]> => {
	try {
		const paths = (await invoke('get_imported_sounds')) as string[];
		console.log(paths);
		return paths;
	} catch (error) {
		console.error('Fehler beim Laden der importierten Pfade:', error);
		return [];
	}
};

export const importFolder = async (
	addSound: (sound: { name: string; path: string }) => void,
	setImportedPaths: React.Dispatch<React.SetStateAction<string[]>>
) => {
	const selected = await open({ directory: true });

	if (!selected) return;

	console.log('Selected folder path:', selected); // <-- Debugging step

	try {
		const files: string[] = await invoke('import_folder', {
			folder_path: selected, // This matches the backend's expected key
		});

		for (const file of files) {
			const cached = await invoke('import_file', { path: file });
			if (cached) {
				addSound({ name: file.split('/').pop()!, path: file });
			} else {
				console.log(`[CACHE] Datei bereits im Cache: ${file}`);
			}
		}

		await invoke('add_imported_sound', { path: selected });

		setImportedPaths((prev) => [...prev, selected]);
	} catch (error) {
		console.error('Fehler beim Import des Ordners:', error);
	}
};


export const removeImportedPath = async (
	path: string,
	setImportedPaths: React.Dispatch<React.SetStateAction<string[]>>
) => {
	try {
		await invoke('remove_imported_sound', { path });
		setImportedPaths((prev) => prev.filter((p) => p !== path));
		console.log(`[CACHE] Pfad entfernt: ${path}`);
	} catch (error) {
		console.error('Fehler beim Entfernen des Pfads:', error);
	}
};
