import { useEffect, useState, useMemo } from 'react';
import { SoundCard } from './SoundCard';
import { getSounds, toggleFavorite } from '../../lib/soundImport';
import type { Sound } from '../../types/Sound';

interface SoundListProps {
	searchQuery: string;
	selectedTags: Set<string>;
}

export const SoundList = ({ searchQuery, selectedTags }: SoundListProps) => {
	const [sounds, setSounds] = useState<Sound[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchSounds = async () => {
			try {
				const importedSounds: Sound[] = await getSounds();
				setSounds(importedSounds);
			} catch (err) {
				console.error(
					'Fehler beim Abrufen der importierten Sounds:',
					err
				);
				setError('Failed to load sounds.');
			}
		};

		fetchSounds();
	}, []);

	const handleToggleFavorite = async (id: number) => {
		try {
			await toggleFavorite(id);
			setSounds((prev) =>
				prev.map((sound) =>
					sound.id === id
						? { ...sound, is_favorite: !sound.is_favorite }
						: sound
				)
			);
		} catch (err) {
			console.error('Error toggling favorite:', err);
		}
	};

	const filteredSounds = useMemo(() => {
		return sounds.filter((sound) => {
			const matchesSearch =
				searchQuery.length === 0 ||
				sound.name.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesTags =
				selectedTags.size === 0 ||
				sound.tags.some((tag) => selectedTags.has(tag));

			return matchesSearch && matchesTags;
		});
	}, [sounds, searchQuery, selectedTags]);

	return (
		<div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
			{error ? (
				<p className='text-center text-red-500'>{error}</p>
			) : filteredSounds.length === 0 ? (
				<p className='text-center text-neutral-500'>
					No matching sounds found.
				</p>
			) : (
				filteredSounds.map((sound) => (
					<SoundCard
						key={sound.id}
						index={sound.id}
						name={sound.name}
						path={sound.path}
						isPlaying={false}
						onPlay={() => console.log('Play sound', sound.name)}
						is_favorite={sound.is_favorite}
						onToggleFavorite={() => handleToggleFavorite(sound.id)}
					/>
				))
			)}
		</div>
	);
};
