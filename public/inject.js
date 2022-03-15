const baseurl = "http://localhost:3000";

const iframe = document.createElement("iframe");
iframe.src = baseurl + "/bridge.html";
iframe.style.cssText = `z-index:10000;position:fixed;top:0;left:0;width:200px;height:400px;`;
document.body.appendChild(iframe);

window.open(baseurl + "?controller=true", "", "popup");

const fireKeyboardEvent = (keyCode) => {
	const e = document.createEvent('Events');
	e.initEvent('keydown', true, true);
	e.bubbles = true;
	e.keyCode = keyCode;
	e.which = keyCode;
	document.body.dispatchEvent(e);
};

// const indicator = document.body.appendChild(document.createElement("div"));
// indicator.style.cssText = `position: fixed;width:20px;height:20px;border-radius:10px;background:#ccc;border:2px solid #000;`;

window.addEventListener("message", (e) => {
	console.log("top window:", e);
	// if (e.data.startsWith("id:")) {
	// 	const id = e.data.substring(3);
	// 	console.log(id);

	// }
	switch (e.data) {
		case "next":
			duchamp.nextStory();
			break;
		case "prev":
			duchamp.previousStory();
			break;
		// case "started":
		// 	indicator.style.background = "#0b9";
		// 	break;
		// case "none":
		// 	indicator.style.background = "#ccc";
		// 	break;
	}
});
