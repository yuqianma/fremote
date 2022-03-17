
export abstract class Peer {

	static ApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

	static RTCConfiguration = { iceServers: [] };

	pc: RTCPeerConnection;
	dc?: RTCDataChannel;
	roomId?: string;

	constructor() {
		this.pc = new RTCPeerConnection(Peer.RTCConfiguration);
		// console.log(this.pc);
	}

  protected _listenOnDataChannel(dc: RTCDataChannel) {
		dc.onopen = () => {
			console.log('dc.onopen');
		};
		dc.onclose = () => {
			console.log('dc.onclose');
		};
		dc.onmessage = (event) => {
			console.log('dc.onmessage', event);
		};
		dc.onerror = (event) => {
			console.log('dc.onerror', event);
		};
	}
}
