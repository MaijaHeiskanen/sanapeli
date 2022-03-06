import { useEffect, useState } from "react";
import { HAND_SIZE } from "../App";

import { ITile } from "../react-app-env";
import { Tile } from "./Tile";

export const Hand = (props: { hand: ITile[] }) => {
	const [handTiles, setHandTiles] = useState<Partial<ITile[]>>([]);

	useEffect(() => {
		const newHand = props.hand.slice();
		const newHandLength = newHand.length;

		if (newHandLength < HAND_SIZE) {
			for (let i = newHandLength; i < HAND_SIZE; i++) {
				newHand.push({
					letter: { char: "", value: 0 },
				});
			}
		}

		setHandTiles(newHand);
	}, [props.hand]);

	return (
		<div className='hand'>
			{handTiles.map((tile, index) => {
				return (
					<span key={index} className='hand-cell'>
						<Tile tile={tile} disabled />
					</span>
				);
			})}
		</div>
	);
};
