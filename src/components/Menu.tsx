type MenuProps = {
	newGame: () => void;
	changeHand: () => void;
	endGame: () => void;
	toggleInstructionsPopover: () => void;
	canEndGame: boolean;
	canChangeHand: boolean;
};

export const Menu = (props: MenuProps) => {
	const { newGame, changeHand, endGame, toggleInstructionsPopover, canEndGame, canChangeHand } = props;

	return (
		<>
			<h2>Valikko</h2>
			<div className='menu'>
				<button onClick={() => newGame()}>Uusi peli</button>
				<button onClick={toggleInstructionsPopover}>Näytä ohjeet</button>
				<button onClick={changeHand} disabled={!canChangeHand}>
					Vaihda käsi
				</button>
				<button onClick={endGame} disabled={!canEndGame} title={"Pelin voi päättää, kun kaikki kirjaimet on käytetty"}>
					Päätä peli
				</button>
			</div>
		</>
	);
};
