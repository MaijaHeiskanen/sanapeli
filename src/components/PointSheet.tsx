import { useEffect, useRef } from "react";
import { ITurn } from "../react-app-env";
import { TableHeaderRow } from "./TableHeaderRow";
import { TableRow } from "./TableRow";

interface PointSheetProps {
    turns: ITurn[];
}

export const PointSheet = (props: PointSheetProps) => {
    const summaryRowRef = useRef<HTMLTableRowElement>(null);
    let rowCountRef = useRef(0);
    const { turns } = props;
    let totalPoints = 0;
    let totalWords = 0;
    const rows: JSX.Element[] = [];

    useEffect(() => {
        if (summaryRowRef && rowCountRef.current !== rows.length) {
            summaryRowRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });

            rowCountRef.current = rows.length;
        }
    }, [rows]);

    rows.push(
        <TableHeaderRow
            key={"header"}
            cells={["Vuoro", "Pisteet", "Sanat"]}
            className="header"
        />
    );

    turns.forEach((turn, index) => {
        const { points, playedWords, changingTiles } = turn;

        totalPoints += points;

        const wordLinks = [];
        const word = playedWords[0];

        if (word) {
            if (!changingTiles) {
                totalWords += 1;
            }

            wordLinks.push(
                <span className="word" key={word}>
                    {changingTiles ? (
                        word
                    ) : (
                        <a
                            className="link"
                            target={"_blank"}
                            rel="noreferrer"
                            href={`https://www.kielitoimistonsanakirja.fi/#/${word.toLowerCase()}`}
                        >
                            {word}
                        </a>
                    )}
                </span>,
                ", "
            );
        }

        for (let i = 1, len = playedWords.length; i < len; i++) {
            const word = playedWords[i];

            if (!changingTiles) {
                totalWords += 1;
            }

            if (changingTiles) {
                wordLinks.push(word, ", ");
            } else {
                wordLinks.push(
                    <a
                        key={word}
                        className="word"
                        target={"_blank"}
                        rel="noreferrer"
                        href={`https://www.kielitoimistonsanakirja.fi/#/${word.toLowerCase()}`}
                    >
                        {word}
                    </a>,
                    ", "
                );
            }
        }

        wordLinks.splice(wordLinks.length - 1, 1);

        rows.push(<TableRow key={index} cells={[index, points, wordLinks]} />);
    });

    rows.push(
        <TableHeaderRow
            key={"footer"}
            cells={[
                "Yht.",
                totalPoints,
                `${totalWords} ${totalWords === 1 ? "sana" : "sanaa"}`,
            ]}
            className="footer"
            ref={summaryRowRef}
        />
    );

    return (
        <>
            <h2>Pisteet</h2>
            <table className="table pointsheet">
                <tbody>{rows}</tbody>
            </table>
        </>
    );
};
