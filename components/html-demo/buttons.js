/** @import HTMLDemoElement from "./html-demo.js" */

/**
 * @typedef {object} ToolbarButton
 * @property {string} label Accessible name, also shown as a tooltip
 * @property {string} [icon] Icon name, rendered from `--icon-<icon>`. Defaults to the button name
 * @property {function(this: HTMLDemoElement, MouseEvent): void} action
 * @property {function(this: HTMLDemoElement): boolean} [available] Return `false` to leave the button out of a demo
 */

/** @type {ToolbarButton} */
export const open = {
	label: "Open in new tab",
	action () {
		let url = URL.createObjectURL(new Blob([this.srcdoc], { type: "text/html" }));
		// Same origin, so we can wait for the new tab to load before revoking
		window.open(url)?.addEventListener("load", () => URL.revokeObjectURL(url));
	},
};

/** @type {ToolbarButton} */
export const codepen = {
	label: "Open in CodePen",
	// https://blog.codepen.io/documentation/prefill/
	action () {
		let data = {
			title: document.title,
			// NOTE Page styles and scripts are not carried over, only relative URLs keep working
			head: `<base href="${ document.baseURI }">`,
			html: this.markup,
		};
		let form = Object.assign(document.createElement("form"), {
			method: "POST",
			action: "https://codepen.io/pen/define",
			target: "_blank",
		});
		form.append(Object.assign(document.createElement("input"), {
			type: "hidden",
			name: "data",
			value: JSON.stringify(data),
		}));
		document.body.append(form);
		form.submit();
		form.remove();
	},
};

/** @type {ToolbarButton} */
export const reload = {
	label: "Reload",
	available () {
		return this.isolate === "iframe";
	},
	action () {
		this.shadowRoot.querySelector("iframe").contentWindow.location.reload();
	},
};
