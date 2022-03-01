import classNames from "classnames";
import React, { ChangeEvent, FocusEvent, ForwardedRef, forwardRef, KeyboardEvent, KeyboardEventHandler } from "react";
import { SpecialTile } from "../enums/SpecialTile";
import { WriteDirection } from "../enums/WriteDirection";
import { IBoardTile, ITileCoordinates } from "../react-app-env";

const Star = () => {
	return (
		<svg x='0px' y='0px' viewBox='0 0 280.124 280.124' className='star'>
			<g>
				<path
					d='M280.124,106.914l-92.059-6.598L140.057,4.441l-48.55,95.874L0,106.914l61.282,74.015
		l-17.519,94.754l96.294-43.614l96.294,43.606l-17.799-94.754C218.553,180.919,280.124,106.914,280.124,106.914z'
				/>
				<polygon
					points='236.352,275.683 218.553,180.92 280.071,106.975 280.071,106.905 188.065,100.315 
		140.057,4.441 140.057,232.068 	'
				/>
			</g>
		</svg>
	);
};

const mapSpecialToText = (special?: SpecialTile) => {
	let text = "";

	switch (special) {
		case SpecialTile.x2letter:
			text = "2x kirjain";
			break;
		case SpecialTile.x3letter:
			text = "3x kirjain";
			break;
		case SpecialTile.x2word:
			text = "2x sana";
			break;
		case SpecialTile.x3word:
			text = "3x sana";
			break;
		default:
			text = "";
			break;
	}

	if (text) {
		return <div className='instruction'>{text}</div>;
	}
};

export enum LetterState {
	Invalid = "invalid",
	Focused = "focused",
	Locked = "valid",
}

interface TileProps {
	tile?: IBoardTile;
	direction: WriteDirection;
	focusedCallback?: (coordinates: ITileCoordinates) => void;
	blurredCallback?: (coordinates: ITileCoordinates) => void;
	changedCallback?: (coordinates: ITileCoordinates, value: string | undefined) => void;
	moveFocus?: (coordinates: ITileCoordinates, direction: ITileCoordinates) => void;
}

export const Tile = forwardRef<HTMLInputElement, TileProps>((props: TileProps, ref: ForwardedRef<HTMLInputElement>) => {
	const { special, coordinates, tile } = props.tile || {};
	const { letter, focused, locked, invalid } = tile || {};

	const onTileFocused = (event: FocusEvent<HTMLInputElement>) => {
		event.currentTarget.setSelectionRange(event.currentTarget.value.length, event.currentTarget.value.length);

		if (props.focusedCallback && coordinates) {
			props.focusedCallback(coordinates);
		}
	};

	const onTileBlurred = () => {
		if (props.blurredCallback && coordinates) {
			props.blurredCallback(coordinates);
		}
	};

	const onTileChanged = (event: ChangeEvent<HTMLInputElement>) => {
		if (props.changedCallback && coordinates) {
			let value = event.target.value;

			if (value.length > 1) {
				value = value[value.length - 1];
			}

			props.changedCallback(coordinates, value);
		}
	};

	const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		const keyCode = event.code;
		let shouldPreventDefault = false;

		if (keyCode === "Backspace" && !letter) {
			if (props.moveFocus && coordinates) {
				const direction = props.direction;
				const moveDirection = { column: 0, row: 0 };

				if (direction === WriteDirection.Right) {
					moveDirection.column = -1;
				} else if (direction === WriteDirection.Down) {
					moveDirection.row = -1;
				}
				props.moveFocus(coordinates, moveDirection);
			}
		}
		if (keyCode === "ArrowUp") {
			if (props.moveFocus && coordinates) {
				shouldPreventDefault = true;
				props.moveFocus(coordinates, { column: 0, row: -1 });
			}
		}
		if (keyCode === "ArrowRight") {
			if (props.moveFocus && coordinates) {
				shouldPreventDefault = true;
				props.moveFocus(coordinates, { column: 1, row: 0 });
			}
		}
		if (keyCode === "ArrowLeft") {
			if (props.moveFocus && coordinates) {
				shouldPreventDefault = true;
				props.moveFocus(coordinates, { column: -1, row: 0 });
			}
		}
		if (keyCode === "ArrowDown") {
			if (props.moveFocus && coordinates) {
				shouldPreventDefault = true;
				props.moveFocus(coordinates, { column: 0, row: 1 });
			}
		}

		if (shouldPreventDefault) {
			event.preventDefault();
		}
	};

	const isEmpty = !letter;

	return (
		<span className={classNames("tile", special, { focused, locked, invalid, "has-letter": !isEmpty })}>
			{special && <div className='rotated-box'></div>}
			{special === SpecialTile.start && <Star />}
			{mapSpecialToText(special)}
			<input
				type={"text"}
				ref={ref}
				onKeyDown={onKeyDown}
				onFocus={onTileFocused}
				onBlur={onTileBlurred}
				onChange={onTileChanged}
				disabled={locked}
				className={classNames("letter", { focused, locked, invalid, "has-letter": !isEmpty })}
				value={letter || ""}
			/>
		</span>
	);
});
