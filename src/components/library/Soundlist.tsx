import { useEffect, useState, useMemo } from 'react';
import { SoundCard } from './SoundCard';
import { getSounds, toggleFavorite } from '../../lib/soundImport';
import type { Sound } from '../../types/Sound';
import { HeartCrack, Music2, Loader2 } from 'lucide-react';

interface SoundListProps {
	searchQuery: string;
	selectedTags: Set<string>;
}

export const SoundList = ({ searchQuery, selectedTags }: SoundListProps) => {
	const [sounds, setSounds] = useState<Sound[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchSounds = async () => {
			try {
				setIsLoading(true);
				const importedSounds: Sound[] = await getSounds();
				setSounds(importedSounds);
			} catch (err) {
				console.error('Error fetching sounds:', err);
				setError('Failed to load sounds.');
			} finally {
				setIsLoading(false);
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
		const soundsAfterFilter = sounds.filter((sound) => {
			const matchesSearch =
				searchQuery.length === 0 ||
				sound.name.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesTags =
				selectedTags.size === 0 ||
				sound.tags.some((tag) => selectedTags.has(tag));
			return matchesSearch && matchesTags;
		});

		return soundsAfterFilter.sort((a, b) => a.name.localeCompare(b.name));
	}, [sounds, searchQuery, selectedTags]);

	if (isLoading) {
		return (
			<div className='flex min-h-[400px] items-center justify-center'>
				<div className='flex flex-col items-center gap-4'>
					<Loader2 className='h-8 w-8 animate-spin text-neutral-400' />
					<p className='text-sm text-neutral-500'>
						Loading sounds...
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex min-h-[400px] items-center justify-center'>
				<div className='mx-auto max-w-md rounded-lg border border-red-200/20 bg-red-50/10 p-6 text-center'>
					<Music2 className='mx-auto mb-4 h-8 w-8 text-red-400' />
					<h3 className='mb-2 text-base font-medium text-red-400'>
						Failed to Load Sounds
					</h3>
					<p className='text-sm text-neutral-500'>{error}</p>
					<button
						onClick={() => window.location.reload()}
						className='mt-4 rounded-md bg-neutral-900 px-4 py-2 text-sm text-white transition-colors hover:bg-neutral-800'>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	if (filteredSounds.length === 0) {
		return (
			<div className='flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-neutral-800 bg-neutral-900/20 p-8 text-center'>
				<div className='flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800/30'>
					<HeartCrack className='h-8 w-8 text-neutral-400' />
				</div>
				<h3 className='mt-6 text-lg font-medium text-neutral-200'>
					{searchQuery || selectedTags.size > 0
						? 'No matches found'
						: 'No sounds yet'}
				</h3>
				<p className='mt-2 max-w-sm text-sm text-neutral-500'>
					{searchQuery || selectedTags.size > 0
						? 'Try adjusting your filters or search terms'
						: 'Start adding sounds to your collection to see them here'}
				</p>
			</div>
		);
	}

	return (
		<div className='relative'>
			<div className='mb-4 flex items-center justify-between'>
				<p className='text-sm text-neutral-500'>
					Showing {filteredSounds.length}{' '}
					{filteredSounds.length === 1 ? 'sound' : 'sounds'}
				</p>
			</div>
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'>
				{filteredSounds.map((sound) => (
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
				))}
			</div>
		</div>
	);
};
