import { useRef, useEffect, useState } from "preact/compat";
import { GestureRecognition } from "./gesture-recognition";

export function Controller() {
	const [isReady, setIsReady] = useState(false);
	const host = useRef<HTMLDivElement>(null);
	const gr = useRef<GestureRecognition>(null);

	useEffect(() => {
		(gr as any).current = new GestureRecognition({
			host: host.current!,
		});
		gr.current?.init().then(() => {
			setIsReady(true);
		});
	}, []);

	return (<div>
		<button
			onClick={() => { gr.current?.detect(); }}
			disabled={!isReady}
		>Capture Gesture</button>
		{!isReady && <progress />}
		<div ref={host} style={{ width: 640, height: 480 }}></div>
	</div>);
}
