import { useRef, useEffect, useState } from "preact/compat";
import { ScreenReceiver } from "./share-screen";

export function Client() {
	const [hasStream, setHasStream] = useState(false);
	const [playing, setPlaying] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const sr = useRef<ScreenReceiver>(null);

	useEffect(() => {
		const screenReceiver = new ScreenReceiver();
		screenReceiver.onStream = () => setHasStream(true);
		(sr as any).current = screenReceiver;
	}, []);

	const play = () => {
		videoRef.current!.play();
		setPlaying(true);
	}

	return <>
		F-Remote
		<video ref={videoRef} id="target-screen" style="width:100%;" controls />
		{/* {(hasStream && !playing) && <div onClick={play} style="position:fixed;top:0;left:0;">play</div>} */}
		{!hasStream && "waiting"}
		<div
			class="button"
			onClick={() => sr.current?.sendCommand("prev")}
		>prev</div>
		<div
			class="button"
			onClick={() => sr.current?.sendCommand("next")}
		>next</div>
	</>
}
