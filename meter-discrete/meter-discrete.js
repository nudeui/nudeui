export default class MeterDiscrete extends HTMLElement {
	#internals

	constructor() {
		super();

		this.attachShadow({ mode: "open" });
		this.shadowRoot.innerHTML = `
		<style>@import "${new URL("style.css", import.meta.url)}";</style>
		<div id=value part=value></div><div id=inactive part="inactive"></div>`;

		this.#internals = this.attachInternals?.();

		if (this.#internals) {
			this.#internals.role = "meter";
			this.#internals.ariaValueMin = this.min;
		}
	}

	get icon () {
		return this.getAttribute("icon") ?? "⭐️";
	}

	// So it can be handled like a <meter>
	get min () {
		return 0;
	}

	get max () {
		return +this.getAttribute("max") || 5;
	}

	set max (max) {
		if (max) {
			this.setAttribute("max", max);
		}
	}

	get value () {
		let value = this.getAttribute("value");

		if (value === null) {
			return null;
		}

		value = +value;

		let step = this.step;

		if (step !== null) {
			// Quantize by step
			value = quantize(value, step);
		}

		return value;
	}

	set value (value) {
		this.setAttribute("value", value);
	}

	get step () {
		return this.hasAttribute("step") ? +this.getAttribute("step") : null;
	}

	get #iconURL () {
		return strLen(this.icon) === 1? emojiToImage(this.icon) : this.icon;
	}

	static get observedAttributes() {
		return ["value", "max", "icon"];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (!name || name === "max") {
			let max = this.max;
			this.style.setProperty("aspect-ratio", `${max} / 1`);
			this.style.setProperty("--max", max);
			this.#internals.ariaValueMax = max;
		}

		if (!name || name === "value") {
			let value = this.value;
			this.style.setProperty("--value", value);
			this.#internals.ariaValueNow = value;
		}

		if (!name || name === "icon") {
			this.style.setProperty("--icon-url", `url('${ this.#iconURL }')`);
		}
	}

	connectedCallback() {
		this.attributeChangedCallback();
	}
}

function emojiToImage(emoji) {
	// For debug: <rect stroke="black" fill="none" stroke-width="2" width="100%" height="100%" />
	return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">`
	+ `<text style="font-size: 80px" x="50%" y=".9em" dominant-baseline="middle" text-anchor="middle">${emoji}</text></svg>`
}

let segmenter = new Intl.Segmenter("en");
function strLen(str) {
	return [...segmenter.segment(str)].length;
}

function quantize (value, step) {
	return Math.round(value / step) * step;
}


customElements.define("meter-discrete", MeterDiscrete);