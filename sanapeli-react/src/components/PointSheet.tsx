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

		return (
			<div className='row' key={index + 1}>
				<div className='column index'>{index + 1}</div>
				<div className='column points'>{points}</div>
				<div className='column words'>{playedWords.join(", ")}</div>
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
				<div className='column index'></div>
				<div className='column points'>{totalPoints}</div>
				<div className='column words'></div>
			</div>
		</div>
	);
};
