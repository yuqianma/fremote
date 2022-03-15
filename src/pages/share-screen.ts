import Peer from "peerjs";

const bc = new BroadcastChannel("fremote");

export class ScreenSender {
	peer: Peer;
	constructor () {
		const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		this.peer = new Peer(id, {
			host: "peerjs.hci.fun",
			// port: 9000,
			path: "myapp",
			secure: true,
			// debug: 3
		});
		this.peer.on('open', (id) => {
			console.log('My peer ID is: ' + id);
			bc.postMessage("id:" + id);
			this.peer.on("connection", (conn) => {
				console.log(conn);
				this.share(conn.peer);
				conn.on('open', function() {
					// Receive messages
					conn.on('data', function(data) {
						console.log('Received', data);
						if (data === "prev" || data === "next") {
							bc.postMessage(data);
						}
					});
				
					// Send messages
					conn.send('Hello! from sender');
				});
			});
		});
	}

	async share(id: string) {
		let screenStream = await navigator.mediaDevices.getDisplayMedia({
			video: true
		});
		const videoEl = document.getElementById("self-view") as HTMLVideoElement;
		videoEl.srcObject = screenStream;
		videoEl.play();
		this.peer.call(id, screenStream);
	}
}

export class ScreenReceiver {
	peer: Peer;
	connection?: Peer.DataConnection;
	public onStream?: () => void;

	constructor () {
		const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		this.peer = new Peer(id, {
			host: "peerjs.hci.fun",
			// port: 9000,
			path: "myapp",
			secure: true,
			// debug: 3,
		});
		this.peer.on('open', (id) => {
			console.log('My peer ID is: ' + id);

			const targetId = new URLSearchParams(window.location.search).get("target-id") || "";
			console.log("targetId", targetId);

			const conn = this.peer.connect(targetId);
			conn.on("error", console.error);
			conn.on('open', () => {
				this.connection = conn;
				// Receive messages
				conn.on('data', function(data) {
					console.log('Received', data);
				});
			
				// Send messages
				conn.send('Hello! from receiver');
			});
		});

		this.peer.on('call', (call) => {
			call.answer();
			call.on('stream', (stream) => {
				const videoEl = document.getElementById("target-screen") as HTMLVideoElement;
				videoEl.srcObject = stream;
				this.onStream && this.onStream();
			});
		});
	}

	sendCommand(cmd: string) {
		this.connection?.send(cmd);
	}
}
