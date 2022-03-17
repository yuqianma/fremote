import { Peer } from "./Peer";

export class PeerRemoteController extends Peer {
	constructor() {
		super();
		this.pc.ondatachannel = (event) => {
			if (event.channel) {
				const dc = this.dc = event.channel;

				this.once("$offer", async ({ offer }) => {
					await this.pc.setRemoteDescription(offer);
					const answerDesc = await this.pc.createAnswer();
					// console.log('answerDesc', answerDesc);
					await this.pc.setLocalDescription(answerDesc);
					const answer = this.pc.localDescription;

					this.send("$answer", { answer });
				});
			}
		};
		(window as any)._peer = this;
	}

	async connect(roomId: string) {
		const res = await fetch(`${Peer.ApiBaseUrl}/room/${roomId}`);
		const { offer } = await res.json();
		// console.log('offer', offer);
		await this.pc.setRemoteDescription(offer);
		const answerDesc = await this.pc.createAnswer();
		// console.log('answerDesc', answerDesc);
		await this.pc.setLocalDescription(answerDesc);

		const answer = await new Promise((resolve, reject) => {
			this.pc.onicecandidate = (iceEvent) => {
				if (iceEvent.candidate === null) {
					const answer = this.pc.localDescription;
					resolve(answer);
				}
			};
		});

		await fetch(`${Peer.ApiBaseUrl}/room/${roomId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ answer })
		});
	}
}
