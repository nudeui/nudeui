import properties from "./properties.js";

const self = class ObserveRecipe {
	events = [];
	attributes = [];
	properties = [];
	text = false;
	deep = false;
	children = false;
	size = false;

	/**
	 * @type {Recipe}
	 */
	parent = null;

	constructor (...specs) {
		this.add(...specs);
	}

	add (...recipes) {
		for (let recipe of recipes) {
			if (typeof recipe === "string") {
				recipe = getRecipe(recipe);
			}
console.log(recipe)
			if (recipe.property) {
				this.properties.push(recipe.property);
			}

			if (this.attributes !== true) {
				if (recipe.attributes === true) {
					this.attributes = true;
				}
				else {
					if (recipe.attribute) {
						this.attributes.push(recipe.attribute);
					}

					if (recipe.attributes?.length > 0) {
						this.attributes.push(...recipe.attributes);
					}
				}
			}

			this.text ||= recipe.text;
			this.deep ||= recipe.deep;
			this.children ||= recipe.children;

			let events = recipe.events ?? recipe.event;

			if (events) {
				events = Array.isArray(events) ? events : [events];
			}
			if (recipe.event) {
				this.events.push(recipe.event);
				this.events.push(...events);
			}

			if (recipe.size) {
				this.size ||= recipe.size;
			}

			if (recipe.parent) {
				if (this.parent) {
					this.parent.add(recipe.parent);
				}
				else {
					this.parent = new Recipe(recipe.parent);
				}
			}
		}

		this.mutation = this.#getMutation();
	}

	#getMutation () {
		let mutation = {};

		if (this.children) {
			mutation.childList = true;
		}

		if (this.text) {
			mutation.characterData = true;
		}

		if (this.deep) {
			mutation.subtree = true;
		}

		if (this.attributes === true || this.attributes?.length > 0) {
			mutation.attributes = true;

			if (this.attributes?.length > 0) {
				mutation.attributeFilter = this.attributes;
			}
		}

		return Object.keys(mutation).length === 0 ? null : mutation;
	}
}

function getRecipe (propertyOrAttribute) {
	if (propertyOrAttribute.startsWith("@")) {
		// Only attribute
		return { attribute: propertyOrAttribute.slice(1) };
	}

	let property = propertyOrAttribute.replace(/^\./, "");

	if (properties[property]) {
		return {
			property,
			...properties[property]
		};
	}

	// Search in also fields as well
	for (let key in properties) {
		if (properties[key].also?.includes(property)) {
			return {
				property,
				...properties[key]
			};
		}
	}

	// Still nothing, assume it's an attribute or arbitrary data property
	attribute = property.toLowerCase();

	if (attribute === property) {
		// Property is all-lowercase, if an attribute exists it will be the same
		return { property, attribute };
	}

	// Property is camelCase, there are two possibilities
	// 1. The attribute is all-lowercase
	// 2. The attribute is kebab-case
	return {
		property,
		attributes: [
			attribute,
			property.replace(/[A-Z]/g, "-$&").toLowerCase(),
		]
	}
}

export default self;