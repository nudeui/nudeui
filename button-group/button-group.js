export default class ButtonGroup extends HTMLElement {
	#internals
	#observer

	constructor () {
		super();

		this.attachShadow({ mode: "open" });
		this.shadowRoot.innerHTML = `<style>@import "${new URL("style.css", import.meta.url)}";</style><slot></slot>`;

		this.#internals = this.attachInternals?.();

		if (this.#internals) {
			// https://twitter.com/LeonieWatson/status/1545788775644667904
			this.#internals.role = "region";
		}

		this.addEventListener("click", evt => {
			let previousValue = this.value + "";

			let button = evt.target;

			while (button && button.parentNode !== this) {
				button = button.parentNode;
			}

			if (button) {
				this.#buttonChanged(button);

				if (previousValue !== this.value + "") {
					let evt = new InputEvent("input", {bubbles: true});
					this.dispatchEvent(evt);
				}
			}
		});

		this.#observer = new MutationObserver(mutations => {
			mutations = mutations.filter(m => {
				if (m.target === this) {
					return true;
				}
				else if (m.target.parentNode === this) {
					if (m.type === "childList") {
						return true;
					}
					else if (m.oldValue !== m.target.getAttribute("aria-pressed")) {
						return true;
					}
				}

				return false;
			});

			if (mutations.length > 0) {
				this.#buttonChanged();
			}
		});
	}

	#buttonChanged (button) {
		if (this.multiple) {
			this.#value ||= [];

			if (button) {
				let pressed = button.getAttribute("aria-pressed") === "true";
				let value = getValue(button);

				if (pressed) {
					this.#value = this.#value.filter(v => v !== value);
				}
				else {
					this.#value.push(value);
				}
			}

			this.value = this.#value;
		}
		else {
			this.value = getValue(button ?? this.pressedButton);
		}
	}

	get name () {
		return this.getAttribute("name");
	}

	set name (value) {
		this.setAttribute("name", value);
	}

	get multiple () {
		return this.hasAttribute("multiple");
	}

	set multiple (value) {
		if (value) {
			this.setAttribute("multiple", "");
		}
		else {
			this.removeAttribute("multiple");
		}
	}

	#value;

	get value () {
		return this.#value;
	}

	set value (value) {
		this.#value = value;

		this.#internals?.setFormValue(value);

		for (let button of this.children) {
			if (!button.hasAttribute("type")) {
				button.type = "button";
			}

			let buttonValue = getValue(button);
			let pressed = this.multiple ? this.#value.includes(buttonValue) : this.#value === buttonValue;

			let ariaPressed = pressed.toString();

			if (ariaPressed !== button.getAttribute("aria-pressed")) {
				button.setAttribute("aria-pressed", ariaPressed);
			}
		}
	}

	get pressedButtons () {
		return [...this.querySelectorAll(`:scope > [aria-pressed="true"]`)];
	}

	get pressedButton () {
		return this.pressedButtons.at(-1);
	}

	get labels() {
		return this.#internals?.labels;
	}

	connectedCallback () {
		this.#buttonChanged();

		this.#observer.observe(this, {
			attributeFilter: ["aria-pressed"],
			attributeOldValue: true,
			childList: true,
			subtree: true,
		});
	}

	disconnectedCallback () {
		this.#observer.disconnect();
	}

	static get formAssociated() {
		return true;
	}
}

function getValue(button) {
	if (!button) {
		return null;
	}

	if (button.hasAttribute("value")) {
		return button.value;
	}
	else {
		return button.textContent.trim();
	}
}

customElements.define("button-group", ButtonGroup);
