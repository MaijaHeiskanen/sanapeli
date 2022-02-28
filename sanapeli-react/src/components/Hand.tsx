import { useEffect, useState } from "react";
import { HAND_SIZE } from "../App";
import { IHandTile } from "../react-app-env";
import { Tile } from "./Tile";

export const Hand = (props: { hand: IHandTile[] }) => {
	const [handTiles, setHandTiles] = useState<Partial<IHandTile[]>>([]);

	useEffect(() => {
		const newHand = props.hand.slice();
		const newHandLength = newHand.length;

		if (newHandLength < HAND_SIZE) {
			for (let i = newHandLength; i < HAND_SIZE; i++) {
				newHand.push({
					letter: "",
					used: false,
				});
			}
		}

		setHandTiles(newHand);
	}, [props.hand]);

	return (
		<div className='hand'>
			{handTiles.map((tile, index) => {
				return <Tile key={index} tile={{ tile: { letter: tile?.letter, locked: tile?.used } }} />;
			})}
		</div>
	);
};
