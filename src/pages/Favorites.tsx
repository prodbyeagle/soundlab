import { useEffect, useState } from 'react';
import { SoundCard } from '../components/library/SoundCard';
import { getSounds, toggleFavorite } from '../lib/soundImport';
import type { Sound } from '../types/Sound';
import Layout from '../components/Layout';
import { AlertCircle, Heart, HeartCrack } from 'lucide-react';

export const Favorites = () => {
	const [favorites, setFavorites] = useState<Sound[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [removingId, setRemovingId] = useState<number | null>(null);

	useEffect(() => {
		const fetchFavorites = async () => {
			try {
				setIsLoading(true);
				const allSounds: Sound[] = await getSounds();
				const favs = allSounds.filter((sound) => sound.is_favorite);
				setFavorites(favs);
			} catch (err) {
				console.error('Error fetching favorites:', err);
				setError(
					'Unable to load your favorite sounds. Please try again.'
				);
			} finally {
				setIsLoading(false);
			}
		};
		fetchFavorites();
	}, []);

	const handleToggleFavorite = async (id: number) => {
		try {
			setRemovingId(id);
			await toggleFavorite(id);
			setFavorites((prev) => prev.filter((sound) => sound.id !== id));
		} catch (err) {
			console.error('Error toggling favorite:', err);
			setError('Failed to update favorite. Please try again.');
		} finally {
			setRemovingId(null);
		}
	};

	return (
		<Layout>
			<div className='space-y-6'>
				<div className='flex items-center space-x-2'>
					<Heart className='h-6 w-6 text-neutral-700' />
					<h1 className='text-2xl font-semibold tracking-tight'>
						Favorites
					</h1>
				</div>

				{error && (
					<div>
						<AlertCircle className='h-4 w-4' />
						<span>{error}</span>
					</div>
				)}

				<div className='relative min-h-[200px]'>
					{isLoading ? (
						<div className='grid animate-pulse grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
							{[...Array(6)].map((_, i) => (
								<div
									key={i}
									className='h-32 rounded-lg bg-neutral-100 dark:bg-neutral-800'
								/>
							))}
						</div>
					) : favorites.length === 0 ? (
						<div className='flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-neutral-800 bg-neutral-900/20 p-8 text-center'>
							<div className='flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800/30'>
								<HeartCrack className='h-8 w-8 text-neutral-400' />
							</div>
							<h3 className='mt-6 text-lg font-medium text-neutral-200'>
								No Favorite sounds yet
							</h3>
							<p className='mt-2 max-w-sm text-sm text-neutral-500'>
								Start favoriting sounds to see them here
							</p>
						</div>
					) : (
						<div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
							{favorites.map((sound) => (
								<div
									key={sound.id}
									className={`transition-opacity duration-300 ${
										removingId === sound.id
											? 'opacity-50'
											: 'opacity-100'
									}`}>
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
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
};

export default Favorites;
