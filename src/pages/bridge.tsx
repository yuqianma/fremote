import { useEffect } from "preact/compat";

function bridge() {
	const bc = new BroadcastChannel("fremote");
	bc.addEventListener("message", (event) => {
		const { namespace, type, data } = event.data;
    if (namespace !== "fremote") {
      return;
    }
		console.log("bridge:", event);
		
		window.top!.postMessage(event.data, "*");
	});
}

export function Bridge() {
	useEffect(() => {
		bridge();
	}, []);

	return null;
}
