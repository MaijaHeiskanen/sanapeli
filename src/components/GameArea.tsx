import React from "react";

type GameAreaProps = {
	pointShteet: React.ReactElement;
	board: React.ReactElement;
	hand: React.ReactElement;
};

export const GameArea = (props: GameAreaProps) => {
	const { pointShteet, board, hand } = props;

	return (
		<div className='gamearea'>
			<div className='side'>{pointShteet}</div>
			<div className='center'>
				{board}
				{hand}
			</div>
			<div className='side'></div>
		</div>
	);
};
