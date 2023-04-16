export default class ImageInput extends HTMLElement {
	#internals
	#el = {}
	#inputMethod
	#previewURL
	files = []
	#initialized = false

	constructor () {
		super();

		this.attachShadow({ mode: "open" });
		this.shadowRoot.innerHTML = `<style>@import "${new URL("style.css", import.meta.url)}";</style>
		<input type="file" accept="image/*" />
		<div id="drop-zone" part="dropzone">
			<slot name="input">
				<input id="url" part="input location"${ this.hasAttribute("autofocus") ? ' autofocus' : "" } />
			</slot>
			<slot name="browse">
				<button part="button browse-button">Browse…</button>
			</slot>
		</div>
		<slot name="preview">
			<img id="preview" part="preview" />
		</slot>`;

		this.#el.input = this.shadowRoot.querySelector("input[part~=input]");
		this.#el.fileInput = this.shadowRoot.querySelector("input[type=file]");
		this.#el.preview = this.shadowRoot.querySelector("img#preview");
		this.#el.previewSlot = this.shadowRoot.querySelector("slot[name=preview]");
		this.#el.dropZone = this.shadowRoot.querySelector("div#drop-zone");
		this.#el.browseButton = this.shadowRoot.querySelector("button[part~=browse-button]");

		this.#internals = this.attachInternals?.();

		if (this.#internals) {
			// this.#internals.role = "region";
		}

		this.attributeChangedCallback();
	}

	connectedCallback () {
		if (this.#initialized) {
			// Prevent multiple initializations
			return;
		}

		this.#el.browseButton.addEventListener("click", () => {
			this.#el.fileInput.click();
		});

		for (event of "drag dragstart dragend dragover dragenter dragleave drop".split(" ")) {
			this.#el.dropZone.addEventListener(event, e => {
				e.preventDefault();
				e.stopPropagation();
			});
		}

		for (event of "dragover dragenter".split(" ")) {
			this.#el.dropZone.addEventListener(event, () => {
				this.#el.dropZone.part.add("dragover");
			});
		}

		for (event of "dragleave dragend drop".split(" ")) {
			this.#el.dropZone.addEventListener(event, () => {
				this.#el.dropZone.part.remove("dragover");
			});
		}

		this.#el.dropZone.addEventListener("drop", e => {
			this.files = [...e.dataTransfer.files];
			this.#inputMethod = "drop";
			this.#render();
		});

		this.#el.fileInput.addEventListener("change", e => {
			this.files = [...e.target.files];
			this.#inputMethod = "browse";
			this.#render();
		});

		this.addEventListener("paste", e => {
			let files = [...e.clipboardData.items].filter(item => item.kind === "file" && /^image\//.test(item.type));

			if (files.length > 0) {
				// Images were pasted
				this.files = files.map(item => item.getAsFile());
				this.#inputMethod = "paste";
				this.#render();
			}
		});

		this.#el.input.addEventListener("input", e => {
			if (this.#inputMethod && this.#inputMethod !== "url") {
				if (/^https?:\/\//.test(this.#el.input.value)) {
					// Back to URL mode, discard the files we have
					this.#inputMethod = "url";
				}
			}

			if (!this.#inputMethod || this.#inputMethod === "url") {
				// User is editing the URL
				if (this.files.length > 0) {
					this.files = [];
				}

				this.#inputMethod = "url";
				this.#render();
			}
		});

		this.#initialized = true;
		this.#render();
	}

	#render () {
		if (!this.#inputMethod || this.#inputMethod === "url") {
			if (this.#inputMethod === "url") {
				this.#previewURL = this.#el.input.value;
			}

			Object.assign(this.#el.input, {
				type: "url",
				ariaLabel: "URL",
				placeholder: "https://"
			});
		}
		else {
			this.#previewURL = URL.createObjectURL(this.files[0]);
			this.#el.input.value = this.files[0].name;

			Object.assign(this.#el.input, {
				type: "",
				ariaLabel: "Filename",
				placeholder: ""
			});

			requestAnimationFrame(() => {
				this.#el.input.select();
			});
		}

		this.#renderPreview();
	}

	#renderPreview () {
		if (this.preview !== "none" && this.#previewURL) {
			this.#el.preview.src = this.#previewURL;
		}
	}

	get name () {
		return this.getAttribute("name");
	}

	set name (value) {
		this.setAttribute("name", value);
	}

	get inputMethod () {
		return this.#inputMethod;
	}

	get preview () {
		return this.getAttribute("preview") || "auto";
	}

	set preview (value) {
		this.setAttribute("preview", value);
	}

	// get multiple () {
	// 	return this.hasAttribute("multiple");
	// }

	// set multiple (value) {
	// 	if (value) {
	// 		this.setAttribute("multiple", "");
	// 	}
	// 	else {
	// 		this.removeAttribute("multiple");
	// 	}
	// }

	get value () {
		return this.#el.value;
	}

	set value (value) {
		this.#el.value = value;

		this.#internals?.setFormValue(value);
	}

	get files () {
		if (this.#inputMethod === "url") {
			return [];
		}
		else {
			let files = [this.files[0]];

			if (this.#el.input.value !== this.files[0].name) {
				// Filename edited
				files[0] = new File([files[0]], this.#el.input.value, files[0]);
			}

			return files;
		}
	}

	get labels() {
		return this.#internals?.labels;
	}

	focus() {
		this.#el.input.focus();
	}

	static get observedAttributes() {
		return ["preview"];
	}

	attributeChangedCallback(name, oldValue) {
		let value = this.getAttribute(name);

		if (oldValue === value) {
			return;
		}

		if (!name || name === "preview") {
			this.#el.preview.style.display = value === "none" ? "none" : "";

			if (value && !["auto", "none"].includes(value)) {
				// Value is a CSS selector
				this.#el.preview = this.ownerDocument.querySelector(value);
			}
			else {
				this.#el.preview = this.#el.previewSlot.assignedElements()[0] // Is an element slotted?
				                   || this.shadowRoot.querySelector("img[part~=preview]"); // get default element
			}

			this.#renderPreview();
		}
	}

	static get formAssociated() {
		return true;
	}
}

customElements.define("img-input", ImageInput);
