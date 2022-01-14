const iframe = document.createElement("iframe");
iframe.src = "http://localhost:3000/bridge.html";
iframe.style.cssText = `width:0;height:0;display:none;`;
document.body.appendChild(iframe);

window.open("http://localhost:3000?controller=true", "", "popup");

const fireKeyboardEvent = (keyCode) => {
	const e = document.createEvent('Events');
	e.initEvent('keydown', true, true);
	e.bubbles = true;
	e.keyCode = keyCode;
	e.which = keyCode;
	document.body.dispatchEvent(e);
};

const indicator = document.body.appendChild(document.createElement("div"));
indicator.style.cssText = `position: fixed;width:20px;height:20px;border-radius:10px;background:#ccc;border:2px solid #000;`;

window.addEventListener("message", (e) => {
	console.log("top window:", e);
	switch (e.data) {
		case "next":
			duchamp.nextStory();
			break;
		case "prev":
			duchamp.previousStory();
			break;
		case "started":
			indicator.style.background = "#0b9";
			break;
		case "none":
			indicator.style.background = "#ccc";
			break;
	}
});
