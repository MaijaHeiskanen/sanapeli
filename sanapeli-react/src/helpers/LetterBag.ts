import seedrandom, { PRNG } from "seedrandom";
import { ILetter } from "../react-app-env";

const letterAmounts: { [key: string]: { amount: number; value: number } } = {
	A: { amount: 10, value: 1 },
	B: { amount: 1, value: 8 },
	C: { amount: 1, value: 10 },
	D: { amount: 1, value: 7 },
	E: { amount: 8, value: 1 },
	F: { amount: 1, value: 8 },
	G: { amount: 1, value: 7 },
	H: { amount: 2, value: 4 },
	I: { amount: 10, value: 1 },
	J: { amount: 2, value: 4 },
	K: { amount: 5, value: 2 },
	L: { amount: 5, value: 2 },
	M: { amount: 3, value: 3 },
	N: { amount: 9, value: 1 },
	O: { amount: 5, value: 2 },
	P: { amount: 2, value: 4 },
	R: { amount: 2, value: 4 },
	S: { amount: 7, value: 1 },
	T: { amount: 9, value: 1 },
	U: { amount: 4, value: 3 },
	V: { amount: 2, value: 4 },
	W: { amount: 1, value: 8 },
	Y: { amount: 2, value: 4 },
	Ä: { amount: 5, value: 2 },
	Ö: { amount: 1, value: 7 },
	// jokeri: 2,
};

export class LetterBag {
	letterBag: ILetter[];
	random: PRNG;

	constructor(seed?: string) {
		this.random = seedrandom(seed);
		this.letterBag = this.createBag();
	}

	private getRndInteger(min: number, max: number) {
		return Math.floor(this.random() * (max - min + 1)) + min;
	}

	private createBag() {
		const letterBag = [];
		const letters = Object.keys(letterAmounts);

		for (let i = 0, len = letters.length; i < len; i++) {
			const letter = letters[i];
			const { amount, value } = letterAmounts[letter];

			for (let ii = 0; ii < amount; ii++) {
				letterBag.push({ char: letter, value });
			}
		}

		const shuffledLetterBag: ILetter[] = [];

		for (let i = 0, len = letterBag.length; i < len; i++) {
			shuffledLetterBag.push(letterBag.splice(this.getRndInteger(0, letterBag.length - 1), 1)[0]);
		}

		return shuffledLetterBag;
	}

	public getLetters() {
		return this.letterBag.slice();
	}

	public getNextLetter() {
		if (this.letterBag.length < 1) {
			return null;
		}

		return this.letterBag.splice(0, 1)[0];
	}
}
