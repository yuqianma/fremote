import { useRef, useEffect, useCallback } from "preact/compat";
import { PeerRemoteController } from "../RTCPeer";

export function RemoteController(props: { roomId: string }) {
	const { roomId } = props;

	const peerRemoteControllerRef = useRef<PeerRemoteController>(null);
	
	useEffect(() => {
		if (!roomId) {
			throw new Error("No roomId");
		}
		(async () => {
			const peerRemoteController = new PeerRemoteController();
			peerRemoteController.pc.ontrack = (event) => {
				// console.log(event);
				const video = document.getElementById('screen-mirror') as HTMLVideoElement;
      	video.srcObject = event.streams[0];
				video.play();
			};
			await peerRemoteController.connect(roomId);
			(peerRemoteControllerRef as any).current = peerRemoteController;
		})();
	}, []);

	const onPrev = useCallback(() => {
		const peerRemoteController = peerRemoteControllerRef.current!;
		peerRemoteController.send("prev");
	}, []);

	const onNext = useCallback(() => {
		const peerRemoteController = peerRemoteControllerRef.current!;
		peerRemoteController.send("next");
	}, []);

	const onFullscreen = useCallback(() => {
		const peerRemoteController = peerRemoteControllerRef.current!;
		peerRemoteController.send("fullscreen");
	}, []);

	return (<>
		{/* <div>remote-controller</div> */}
		<video id="screen-mirror" style="width:100vw;" controls />
		<div style={{
			display: "flex",
			justifyContent: "space-evenly",
			width: "100vw",
			padding: "1rem"
		}}>
			<span class="button" onClick={onPrev}>←</span>
			<span class="button" onClick={onFullscreen}>📽️</span>
			<span class="button" onClick={onNext}>→</span>
		</div>
	</>);
}
