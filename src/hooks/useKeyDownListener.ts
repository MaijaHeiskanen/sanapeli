import { useEffect } from "react";

export const useKeyDownListener = (keyDownCallback: (event: KeyboardEvent) => void) => {
	useEffect(() => {
		const callback = (event: KeyboardEvent) => {
			keyDownCallback(event);
		};

		document.addEventListener("keydown", callback);

		const removeListener = () => {
			document.removeEventListener("keydown", callback);
		};

		return removeListener;
	}, [keyDownCallback]);
};
