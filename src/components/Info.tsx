import { ILetterAmounts } from "../helpers/LetterBag";

type InfoProps = {
	startAmount: number | undefined;
	currentAmount: number | undefined;
	amountOfEachLetter: ILetterAmounts | undefined;
};

export const Info = (props: InfoProps) => {
	const { startAmount, currentAmount, amountOfEachLetter } = props;
	const letters = Object.keys(amountOfEachLetter || {});
	const amounts = [];

	if (amountOfEachLetter) {
		for (let i = 0, len = letters.length; i < len; i++) {
			amounts.push(amountOfEachLetter[letters[i]].amount);
		}
	}

	return (
		<>
			<h2>Kirjainpussi</h2>
			<div className='info'>
				<div className='letters'>{`${currentAmount} / ${startAmount} kirjainta pussissa`}</div>
				<div className='letter-amounts'>
					<div className='row'>
						<div className='title'>Kirjain</div>
						{letters.map((letter) => (
							<div key={letter}>{letter}</div>
						))}
					</div>
					<div className='row'>
						<div className='title'>Jäljellä</div>
						{amounts.map((amount, index) => (
							<div key={letters[index]}>{amount}</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
};
