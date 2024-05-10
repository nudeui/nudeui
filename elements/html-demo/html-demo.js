let styleURL = new URL("./html-demo.css", import.meta.url);

let Prism = globalThis.Prism;
if (!Prism) {
	await import("https://prismjs.com/prism.js");
}
Prism = globalThis.Prism;

if (!Prism.plugins.NormalizeWhitespace) {
	await import("https://prismjs.com/plugins/normalize-whitespace/prism-normalize-whitespace.min.js");
}

let self = class HTMLDemoElement extends HTMLElement {
	#el = {};
	#slots = {};
	adjust = {};
	#observer = new MutationObserver((mutations) => {
		this.#assignSlots();
		this.#render();
	});
	#dummy = document.createElement("div");

	constructor () {
		super();
		this.attachShadow({
			mode: "open",
			slotAssignment: "manual"
		});

		// TODO CodePen
		// https://assets.codepen.io/t-1/codepen-logo.svg

		this.shadowRoot.innerHTML = `
			<style>@import url("${ styleURL }")</style>
			<div id="toolbar">
				<div id="adjusters"></div>
				<slot name="toolbar"></slot>
			</div>
			<slot name="demo" data-default></slot>
			<slot name="code" data-assign="pre"></slot>
		`;

		for (let slot of this.shadowRoot.querySelectorAll("slot")) {
			this.#slots[slot.name] = slot;

			if (!slot.name || slot.dataset.default !== undefined) {
				this.#slots.default = slot;
			}
		}

		for (let el of this.shadowRoot.querySelectorAll("[id]")) {
			this.#el[el.id] = el;
		}
	}

	connectedCallback () {
		this.#assignSlots();
		this.#render();

		this.#observe();
	}

	#observe () {
		this.#observer.observe(this, { childList: true });
	}

	#unoobserve () {
		this.#observer.disconnect();
	}

	disconnectedCallback () {
		this.#unoobserve();
	}

	#assignSlots () {
		let children = this.childNodes;
		let slotElements = Object.values(this.#slots);
		let assignments = new WeakMap();

		// Assign to slots
		for (let child of children) {
			let assignedSlot;

			if (child.slot) {
				// Explicit slot
				assignedSlot = this.#slots[child.slot];
			}
			else if (child.matches) {
				assignedSlot = slotElements.find(slot => child.matches(slot.dataset.assign));
			}

			assignedSlot ??= this.#slots.default;
			let all = assignments.get(assignedSlot) ?? new Set();
			all.add(child);
			assignments.set(assignedSlot, all);
		}

		for (let slot of slotElements) {
			let all = assignments.get(slot) ?? new Set();
			slot.assign(...all);
		}
	}

	#render () {
		if (this.children.length === 0) {
			return;
		}

		this.#unoobserve(); // avoid mutation cycles

		this.#el.codeElements = [...this.#slots.code.assignedNodes()];
		this.#el.demoNodes = [...this.#slots.demo.assignedNodes()];

		// Once source is determined mutations can't change it
		this.source ??= this.getAttribute("source") ?? (this.#el.codeElements.length > 0 ? "code" : "content");
		this.isolate = this.hasAttribute("isolate");

		if (this.source == "code") {
			// Code-first
			let previousCode = this.code;

			// TODO handle non-markup code
			this.code = this.#el.codeElements.map(code => code.textContent).join("\n");

			if (previousCode === this.code) {
				return;
			}

			// TODO handle scripts

			if (this.isolate) {
				// Remove past demo nodes
				this.#el.demoNodes.forEach(node => node.remove());
				this.#slots.demo.assign();
				this.#slots.demo.innerHTML = this.code;
				runScripts(this.#slots.demo.children);
			}
			else {
				this.#dummy.innerHTML = this.code;
				let nodes = [...this.#dummy.childNodes]
				this.append(...nodes);
				this.#slots.demo.assign(...nodes);
				runScripts(nodes);
			}
		}
		else {
			// Get code from content
			this.code = this.#el.demoNodes.map(el => el.outerHTML ?? el.textContent).join("");

			// TODO Clean up markup
			let pre = document.createElement("pre");
			let code = document.createElement("code");
			pre.classList.add("language-html", "html-demo-code");
			code.textContent = this.code;
			pre.append(code);

			this.append(pre);
			this.#slots.code.assign(pre);

			if (this.isolate) {
				// Move demo nodes to shadow root
				let fragment = document.createDocumentFragment();
				fragment.append(...this.#el.demoNodes);
				this.#slots.demo.replaceChildren(...fragment.childNodes);
			}
		}

		Prism.highlightAllUnder(this);

		// Render adjusters
		this.#el.adjusters.innerHTML = "";

		if (this.hasAttribute("adjust")) {
			let adjusters = this.getAttribute("adjust").split(/\s+/);
			for (let adjuster of adjusters) {
				this.#renderAdjuster(adjuster);
			}
		}

		this.#observe();
	}

	#renderAdjuster (adjuster) {
		let template = self.adjusterTemplates[adjuster]?.call(this);

		if (!template) {
			return null;
		}

		let container = appendHTML(this.#el.adjusters, template);
		let formControl = container.querySelector(".main-adjuster, input, select, textarea");
		formControl.addEventListener("input", e => {
			let value = Number(formControl.value);
			this.adjust[adjuster] = value;
			this.#slots.demo.style.setProperty("--adjust-" + adjuster, value);
		});

		return container;
	}

	/**
	 * Wrap one or more elements with <html-demo>
	 * Assumes elements are siblings
	 * @param  {...any} elements
	 * @returns
	 */
	static wrap (...elements) {
		let wrapper = document.createElement("html-demo");
		elements[0].replaceWith(wrapper);
		wrapper.append(...elements);
		return wrapper;
	}

	/**
	 * Wrap <pre> elements under a given container
	 * @param {object} options
	 * @param {Node} [options.container=document]
	 * @param {string[]} [options.languages=["html", "markup"]
	 * @param {string} [options.ignore=".no-html-demo, #installation"]
	 */
	static wrapAll ({
		container = document,
		languages = ["html", "markup"],
		ignore = ".no-html-demo, #installation",
		selector = "",
	} = {}) {
		let languageSelector = languages.flatMap(id => `.language-${ id }, .language-${ id } *`).join(", ");
		let ignoreSelector = `html-demo *, :is(${ignore}) *`;

		// TODO wrap adjacent <pre> elements together
		// TODO handle CSS and JS
		let elements = container.querySelectorAll(`pre:has(> code:is(${ languageSelector }):not(${ ignoreSelector }))`);
		elements = Array.from(elements, pre => this.wrap(pre));
		return elements;
	}

	static adjusterTemplates = {
		"font-size": function() {
			return `
			<label class="font-size adjuster">
				<small class="small">A</small>
				<input type="range" min="0" max="1" step=".01" value="${ this.adjust["font-size"] ?? "0.5"}" aria-label="Adjust font size" />
				<strong class="big">A</strong>
			</label>`;
		}
	};
}

function appendHTML (container, html) {
	container.insertAdjacentHTML("beforeend", html);
	return container.children[container.children.length - 1];
}

/**
 * Execute any inline <scripts> in an array of nodes
 * @param {Array<Node>} nodes
 */
function runScripts (nodes) {
	for (let node of nodes) {
		if (node.matches?.("script")) {
			const clone = document.createElement("script");
			node.getAttributeNames().forEach(name => clone.setAttribute(name, node.getAttribute(name)));
			clone.append(node.innerHTML);
			node.replaceWith(clone);
		}
	}
}

customElements.define("html-demo", self);

export default self;