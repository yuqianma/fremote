import { Peer } from "./Peer";

export class PeerScreen extends Peer {
	
	static ConnectionTimeout = 60_000;

	bc: BroadcastChannel;

	constructor() {
		super();
		this.dc = this.pc.createDataChannel("fremote");
		this.bc = this._createBroadcastChannel();

		// forward data channel message to broadcast channel
		this.dc.addEventListener("message", (event) => {
			const data = JSON.parse(event.data);
			if (data.type[0] !== "$") {
				this.bc.postMessage(data);
			}
		});

		(window as any)._peer = this;
	}

	private _createBroadcastChannel() {
		const bc = new BroadcastChannel("fremote");
		bc.addEventListener("message", (event) => {
			console.log("assist:", event);
		});
		(window as any).bc = bc;
		return bc;
	}

	async create() {
		const offerDesc = await this.pc.createOffer();
		await this.pc.setLocalDescription(offerDesc);

		const offer = await new Promise((resolve, reject) => {
			this.pc.onicecandidate = (iceEvent) => {
				if (iceEvent.candidate === null) {
					const offer = this.pc.localDescription;
					resolve(offer);
				}
			};
		});

		const res = await fetch(`${Peer.ApiBaseUrl}/room`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ offer })
		});
		const { roomId } = await res.json();
		console.log('roomId', roomId);
		this.roomId = roomId;
	}

	async connect() {
		if (!this.roomId) {
			throw new Error("roomId is not set");
		}
		const answer = await this._pullAnswer(this.roomId);
		console.log('answer', answer);
		this.pc.setRemoteDescription(answer);
	}

	private async _pullAnswer(roomId: string): Promise<RTCSessionDescription> {
		return new Promise((resolve, reject) => {
			const tid = window.setTimeout(() => {
				window.clearInterval(iid);
				reject('timeout');
			}, PeerScreen.ConnectionTimeout);
			const iid = window.setInterval(async () => {
				const res = await fetch(`${Peer.ApiBaseUrl}/room/${roomId}`);
				const { answer } = await res.json();
				if (answer) {
					window.clearTimeout(tid);
					window.clearInterval(iid);
					resolve(answer);
				}
			}, 1000);
		});
	}

	async addScreenStream() {
		this.pc.onnegotiationneeded = async () => {
			const offerDesc = await this.pc.createOffer();
			await this.pc.setLocalDescription(offerDesc);
			const offer = this.pc.localDescription;

			this.send("$offer", { offer });
		};
		this.once("$answer", ({ answer }) => {
			this.pc.setRemoteDescription(answer);
		});

		const screenStream = await navigator.mediaDevices.getDisplayMedia({
			video: true
		});
		const track = screenStream.getVideoTracks()[0];
		const sender = this.pc.addTrack(track, screenStream);
	}
}
