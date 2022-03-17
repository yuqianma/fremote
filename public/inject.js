function main() {
  const BaseUrl = window.__FREMOTE_BASE_URL__;

  window.addEventListener("message", (event) => {
    // if (event.origin !== BaseUrl) {
    //   return;
    // }
    const { namespace, type, data } = event.data;
    if (namespace !== "fremote") {
      return;
    }
    switch (type) {
      // case "next":
      //   console.log("next");
      //   break;
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
