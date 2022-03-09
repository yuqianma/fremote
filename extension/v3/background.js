chrome.action.onClicked.addListener((tab) => {
	console.log(tab);
	chrome.desktopCapture.chooseDesktopMedia(
		["tab"], // whatever options
		// !!! crash: omit targetTab
		(streamId, options) => {
			console.log(streamId, options);
		},
	)
});
