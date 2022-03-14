interface TableHeaderRowProps {
	cells: React.ReactChild[];
	className?: string;
}

export const TableHeaderRow = (props: TableHeaderRowProps) => {
	const { cells, className } = props;
	return (
		<tr className={className}>
			{cells.map((cell, index) => (
				<th key={index}>{cell}</th>
			))}
		</tr>
	);
};
