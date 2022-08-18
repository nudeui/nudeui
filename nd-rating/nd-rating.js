import MeterDiscrete, {internals} from "../meter-discrete/meter-discrete.js";

class NudeRating extends MeterDiscrete {
	constructor () {
		super();

		if (!this.hasAttribute("tabindex")) {
			this.tabIndex = 0;
		}
	}

	get readonly () {
		return this.hasAttribute("readonly");
	}

	get value () {
		return super.value;
	}

	set value (value) {
		let oldValue = super.value;
		super.value = value;

		this[internals].setFormValue(value);
	}

	set readonly (readonly) {
		if (readonly) {
			this.setAttribute("readonly", "");
		}
		else {
			this.removeAttribute("readonly");
		}
	}

	static get observedAttributes() {
		return [...super.observedAttributes, "readonly"];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		super.attributeChangedCallback(name, oldValue, newValue);

		if (name === "readonly" || (!name && !this.readonly)) {
			if (name === "readonly" && newValue !== null) {
				this.#endEditing();
			}
			else {
				this.#startEditing();
			}
		}
	}

	#startEditing () {
		this.addEventListener("mouseenter", this.edit);
		this.addEventListener("focus", this.edit);
	}

	#endEditing () {
		this.removeEventListener("mouseenter", this.edit);
		this.removeEventListener("focus", this.edit);
	}

	edit () {
		// Code adapted from Mavo: https://github.com/mavoweb/mavo/blob/master/src/elements.js#L378
		let {min = 0, max, step} = this;
		let range = max - min;

		step = step ?? (range > 1? 1 : range/100);

		let value = this.value;

		let handlers = {
			mousemove: evt => {
				// Change property as mouse moves
				let {left, width} = this.getBoundingClientRect();
				let offset = evt.offsetX / width;
				let newValue = quantize(min + range * offset, step);

				this.value = newValue;
			},

			mouseleave: evt => {
				// Return to actual value
				this.value = value;

				for (let event in handlers) {
					this.removeEventListener(event, handlers[event]);
				}
			},

			click: evt => {
				// Register change
				value = this.value;

				this.dispatchEvent(new InputEvent("input", { bubbles: true }));
			},

			keydown: evt => {
				// Edit with arrow keys
				if (["ArrowLeft", "ArrowRight"].includes(evt.key)) {
					let increment = step * (evt.key === "ArrowRight"? 1 : -1) * (evt.shiftKey? 10 : 1);
					let newValue = this.value + increment;
					newValue = Math.max(min, Math.min(newValue, max));

					this.value = newValue;

					this.dispatchEvent(new InputEvent("input", { bubbles: true }));

					evt.preventDefault();
				}
			}
		};

		handlers.blur = handlers.mouseleave;

		for (let event in handlers) {
			this.addEventListener(event, handlers[event]);
		}
	}

	get labels() {
		return this[internals]?.labels;
	}

	static formAssociated = true;
}

function quantize (value, step) {
	return Math.round(value / step) * step;
}

customElements.define("nd-rating", NudeRating);