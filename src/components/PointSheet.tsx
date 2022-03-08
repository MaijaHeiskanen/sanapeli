import { ITurn } from "../react-app-env";

interface PointSheetProps {
	turns: ITurn[];
}

export const PointSheet = (props: PointSheetProps) => {
	let totalPoints = 0;

	const rows = props.turns.map((turn, index) => {
		const { points, playedWords } = turn;
		console.log({ points, playedWords });

		totalPoints += points;

		const wordLinks = [];
		const word = playedWords[0];

		wordLinks.push(
			<span className='word'>
				<a className='link' target={"_blank"} rel='noreferrer' href={`https://www.kielitoimistonsanakirja.fi/#/${word}`}>
					{word}
				</a>
				{playedWords.length > 1 && ", "}
			</span>
		);

		for (let i = 1, len = playedWords.length; i < len; i++) {
			const word = playedWords[i];

			wordLinks.push(
				<a className='word' target={"_blank"} rel='noreferrer' href={`https://www.kielitoimistonsanakirja.fi/#/${word}`}>
					{word}
				</a>
			);
		}

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
				<div className='column words'></div>
			</div>
		</div>
	);
};
