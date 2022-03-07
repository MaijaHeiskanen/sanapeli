import { SpecialCell } from "../enums/SpecialCell";
import { IBoardCell } from "../react-app-env";

export const setSpecialCells = (board: IBoardCell[][]) => {
	const boardTilesWithSpecials = board.slice();

	const specials = [
		// x3word
		{ column: 0, row: 0, special: SpecialCell.x3word },
		{ column: 0, row: 7, special: SpecialCell.x3word },
		{ column: 0, row: 14, special: SpecialCell.x3word },
		{ column: 7, row: 0, special: SpecialCell.x3word },
		{ column: 7, row: 14, special: SpecialCell.x3word },
		{ column: 14, row: 0, special: SpecialCell.x3word },
		{ column: 14, row: 7, special: SpecialCell.x3word },
		{ column: 14, row: 14, special: SpecialCell.x3word },
		// x2word
		{ column: 1, row: 1, special: SpecialCell.x2word },
		{ column: 2, row: 2, special: SpecialCell.x2word },
		{ column: 3, row: 3, special: SpecialCell.x2word },
		{ column: 4, row: 4, special: SpecialCell.x2word },
		{ column: 13, row: 1, special: SpecialCell.x2word },
		{ column: 12, row: 2, special: SpecialCell.x2word },
		{ column: 11, row: 3, special: SpecialCell.x2word },
		{ column: 10, row: 4, special: SpecialCell.x2word },
		{ column: 1, row: 13, special: SpecialCell.x2word },
		{ column: 2, row: 12, special: SpecialCell.x2word },
		{ column: 3, row: 11, special: SpecialCell.x2word },
		{ column: 4, row: 10, special: SpecialCell.x2word },
		{ column: 10, row: 10, special: SpecialCell.x2word },
		{ column: 11, row: 11, special: SpecialCell.x2word },
		{ column: 12, row: 12, special: SpecialCell.x2word },
		{ column: 13, row: 13, special: SpecialCell.x2word },
		// x3letter
		{ column: 1, row: 5, special: SpecialCell.x3letter },
		{ column: 1, row: 9, special: SpecialCell.x3letter },
		{ column: 5, row: 1, special: SpecialCell.x3letter },
		{ column: 5, row: 5, special: SpecialCell.x3letter },
		{ column: 5, row: 9, special: SpecialCell.x3letter },
		{ column: 5, row: 13, special: SpecialCell.x3letter },
		{ column: 9, row: 1, special: SpecialCell.x3letter },
		{ column: 9, row: 5, special: SpecialCell.x3letter },
		{ column: 9, row: 9, special: SpecialCell.x3letter },
		{ column: 9, row: 13, special: SpecialCell.x3letter },
		{ column: 13, row: 5, special: SpecialCell.x3letter },
		{ column: 13, row: 9, special: SpecialCell.x3letter },
		// x2letter
		{ column: 0, row: 3, special: SpecialCell.x2letter },
		{ column: 0, row: 11, special: SpecialCell.x2letter },
		{ column: 2, row: 6, special: SpecialCell.x2letter },
		{ column: 2, row: 8, special: SpecialCell.x2letter },
		{ column: 3, row: 0, special: SpecialCell.x2letter },
		{ column: 3, row: 7, special: SpecialCell.x2letter },
		{ column: 3, row: 14, special: SpecialCell.x2letter },
		{ column: 6, row: 2, special: SpecialCell.x2letter },
		{ column: 6, row: 6, special: SpecialCell.x2letter },
		{ column: 6, row: 8, special: SpecialCell.x2letter },
		{ column: 6, row: 12, special: SpecialCell.x2letter },
		{ column: 7, row: 3, special: SpecialCell.x2letter },
		{ column: 7, row: 11, special: SpecialCell.x2letter },
		{ column: 8, row: 2, special: SpecialCell.x2letter },
		{ column: 8, row: 6, special: SpecialCell.x2letter },
		{ column: 8, row: 8, special: SpecialCell.x2letter },
		{ column: 8, row: 12, special: SpecialCell.x2letter },
		{ column: 11, row: 0, special: SpecialCell.x2letter },
		{ column: 11, row: 7, special: SpecialCell.x2letter },
		{ column: 11, row: 14, special: SpecialCell.x2letter },
		{ column: 12, row: 6, special: SpecialCell.x2letter },
		{ column: 12, row: 8, special: SpecialCell.x2letter },
		{ column: 14, row: 3, special: SpecialCell.x2letter },
		{ column: 14, row: 11, special: SpecialCell.x2letter },
		// start
		{ column: 7, row: 7, special: SpecialCell.start },
	];

	specials.forEach((s) => {
		const { column, row, special } = s;
		boardTilesWithSpecials[row][column].special = special;
	});

	return boardTilesWithSpecials;
};
