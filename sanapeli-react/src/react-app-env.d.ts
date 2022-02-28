/// <reference types="react-scripts" />

export interface ITile {
	letter?: string;
	focused?: boolean;
	locked?: boolean;
	invalid?: boolean;
}

export interface ITileCoordinates {
	column: number;
	row: number;
}

export interface IBoardTile {
	tile?: ITile;
	special?: SpecialTile;
	coordinates?: ITileCoordinates;
	inputRef?: RefObject<HTMLInputElement>;
}
