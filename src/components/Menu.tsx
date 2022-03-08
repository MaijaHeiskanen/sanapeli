type MenuProps = {
	newGame: () => void;
};

export const Menu = (props: MenuProps) => {
	const { newGame } = props;

	return (
		<div className='menu'>
			<button onClick={newGame}>Uusi peli</button>
		</div>
	);
};
