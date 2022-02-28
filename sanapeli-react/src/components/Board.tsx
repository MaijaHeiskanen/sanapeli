import { Tile } from "./Tile";

export const enum SpecialTile {
	x2letter = "x2letter",
	x3letter = "x3letter",
	x2word = "x2word",
	x3word = "x3word",
	start = "start",
}

interface ITile {
	letter?: string;
	special?: SpecialTile;
}

const SIZE = 15;
const createBoard = () => {
	const tiles = [];

	for (let i = 0; i < SIZE; i++) {
		const row = [];

		for (let ii = 0; ii < SIZE; ii++) {
			if (i === 3) {
				row.push({ letter: "B" });
			} else {
				row.push({ letter: undefined });
			}
		}

		tiles.push(row);
	}

	return tiles;
};
const setSpecialTiles = (board: ITile[][]) => {
	const tilesWithSpecials = board.slice();

	const specials = [
		// x3word
		{ column: 0, row: 0, special: SpecialTile.x3word },
		{ column: 0, row: 7, special: SpecialTile.x3word },
		{ column: 0, row: 14, special: SpecialTile.x3word },
		{ column: 7, row: 0, special: SpecialTile.x3word },
		{ column: 7, row: 14, special: SpecialTile.x3word },
		{ column: 14, row: 0, special: SpecialTile.x3word },
		{ column: 14, row: 7, special: SpecialTile.x3word },
		{ column: 14, row: 14, special: SpecialTile.x3word },
		// x2word
		{ column: 1, row: 1, special: SpecialTile.x2word },
		{ column: 2, row: 2, special: SpecialTile.x2word },
		{ column: 3, row: 3, special: SpecialTile.x2word },
		{ column: 4, row: 4, special: SpecialTile.x2word },
		{ column: 13, row: 1, special: SpecialTile.x2word },
		{ column: 12, row: 2, special: SpecialTile.x2word },
		{ column: 11, row: 3, special: SpecialTile.x2word },
		{ column: 10, row: 4, special: SpecialTile.x2word },
		{ column: 1, row: 13, special: SpecialTile.x2word },
		{ column: 2, row: 12, special: SpecialTile.x2word },
		{ column: 3, row: 11, special: SpecialTile.x2word },
		{ column: 4, row: 10, special: SpecialTile.x2word },
		{ column: 10, row: 10, special: SpecialTile.x2word },
		{ column: 11, row: 11, special: SpecialTile.x2word },
		{ column: 12, row: 12, special: SpecialTile.x2word },
		{ column: 13, row: 13, special: SpecialTile.x2word },
		// x3letter
		{ column: 1, row: 5, special: SpecialTile.x3letter },
		{ column: 1, row: 9, special: SpecialTile.x3letter },
		{ column: 5, row: 1, special: SpecialTile.x3letter },
		{ column: 5, row: 5, special: SpecialTile.x3letter },
		{ column: 5, row: 9, special: SpecialTile.x3letter },
		{ column: 5, row: 13, special: SpecialTile.x3letter },
		{ column: 9, row: 1, special: SpecialTile.x3letter },
		{ column: 9, row: 5, special: SpecialTile.x3letter },
		{ column: 9, row: 9, special: SpecialTile.x3letter },
		{ column: 9, row: 13, special: SpecialTile.x3letter },
		{ column: 13, row: 5, special: SpecialTile.x3letter },
		{ column: 13, row: 9, special: SpecialTile.x3letter },
		// x2letter
		{ column: 0, row: 3, special: SpecialTile.x2letter },
		{ column: 0, row: 11, special: SpecialTile.x2letter },
		{ column: 2, row: 6, special: SpecialTile.x2letter },
		{ column: 2, row: 8, special: SpecialTile.x2letter },
		{ column: 3, row: 0, special: SpecialTile.x2letter },
		{ column: 3, row: 7, special: SpecialTile.x2letter },
		{ column: 3, row: 14, special: SpecialTile.x2letter },
		{ column: 6, row: 2, special: SpecialTile.x2letter },
		{ column: 6, row: 6, special: SpecialTile.x2letter },
		{ column: 6, row: 8, special: SpecialTile.x2letter },
		{ column: 6, row: 12, special: SpecialTile.x2letter },
		{ column: 7, row: 3, special: SpecialTile.x2letter },
		{ column: 7, row: 11, special: SpecialTile.x2letter },
		{ column: 8, row: 2, special: SpecialTile.x2letter },
		{ column: 8, row: 6, special: SpecialTile.x2letter },
		{ column: 8, row: 8, special: SpecialTile.x2letter },
		{ column: 8, row: 12, special: SpecialTile.x2letter },
		{ column: 11, row: 0, special: SpecialTile.x2letter },
		{ column: 11, row: 7, special: SpecialTile.x2letter },
		{ column: 11, row: 14, special: SpecialTile.x2letter },
		{ column: 12, row: 6, special: SpecialTile.x2letter },
		{ column: 12, row: 8, special: SpecialTile.x2letter },
		{ column: 14, row: 3, special: SpecialTile.x2letter },
		{ column: 14, row: 11, special: SpecialTile.x2letter },
		// start
		{ column: 7, row: 7, special: SpecialTile.start },
	];

	specials.forEach((s) => {
		const { column, row, special } = s;
		tilesWithSpecials[row][column].special = special;
	});

	return tilesWithSpecials;
};

export const Board = () => {
	const tiles = setSpecialTiles(createBoard());
	const boardRows = [];

	for (let i = 0; i < SIZE; i++) {
		const row = [];

		for (let ii = 0; ii < SIZE; ii++) {
			const tile = tiles[i][ii];
			row.push(<Tile letter={tile.letter} special={tile.special} />);
		}

		boardRows.push(row);
	}

	const rows = boardRows.map((row) => {
		return <div className='row'>{row}</div>;
	});

	return <div className='board'>{rows}</div>;
};
