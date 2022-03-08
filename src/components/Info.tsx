type InfoProps = {
	startAmount: number | undefined;
	currentAmount: number | undefined;
};

export const Info = (props: InfoProps) => {
	const { startAmount, currentAmount } = props;

	return <div className='info'>{`${currentAmount} / ${startAmount} kirjainta pussissa`}</div>;
};
