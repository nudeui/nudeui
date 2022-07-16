import "./button-group/button-group.js";
import "./cycle-toggle/cycle-toggle.js";

// CSS only modules
let modules = [
	"nd-switch",
]

document.head.insertAdjacentHTML("beforeend", modules.map(id => `<link rel="stylesheet" href="${new URL(`./${id}/${id}.css`, import.meta.url)}" />`).join("\n"));