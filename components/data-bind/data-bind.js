import Observer from "./Observer.js";

const tagName = "data-bind";

let self = class DataBindlement extends HTMLElement {
	_slots = {};

	constructor () {
		super();
	}

	connectedCallback () {
		this.configure();
		// this.update();
	}

	configure () {
		if (this.hasAttribute("source")) {
			this.source = this.getAttribute("source");

			if (["window", "document"].includes(this.source)) {
				this.sourceElement = window[this.source];
			}
			else if (["body", "head"].includes(this.source)) {
				this.sourceElement = document[this.source];
			}
			else {
				let scope = this;
				while (!this.sourceElement && scope) {
					this.sourceElement = scope.querySelector(this.source);
					scope = scope.parentElement;
				}
			}
		}
		else {
			this.sourceElement = this.querySelector(":scope > [data-bind-source]");
		}

		this.destElements = [...this.querySelectorAll(":scope > :not([data-bind-source])")];

		if (!this.sourceElement || this.destElements.length === 0) {
			return;
		}

		let paths = this.destElements
			.filter(element => element.dataset.bind !== null) // Only elements with data-bind attribute
			.map(element => element.dataset.bind ?? "textContent"); // If data-bind is empty, use textContent (or should it be innerHTML?)
		let properties = paths.map(path => path.split(".")[0]);

		this.observer = new Observer(this.sourceElement, properties);

		this.observer.observe(change => {
			this.update(change);
		})
	}

	update ({ force, property } = {}) {
		// debugger;
		// this.destElements.forEach(element => {
		// 	if (!property || element.matches(`[data-bind="${property}"], [data-bind^="${property}."]`)) {
		// 		this.updateElement(element);
		// 	}

		// });
	}

	updateElement (element) {
		if (!element.dataset.bind) {
			return;
		}

		let path = element.dataset.bind.split(".");
		let property = path[0];

		if (element.dataset.bind === property) {
			// Single property
			element.textContent = this.sourceElement[property];
		}
		else if (element.dataset.bind?.startsWith(`${property}.`)) {

			let obj = this.sourceElement;
			let i = 0;

			while (obj !== null && obj !== undefined && i < path.length - 1) {
				obj = obj?.[path[i++]];
			}

			element.textContent = obj[path[i]];
		}
	}

	static observedAttributes = ["source"];

	attributeChangedCallback (name, oldValue, newValue) {
		if (oldValue !== newValue) {
			this[name] = newValue;
		}
	}
}

customElements.define(tagName, self);

export default self;

