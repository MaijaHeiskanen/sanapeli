import React from "react";

type GameAreaProps = {
	pointShteet: React.ReactElement;
	board: React.ReactElement;
	hand: React.ReactElement;
	menu: React.ReactElement;
};

export const GameArea = (props: GameAreaProps) => {
	const { pointShteet, board, hand, menu } = props;

	return (
		<div className='gamearea'>
			<div className='side'>{pointShteet}</div>
			<div className='center'>
				{board}
				{hand}
			</div>
			<div className='side right'>{menu}</div>
		</div>
	);
};
