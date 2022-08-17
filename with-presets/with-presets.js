export default class WithPresets extends HTMLElement {
	#observer

	constructor() {
		super();

		this.attachShadow({ mode: "open" });
		this.shadowRoot.innerHTML = `<style>@import "${new URL("style.css", import.meta.url)}";</style><slot></slot>`;

		this.customValue = this.getAttribute("customvalue") ?? "";

		this.addEventListener("input", evt => {
			let value = evt.target.value;

			if (value === "custom" && evt.target === this.select) {
				value = this.customValue ?? "";
			}

			this.value = value;
		});
	}

	isPreset (value) {
		// Is there an option with this value?
		value = value?.replaceAll? value.replaceAll('"', '\\"') : value;
		return !!this.findPreset(value);
	}

	findPreset (value) {
		let options = this.select.options || this.select.children; // might not be a <select>

		return [...options].find(option => option.value === value);
	}

	#value

	get value () {
		return this.#value;
	}

	set value (value) {
		value ??= "";

		if (this.#value && !this.isPreset(this.#value)) {
			// Allow user to toggle between presets and not lose the custom value they entered
			this.customValue = this.#value;
		}

		this.#value = value;

		if (this.input) {
			this.input.value = this.#value;
		}

		if (this.select) {
			this.select.value = this.isPreset(value) ? value : "custom";
		}

		this[(this.isCustom ? 'set' : 'remove') + "Attribute"]("custom", "");
	}

	get isCustom () {
		return this.select?.value === "custom";
	}

	connectedCallback () {
		this.input = this.querySelector(":scope > input") || this.children[1];
		this.select = this.querySelector(":scope > :not(input)") || this.children[0];

		// Just in case
		customElements.upgrade(this.input);
		customElements.upgrade(this.select);

		if (this.select && !this.findPreset("custom")) {
			// TODO get tag name from first option
			this.select.insertAdjacentHTML("beforeend", `<option value="custom">Custom…</option>`);
		}

		if (this.#value) {
			this.value = this.#value;
		}
		else if (this.input?.value) {
			this.value = this.input.value;
		}
		else if (this.select) {
			this.value = this.select.value;
		}

		this.observer = new MutationObserver(records => {
			// Presets changed. We only need to react in two cases:
			// a) The value was a preset, but the preset is no longer available
			// b) The value was not a preset, but the preset is now available
			let wasPreset = !this.isCustom;
			let isPreset = this.isPreset(this.#value);

			if (isPreset !== wasPreset) {
				this.value = this.#value;
			}
		});

		this.observer.observe(this.select, {
			subtree: true,
			childList: true,
			characterData: true,
			attributeFilter: ["value"]
		});
	}
}

customElements.define("with-presets", WithPresets);