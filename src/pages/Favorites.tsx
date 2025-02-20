import { useEffect, useState } from 'react';
import { SoundCard } from '../components/library/SoundCard';
import { getSounds, toggleFavorite } from '../lib/soundImport';
import type { Sound } from '../types/Sound';
import Layout from '../components/Layout';

export const Favorites = () => {
	const [favorites, setFavorites] = useState<Sound[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchFavorites = async () => {
			try {
				const allSounds: Sound[] = await getSounds();
				const favs = allSounds.filter((sound) => sound.is_favorite);
				setFavorites(favs);
			} catch (err) {
				console.error('Fehler beim Abrufen der Favoriten:', err);
				setError('Failed to load favourite sounds.');
			}
		};

		fetchFavorites();
	}, []);

	const handleToggleFavorite = async (id: number) => {
		try {
			await toggleFavorite(id);
			setFavorites((prev) =>
				prev.filter((sound) =>
					sound.id === id ? !sound.is_favorite : true
				)
			);
		} catch (err) {
			console.error('Error toggling favourite:', err);
		}
	};

	return (
		<Layout>
			<div className='grid grid-cols-1 gap-4 rounded-xl border-neutral-800 sm:border sm:p-4 md:grid-cols-2 xl:grid-cols-3'>
				<h1 className='text-xl font-medium lg:text-2xl'>Favorites</h1>
				{error ? (
					<p className='text-center text-red-500'>{error}</p>
				) : favorites.length === 0 ? (
					<p className='text-center text-neutral-500 italic'>
						<span className='not-italic'>😢</span> No favourite
						sounds yet.
					</p>
				) : (
					favorites.map((sound) => (
						<SoundCard
							key={sound.id}
							index={sound.id}
							name={sound.name}
							path={sound.path}
							isPlaying={false}
							onPlay={() => console.log('Play sound')}
							is_favorite={sound.is_favorite}
							onToggleFavorite={() =>
								handleToggleFavorite(sound.id)
							}
						/>
					))
				)}
			</div>
		</Layout>
	);
};
