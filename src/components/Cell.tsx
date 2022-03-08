import classNames from "classnames";
import React, { ChangeEvent, FocusEvent, ForwardedRef, forwardRef, KeyboardEvent } from "react";
import { SpecialCell } from "../enums/SpecialCell";
import { WriteDirection } from "../enums/WriteDirection";
import { mapSpecialCellTypeToText } from "../helpers/mapSpecialCellTypeToText";
import { IBoardCell, ITileCoordinates } from "../react-app-env";
import { Star } from "./Star";
import { Tile } from "./Tile";

interface CellProps {
	cell?: IBoardCell;
	direction: WriteDirection;
	changedCallback?: (coordinates: ITileCoordinates, value: string | undefined) => void;
	moveFocus?: (coordinates: ITileCoordinates, direction: ITileCoordinates) => void;
}

export const Cell = forwardRef<HTMLInputElement, CellProps>((props: CellProps, ref: ForwardedRef<HTMLInputElement>) => {
	const { cell, direction, changedCallback, moveFocus } = props;
	const { special, coordinates, tile, invalidTile } = cell || {};
	const { letter, played, locked } = tile || {};

	const onTileFocused = (event: FocusEvent<HTMLInputElement>) => {
		event.currentTarget.setSelectionRange(event.currentTarget.value.length, event.currentTarget.value.length);
	};

	const onTileChanged = (event: ChangeEvent<HTMLInputElement>) => {
		if (changedCallback && coordinates) {
			let value = event.target.value;

			if (value.length > 1) {
				value = value[value.length - 1];
			}

			changedCallback(coordinates, value);
		}
	};

	const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		const keyCode = event.code;
		let shouldPreventDefault = false;

		if (keyCode === "Backspace" && !letter) {
			if (moveFocus && coordinates) {
				const moveDirection = { column: 0, row: 0 };

				if (direction === WriteDirection.Right) {
					moveDirection.column = -1;
				} else if (direction === WriteDirection.Down) {
					moveDirection.row = -1;
				}
				moveFocus(coordinates, moveDirection);
			}
		}
		if (keyCode === "ArrowUp") {
			if (moveFocus && coordinates) {
				shouldPreventDefault = true;
				moveFocus(coordinates, { column: 0, row: -1 });
			}
		}
		if (keyCode === "ArrowRight") {
			if (moveFocus && coordinates) {
				shouldPreventDefault = true;
				moveFocus(coordinates, { column: 1, row: 0 });
			}
		}
		if (keyCode === "ArrowLeft") {
			if (moveFocus && coordinates) {
				shouldPreventDefault = true;
				moveFocus(coordinates, { column: -1, row: 0 });
			}
		}
		if (keyCode === "ArrowDown") {
			if (moveFocus && coordinates) {
				shouldPreventDefault = true;
				moveFocus(coordinates, { column: 0, row: 1 });
			}
		}

		if (shouldPreventDefault) {
			event.preventDefault();
		}
	};

	const isEmpty = !letter;
	const instructionText = mapSpecialCellTypeToText(special);

	return (
		<span className={classNames("cell", special, { played, locked, "has-letter": !isEmpty })}>
			{special && <div className='rotated-box'></div>}
			{invalidTile && <div className='invalid blink'></div>}
			{special === SpecialCell.start && <Star />}
			{instructionText && <div className='instruction'>{instructionText}</div>}
			<Tile ref={ref} tile={tile} direction={direction} onFocus={onTileFocused} onChange={onTileChanged} onKeyDown={onKeyDown} />
		</span>
	);
});
