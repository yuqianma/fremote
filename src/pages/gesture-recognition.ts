const handTrack = (window as any).handTrack;

const Label = {
	Open: "open",
	Closed: "closed",
	Face: "face"
	//
} as const;

type Label = typeof Label[keyof typeof Label];

type Prediction = {
	label: Label;
	bbox: number[];
	center: { x: number, y: number }; // add manually
	//
};

const GestureState = {
	None: "none",
	Started: "started",
} as const;

type GestureState = typeof GestureState[keyof typeof GestureState];

const modelParams = {
  flipHorizontal: true, // flip e.g for video
  maxNumBoxes: 10, // maximum number of boxes to detect
  iouThreshold: 0.5, // ioU threshold for non-max suppression
  scoreThreshold: 0.4, // confidence threshold for predictions.
	// modelSize: "large"
};

const getCenter = (bbox: number[]) => {
	const [x, y, width, height] = bbox;
	return {
		x: x + width / 2,
		y: y + height / 2,
	}
};

const bc = new BroadcastChannel("fremote");

export class GestureRecognition {
	private host?: HTMLElement;
	private videoEl: HTMLVideoElement;
	private canvasEl?: HTMLCanvasElement;
	private context?: CanvasRenderingContext2D;
	private width: number;
	private height: number;
	private model: any;
	private detecting: boolean = false;

	private headPrediction?: Prediction;
	private prevPrediction?: Prediction;
	private _gestureState: GestureState = GestureState.None;

	private get gestureState() {
		return this._gestureState;
	}

	private set gestureState(v: GestureState) {
		console.log("state", v);
		bc.postMessage(v);
		this._gestureState = v;
	}

	constructor({ host, width = 640, height = 480 }: { host: HTMLElement; width?: number; height?: number }) {
		this.videoEl = document.createElement("video");
		this.videoEl.width = width;
		this.videoEl.height = height;
		this.videoEl.style.cssText = `width: ${width}px; height: ${height}px;`;
		this.videoEl.style.display = "none";

		if (host) {
			this.host = host;
			this.canvasEl = document.createElement("canvas");
			this.canvasEl.width = width;
			this.canvasEl.height = height;
			this.context = this.canvasEl.getContext("2d")!;
			this.host.appendChild(this.videoEl);
			this.host.appendChild(this.canvasEl);
		}
		//  else {
		// 	this.host = document.createElement("div");
		// 	this.host.style.cssText = `display: none;`;
		// }

		this.width = width;
		this.height = height;

		this._runDetection = this._runDetection.bind(this);
	}

	async init() {
		this.model = await handTrack.load(modelParams);
		console.log("Loaded Model");
	}

	isReady() {
		return !!this.model;	
	}

	async detect() {
		if (!this.model) {
			throw new Error("waiting for model loaded");
		}
		if (this.detecting) {
			console.error("running");
			return;
		}
		const status = await handTrack.startVideo(this.videoEl);
		if (!status) {
			throw new Error("no video");
		}
		this.detecting = true;
		this._runDetection();
	}

	private async _runDetection() {
		let predictions = await this.model.detect(this.videoEl) as Prediction[] | null;
		this._processPoint(predictions);
		if (this.detecting) {
			requestAnimationFrame(this._runDetection);
		}
	}

	private _processPoint(predictions: Prediction[] | null) {
		const prediction = (predictions || []).find(p => p.label !== Label.Face);
		if (prediction) {
			// patch center
			prediction.center = getCenter(prediction.bbox);
		}

		if (this.gestureState === GestureState.Started) {
			this._move(prediction);
		} else {
			if (prediction?.label === Label.Open) {
				this._start(prediction);
			}
		}

		if (this.canvasEl) {
			this.model.renderPredictions(prediction ? [prediction] : [], this.canvasEl, this.context, this.videoEl);
			this.context!.fillStyle = this.gestureState === GestureState.None ? "#ccc" : "#0b9";
			this.context?.fillRect(0, 0, 10, 10);
		}
	}

	private _start(prediction: Prediction) {
		if (Math.abs(prediction.center.x / this.width - 0.5) < 0.1) {
			this.gestureState = GestureState.Started;
			this.headPrediction = this.prevPrediction = prediction;
		}
	}

	private _move(prediction?: Prediction) {
		if (this.gestureState !== GestureState.Started) {
			return;
		}
		let lastPrediction = prediction;	
		if (!lastPrediction) {
			lastPrediction = this.prevPrediction;
		}
		const delta = lastPrediction!.center.x - this.headPrediction!.center.x;
		console.log(delta / this.width);
		if (Math.abs(delta / this.width) > 0.07) {
			this._result(delta < 0 ? "prev" : "next");
		}

		if (!prediction) {
			this.headPrediction = this.prevPrediction = undefined;
			this.gestureState = GestureState.None;
		}
	}

	private _result(direction: string) {
		console.warn(direction);
		bc.postMessage(direction);
		this.headPrediction = this.prevPrediction = undefined;
		this.gestureState = GestureState.None;
	}
}

