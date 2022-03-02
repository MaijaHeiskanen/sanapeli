/// <reference types="react-scripts" />

import { SpecialCell } from "./enums/SpecialCell";

export interface ITileCoordinates {
	column: number;
	row: number;
}

export interface IBoardCell {
	tile?: ITile;
	special?: SpecialCell;
	coordinates?: ITileCoordinates;
	inputRef?: RefObject<HTMLInputElement>;
	focused?: boolean;
	invalidTile?: boolean;
}

export interface ITile {
	letter: string;
	played?: boolean;
	locked?: boolean;
}
