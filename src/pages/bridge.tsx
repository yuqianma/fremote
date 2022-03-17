import { useEffect } from "preact/compat";

// forward broadcast channel to target page window
function bridge() {
	const bc = new BroadcastChannel("fremote");
	bc.addEventListener("message", (event) => {
		const data = { ...event.data, namespace: "fremote" };
		console.log("bridge:", data);
		window.top!.postMessage(data, "*");
	});
}

// Unnecessary to be a component, but it makes things simple.
export function Bridge() {
	useEffect(() => {
		bridge();
	}, []);

	return null;
}
