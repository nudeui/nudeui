/**
 * Fallback for engines without advanced attr(): copy the attributes --_value-attr / --_max-attr name
 * into --progress-ring-value / --progress-ring-max. Raw attribute values, exactly what attr() would
 * produce — the math that turns them into a percentage stays in the CSS, as does which attributes to
 * read and what they default to.
 */

const SELECTOR = "progress.ring, .progress-ring";
/** Custom property naming the attribute each value comes from. */
const SOURCES = { value: "--_value-attr", max: "--_max-attr" };

const SUPPORTED = CSS.supports("width", "attr(data-x type(<number>))");
const observer = SUPPORTED ? null : new MutationObserver(records => sync(changed(records)));

if (!SUPPORTED) {
	sync();
	observe();
}

/**
 * Rings affected by a batch of mutations.
 * Any attribute can be the source, so we watch all of them — except style, which is where we write.
 * @param {MutationRecord[]} records
 */
function* changed (records) {
	for (let { type, target, attributeName, addedNodes } of records) {
		if (type === "attributes") {
			if (attributeName !== "style" && target.matches(SELECTOR)) {
				yield target;
			}
		}
		else {
			for (let node of addedNodes) {
				if (node.nodeType === Node.ELEMENT_NODE) {
					if (node.matches(SELECTOR)) {
						yield node;
					}

					yield* node.querySelectorAll(SELECTOR);
				}
			}
		}
	}
}

export function observe (root = document) {
	observer?.observe(root, { subtree: true, childList: true, attributes: true });
}

export function sync (rings = document.querySelectorAll(SELECTOR)) {
	if (SUPPORTED) {
		return;
	}

	for (let ring of rings) {
		let style = getComputedStyle(ring);

		for (let [property, source] of Object.entries(SOURCES)) {
			// Gecko keeps the leading whitespace of a custom property's computed value
			let attribute = style.getPropertyValue(source).trim();
			let value = attribute ? ring.getAttribute(attribute) : null;

			if (value === null || isNaN(value)) {
				value = style.getPropertyValue(`--${property}-default`).trim();
			}

			ring.style.setProperty(`--progress-ring-${property}`, value);
		}
	}
}
