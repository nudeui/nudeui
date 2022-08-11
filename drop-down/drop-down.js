if (!HTMLSlotElement.prototype.assign) {
	// Include Imperative Slot Assignment polyfill
	await import("https://unpkg.com/dom-slot-assign");
}

export default class DropDown extends HTMLElement {
	#internals
	#triggerSlot
	#menuSlot
	#observer
	#resizeObserver
	#menu
	#trigger

	constructor () {
		super();

		this.attachShadow({
			mode: "open",
			slotAssignment: "manual",
			delegatesFocus: true,
		});
		this.shadowRoot.innerHTML = `
		<style>@import "${new URL("style.css", import.meta.url)}";</style>
		<div id="trigger-container">
			<slot name="trigger"></slot>
		</div>
		<slot name="menu"></slot>
		`;
		this.#triggerSlot = this.shadowRoot.querySelector("slot[name=trigger]");
		this.#menuSlot = this.shadowRoot.querySelector("slot[name=menu]");
		this.#trigger = this.shadowRoot.querySelector("#trigger");

		this.#childrenChanged();

		// this.#internals = this.attachInternals?.();

		this.#observe();

		this.addEventListener("click", evt => this.#handleEvent(evt));
		this.addEventListener("input", evt => this.#handleEvent(evt));
		this.addEventListener("focusin", evt => this.#handleEvent(evt));
		this.addEventListener("focusout", evt => this.#handleEvent(evt));
	}

	get labels() {
		return this.#internals?.labels;
	}

	#handleEvent (evt) {
		if (evt.type === "input") {
			if (evt.target === this.#menu) {
				this.#trigger.removeAttribute("aria-pressed");
				let item = evt.target.selectedOptions[0];
				let value = evt.target.value;

				this.dispatchEvent(new CustomEvent("dropdownselect", {
					bubbles: true,
					detail: { item, value }
				}));

				// Dispatch individual click event to selected option
				item.dispatchEvent(new MouseEvent("click"));

				// Reset selected option
				this.#menu.options[0].selected = true;

				// Stop input event from propagating further
				evt.stopPropagation();
			}
		}
		else if (evt.type === "click") {
			if (evt.target === this.#menu) {
				this.#trigger.setAttribute("aria-pressed", "true");
				this.ownerDocument.addEventListener("click", evt => this.#handleEvent(evt), {once: true});
			}
			if (!this.contains(evt.target)) {
				this.#trigger.removeAttribute("aria-pressed");
			}
		}
		else if (evt.type === "focusin") {

		}
		else if (evt.type === "focusout") {
			if (evt.target === this.#menu) {
				this.#trigger.removeAttribute("aria-pressed");
			}
		}
	}

	#observe () {
		this.#observer = this.#observer || new MutationObserver(mutations => {
			// An element can't be in both slots at once, so once the <select> is assigned
			// to the select slot, it will be removed from the trigger slot
			this.#childrenChanged();
		});

		this.#observer.observe(this, {
			childList: true,
		});
	}

	#childrenChanged () {
		let select = this.querySelectorAll(":scope > select")[0];
		let trigger = this.querySelectorAll(":scope > :not(select)")[0];
		this.#triggerSlot.assign(trigger);
		this.#menuSlot.assign(select);

		this.#trigger = trigger;
		this.#menu = select;

		let label = this.#menu.ariaLabel || "Select:";
		this.#menu.insertAdjacentHTML("afterbegin", `<option style="opacity: .5" disabled selected>${label}</option>`);
		this.#menu.size = 0; // make sure it has a popup
		this.#menu.multiple = false;

		this.#trigger.ariaHasPopup = "true";

		// Observe trigger size so we can set <select> size appropriately
		this.#resizeObserver = this.#resizeObserver || new ResizeObserver(entries => {
			for (let entry of entries) {
				this.style.setProperty("--trigger-width", `${entry.borderBoxSize.width}px`);
			}
		});

		this.#resizeObserver.observe(this.#trigger);
	}

	// #unobserve() {
	// 	if (this.#observer) {
	// 		this.#observer.takeRecords();
	// 		this.#observer.disconnect();
	// 	}
	// }

	// static get formAssociated() {
	// 	return true;
	// }
}

customElements.define("drop-down", DropDown);