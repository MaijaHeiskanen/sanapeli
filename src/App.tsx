import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Game } from "./Game";

export const BOARD_SIZE = 15;
export const HAND_SIZE = 7;
export const SHOW_HIGHSCORES = 5;

function App() {
	return (
		<Router basename={process.env.PUBLIC_URL}>
			<Routes>
				<Route path='/' element={<Game />} />
				<Route path='/:seed' element={<Game />} />
			</Routes>
		</Router>
	);
}

export default App;
