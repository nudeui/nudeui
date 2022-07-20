if (!HTMLSlotElement.prototype.assign) {
	// Include Imperative Slot Assignment polyfill
	await import("https://unpkg.com/dom-slot-assign");
}

export default class CycleToggle extends HTMLElement {
	#internals
	#observer
	#selectedSlot

	constructor () {
		super();

		this.attachShadow({
			mode: "open",
			slotAssignment: "manual",
			delegatesFocus: true,
		});
		this.shadowRoot.innerHTML = `<style>@import "${new URL("style.css", import.meta.url)}";</style><button><slot name="selected"></slot></button>`;
		this.#selectedSlot = this.shadowRoot.querySelector("slot");

		this.#internals = this.attachInternals?.();

		this.addEventListener("click", evt => {
			if (!this.hasAttribute("readonly")) {
				this.cycle();
			}
		});
	}

	get name () {
		return this.getAttribute("name");
	}

	set name (value) {
		this.setAttribute("name", value);
	}

	get readonly () {
		return this.hasAttribute("readonly");
	}

	set readonly (value) {
		if (value) {
			this.setAttribute("readonly", "");
		}
		else {
			this.removeAttribute("readonly");
		}
	}

	#value;

	get value () {
		return this.#value;
	}

	set value (value) {
		value = value + "";
		this.#value = value;

		// TODO should we reject unrecognized values or be lossless?
		this.#internals?.setFormValue(value);

		for (let option of this.children) {
			this.#setSelected(option, getValue(option) === value);
		}
	}

	get selectedOptions () {
		return [...this.querySelectorAll(`:scope > [aria-selected="true"]`)];
	}

	get selectedOption () {
		return this.selectedOptions?.at(-1) || this.firstElementChild;
	}

	get labels() {
		return this.#internals?.labels;
	}

	// Select the next option, or the first if there is no next option.
	cycle () {
		this.#unobserve();
		let selectedOption = this.selectedOption;
		this.#setSelected(this.selectedOption, false);

		let nextOption = selectedOption.nextElementSibling || this.firstElementChild;
		this.#setSelected(nextOption, true);
		this.dispatchEvent(new InputEvent("input"));
		this.#observe();
	}

	#setSelected (option, selected = false) {
		if (!option) {
			return;
		}

		if (selected) {
			if (option.getAttribute("aria-selected") !== "true") {
				option.setAttribute("aria-selected", "true");
			}

			this.#value = getValue(this.selectedOption);
		}
		else {
			option.removeAttribute("aria-selected");

			if (this.#value === getValue(option)) {
				this.#value = getValue(this.selectedOption);
			}
		}

		this.#selectedSlot.assign(this.selectedOption);
	}

	connectedCallback () {
		this.value = getValue(this.selectedOption);

		this.#observe();
	}

	#observe () {
		this.#observer = this.#observer || new MutationObserver(mutations => {
			this.value = getValue(this.selectedOption);
		});

		this.#observer.observe(this, {
			attributeFilter: ["aria-selected", "value"],
			attributeOldValue: true,
			childList: true,
			subtree: true,
		});
	}

	#unobserve() {
		if (this.#observer) {
			this.#observer.takeRecords();
			this.#observer.disconnect();
		}
	}

	disconnectedCallback () {
		this.#unobserve();
	}

	static get formAssociated() {
		return true;
	}
}

function getValue(element) {
	if (!element) {
		return null;
	}

	if (element.hasAttribute("value")) {
		return element.getAttribute("value");
	}
	else {
		return element.textContent.trim();
	}
}

customElements.define("cycle-toggle", CycleToggle);