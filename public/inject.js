const fireKeyboardEvent = (keyCode) => {
	const e = document.createEvent('Events');
	e.initEvent('keydown', true, true);
	e.bubbles = true;
	e.keyCode = keyCode;
	e.which = keyCode;
	document.body.dispatchEvent(e);
};

const handlers = {
  prev: () => fireKeyboardEvent(37),
  next: () => fireKeyboardEvent(39),
};

// patch for duchamp
if (window.duchamp) {
  handlers.prev = () => duchamp.previousStory();
  handlers.next = () => duchamp.nextStory();
}

async function main() {
  const BaseUrl = window.__FREMOTE_BASE_URL__;

  window.addEventListener("message", (event) => {
    // if (event.origin !== BaseUrl) {
    //   return;
    // }
    if (event.data?.namespace !== "fremote") {
      return;
    }
    console.log("[fremote]", event.data);
    const { type } = event.data;
    switch (type) {
      case "prev":
        handlers.prev();
        break;
      case "next":
        handlers.next();
        break;
      case "fullscreen":
        document.documentElement.requestFullscreen();
        break;
      default:
        console.log("Unknown message type:", event);
    }
  });

  const iframe = document.createElement("iframe");
  iframe.src = BaseUrl + "?page=bridge";
  iframe.style.cssText = `display:none;width:0;height:0;`;
  document.body.appendChild(iframe);

  // open a new window at the center of screen
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;

  const width = 300;
  const height = 500;

  const windowObjectReference = window.open(
    BaseUrl + "?page=assist",
    "",
    `left=${(screenWidth - width) / 2},top=${(screenHeight - height) / 2},width=${width},height=${height},popup`
  );
}

main();
