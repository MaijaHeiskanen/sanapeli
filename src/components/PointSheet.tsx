import { ITurn } from "../react-app-env";

interface PointSheetProps {
	turns: ITurn[];
}

export const PointSheet = (props: PointSheetProps) => {
	const { turns } = props;
	let totalPoints = 0;
	let totalWords = 0;

	const turnIndexes = [];
	const scores = [];
	const words = [];

	turnIndexes.push(
		<div key={"header"} className='header'>
			Vuoro
		</div>
	);
	scores.push(
		<div key={"header"} className='header'>
			Pisteet
		</div>
	);
	words.push(
		<div key={"header"} className='header'>
			Sanat
		</div>
	);

	turns.forEach((turn, index) => {
		const { points, playedWords, changingTiles } = turn;

		totalPoints += points;

		const wordLinks = [];
		const word = playedWords[0];

		if (word) {
			if (!changingTiles) {
				totalWords += 1;
			}

			wordLinks.push(
				<span className='word'>
					{changingTiles ? (
						word
					) : (
						<a key={word} className='link' target={"_blank"} rel='noreferrer' href={`https://www.kielitoimistonsanakirja.fi/#/${word.toLowerCase()}`}>
							{word}
						</a>
					)}
				</span>,
				", "
			);
		}

		for (let i = 1, len = playedWords.length; i < len; i++) {
			const word = playedWords[i];

			if (!changingTiles) {
				totalWords += 1;
			}

			if (changingTiles) {
				wordLinks.push(word, ", ");
			} else {
				wordLinks.push(
					<a key={word} className='word' target={"_blank"} rel='noreferrer' href={`https://www.kielitoimistonsanakirja.fi/#/${word.toLowerCase()}`}>
						{word}
					</a>,
					", "
				);
			}
		}

		wordLinks.splice(wordLinks.length - 1, 1);

		turnIndexes.push(
			<div key={index} className='row'>
				{index + 1}
			</div>
		);
		scores.push(
			<div key={index} className='row'>
				{points}
			</div>
		);
		words.push(
			<div key={index} className='row'>
				{wordLinks}
			</div>
		);
	});

	turnIndexes.push(
		<div key={"footer"} className='footer'>
			Yht.
		</div>
	);
	scores.push(
		<div key={"footer"} className='footer'>
			{totalPoints}
		</div>
	);
	words.push(<div key={"footer"} className='footer'>{`${totalWords} ${totalWords === 1 ? "sana" : "sanaa"}`}</div>);

	return (
		<>
			<h2>Pisteet</h2>
			<div className='pointsheet'>
				<div className='column'>{turnIndexes}</div>
				<div className='column'>{scores}</div>
				<div className='column'>{words}</div>
			</div>
		</>
	);
};
