import { Tile } from "./Tile";

export const Hand = () => {
	const letters = ["A", "E", "A", "R", "T", "I", "G"];
	return (
		<div className='hand'>
			{letters.map((letter, index) => {
				return <Tile key={index} tile={{ tile: { letter, locked: true } }} />;
			})}
		</div>
	);
};
