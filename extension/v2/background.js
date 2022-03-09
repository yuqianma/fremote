chrome.browserAction.onClicked.addListener((tab) => {
	console.log(tab);
	chrome.desktopCapture.chooseDesktopMedia(
		["tab", "window"],
		(streamId, options) => {
			console.log(streamId, options);
		},
	)
});
