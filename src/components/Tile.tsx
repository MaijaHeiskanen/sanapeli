import classNames from "classnames";
import React, { ChangeEvent, FocusEvent, ForwardedRef, forwardRef, KeyboardEvent } from "react";
import { ITile } from "../react-app-env";

interface TileProps {
	disabled?: boolean;
	tile?: ITile;
	onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
	onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
	onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export const Tile = forwardRef<HTMLInputElement, TileProps>((props: TileProps, ref: ForwardedRef<HTMLInputElement>) => {
	const { disabled, tile, onFocus, onBlur, onChange, onKeyDown } = props;
	const { letter, played, locked } = tile || {};
	const { char, value } = letter || {};

	const onTileFocused = (event: FocusEvent<HTMLInputElement>) => {
		event.currentTarget.setSelectionRange(event.currentTarget.value.length, event.currentTarget.value.length);

		if (onFocus) {
			onFocus(event);
		}
	};

	const onTileBlurred = (event: FocusEvent<HTMLInputElement>) => {
		if (onBlur) {
			onBlur(event);
		}
	};

	const onTileChanged = (event: ChangeEvent<HTMLInputElement>) => {
		if (onChange) {
			onChange(event);
		}
	};

	const onTileKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (onKeyDown) {
			onKeyDown(event);
		}
	};

	const isEmpty = !letter;

	return (
		<>
			<input
				type={"text"}
				ref={ref}
				onKeyDown={onTileKeyDown}
				onFocus={onTileFocused}
				onBlur={onTileBlurred}
				onChange={onTileChanged}
				disabled={locked || disabled}
				className={classNames("tile", { played, locked, "has-letter": !isEmpty })}
				value={char || ""}
			/>
			{value && <span className='value'>{value}</span>}
		</>
	);
});
