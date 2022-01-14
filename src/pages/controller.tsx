import { useRef, useEffect, useState } from "preact/compat";
import { GestureRecognition } from "./gesture-recognition";
import { ScreenSender } from "./share-screen";

export function Controller() {
	const [isReady, setIsReady] = useState(false);
	const host = useRef<HTMLDivElement>(null);
	const gr = useRef<GestureRecognition>(null);
	const ss = useRef<ScreenSender>(null);

	useEffect(() => {
		(gr as any).current = new GestureRecognition({
			host: host.current!,
		});
		gr.current?.init().then(() => {
			setIsReady(true);
		});

		(ss as any).current = new ScreenSender();
	}, []);

	return (<div>
		<button
			onClick={() => { gr.current?.detect(); }}
			disabled={!isReady}
		>Capture Gesture</button>
		{!isReady && <progress />}
		<button
			onClick={() => { ss.current?.share() }}
		>Share Screen</button>
		<div ref={host} style={{ width: 640, height: 480 }}></div>
		<video id="self-view" width="640" height="480" style="border:1px solid #000;" />
	</div>);
}
