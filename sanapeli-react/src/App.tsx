import "./App.scss";
import { Board } from "./components/Board";
import { GameArea } from "./components/GameArea";
import { Hand } from "./components/Hand";

function App() {
	return (
		<div className='app'>
			<GameArea>
				<Board />
				<Hand />
			</GameArea>
		</div>
	);
}

export default App;
