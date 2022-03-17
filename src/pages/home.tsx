
const Href = `javascript:(() => {
	window.__FREMOTE_BASE_URL__ = '${location.origin}';
	const script = document.createElement("script");
	script.src = "${location.origin}/inject.js";
	document.head.appendChild(script);
})();`.replace(/\s/g, "");

export function Home() {
	return (<div>
		Drag this link to bookmarks: 
		<a href={Href}>FRemote</a>
	</div>);
}
