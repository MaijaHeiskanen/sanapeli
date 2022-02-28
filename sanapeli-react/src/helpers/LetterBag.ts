import seedrandom, { PRNG } from "seedrandom";

const letterAmounts: { [key: string]: number } = {
	A: 10,
	B: 1,
	C: 1,
	D: 1,
	E: 8,
	F: 1,
	G: 1,
	H: 2,
	I: 10,
	J: 2,
	K: 5,
	L: 5,
	M: 3,
	N: 9,
	O: 5,
	P: 2,
	R: 2,
	S: 7,
	T: 9,
	U: 4,
	V: 2,
	W: 1,
	Y: 2,
	Ä: 5,
	Ö: 1,
	// jokeri: 2,
};

export class LetterBag {
	letterBag: string[];
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
			const amount = letterAmounts[letter];

			for (let ii = 0; ii < amount; ii++) {
				letterBag.push(letter);
			}
		}

		const shuffledLetterBag: string[] = [];

		for (let i = 0, len = letterBag.length; i < len; i++) {
			shuffledLetterBag.push(letterBag.splice(this.getRndInteger(0, letterBag.length - 1), 1)[0]);
		}

		return shuffledLetterBag;
	}
}
