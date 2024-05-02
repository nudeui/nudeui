/**
 * Get a property descriptor from an object or its prototype chain.
 * @param {*} object
 * @param {*} key
 * @returns
 */
export function getPropertyDescriptor (object, key) {
	while (object) {
		descriptor = Object.getOwnPropertyDescriptor(object, key);

		if (descriptor) {
			return {object, descriptor};
		}

		object = Object.getPrototypeOf(object);
	}
}

export function interceptPropertyWrites (obj, property, callback) {
	let {descriptor: d, object} = getPropertyDescriptor(obj, property);

	let value = (d && "value" in d) ? d.value : obj[property];

	let descriptor = {
		get: d.get ?? function() {
			return value;
		},
		set (newValue) {
			let oldValue = obj[property];
			if (d?.set) {
				d.set.call(this, newValue);
			}
			else {
				obj[property] = value = newValue;
			}
			callback({ type: "set", property, value, oldValue });
		},
		configurable: true,
		enumerable: d.enumerable ?? true,
	}

	Object.defineProperty(obj, property, descriptor);

	return { descriptor, originalDescriptor: d, inherited: object !== obj };
}

export function uninterceptPropertyWrites (obj, property, descriptor) {
	if (!descriptor.get) {
		// Data property
		let currentValue = obj[property];
		descriptor = {...descriptor, value: currentValue};
	}

	Object.defineProperty(obj, property, descriptor);
}

export function flushMutationObserver (mutationObserver, callback) {
	if (!mutationObserver) {
		return;
	}

	let records = mutationObserver.takeRecords();
	if (records.length > 0) {
		callback(records);
	}
	mutationObserver.disconnect();
}