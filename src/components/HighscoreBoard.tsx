import { IHighscore } from "../react-app-env";

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

	const scores: React.ReactElement[] = [];
	const amountsOfPlayedWords: React.ReactElement[] = [];
	const amountsOfSkippedLetters: React.ReactElement[] = [];
	const dates: React.ReactElement[] = [];

	scores.push(
		<div key={"title"} className={"title"}>
			Pisteet
		</div>
	);
	amountsOfPlayedWords.push(
		<div key={"title"} className={"title"}>
			Sanamäärä
		</div>
	);
	amountsOfSkippedLetters.push(
		<div key={"title"} className={"title"}>
			Ohitetut kirjaimet
		</div>
	);
	dates.push(
		<div key={"title"} className={"title"}>
			Päivämäärä
		</div>
	);

	highscores.forEach((score, index) => {
		const { points, amountOfPlayedWords, amountOfSkippedLetters, date } = score;

		scores.push(
			<div className='row' key={index}>
				{points}
			</div>
		);
		amountsOfPlayedWords.push(
			<div className='row' key={index}>
				{amountOfPlayedWords}
			</div>
		);
		amountsOfSkippedLetters.push(
			<div className='row' key={index}>
				{amountOfSkippedLetters}
			</div>
		);
		dates.push(
			<div className='row' key={index}>
				{new Date(date).toLocaleDateString("fi-FI")}
			</div>
		);
	});

	return (
		<>
			<h2>Ennätykset</h2>
			<div className='highscoreboard'>
				<div className='column'>{scores}</div>
				<div className='column'>{amountsOfPlayedWords}</div>
				<div className='column'>{amountsOfSkippedLetters}</div>
				<div className='column'>{dates}</div>
			</div>
		</>
	);
};
