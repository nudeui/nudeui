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
const STATUS_ICONS = {
	"Mature": "✅",
	"In incubation": "🐣",
	"Failed": "💀",
};

const site = {
	id: "nudeui-site",
	url: import.meta.url,
	scripts: "./site.js",
	styles: "site.css",
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
				let icon = STATUS_ICONS[status];
				badges.push({
					tag: "span",
					attrs: { class: "badge", "data-status": status.toLowerCase().replaceAll(" ", "-") },
					content: [icon ? `${icon} ${status}` : status],
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
