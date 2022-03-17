import { useRef, useEffect, useState } from "preact/compat";
import { PeerRemoteController } from "../RTCPeer";

export function RemoteController(props: { roomId: string }) {
	const { roomId } = props;
	
	useEffect(() => {
		if (!roomId) {
			throw new Error("No roomId");
		}
		(async () => {
			const peerRemoteController = new PeerRemoteController();
			peerRemoteController.pc.ontrack = (event) => {
				console.log(event);
				const video = document.getElementById('screen-mirror') as HTMLVideoElement;
      	video.srcObject = event.streams[0];
				video.play();
			};
			await peerRemoteController.connect(roomId);
		})();
	}, []);

	return (<>
		<div>remote-controller</div>
		<video id="screen-mirror" style="width:100%;" controls />
	</>);
}
