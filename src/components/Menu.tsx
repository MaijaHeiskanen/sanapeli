type MenuProps = {
	newGame: () => void;
};

export const Menu = (props: MenuProps) => {
	const { newGame } = props;

	return (
		<div>
			<button onClick={newGame}>Uusi peli</button>
		</div>
	);
};
