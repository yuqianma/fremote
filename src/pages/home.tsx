
const OneClickHref = `javascript:(() => {
	window.__FREMOTE_BASE_URL__ = "${location.origin}";
	const script = document.createElement("script");
	script.src = "${location.origin}/inject.js";
	document.head.appendChild(script);
})();`.replace(/\n\s+/g, "");

const AddButtonHref = `javascript:(() => {
	window.__FREMOTE_BASE_URL__ = "${location.origin}";
	const btn = document.body.appendChild(document.createElement("button"));
	btn.innerText = "FRemote";
	btn.style.position = "fixed";
	btn.style.top = "0";
	btn.style.right = "0";
	btn.style.zIndex = "9999";
	btn.addEventListener("click", () => {
		const script = document.createElement("script");
		script.src = "${location.origin}/inject.js";
		document.head.appendChild(script);
	});
})();`.replace(/\n\s+/g, "");

export function Home() {
	return (<>
		Drag links to bookmarks
		<p></p>
		<div>
			<div>One click bookmark: <a href={OneClickHref}>FRemote</a></div>
			<div>Add "FRemote" Button bookmark: <a href={AddButtonHref}>Add Fremote Button</a></div>
		</div>
	</>);
}
