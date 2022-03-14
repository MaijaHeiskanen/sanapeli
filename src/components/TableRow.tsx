interface TableRowProps {
	cells: React.ReactNode[];
	className?: string;
}

export const TableRow = (props: TableRowProps) => {
	const { cells } = props;
	return (
		<tr>
			{cells.map((cell, index) => (
				<td key={index}>{cell}</td>
			))}
		</tr>
	);
};
