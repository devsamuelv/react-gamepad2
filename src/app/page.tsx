"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function Home() {
	const gamepadsRef = useRef<(Gamepad | null)[]>();
	const listenersRef = useRef<{ [id: number]: () => void }>();
	const lastButtonInput = useRef<readonly GamepadButton[]>();

	const loop = () => {
		if (navigator != null && navigator.getGamepads() != null) {
			gamepadsRef.current = navigator.getGamepads();

			const gamepad0 = navigator.getGamepads()[0];
			const listener = listenersRef.current;

			if (listener != null && gamepad0 != null) {
				gamepad0.buttons.forEach(({ pressed }, i) => {
					const fn = listener[i];

					/**
					 * TASK: Make a call back run once.
					 */
					if (pressed && fn != null) {
						fn();
					}
				});

				lastButtonInput.current = gamepad0.buttons;
			}
		}
		requestAnimationFrame(loop);
	};

	const addListener = (id: number, call: () => void) => {
		var currentListeners = { ...listenersRef.current };

		currentListeners[id] = call;
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
