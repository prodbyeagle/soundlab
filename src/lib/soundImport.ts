import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import type { Sound } from '../types/Sound';

export async function importSound(name: string, path: string): Promise<void> {
	try {
		await invoke('import_sound', { name, path });
	} catch (error) {
		console.error('Error importing sound:', error);
		throw error;
	}
}

export async function importDirectory(): Promise<void> {
	try {
		const selected = await open({ directory: true });
		if (!selected) return;

		await invoke('import_directory', { dirPath: selected });
	} catch (error) {
		console.error('Error importing directory:', error);
		throw error;
	}
}

export const getSounds = async (): Promise<Sound[]> => {
	try {
		const sounds = (await invoke('get_sounds')) as {
			id: string;
			name: string;
			path: string;
		}[];

		return sounds.map((sound) => ({
			id: parseInt(sound.id, 10),
			name: sound.name,
			path: sound.path,
			isFavorite: false,
		}));
	} catch (error) {
		console.error('Error fetching sounds:', error);
		throw error;
	}
};

export async function deleteSound(id: string): Promise<void> {
	try {
		await invoke('delete_sound', { id });
	} catch (error) {
		console.error('Error deleting sound:', error);
		throw error;
	}
}

export async function getImportedPaths(): Promise<Sound[]> {
	try {
		const paths = (await invoke('get_imported_paths')) as string[];

		return paths.map((path, index) => ({
			id: index + 1,
			//! maybe change logic so we can use the "real" name of the sound. but this works too.
			name: path.split('\\').pop()?.split('/').pop() ?? 'Unknown Sound',
			path,
			isFavorite: false,
		}));
	} catch (error) {
		console.error('Error fetching imported paths:', error);
		throw error;
	}
}

export async function removeImportedPath(path: string): Promise<void> {
	try {
		await invoke('remove_imported_path', { path });
	} catch (error) {
		console.error(`Error removing imported path '${path}':`, error);
		throw error;
	}
}

export async function toggleFavorite(id: string): Promise<string> {
	try {
		const result = await invoke('toggle_favorite', { id });

		return result as string;
	} catch (error) {
		console.error('Error toggling sound favorite status:', error);
		throw error;
	}
}
