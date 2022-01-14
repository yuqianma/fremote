import Peer from "peerjs";

const bc = new BroadcastChannel("fremote");

export class ScreenSender {
	peer: Peer;
	constructor () {
		this.peer = new Peer("fremote-sender", {
			host: "2022.hci.fun",
			port: 9000,
			path: "myapp"
		});
		this.peer.on('open', (id) => {
			console.log('My peer ID is: ' + id);
			this.peer.on("connection", (conn) => {
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

	async share() {
		let screenStream = await navigator.mediaDevices.getDisplayMedia({
			video: true
		});
		const videoEl = document.getElementById("self-view") as HTMLVideoElement;
		videoEl.srcObject = screenStream;
		videoEl.play();
		this.peer.call("fremote-receiver", screenStream);
	}
}

export class ScreenReceiver {
	peer: Peer;
	connection?: Peer.DataConnection;
	public onStream?: () => void;

	constructor () {
		this.peer = new Peer("fremote-receiver", {
			host: "2022.hci.fun",
			port: 9000,
			path: "myapp"
		});
		this.peer.on('open', (id) => {
			console.log('My peer ID is: ' + id);

			const conn = this.peer.connect('fremote-sender');
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
