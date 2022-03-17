import { Peer } from "./Peer";

export class PeerRemoteController extends Peer {
	constructor() {
		super();
		this.pc.ondatachannel = (event) => {
			if (event.channel) {
				const dc = this.dc = event.channel;
				// this._listenOnDataChannel(dc);

				this.dc.onmessage = async (event) => {
					console.log('dc.onmessage', event);
					const { type, offer } = JSON.parse(event.data);
					await this.pc.setRemoteDescription(offer);
					const answerDesc = await this.pc.createAnswer();
					console.log('answerDesc', answerDesc);
					await this.pc.setLocalDescription(answerDesc);
					const answer = this.pc.localDescription;
					this.dc!.send(JSON.stringify({
						type: 'answer',
						answer,
					}));
				};
			}
		};
		(window as any)._peer = this;
	}

	async connect(roomId: string) {
		const res = await fetch(`${Peer.ApiBaseUrl}/api/room/${roomId}`);
		const { offer } = await res.json();
		console.log('offer', offer);
		await this.pc.setRemoteDescription(offer);
		const answerDesc = await this.pc.createAnswer();
		console.log('answerDesc', answerDesc);
		await this.pc.setLocalDescription(answerDesc);

		const answer = await new Promise((resolve, reject) => {
			this.pc.onicecandidate = (iceEvent) => {
				if (iceEvent.candidate === null) {
					const answer = this.pc.localDescription;
					resolve(answer);
				}
			};
		});

		await fetch(`${Peer.ApiBaseUrl}/api/room/${roomId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ answer })
		});
	}
}
