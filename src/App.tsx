import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SoundProvider } from './context/SoundContext';
import Library from './pages/Library';
import Settings from './pages/Settings';
import { Favorites } from './pages/Favorites';
import Titlebar from './components/Titlebar';
import { useEffect } from 'react';

const App = () => {
	useEffect(() => {
		const disableContextMenu = (event: MouseEvent) => {
			event.preventDefault();
		};

		document.addEventListener('contextmenu', disableContextMenu);
		return () => {
			document.removeEventListener('contextmenu', disableContextMenu);
		};
	}, []);

	return (
		<div className='font-main overflow-scroll bg-neutral-950 text-neutral-100'>
			<Titlebar />
			<SoundProvider>
				<BrowserRouter>
					<Routes>
						<Route path='/' element={<Library />} />
						<Route path='/favorites' element={<Favorites />} />
						<Route path='/settings' element={<Settings />} />
					</Routes>
				</BrowserRouter>
			</SoundProvider>
		</div>
	);
};

export default App;
