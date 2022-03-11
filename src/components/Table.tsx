interface TableProps<T> {
	data: T[];
}

export const Table = <T extends unknown>(props: TableProps<T>) => {};
