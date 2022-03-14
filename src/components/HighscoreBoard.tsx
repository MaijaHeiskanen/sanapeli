import { IHighscore } from "../react-app-env";
import { TableHeaderRow } from "./TableHeaderRow";
import { TableRow } from "./TableRow";

interface HighscoreProps {
	highscores: IHighscore[];
}

export const HighscoreBoard = (props: HighscoreProps) => {
	const { highscores } = props;

	if (highscores.length === 0) {
		return (
			<>
				<h2>Ennätykset</h2>
				<div className='no-scores'>Ei vielä tallennettuja tuloksia</div>
			</>
		);
	}

	const rows = [];

	rows.push(<TableHeaderRow className='header' key='header' cells={["Pisteet", "Sanamäärä", "Ohitetut kirjaimet", "Päivämäärä"]} />);

	highscores.forEach((score, index) => {
		const { points, amountOfPlayedWords, amountOfSkippedLetters, date } = score;

		rows.push(<TableRow key={index} cells={[points, amountOfPlayedWords, amountOfSkippedLetters, new Date(date).toLocaleDateString("fi-FI")]} />);
	});

	return (
		<>
			<h2>Ennätykset</h2>
			<table className='table highscoreboard'>
				<tbody>{rows}</tbody>
			</table>
		</>
	);
};
