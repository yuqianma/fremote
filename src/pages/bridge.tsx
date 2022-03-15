import { useRef, useEffect, useState } from "preact/compat";
import QRCode from "qrcode";
import { PeerScreen } from "../rtc";

const peerScreen = new PeerScreen();

const RemoteControllerBaseUrl = import.meta.env.VITE_REMOTE_CONTROLLER_BASE_URL;

const CreateQR = (text: string) => {
	const canvas = document.getElementById('qr');
	QRCode.toCanvas(canvas, text, function (error: any) {
		if (error) console.error(error)
		console.log('qr success!', text);
	});
};

export function Bridge() {
	// const [loaded, setLoaded] = useState(false);
	const [link, setLink] = useState("");

	useEffect(() => {
		(async () => {
			await peerScreen.create();
			const text = `${RemoteControllerBaseUrl}?page=remote-controller&room-id=${peerScreen.roomId!}`;
			setLink(text);
			CreateQR(text);
			await peerScreen.connect();
		})();
	}, []);
	
	return (<div>
		bridge
		<canvas id="qr"></canvas>
		<a href={link} target="_blank">{link}</a>
	</div>)
}
