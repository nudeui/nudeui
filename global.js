// Website scripts

import "https://prismjs.com/prism.js";
import "https://md-block.verou.me/md-block.js";

let observer = new MutationObserver(records => {
	for (let m of records) {
		let md = m.target;

		if (md.rendered === "remote") {
			for (let code of md.querySelectorAll("pre.language-html > code")) {
				let pre = code.parentNode;

				if (!pre.previousElementSibling.matches(".demo")) {
					code.parentNode.insertAdjacentHTML("beforebegin", `<p class="demo">${code.textContent}</p>`);
				}
			}

			if (!document.documentElement.matches(".no-home-link")) {
				let h1 = document.querySelector("h1");

				if (h1 && !h1.parentNode.querySelector(".home")) {
					h1.insertAdjacentHTML("beforebegin", `<a href="../index.html" class="home">Nude Forms</a>`);
				}
			}
		}
	}
});

for (let md of document.querySelectorAll("md-block")) {
	observer.observe(md, {attributeFilter: ["rendered"]})
}

