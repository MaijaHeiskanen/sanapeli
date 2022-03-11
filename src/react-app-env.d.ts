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
	letter: ILetter;
	played?: boolean;
	locked?: boolean;
}

export interface ITurn {
	playedWords: string[];
	filledCells: IBoardCell[];
	points: number;
	changingTiles?: boolean;
}

export interface ILetter {
	char: string;
	value: number;
}

export interface IHighscore {
	points: number;
	amountOfPlayedWords: number;
	date: Date;
	amountOfSkippedLetters: number;
}
