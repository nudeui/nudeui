// Website scripts
import "./index.js";
import "https://prismjs.com/prism.js";

function renderDemos() {
	for (let code of document.querySelectorAll("pre > code.language-html, pre.language-html > code")) {
		let pre = code.parentNode;

		if (!pre.previousElementSibling.matches(".demo")) {
			code.parentNode.insertAdjacentHTML("beforebegin", `<p class="demo">${code.textContent}</p>`);
		}
	}

	if (!document.documentElement.matches(".no-home-link")) {
		let h1 = document.querySelector("h1");

		if (h1 && !h1.parentNode.querySelector(".home")) {
			h1.insertAdjacentHTML("beforebegin", `<a href="../index.html" class="home">Nude UI</a>`);
		}
	}
}

renderDemos();