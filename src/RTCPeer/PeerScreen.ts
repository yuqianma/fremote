import { Peer } from "./Peer";

const TimeOut = 30_000;

export class PeerScreen extends Peer {
	constructor() {
		super();
		this.dc = this.pc.createDataChannel('fremote');
		// console.log(this.dc);
		// this._listenOnDataChannel(this.dc);
		(window as any)._peer = this;
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

		const res = await fetch(`${Peer.ApiBaseUrl}/api/room`, {
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
			}, TimeOut);
			const iid = window.setInterval(async () => {
				const res = await fetch(`${Peer.ApiBaseUrl}/api/room/${roomId}`);
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
			this.dc!.send(JSON.stringify({
				type: 'offer',
				offer,
			}));
		};
		this.dc!.onmessage = (event) => {
			console.log('dc.onmessage', event);
			const { type, answer } = JSON.parse(event.data);
			if (type === 'answer') {
				this.pc.setRemoteDescription(answer);
			}
		};
		const screenStream = await navigator.mediaDevices.getDisplayMedia({
			video: true
		});
		// console.log(screenStream);
		const track = screenStream.getVideoTracks()[0];
		const sender = this.pc.addTrack(track, screenStream);
		// console.log(sender);
		
	}
}
