/// <reference types="react-scripts" />

import { SpecialCell } from "./enums/SpecialCell";

export interface ITileCoordinates {
	column: number;
	row: number;
}

export interface IBoardCell {
	tile?: ITile;
	special?: SpecialCell;
	coordinates: ITileCoordinates;
	inputRef?: RefObject<HTMLInputElement>;
	invalidTile?: boolean;
}

export interface ITile {
	letter: string;
	played?: boolean;
	locked?: boolean;
}
