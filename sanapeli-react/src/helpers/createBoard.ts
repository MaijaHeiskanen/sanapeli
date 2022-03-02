import { createRef } from "react";
import { IBoardCell } from "../react-app-env";

export const createBoard = (size: number) => {
	const tiles: IBoardCell[][] = [];

	for (let i = 0; i < size; i++) {
		const column: IBoardCell[] = [];

		for (let ii = 0; ii < size; ii++) {
			column.push({ tile: undefined, coordinates: { column: ii, row: i }, inputRef: createRef<HTMLInputElement>() });
		}

		tiles.push(column);
	}

	return tiles;
};
