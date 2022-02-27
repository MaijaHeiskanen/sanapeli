import React from "react";

type GameAreaProps = {};

export const GameArea = (props: React.PropsWithChildren<GameAreaProps>) => {
	return <div className='gamearea'>{props.children}</div>;
};
