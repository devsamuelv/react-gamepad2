"use client";

import Image from "next/image";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";

export default function Home() {
	const gamepadsRef = useRef<(Gamepad | null)[]>();
	const listenersRef = useRef<{
		[id: number]: { callback: () => void; isPressed: boolean };
	}>();
	const lastButtonInput = useRef<readonly GamepadButton[]>();

	const loop = () => {
		if (navigator != null && navigator.getGamepads() != null) {
			gamepadsRef.current = navigator.getGamepads();

			const gamepad0 = navigator.getGamepads()[0];
			const listener = listenersRef.current;

			if (listener != null && gamepad0 != null) {
				gamepad0.buttons.forEach(({ pressed, value }, i) => {
					if (listener[i] == undefined) {
						return;
					}

					var { callback, isPressed } = listener[i];

					/**
					 * TASK: Make a call back run once.
					 */
					if (pressed && callback != null && !isPressed) {
						callback();

						listener[i].isPressed = true;
					} else if (value == 0) {
						listener[i].isPressed = false;
					}
				});

				lastButtonInput.current = gamepad0.buttons;
			}
		}
		requestAnimationFrame(loop);
	};

	const addListener = (id: number, call: () => void) => {
		var currentListeners = { ...listenersRef.current };

		currentListeners[id] = { callback: call, isPressed: false };
		listenersRef.current = currentListeners;
	};

	useLayoutEffect(() => {
		addListener(1, () => console.log("Hello"));
	}, []);

	return (
		<main>
			<button onClick={() => loop()}>loop</button>
		</main>
	);
}
