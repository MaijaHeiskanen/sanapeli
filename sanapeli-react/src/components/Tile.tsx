import classNames from "classnames";
import { SpecialTile } from "./Board";

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

export const Tile = (props: { letter?: string; special?: string }) => {
	return (
		<span className={classNames("tile", props.special)}>
			{props.special && <div className='rotated-box'></div>}
			{props.special === SpecialTile.start && <Star />}
			<span className={classNames("letter")}>{props.letter}</span>
		</span>
	);
};
