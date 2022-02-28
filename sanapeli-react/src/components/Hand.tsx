import { Tile } from "./Tile";

export const Hand = () => {
	const letters = ["A", "A", "A", "A", "A", "A", "A"];
	return (
		<div className='hand'>
			{letters.map((letter) => {
				return <Tile letter={letter} transparent />;
			})}
		</div>
	);
};
