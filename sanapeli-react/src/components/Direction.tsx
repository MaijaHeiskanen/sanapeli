import { WriteDirection } from "../enums/WriteDirection";

export const Direction = (props: { direction: WriteDirection }) => {
	const direction = props.direction;
	const text = direction === WriteDirection.Down ? "Alas" : "Oikealle";
	return <div className={"direction"}>{text}</div>;
};
