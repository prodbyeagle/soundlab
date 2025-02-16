import { invoke } from '@tauri-apps/api/core';

/**
 * Importiert einen einzelnen Sound.
 * @param name - Name des Sounds
 * @param path - Dateipfad des Sounds
 */
export async function importSound(name: string, path: string): Promise<void> {
	try {
		await invoke('import_sound', { name, path });
	} catch (error) {
		console.error('Error importing sound:', error);
		throw error;
	}
}

/**
 * Importiert alle Sounds aus einem Verzeichnis.
 * @param dirPath - Pfad zum Verzeichnis
 */
export async function importDirectory(dirPath: string): Promise<void> {
	try {
		await invoke('import_directory', { dir_path: dirPath });
	} catch (error) {
		console.error('Error importing directory:', error);
		throw error;
	}
}

/**
 * Ruft alle gespeicherten Sounds (Namen) ab.
 * @returns Array von Soundnamen
 */
export async function getSounds(): Promise<string[]> {
	try {
		const sounds = (await invoke('get_sounds')) as string[];
		return sounds;
	} catch (error) {
		console.error('Error fetching sounds:', error);
		throw error;
	}
}

/**
 * Löscht einen Sound anhand seiner ID.
 * @param id - ID des Sounds
 */
export async function deleteSound(id: string): Promise<void> {
	try {
		await invoke('delete_sound', { id });
	} catch (error) {
		console.error('Error deleting sound:', error);
		throw error;
	}
}

/**
 * Ruft alle importierten Pfade ab.
 * @returns Array von Pfaden
 */
export async function getImportedPaths(): Promise<string[]> {
	try {
		const paths = (await invoke('get_imported_paths')) as string[];
		return paths;
	} catch (error) {
		console.error('Error fetching imported paths:', error);
		throw error;
	}
}
