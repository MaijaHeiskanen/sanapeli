import React, { forwardRef, ReactNode } from "react";

interface TableHeaderRowProps {
    cells: ReactNode[];
    className?: string;
}

export const TableHeaderRow = forwardRef(
    (
        props: TableHeaderRowProps,
        ref: React.ForwardedRef<HTMLTableRowElement>
    ) => {
        const { cells, className } = props;
        return (
            <tr className={className} ref={ref}>
                {cells.map((cell, index) => (
                    <th key={index}>{cell}</th>
                ))}
            </tr>
        );
    }
);
