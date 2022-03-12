import React from "react";

type GameAreaProps = {
	pointShteet: React.ReactElement;
	info: React.ReactElement;
	board: React.ReactElement;
	hand: React.ReactElement;
	highscoreBoard: React.ReactElement;
	menu: React.ReactElement;
};

export const GameArea = (props: GameAreaProps) => {
	const { pointShteet, info, board, hand, highscoreBoard, menu } = props;

	return (
		<div className='gamearea'>
			<div className='side'>
				{menu}
				{pointShteet}
			</div>
			<div className='center'>
				{board}
				{hand}
			</div>
			<div className='side right'>
				{highscoreBoard}
				{info}
			</div>
		</div>
	);
};
