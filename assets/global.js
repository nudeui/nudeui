// Website scripts
import "./index.js";
import "https://prismjs.com/prism.js";
import renderDemos from "./wc-demos.js";

if (!container.documentElement.matches(".no-home-link")) {
	let h1 = document.querySelector("h1");

	if (h1 && !h1.parentNode.querySelector(".home")) {
		h1.insertAdjacentHTML("beforebegin", `<a href="../index.html" class="home">Nude UI</a>`);
	}
}

renderDemos();