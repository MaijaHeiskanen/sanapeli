import { SpecialCell } from "../enums/SpecialCell";

export const mapSpecialCellTypeToText = (special?: SpecialCell) => {
	let text = "";

	switch (special) {
		case SpecialCell.x2letter:
			text = "2x kirjain";
			break;
		case SpecialCell.x3letter:
			text = "3x kirjain";
			break;
		case SpecialCell.x2word:
			text = "2x sana";
			break;
		case SpecialCell.x3word:
			text = "3x sana";
			break;
		default:
			text = "";
			break;
	}

	return text;
};
