import words from "./../words.json";

class CheckerClass {
	validWords: Set<string>;

	constructor() {
		this.validWords = new Set(Object.keys(words).map((word) => word.toLocaleLowerCase()));
	}

	public checkWord(word: string) {
		return this.validWords.has(word.toLowerCase());
	}

	public checkLetter(letter: string | undefined): boolean {
		if (!letter) return true;

		if (letter.length > 1) return false;

		return /^[A-Za-z -äö]/.test(letter);
	}
}

export const Checker = new CheckerClass();
