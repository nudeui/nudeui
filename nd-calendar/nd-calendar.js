const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const dur = { ms: 1 };
dur.sec = dur.ms * 1000;
dur.min = dur.sec * 60;
dur.hour = dur.min * 60;
dur.day = dur.hour * 24;
dur.week = dur.day * 7;
dur.month = dur.day * 30.4368;

export default class NudeCalendar extends HTMLElement {
	#headers
	#calendar
	#observer;

	constructor() {
		super();

		this.attachShadow({ mode: "open" });
		this.shadowRoot.innerHTML = `
		<style>@import "${new URL("style.css", import.meta.url)}";</style>
		<div id="headers"></div>
		<div id="calendar"></div>
		`;
		this.#headers = this.shadowRoot.getElementById("headers");
		this.#calendar = this.shadowRoot.getElementById("calendar");
		this.#observe();
	}

	#createHeaders () {
		if (this.getAttribute("rows") === "months") {
			let days = Array(31).fill(1).map((a, i) => i + 1);
			this.#headers.innerHTML = days.map((d, i) => `<div style="--day: ${i + 1}">${d}</div>`).join("\n");
		}
		else {
			this.#headers.innerHTML = DAYS_OF_WEEK.map((d, i) => `<div style="--weekday: ${i + 1}">${d}</div>`).join("\n");
		}

	}

	#observe () {
		this.#observer ??= new MutationObserver(() => this.#render());
		this.#observer.observe(this, { childList: true, subtree: true, attributeFilter: ["datetime"] });
	}

	#unobserve () {
		this.#observer.takeRecords();
		this.#observer.disconnect();
	}

	#render() {
		this.#unobserve();
		this.#calendar.innerHTML = "";
		let dates = [...this.children].flatMap(time => {
			let dt = time.getAttribute("datetime");

			if (dt.includes("/")) {
				// Date range
				// add ALL dates between these
				let [low, high] = dt.split("/").map(d => new BetterDate(d));

				// Return all dates between low and high
				let dates = [];
				let daysApart = (high - low) / dur.day;

				if (isNaN(high) || isNaN(low)) {
					return [];
				}

				for (let d = new BetterDate(low), i = 0; d <= new BetterDate(high + dur.day); d.setDate(d.getDate() + 1)) {
					i++;
					dates.push(d.isoDate);
					if (i > daysApart) break; // failsafe
				}

				return dates.map(d => new BetterDate(d));
			}

			return new BetterDate(dt);
		}).filter(d => !isNaN(d)).sort((a, b) => a - b);

		if (dates.length === 0) {
			this.#observe();
			return;
		}

		let hasMin = this.hasAttribute("min");
		let hasMax = this.hasAttribute("max");
		this.min = hasMin && new BetterDate(this.getAttribute("min")) || dates[0];
		this.max = hasMax && new BetterDate(this.getAttribute("max")) || dates.at(-1);

		if (!hasMax) {
			if (this.getAttribute("rows") === "months") {
				this.max = new BetterDate(this.max);
				this.max.setMonth(this.max.getMonth() + 1);
				this.max.setDate(0);
			}
			else {
				let now = new BetterDate();
				if (now - this.max < dur.month) {
					// If max is recent use today as the default max
					this.max = now;
				}
			}

		}

		if (!hasMin) {
			// If no mix and max is specified, extend min and max in some cases for better presentation
			if (this.getAttribute("rows") === "months") {
				// Grow ranges to be full months
				this.min = new BetterDate(this.min);
				this.min.setDate(1);

			}
			else {
				if (this.max - this.min < dur.month) {
					// If range is less than a month make it a month to today
					this.min = new BetterDate(this.max - dur.month);
				}
			}
		}

		this.dates = new Set(dates.map(d => d.isoDate));

		let previousMonth;
		let daysApart = (this.max - this.min) / dur.day;
		for (let date = this.min, i = 0; !(date > this.max); date.setDate(date.getDate() + 1)) {
			if (isNaN(date)) {
				return;
			}

			const dayElement = document.createElement("time");
			dayElement.part = "day" + (this.dates.has(date.isoDate) ? " active" : "");
			dayElement.setAttribute("datetime", date.isoDate);
			dayElement.title = date.toLocaleString("en-US", { dateStyle: "long" });
			dayElement.style.setProperty("--weekday", date.weekday);

			let year = date.getComponent("year");
			let month = date.getComponent("month", "short");
			let day = date.getComponent("day");
			dayElement.style.setProperty("--year", `"${year}"`);
			dayElement.style.setProperty("--month", `"${month}"`);
			dayElement.style.setProperty("--day", day);

			this.#calendar.appendChild(dayElement);

			if (previousMonth !== month) {
				dayElement.insertAdjacentHTML("beforebegin", `<div part="month" style="--month: "${month}";">${month}</div>`);
			}

			if (i > daysApart) break; // failsafe

			previousMonth = month;
			i++;
		}

		this.#observe();
	}

	static observedAttributes = ["rows"]

	attributeChangedCallback(name, oldValue, newValue) {
		if (!name || name === "rows") {
			this.#createHeaders();
		}
	}

	connectedCallback() {
		this.attributeChangedCallback();
		this.#render();
	}
}

class BetterDate extends Date {
	constructor(...args) {
		super(...args);

		this.hasTimezone = typeof args[0] === "string" && /\+|Ζ/.test(args[0]) || args[0]?.hasTimezone;

		if (!this.hasTimezone) {
			// Use UTC time if no timezone provided
			this.setMinutes(this.getMinutes() + this.getTimezoneOffset());
		}
	}

	get weekday() {
		return this.getDay() || 7;
	}

	get isoDate () {
		try {
			return this.toISOString().split("T")[0];
		}
		catch (e) {
			return "";
		}
	}

	getComponent(component, format = "numeric") {
		return this.toLocaleString("en-US", { timeZone: "UTC", [component]: format });
	}
}

customElements.define("nd-calendar", NudeCalendar);