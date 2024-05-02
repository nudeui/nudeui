
import {
	interceptPropertyWrites,
	flushMutationObserver,
} from "./util.js";
import Recipe from "./Recipe.js";

let self = class Observer {
	constructor (element, recipes) {
		this.element = element;
		this.recipes = recipes.map(property => new Recipe(property));
		this.recipe = new Recipe(...this.recipes);
	}

	observe (fn) {
		if (this.callback) {
			this.unobserve();
		}

		this.callback = fn;

		if (this.recipe.mutation) {
			this.mutationObserver ??= new MutationObserver(records => this.changed({type: "mutation", records}));
			this.mutationObserver.observe(this.element, this.recipe.mutation);
		}

		if (this.recipe.parentMutation) {
			let parent = this.element.parentElement;
			this.parentMutationObserver ??= new MutationObserver(records => {
				if (parent !== this.element.parentElement) {
					// Parent changed

				}
				this.changed({type: "mutation", records});
			});
			this.parentMutationObserver.observe(parent, this.recipe.parentMutation);
		}

		if (this.recipe.events) {
			for (let event of this.recipe.events) {
				this.element.addEventListener(event, this.changed);
			}
		}

		if (this.recipe.resize) {
			this.resizeObserver ??= new ResizeObserver(entries => this.changed({type: "resize", entries}));
			this.resizeObserver.observe(this.element);
		}

		// Observe direct property writes
		this.descriptors = this.recipe.properties.map(property =>
			interceptPropertyWrites(
				this.element,
				property,
				(value, oldValue) => this.changed({type: "set", property, value, oldValue}),
			)
		);
	}

	unobserve () {
		flushMutationObserver(this.mutationObserver, records => this.changed({type: "mutation", records}));
		flushMutationObserver(this.parentMutationObserver, records => this.changed({type: "mutation", records}));

		this.resizeObserver?.disconnect();

		if (this.recipe.events) {
			for (let event of this.recipe.events) {
				this.element.removeEventListener(event, this.changed);
			}
		}

		if (this.descriptors?.length) {
			for (let {property, oldDescriptor} of this.descriptors) {
				uninterceptPropertyWrites(this.element, property, oldDescriptor);
			}
		}
	}

	changed (change) {
		this.callback?.(change);
	}
}

export default self;