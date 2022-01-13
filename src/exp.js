const video = document.getElementById("camera-video");
const canvas = document.getElementById("detect-canvas");
const context = canvas.getContext("2d");

let isVideo = false;
let model = null;

const modelParams = {
  flipHorizontal: true, // flip e.g for video
  maxNumBoxes: 1, // maximum number of boxes to detect
  iouThreshold: 0.5, // ioU threshold for non-max suppression
  scoreThreshold: 0.6, // confidence threshold for predictions.
};

const getCenter = (bbox) => [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2];

handTrack.load(modelParams).then((lmodel) => {
  // detect objects in the image.
  model = lmodel;
  console.log(model);
  console.log("Loaded Model!");
});

let prevGesture = null;
let panStartPoint = null;

const bc = new BroadcastChannel('test_channel');

function runDetection() {
  model.detect(video).then((predictions) => {
		predictions = predictions?.filter(p => p.label === "open" || p.label === "closed");
		if (predictions?.[0]) {
			// console.log("Predictions: ", predictions[0]);
			if (prevGesture === "closed" && predictions[0].label === "open") {
				panStartPoint = getCenter(predictions[0].bbox);
			}
			if (prevGesture === "open" && predictions[0].label === "closed") {
				const panEndPoint = getCenter(predictions[0].bbox);
				if (panEndPoint[0] - panStartPoint[0] > 100) {
					console.log("-> right");
					bc.postMessage("-> right")
				} else if (panEndPoint[0] - panStartPoint[0] < 100) {
					console.log("<- left");
					bc.postMessage("<- left")
				}
			}
			prevGesture = predictions[0].label;
			model.renderPredictions(predictions, canvas, context, video);
		}
    if (isVideo) {
      requestAnimationFrame(runDetection);
    }
  });
}

window.run = () => {
	handTrack.startVideo(video).then(function (status) {
		console.log("video started", status);
		if (status) {
			isVideo = true;
			runDetection();
		} else {
			console.error("no video");
		}
	});
}
