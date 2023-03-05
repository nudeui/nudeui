export default class ImageInput extends HTMLElement {
	#internals
	#el = {}
	#inputMethod
	files = []

	constructor () {
		super();

		this.attachShadow({ mode: "open" });


		this.#internals = this.attachInternals?.();

		if (this.#internals) {
			// this.#internals.role = "region";
		}
	}

	connectedCallback () {
		if (this.shadowRoot.childNodes > 0) {
			// Prevent multiple initializations
			return;
		}

		this.shadowRoot.innerHTML = `<style>@import "${new URL("style.css", import.meta.url)}";</style>
		<div id="drop-zone" part="dropzone">
			<input id="url" part="input location"${ this.hasAttribute("autofocus") ? ' autofocus' : "" } />
			<div id="upload-wrapper">
				<input type="file" accept="image/*" />
				<slot name="browse">
					<button part="button browse-button">Browse…</button>
				</slot>
			</div>
			<img id="preview" part="preview" />
		</div>`;

		this.#el.input = this.shadowRoot.querySelector("input[part~=input]");
		this.#el.fileInput = this.shadowRoot.querySelector("input[type=file]");
		this.#el.preview = this.shadowRoot.querySelector("img#preview");
		this.#el.dropZone = this.shadowRoot.querySelector("div#drop-zone");

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

		this.#render();
	}

	#render () {
		if (!this.#inputMethod || this.#inputMethod === "url") {
			if (this.#inputMethod === "url") {
				this.#el.preview.src = this.#el.input.value;
			}

			Object.assign(this.#el.input, {
				type: "url",
				ariaLabel: "URL",
				placeholder: "https://"
			});
		}
		else {
			this.#el.preview.src = URL.createObjectURL(this.files[0]);
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
	}

	get name () {
		return this.getAttribute("name");
	}

	set name (value) {
		this.setAttribute("name", value);
	}

	get noPreview () {
		return this.hasAttribute("nopreview");
	}

	set noPreview (value) {
		if (value) {
			this.setAttribute("nopreview", "");
		}
		else {
			this.removeAttribute("nopreview");
		}
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

	static get formAssociated() {
		return true;
	}
}

customElements.define("img-input", ImageInput);
