import { Window } from '@tauri-apps/api/window';
import { useState, useEffect } from 'react';
import { Minus, Square, X, Maximize2 } from 'lucide-react';

const Titlebar = () => {
	const [isMaximized, setIsMaximized] = useState(false);
	const [appIcon, setAppIcon] = useState('/icon.png');

	useEffect(() => {
		const initialIcon = localStorage.getItem('appIcon') || '/icon.png';
		setAppIcon(initialIcon);

		const handleStorageChange = () => {
			const updatedIcon = localStorage.getItem('appIcon') || '/icon.png';
			setAppIcon(updatedIcon);
		};

		window.addEventListener('storage', handleStorageChange);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	}, []);

	useEffect(() => {
		const updateMaximizedState = async () => {
			const appWindow = Window.getCurrent();
			setIsMaximized(await appWindow.isMaximized());

			const unlisten = await appWindow.onResized(() => {
				appWindow.isMaximized().then(setIsMaximized);
			});

			return () => {
				unlisten();
			};
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
	};

	const handleClose = async () => {
		const appWindow = Window.getCurrent();
		await appWindow.close();
	};

	return (
		<div
			data-tauri-drag-region
			className='fixed top-0 right-0 left-0 z-50 flex h-8 w-full items-center justify-between border-b border-neutral-900 bg-neutral-950'>
			<div
				data-tauri-drag-region
				className='pointer-events-none flex items-center gap-2 px-3 py-1.5'>
				<img src={appIcon} alt='Logo' className='h-5 w-5' />
				<span className='text-xs font-medium text-neutral-300'>
					SoundLab
				</span>
			</div>

			<div className='flex h-full'>
				<button
					onClick={handleMinimize}
					className='flex h-full w-10 items-center justify-center text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-200'
					aria-label='Minimize'>
					<Minus size={14} />
				</button>

				<button
					onClick={handleMaximize}
					className='flex h-full w-10 items-center justify-center text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-200'
					aria-label={isMaximized ? 'Restore' : 'Maximize'}>
					{isMaximized ? (
						<Square size={13} />
					) : (
						<Maximize2 size={13} />
					)}
				</button>

				<button
					onClick={handleClose}
					className='flex h-full w-10 items-center justify-center text-neutral-400 transition-colors hover:bg-red-600 hover:text-white'
					aria-label='Close'>
					<X size={16} />
				</button>
			</div>
		</div>
	);
};

export default Titlebar;
