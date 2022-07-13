document.head.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="${new URL("style.css", import.meta.url)}" />`);

export default class ButtonGroup extends HTMLElement {
	#internals

	constructor () {
		super();

		this.#internals = this.attachInternals?.();

		this.addEventListener("click", evt => {
			let button = evt.target.closest("button");
			if (button) {
				this.value = button.value;
			}
		});

		// TODO mutation observer for aria-pressed on children and new children
	}

	get name () {
		return this.getAttribute("name");
	}

	set name (value) {
		// TODO set names of radios
		this.setAttribute("name", value);
	}

	#value;

	get value () {
		return this.#value;
	}

	set value (value) {
		this.#value = value;

		if (this.getAttribute("value") != value) {
			this.setAttribute("value", value);
		}

		this.#internals?.setFormValue(value);

		if (this.pressedButton?.value != value) {
			for (let button of this.children) {
				button.ariaPressed = button.value === value;
			}
		}
	}

	get pressedButton () {
		return this.querySelector(`button[aria-pressed="true"]`);
	}

	connectedCallback () {
		let value = this.#value;

		for (let button of this.children) {
			if (!button.hasAttribute("type")) {
				button.type = "button";
			}

			if (!button.value) {
				button.value = idify(button.textContent.trim());
			}

			if (value !== undefined) {
				button.ariaPressed = button.value === value;
			}
			else if (button.ariaPressed === "true") {
				value = button.value;
			}
		}

		if (value !== undefined) {
			this.value = value;
		}
	}

	static get observedAttributes () {
		return ["name", "value"];
	}

	attributeChangedCallback (name, oldValue, newValue) {
		if (name === "value") {
			this.value = newValue;
		}
	}

	static get formAssociated() {
		return true;
	}
}

function idify (str) {
	return str.trim().replace(/\s+/g, "-") // Convert whitespace to hyphens
			.toLowerCase();
}

customElements.define("button-group", ButtonGroup);