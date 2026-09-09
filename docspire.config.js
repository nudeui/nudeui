import landing from "docspire/plugins/landing";
import icons from "./icons.js";

const STATUS_ICONS = {
	"Mature": "circle-check",
	"In incubation": "flask",
	"Failed": "trash",
};

/**
 * Site-specific Docspire plugin:
 * - Copies the component sources into the output, since they are served straight
 *   from the site (e.g. https://nudeui.com/components/index.js)
 * - Provides a `components` collection (pages with a `status`, in `order`)
 *   that drives the component table on the homepage
 * - Appends the installation instructions (templates/installation.njk) to every component page
 * - Turns ```html {demo} code blocks into live demos, using our very own <html-demo>
 *   (loaded, with the rest of the mature components, by assets/scripts/site.js)
 */
const site = {
	id: "nudeui-site",
	url: import.meta.url,
	scripts: "./site.js",
	styles: ["site.css", "demos.css"],
	icons,
	data: { statusIcons: STATUS_ICONS },
	slots: {
		"content.end": "installation",
	},
	plugin (config) {
		config.addPassthroughCopy({
			"components": "components",
			"logo.svg": "logo.svg",
			"_headers": "_headers",
			"_redirects": "_redirects",
		});

		config.addCollection("components", api =>
			api.getAll()
				.filter(page => page.data.status)
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

		// Render component-badges.njk (the component’s metadata) right after the page title
		config.addContentTransform((tree, data) => {
			if (!data?.id) {
				return tree;
			}

			let badges = config.njkEnv.render("component-badges.njk", data);

			let done = false;
			tree.match("h1", node => {
				if (done) {
					return node;
				}

				done = true;
				return [node, "\n", badges];
			});

			return tree;
		});
	},
};

export default {
	title: "Nude UI",
	description: "A collection of accessible, customizable, ultra-light web components",
	icon: "/logo.svg",
	// Each component documents itself, in a README.md that also renders on GitHub.
	// The docs tree mirrors the repo layout, so a README publishes at /components/<name>/.
	import: "components/:name/README.md",
	plugins: [landing, site],
};
