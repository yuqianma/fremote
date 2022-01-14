import { useRef, useEffect, useState } from "preact/compat";
import { ScreenReceiver } from "./share-screen";

export function Client() {
	const [hasStream, setHasStream] = useState(false);
	const [playing, setPlaying] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const sr = new ScreenReceiver();
		sr.onStream = () => setHasStream(true);
	}, []);

	const play = () => {
		videoRef.current!.play();
		setPlaying(true);
	}

	return <>
		<video ref={videoRef} id="target-screen" style="width:100%;" controls />
		{/* {(hasStream && !playing) && <div onClick={play} style="position:fixed;top:0;left:0;width:100px;height:50px;background:#ccc;border-radius:10px;text-align:center;">play</div>} */}
		{!hasStream && "waiting"}
	</>
}
