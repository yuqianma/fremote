
export abstract class Peer {

	// static ApiBaseUrl = import.meta.env.VITE_API_BASE_URL + "/api";
	static ApiBaseUrl = location.origin + "/api";

	static RTCConfiguration = { iceServers: [] };

	pc: RTCPeerConnection;
	dc?: RTCDataChannel;
	roomId?: string;

	constructor() {
		this.pc = new RTCPeerConnection(Peer.RTCConfiguration);
		// console.log(this.pc);
	}

	// TODO, ensure data channel is open before sending

	send(type: string, data?: Record<string, any>) {
		this.dc!.send(JSON.stringify({ type, ...data }));
	}

	on(type: string, callback: (data: Record<string, any>) => void) {
		this.dc!.addEventListener("message", (event) => {
			const data = JSON.parse(event.data);
			if (data.type === type) {
				callback(data);
			}
		});
	}

	once(type: string, callback: (data: Record<string, any>) => void) {
		this.dc!.addEventListener("message", (event) => {
			const data = JSON.parse(event.data);
			if (data.type === type) {
				callback(data);
				this.dc!.removeEventListener("message", callback);
			}
		});
	}

	// for debug
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
