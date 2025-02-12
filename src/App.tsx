import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';
import Library from './pages/Library';
import Settings from './pages/Settings';
import Titlebar from './components/Titlebar';

const App = () => {
	return (
		<div className='font-main'>
			<Titlebar />
			<ThemeProvider>
				<SoundProvider>
					<BrowserRouter>
						<Routes>
							<Route path='/' element={<Library />} />
							<Route path='/settings' element={<Settings />} />
						</Routes>
					</BrowserRouter>
				</SoundProvider>
			</ThemeProvider>
		</div>
	);
};

export default App;
