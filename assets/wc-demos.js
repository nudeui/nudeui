export default function renderDemos(container = document) {
	for (let code of container.querySelectorAll("pre > code.language-html, pre.language-html > code")) {
		let pre = code.parentNode;

		if (!pre.previousElementSibling.matches(".demo")) {
			code.parentNode.insertAdjacentHTML("beforebegin", `<p class="demo">${code.textContent}</p>`);
		}
	}
}