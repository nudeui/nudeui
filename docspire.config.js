import landing from "docspire/plugins/landing";

/**
 * Site-specific Docspire plugin:
 * - Copies the element sources into the output, since they are served straight
 *   from the site (e.g. https://nudeui.com/elements/index.js)
 * - Provides a `components` collection (pages with `component` metadata, in `order`)
 *   that drives the component table on the homepage
 * - Appends the installation instructions (templates/installation.njk) to every component page
 * - Turns ```html {demo} code blocks into live demos, using our very own <html-demo>
 *   (loaded, with the rest of the mature components, by assets/scripts/site.js)
 */
// Font Awesome Free 7.3.1 (https://fontawesome.com/license/free)
const ICONS = {
	"circle-check": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c5 5 11.8 7.5 18.8 7s13.4-4.1 17.5-9.8L379.3 179.2c7.8-10.7 5.4-25.7-5.3-33.5z"/></svg>`,
	flask: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M288 0L128 0C110.3 0 96 14.3 96 32s14.3 32 32 32L128 215.5 7.5 426.3C2.6 435 0 444.7 0 454.7 0 486.4 25.6 512 57.3 512l333.4 0c31.6 0 57.3-25.6 57.3-57.3 0-10-2.6-19.8-7.5-28.4L320 215.5 320 64c17.7 0 32-14.3 32-32S337.7 0 320 0L288 0zM192 215.5l0-151.5 64 0 0 151.5c0 11.1 2.9 22.1 8.4 31.8l41.6 72.7-164 0 41.6-72.7c5.5-9.7 8.4-20.6 8.4-31.8z"/></svg>`,
	trash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M136.7 5.9C141.1-7.2 153.3-16 167.1-16l113.9 0c13.8 0 26 8.8 30.4 21.9L320 32 416 32c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 8.7-26.1zM32 144l384 0 0 304c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-304zm88 64c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24zm104 0c-13.3 0-24 10.7-24 24l0 192c0 13.3 10.7 24 24 24s24-10.7 24-24l0-192c0-13.3-10.7-24-24-24z"/></svg>`,
};

const STATUS_ICONS = {
	"Mature": "circle-check",
	"In incubation": "flask",
	"Failed": "trash",
};

const site = {
	id: "nudeui-site",
	url: import.meta.url,
	scripts: "./site.js",
	styles: "site.css",
	icons: ICONS,
	data: { statusIcons: STATUS_ICONS },
	slots: {
		"content.end": "installation",
	},
	plugin (config) {
		config.addPassthroughCopy({
			"elements": "elements",
			"logo.svg": "logo.svg",
			"_headers": "_headers",
			"_redirects": "_redirects",
		});

		config.addCollection("components", api =>
			api.getAll()
				.filter(page => page.data.component)
				.sort((a, b) => (a.data.order ?? 1) - (b.data.order ?? 1)),
		);

		// Replace the <code-block> around ```html {demo} snippets with <html-demo>,
		// which renders the demo client-side from the code’s text content
		config.addContentTransform(tree => {
			tree.match("code-block", node => {
				let pre = node.content?.find(child => child?.tag === "pre");
				let code = pre?.content?.find(child => child?.tag === "code");

				if (!code || code.attrs?.demo === undefined) {
					return node;
				}

				delete code.attrs.demo;

				return { tag: "html-demo", content: [pre] };
			});

			return tree;
		});

		// Show the component’s metadata (syntax, status, type) as badges under the page title
		config.addContentTransform((tree, data) => {
			if (!data?.id) {
				return tree;
			}

			let badges = [];
			let status = data.component?.status;
			let syntax = data.css_only ? `.${data.id}` : `&lt;${data.id}&gt;`;

			badges.push({
				tag: "code",
				attrs: { class: "badge badge-syntax" },
				content: [syntax],
			});

			if (status) {
				badges.push({
					tag: "span",
					attrs: {
						class: STATUS_ICONS[status] ? "badge icon-before" : "badge",
						"data-status": status.toLowerCase().replaceAll(" ", "-"),
					},
					content: [status],
				});
			}

			badges.push({
				tag: "span",
				attrs: { class: "badge", "data-type": data.css_only ? "css" : "js" },
				content: [data.css_only ? "CSS-only" : "JS"],
			});

			let done = false;
			tree.match("h1", node => {
				if (done) {
					return node;
				}

				done = true;

				return [node, "\n", {
					tag: "p",
					attrs: { class: "component-badges" },
					content: badges,
				}];
			});

			return tree;
		});
	},
};

export default {
	title: "Nude UI",
	description: "A collection of accessible, customizable, ultra-light web components",
	icon: "/logo.svg",
	plugins: [landing, site],
};
