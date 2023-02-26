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

		this.#calendar.innerHTML = "";

		let hasMin = this.hasAttribute("start");
		let hasMax = this.hasAttribute("end");
		this.min = hasMin && new BetterDate(this.getAttribute("start")) || dates[0];
		this.max = hasMax && new BetterDate(this.getAttribute("end")) || dates.at(-1);

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
				this.min = new BetterDate(this.max - dur.month);
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

export class NudeTimetable extends HTMLElement {
	#headers
	#calendar

	constructor() {
		super();

		this.attachShadow({ mode: "open" });
		this.shadowRoot.innerHTML = `
		<style>@import "${new URL("style.css", import.meta.url)}";</style>
		<div id="headers"></div>
		<div id="hours">
			${ Array(24).fill(1).map((a, i) => `<div style="--hour: ${i}">${String(i).padStart(2, "0")}:00</div>`).join("\n") }
		</div>
		<div id="calendar"></div>
		`;
		this.#headers = this.shadowRoot.getElementById("headers");
		this.#calendar = this.shadowRoot.getElementById("calendar");
	}

	#render() {
		this.#calendar.innerHTML = "";

		this.min = this.getAttribute("start");
		this.max = this.getAttribute("end");

		let hasMin = this.hasAttribute("start");
		let hasMax = this.hasAttribute("end");

		if (this.min) {
			this.start = new BetterDate(this.min);
		}

		if (this.max) {
			this.end = new BetterDate(this.max);
		}

		if (isNaN(this.start)) {
			hasMin = false;
			delete this.start;
		}

		if (isNaN(this.end)) {
			hasMax = false;
			delete this.end;
		}

		if (!hasMin || !hasMax) {
			let min, max;

			for (let time of this.children) {
				let raw = time.getAttribute("datetime");
				let [low, high = low] = raw.split("/").map(d => new BetterDate(d));

				if (min === undefined || low < min) {
					min = low;
				}

				if (max === undefined || high >= max) {
					max = high;
				}
			}

			if (!hasMin) {
				this.start = min;
			}

			if (!hasMax) {
				this.end = max;
			}
		}

		if (!hasMax) {
			let now = new BetterDate();
			if (now - this.max < dur.month) {
				// If max is recent use today as the default max
				this.max = now;
			}
		}

		if (!hasMin) {
			if (this.max - this.min < dur.month) {
				// If range is less than a month make it a month to today
				this.min = new BetterDate(this.max - dur.month);
			}
		}

		let previousMonth;
		for (let i = this.min; !(i > this.max); i.setDate(i.getDate() + 1)) {
			const dayElement = document.createElement("time");
			dayElement.part = "day";
			dayElement.setAttribute("datetime", i.isoDate);
			dayElement.title = i.toLocaleString("en-US", { dateStyle: "long" });

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

	static observedAttributes = []

	attributeChangedCallback(name, oldValue, newValue) {
		if (!name || name === "rows") {

		}
	}

	connectedCallback() {
		this.attributeChangedCallback();
		this.#render();
	}
}

export class BetterDate extends Date {
	constructor(...args) {
		args = args.map(a => typeof a === "string"? a.trim() : a);
		super(...args);
		this.source = args;

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