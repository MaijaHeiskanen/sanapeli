import { ILetterAmounts } from "../helpers/LetterBag";
import { TableHeaderRow } from "./TableHeaderRow";
import { TableRow } from "./TableRow";

type InfoProps = {
	currentAmount: number | null;
	amountOfEachLetter: ILetterAmounts | null;
};

export const Info = (props: InfoProps) => {
	const { currentAmount, amountOfEachLetter } = props;
	const letters = Object.keys(amountOfEachLetter || {});
	const amounts = [];
	const rows = [];

	rows.push(<TableHeaderRow className='header' key={"header"} cells={["Kirjain", "Jäljellä"]} />);

	if (amountOfEachLetter) {
		for (let i = 0, len = letters.length; i < len; i++) {
			const letter = letters[i];
			const amount = amountOfEachLetter[letter].amount;

			rows.push(<TableRow key={letter} cells={[letter, amount]} />);
			amounts.push(amountOfEachLetter[letters[i]].amount);
		}
	}

	return (
		<>
			<h2>Kirjainpussi</h2>
			<div className='info'>
				<div className='letters'>{`${99 - (currentAmount ?? 0)} / ${"99"} kirjainta pussissa`}</div>

				<table className='table letter-amounts'>
					<tbody>{rows}</tbody>
				</table>
			</div>
		</>
	);
};
