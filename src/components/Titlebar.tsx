import { Window } from '@tauri-apps/api/window';
import { useState, useEffect } from 'react';

const Titlebar = () => {
	const [isMaximized, setIsMaximized] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	useEffect(() => {
		const updateMaximizedState = async () => {
			const appWindow = Window.getCurrent();
			setIsMaximized(await appWindow.isMaximized());
		};
		updateMaximizedState();
	}, []);

	const handleMinimize = async () => {
		const appWindow = Window.getCurrent();
		await appWindow.minimize();
	};

	const handleMaximize = async () => {
		const appWindow = Window.getCurrent();
		await appWindow.toggleMaximize();
		setIsMaximized(!isMaximized);
	};

	const handleClose = async () => {
		const appWindow = Window.getCurrent();
		await appWindow.close();
	};

	return (
		<div
			data-tauri-drag-region
			className='absolute top-0 left-0 z-50 flex h-8 w-full items-center border-b border-neutral-900 bg-neutral-950 px-3'
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}>
			<div className='flex items-center gap-2 py-1.5'>
				<button
					onClick={handleClose}
					className='group relative h-3 w-3 rounded-full bg-red-500 transition-opacity hover:bg-red-600'
					aria-label='Schließen'>
					{isHovered && (
						<svg
							className='absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100'
							viewBox='0 0 10 10'>
							<path
								d='M2,2 L8,8 M8,2 L2,8'
								stroke='rgba(0,0,0,0.4)'
								strokeWidth='1.1'
							/>
						</svg>
					)}
				</button>
				<button
					onClick={handleMinimize}
					className='group relative h-3 w-3 rounded-full bg-yellow-500 transition-opacity hover:bg-yellow-600'
					aria-label='Minimieren'>
					{isHovered && (
						<svg
							className='absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100'
							viewBox='0 0 10 10'>
							<path
								d='M2,5 L8,5'
								stroke='rgba(0,0,0,0.4)'
								strokeWidth='1.1'
							/>
						</svg>
					)}
				</button>
				<button
					onClick={handleMaximize}
					className='group relative h-3 w-3 rounded-full bg-green-500 transition-opacity hover:bg-green-600'
					aria-label={
						isMaximized
							? 'Fenstergröße wiederherstellen'
							: 'Maximieren'
					}>
					{isHovered && (
						<svg
							className='absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100'
							viewBox='0 0 10 10'>
							{isMaximized ? (
								<path
									d='M2.5,4.5 v3 h3 v-3 h-3 M4.5,2.5 v3 h3 v-3 h-3'
									stroke='rgba(0,0,0,0.4)'
									strokeWidth='1.1'
									fill='none'
								/>
							) : (
								<path
									d='M2.5,2.5 v5 h5 v-5 h-5'
									stroke='rgba(0,0,0,0.4)'
									strokeWidth='1.1'
									fill='none'
								/>
							)}
						</svg>
					)}
				</button>
			</div>
			<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
				<div className='text-sm font-medium text-neutral-300 select-none'>
					SoundLab [INDEV]
				</div>
			</div>
		</div>
	);
};

export default Titlebar;
