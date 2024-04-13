let elements = [
	"button-group",
	"cycle-toggle",
	"meter-discrete",
	"nd-rating",
	"with-presets",
	"nd-calendar",
];

await Promise.all(elements.map(id => import(`../${id}/${id}.js`)));

// CSS only modules
let modules = [
	"nd-switch",
];

document.head.insertAdjacentHTML("beforeend", modules.map(id => `<link rel="stylesheet" href="${new URL(`../${id}/${id}.css`, import.meta.url)}" />`).join("\n"));