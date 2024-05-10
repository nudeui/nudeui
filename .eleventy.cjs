let markdownIt = require("markdown-it");
let markdownItAnchor = require("markdown-it-anchor");
let markdownItAttrs = require("markdown-it-attrs");

module.exports = config => {
	let data = {
		"layout": "page.njk",
		"permalink": "{{ page.filePathStem | replace('README', '') }}/index.html",
		eleventyComputed: {
			defaultTitle: data => {
				if (data.id) {
					return data.css_only? `.${data.id}` : `<${data.id}>`;
				}

				return "Nude UI: A collection of accessible, customizable, ultra-light web components";
			}
		}
	};

	for (let p in data) {
		config.addGlobalData(p, data[p]);
	}

	config.setDataDeepMerge(true);

	config.setLibrary("md", markdownIt({
			html: true,
		})
		.disable("code")
		.use(markdownItAttrs)
		.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.headerLink(),
			level: 2,
		})
	);

	config.addFilter(
		"relative",
		page => {
			let path = page.url.replace(/[^/]+$/, "");
			let ret = require("path").relative(path, "/");

			return ret || ".";
		}
	);

	return {
		markdownTemplateEngine: "njk",
		templateFormats: ["md", "njk"],
		dir: {
			output: "."
		},
	};
};
