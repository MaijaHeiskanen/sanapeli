type MenuProps = {
	newGame: () => void;
	changeHand: () => void;
	endGame: () => void;
	canEndGame: boolean;
	canChangeHand: boolean;
};

export const Menu = (props: MenuProps) => {
	const { newGame, changeHand, endGame, canEndGame, canChangeHand } = props;

	console.log({ canEndGame, canChangeHand });

	return (
		<div className='menu'>
			<button onClick={newGame}>Uusi peli</button>
			<button onClick={changeHand} disabled={!canChangeHand}>
				Vaihda käsi
			</button>
			{/* <button onClick={endGame} disabled={!canEndGame} title={"Pelin voi päättää, kun kaikki kirjaimet on käytetty"}>
				Päätä peli
			</button> */}
		</div>
	);
};
