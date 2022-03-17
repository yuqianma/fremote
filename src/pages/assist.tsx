import { useEffect } from "preact/compat";
import QRCode from "qrcode";
import { PeerScreen } from "../RTCPeer";

const RemoteControllerBaseUrl = import.meta.env.VITE_REMOTE_CONTROLLER_BASE_URL;

const CreateQR = (text: string) => {
	const canvas = document.getElementById('qr');
	QRCode.toCanvas(canvas, text, function (error: any) {
		if (error) console.error(error)
		console.log('qr success!', text);
	});
};

export function Assist() {
	
	useEffect(() => {

		(async () => {
			const peerScreen = new PeerScreen();
			await peerScreen.create();
			const remoteUrl = `${RemoteControllerBaseUrl}?room-id=${peerScreen.roomId!}`;
			CreateQR(remoteUrl);
			await peerScreen.connect();
			// TODO count down indicator

			await peerScreen.addScreenStream();

		})();
	}, []);
	
	return (<>
		<div>FRemote</div>
		<div><canvas id="qr"></canvas></div>
		Valid in {PeerScreen.ConnectionTimeout / 1000}s
	</>)
}