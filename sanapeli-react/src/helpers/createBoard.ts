import { createRef } from "react";
import { IBoardTile } from "../react-app-env";

export const createBoard = (size: number) => {
	const tiles: IBoardTile[][] = [];

	for (let i = 0; i < size; i++) {
		const column: IBoardTile[] = [];

		for (let ii = 0; ii < size; ii++) {
			column.push({ tile: {}, coordinates: { column: ii, row: i }, inputRef: createRef<HTMLInputElement>() });
		}

		tiles.push(column);
	}

	return tiles;
};
