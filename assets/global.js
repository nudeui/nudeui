// Website scripts
import "../elements/index.js";
import "https://prismjs.com/prism.js";
import HTMLDemo from "../elements/html-demo/html-demo.js";

if (!document.documentElement.matches(".no-home-link")) {
	let h1 = document.querySelector("h1");

	if (h1 && !h1.parentNode.querySelector(".home")) {
		h1.insertAdjacentHTML("beforebegin", `<a href="../index.html" class="home">Nude UI</a>`);
	}
}

HTMLDemo.wrapAll();