/// <reference types="react-scripts" />

import { NumericLiteral } from "typescript";
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
	letter: ILetter;
	played?: boolean;
	locked?: boolean;
}

export interface ITurn {
	playedWords: string[];
	filledCells: IBoardCell[];
	points: number;
}

export interface ILetter {
	char: string;
	value: number;
}
