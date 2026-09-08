let properties = {
	textContent: {
		children: true,
		text: true,
		deep: true,
	},
	innerHTML: {
		children: true,
		text: true,
		deep: true,
		attributes: true,

		also: [
			"outerHTML",
		],
	},
	value: {
		event: "input",

		also: [
			"checked",
			"valueAsNumber",
			"valueAsDate",
		],
	},
	defaultValue: {
		attribute: "value",
		text: true, // for <textarea>
	},
	defaultChecked: {
		attribute: "checked",
	},
	className: {
		attribute: "class",
	},
	classList: {
		attribute: "class",
	},
	offsetWidth: {
		size: true,

		also: [
			"offsetHeight",
			"clientWidth",
			"clientHeight",
		],
	},
	parentNode: {
		parent: {
			children: true,
		},

		also: [
			"parentElement",
			"nextElementSibling",
			"previousElementSibling",
		],
	},
	nextSibling: {
		parent: {
			children: true,
			text: true,
		},

		also: [
			"previousSibling",
		],
	},
	childNodes: {
		children: true,
		text: true,

		also: [
			"firstChild",
			"lastChild",
		],
	},
	children: {
		children: true,

		also: [
			"firstElementChild",
			"lastElementChild",
			"childElementCount",
		],
	},
	scrollTop: {
		event: "scroll",

		also: [
			"scrollLeft",
		],
	},
	attributes: {
		attributes: true,
	},
};

export default properties;