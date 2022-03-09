import { ITurn } from "../react-app-env";

interface PointSheetProps {
	turns: ITurn[];
}

export const PointSheet = (props: PointSheetProps) => {
	let totalPoints = 0;
	let totalWords = 0;

	const rows = props.turns.map((turn, index) => {
		const { points, playedWords, changingTiles } = turn;

		totalPoints += points;

		const wordLinks = [];
		const word = playedWords[0];

		if (word) {
			totalWords += 1;
			wordLinks.push(
				<span className='word'>
					{changingTiles ? (
						word
					) : (
						<a key={word} className='link' target={"_blank"} rel='noreferrer' href={`https://www.kielitoimistonsanakirja.fi/#/${word.toLowerCase()}`}>
							{word}
						</a>
					)}
					{", "}
				</span>
			);
		}

		for (let i = 1, len = playedWords.length; i < len; i++) {
			const word = playedWords[i];
			totalWords += 1;

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

		return (
			<div className='row' key={index + 1}>
				<div className='column index'>{index + 1}</div>
				<div className='column points'>{points}</div>
				<div className='column words'>{wordLinks}</div>
			</div>
		);
	});

	return (
		<div className='pointsheet'>
			<div className='row header' key={"header"}>
				<div className='column index'>Vuoro</div>
				<div className='column points'>Pisteet</div>
				<div className='column words'>Sanat</div>
			</div>

			{rows}

			<div className='row footer' key={"footer"}>
				<div className='column index'>Yht.</div>
				<div className='column points'>{totalPoints}</div>
				<div className='column words'>{`${totalWords} ${totalWords === 1 ? "sana" : "sanaa"}`}</div>
			</div>
		</div>
	);
};
