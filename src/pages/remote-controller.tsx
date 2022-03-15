import { useRef, useEffect, useState } from "preact/compat";
import { PeerRemoteController } from "../rtc";

const peerRemoteController = new PeerRemoteController();

export function RemoteController() {
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const roomId = params.get("room-id");
		if (!roomId) {
			throw new Error("No roomId");
		}
		(async () => {
			await peerRemoteController.connect(roomId);
		})();
	}, []);
	return <div>remote-controller<div id="log"></div></div>
}
