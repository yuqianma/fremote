const Config = { iceServers: [] };

const ApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const TimeOut = 120_000;

class Peer{
	pc: RTCPeerConnection;
	dc?: RTCDataChannel;
	roomId?: string;

	constructor() {
		this.pc = new RTCPeerConnection(Config);
	}

  protected _listenOnDataChannel(dc: RTCDataChannel) {
		dc.onopen = () => {
			console.log('dc.onopen');
		};
		dc.onclose = () => {
			console.log('dc.onclose');
		};
		dc.onmessage = (event) => {
			const logDom = document.getElementById("log");
			if (logDom) {
				logDom.innerHTML += `<div>${event.data}</div>`;
			}
			console.log('dc.onmessage', event);
		};
		dc.onerror = (event) => {
			console.log('dc.onerror', event);
		};
	}
}

export class PeerScreen extends Peer {
	constructor() {
		super();
		this.dc = this.pc.createDataChannel('fremote');
		console.log(this.dc);
		this._listenOnDataChannel(this.dc);
		(window as any)._peer = this;
	}

	async create() {
		const offerDesc = await this.pc.createOffer();
		await this.pc.setLocalDescription(offerDesc);
		console.log('offerDesc', offerDesc);

		const offer = await new Promise((resolve, reject) => {
			this.pc.onicecandidate = (iceEvent) => {
				if (iceEvent.candidate === null) {
					const offer = this.pc.localDescription;
					// console.log("offerDesc === offer", offerDesc.sdp === offer?.sdp);
					resolve(offer);
				}
			};
		});

		const res = await fetch(`${ApiBaseUrl}/api/room`, {
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
				const res = await fetch(`${ApiBaseUrl}/api/room/${roomId}`);
				const { answer } = await res.json();
				if (answer) {
					window.clearTimeout(tid);
					window.clearInterval(iid);
					resolve(answer);
				}
			}, 1000);
		});
	}
}

export class PeerRemoteController extends Peer {
	constructor() {
		super();
		this.pc.ondatachannel = (event) => {
			if (event.channel) {
				const dc = this.dc = event.channel;
				this._listenOnDataChannel(dc);
			}
		};
	}

	async connect(roomId: string) {
		const res = await fetch(`${ApiBaseUrl}/api/room/${roomId}`);
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
					// console.log("answerDesc === answer", answerDesc.sdp === answer?.sdp);
					resolve(answer);
				}
			};
		});

		await fetch(`${ApiBaseUrl}/api/room/${roomId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ answer })
		});
	}
}
