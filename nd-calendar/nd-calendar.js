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
		this.#observer = new MutationObserver(() => this.#render()).observe(this, { childList: true, subtree: true, attributeFilter: ["datetime"] });
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

	#render() {
		this.#calendar.innerHTML = "";
		let dates = [...this.children].flatMap(time => {
			let dt = time.getAttribute("datetime");

			if (dt.includes("/")) {
				// Date range
				// add ALL dates between these
				let [low, high] = dt.split("/").map(d => new BetterDate(d));

				// Return all dates between low and high
				let dates = [];
				for (let d = new BetterDate(low); d <= new BetterDate(high + dur.day); d.setDate(d.getDate() + 1)) {
					dates.push(d.isoDate);
				}
				console.log(dates);
				return dates.map(d => new BetterDate(d));
			}

			return new BetterDate(dt);
		}).sort((a, b) => a - b);

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
		for (let i = this.min; !(i > this.max); i.setDate(i.getDate() + 1)) {
			const dayElement = document.createElement("time");
			dayElement.part = "day" + (this.dates.has(i.isoDate) ? " active" : "");
			dayElement.setAttribute("datetime", i.isoDate);
			dayElement.title = i.toLocaleString("en-US", { dateStyle: "long" });
			dayElement.style.setProperty("--weekday", i.weekday);

			let year = i.getComponent("year");
			let month = i.getComponent("month", "short");
			let day = i.getComponent("day");
			dayElement.style.setProperty("--year", `"${year}"`);
			dayElement.style.setProperty("--month", `"${month}"`);
			dayElement.style.setProperty("--day", day);

			this.#calendar.appendChild(dayElement);

			if (previousMonth !== month) {
				dayElement.insertAdjacentHTML("beforebegin", `<div part="month" style="--month: "${month}";">${month}</div>`);
			}

			previousMonth = month;
		}
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
		return this.toISOString().split("T")[0];
	}

	getComponent(component, format = "numeric") {
		return this.toLocaleString("en-US", { timeZone: "UTC", [component]: format });
	}
}

customElements.define("nd-calendar", NudeCalendar);