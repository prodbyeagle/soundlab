import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SoundProvider } from './context/SoundContext';
import Library from './pages/Library';
import Settings from './pages/Settings';
import Titlebar from './components/Titlebar';
import { invoke } from '@tauri-apps/api/core';
import { useEffect } from 'react';

const App = () => {
	useEffect(() => {
		invoke('init_cache').catch(console.error);
	}, []);

	return (
		<div className='font-main bg-neutral-950 text-neutral-100'>
			<Titlebar />
			<SoundProvider>
				<BrowserRouter>
					<Routes>
						<Route path='/' element={<Library />} />
						<Route path='/settings' element={<Settings />} />
					</Routes>
				</BrowserRouter>
			</SoundProvider>
		</div>
	);
};

export default App;
