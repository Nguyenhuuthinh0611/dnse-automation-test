import type {
	BrowserContext,
	FrameLocator,
	Locator,
	Page,
} from "@playwright/test";
import logger from "../ultils/logger";
import { expect } from "@playwright/test";
import { randomCode } from "../ultils/random";
interface IGetPage {
	offset?: number;
	index?: number;
	title?: string;
}

interface ILocator {
	/**
	 * An optional array of frames locators to navigate to the element.
	 */
	framesChain?: Array<string>;
}
export interface IWait {
	/**
	 * The locator used to identify the element to wait for.
	 */
	locator?: string | Locator;

	/**
	 * The maximum amount of time to wait, in milliseconds.
	 */
	timeout?: number;

	/**
	 * The amount of time to sleep before performing the freeze/sleep, in milliseconds.
	 */
	sleep?: number;

	/**
	 * The state to wait for before continuing the automation.
	 * Possible values are "domcontentloaded", "load", or "networkidle".
	 */
	state?: "domcontentloaded" | "load" | "networkidle";
}
/**
 * Represents the options for a click action.
 * Extends the `IWait` interface.
 */
interface IClick extends IWait {
	/**
	 * Specifies whether to force the click action even if the element is covered by other elements.
	 */
	force?: boolean;
	blank: boolean;
}

/**
 * Represents a list with different selection types.
 */
interface IList {
	type: "oneof" | "all" | "none";
}

/**
 * Represents the options for filling a component.
 */
interface IFill extends IWait {
	/**
	 * Specifies whether to clear the component before filling it.
	 */
	clear?: boolean;
}
export default class BaseComponent {
	private _page: Page;
	private _locator: string | Locator;
	private context: BrowserContext;
	async checkIn(): Promise<void> {}

	constructor(page: Page) {
		this._page = page;
	}

	getPage(options?: IGetPage): Page {
		if (options?.index) {
			return this.context.pages()[options.index];
		}
		if (options?.offset) {
			const currentIndex = this.context.pages().indexOf(this._page);
			return this.context.pages()[currentIndex + options.offset];
		}
		if (options?.title) {
			const newPage = this.context.pages().find(async (page) => {
				(await page.title()) === options.title;
			});
			if (!newPage) {
				throw new Error(`Page with title: ${options.title} not found`);
			}
			return newPage;
		}
		return this._page;
	}

	// Interaction methods

	/**
	 * Clicks on an element with the specified selector.
	 * @param {string} selector - The selector of the element to click.
	 */
	async click(selector: string | Locator, options?: IClick) {
		try {
			logger.debug(`Clicking element by selector: ${selector}`);
			if (options?.blank) {
				const [newPage] = await Promise.all([
					this.context.waitForEvent("page"),
					this.locator(selector).click(),
				]);
				return newPage;
			}
			await this.locator(selector).click({ force: options?.force });
		} catch (err) {
			logger.error(err);
		}
	}
	async fill(selector: string | Locator, text: string, options?: IFill) {
		if (!this._page) {
			throw new Error("Page is not initialized");
		}
		try {
			logger.debug(
				`Filling element by selector: ${selector} with text: ${text}`,
			);
			await this.click(selector);
			if (options?.clear) {
			}
			await this.locator(selector).fill(text);
			expect(await this.locator(selector).inputValue()).toBe(text);
		} catch (err) {
			logger.error(err);
		}
	}
	async waitForSelector(
		selector: string | Locator,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		options?: any | { state: "visible"; timeout: 1000 },
	) {
		try {
			if (typeof selector === "string") {
				if (typeof options === "object") {
					logger.debug(
						`Waiting for selector: ${selector} to options: ${options.state}`,
					);
					await this._page?.waitForSelector(selector, { state: options.state });
				} else {
					logger.debug(`Waiting for selector: ${selector} to be visible`);
					await this._page?.waitForSelector(selector, { state: "visible" });
				}
			} else {
				await selector.waitFor();
			}
		} catch (err) {
			logger.error(err);
		}
	}

	async waitForOptions(options?: IWait) {
		if (options?.locator) {
			await this.waitForSelector(options.locator, options);
		} else if (options?.state) {
			await this.waitForLoadState(options.state);
		}
		if (options?.sleep) {
			await this.sleep(options.sleep);
		}
		if (options?.timeout) {
			await this.waitForTimeout(options.timeout);
		}
	}
	async waitForLoadState(state: "load" | "domcontentloaded" | "networkidle") {
		logger.debug(`Wait for load state: ${state}`);
		await this._page?.waitForLoadState(state);
	}

	async keyboard(key: string, action?: "down" | "up" | "backspace") {
		try {
			if (action === "down") {
				logger.debug(`Pressing key: ${key} down`);
				await this._page?.keyboard.down(key);
			} else if (action === "up") {
				logger.debug(`Release key: ${key} up`);
				await this._page?.keyboard.up(key);
			} else if (action === "backspace") {
				logger.debug(`Pressing key: ${key} backspace`);
				await this._page?.keyboard.press("Backspace");
			} else {
				logger.debug(`Pressing key: ${key}`);
				await this._page?.keyboard.press(key);
			}
		} catch (err) {
			logger.error(err);
		}
	}

	async getInnerText(selector: string | Locator) {
		return await this.locator(selector).innerText();
	}

	async getAttribute(selector: string | Locator, attribute: string) {
		if (attribute === "innerText") {
			return await this.locator(selector).innerText();
		}
		if (attribute === "textContent") {
			return await this.locator(selector).textContent();
		}
		return await this.locator(selector).getAttribute(attribute);
	}
	async selectOptionByText(selector: string | Locator, option: string) {
		try {
			logger.debug(`Selecting option: ${option} from dropdown list`);
			if (typeof selector === "string") {
				await this._page.selectOption(selector, option);
			} else {
				await selector.selectOption(option);
			}
		} catch (err) {
			logger.error(err);
		}
	}

	async selectOptionByIndex(selector: string | Locator, index: number) {
		try {
			logger.debug(`Selecting option: ${index} from dropdown list`);
			if (typeof selector === "string") {
				await this.locator(selector).selectOption({ index: index });
			} else {
				await selector.selectOption({ index: index });
			}
		} catch (err) {
			logger.error(err);
		}
	}

	async assertVisible(selector: string | Locator, options?: IWait) {
		logger.debug(`Asserting element is visible: ${selector}`);

		try {
			await this.waitForOptions(options);
			await expect(this.locator(selector)).toBeVisible();
		} catch (err) {
			throw new Error(`Element is not visible: ${selector}, error: ${err}`);
		}
	}

	async assertNotVisible(selector: string | Locator, options?: IWait) {
		if (options) {
			await this.waitForOptions(options);
		}
		logger.debug(`Asserting element is not visible: ${selector}`);
		await expect(await this.locator(selector)).not.toBeVisible();
	}

	async assertElementHasText(selector: string | Locator, text: string) {
		logger.debug(`Asserting element ${selector} has text: ${text}`);
		if (typeof selector === "string") {
			expect(await this.locator(selector).innerText()).toBe(text);
		} else {
			expect(await selector.innerText()).toBe(text);
		}
	}

	async assertElementHasTextContains(selector: string | Locator, text: string) {
		expect(await this.locator(selector).innerText()).toContain(text);
	}

	async assertElementAttributeHasValue(
		selector: string | Locator,
		attribute: string,
		value: string,
	) {
		if (typeof selector === "string") {
			expect(await this.locator(selector).getAttribute(attribute)).toBe(value);
		} else {
			expect(await selector.getAttribute(attribute)).toBe(value);
		}
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	assertEquals(actual: any, expected: any) {
		expect(actual, {
			message: `Actual: ${actual} is equal to expected: ${expected}`,
		}).toEqual(expected);
	}
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	async assertNotEquals(actual: any, expected: any) {
		expect(actual).not.toEqual(expected);
	}

	async sleep(time?: number) {
		try {
			const _time = time || 200;
			logger.debug(`Sleeping for: ${_time}...\r`);
			await new Promise((resolve) => setTimeout(resolve, _time));
			logger.debug("wake up!");
			return;
		} catch (err) {
			logger.error(err);
		}
	}
	async waitForTimeout(time: number) {
		try {
			logger.debug(`Waiting for timeout: ${time}`);
			await this._page?.waitForTimeout(time);
		} catch (err) {
			logger.error(err);
		}
	}
	async waitForDomContentLoaded() {
		await this._page?.waitForLoadState("domcontentloaded");
		logger.debug("Dom content loaded");
	}

	async scrollDown(distance: number) {
		try {
			logger.debug(`Scrolling down: ${distance}`);
			await this._page?.mouse.wheel(0, distance);
		} catch (err) {
			logger.error(err);
		}
	}

	async captureScreenshot(path: string) {
		try {
			logger.debug(`Capturing screenshot and saving: ${path}`);
			await this._page?.screenshot({ path: path });
		} catch (err) {
			logger.error(err);
		}
	}

	async screenshot() {
		try {
			const imageName = `screenshot-${Date.now()}-${randomCode(8)}.png`;
			logger.debug(`Capturing screenshot: ${imageName}`);
			return await this._page?.screenshot({
				path: `playwright-report/data/screenshots/${imageName}.png`,
				timeout: 5000,
			});
		} catch (err) {
			logger.error(`Screenshot error: ${err}`);
		}
	}

	locator(selector: string | Locator, options?: ILocator): Locator {
		if (!this._page) {
			throw new Error("Page is not initialized");
		}
		let frame: FrameLocator | Page = this._page;
		if (options?.framesChain && options.framesChain.length > 0) {
			for (let i = 0; i < options.framesChain.length; i++) {
				frame = frame.frameLocator(options.framesChain[i]);
			}
		}
		if (typeof selector === "string") {
			return frame.locator(selector);
		}
		return selector;
	}

	async locatorAll(selector: string | Locator): Promise<Locator[]> {
		if (!this._page) {
			throw new Error("Page is not initialized");
		}
		try {
			if (typeof selector === "string") {
				return await this.locator(selector).all();
			}
			return await selector.all();
		} catch (err) {
			logger.error(err);
			throw err;
		}
	}

	async isVisible(
		selector: string | Locator,
		options?: IWait | { timeout: 1000 },
	) {
		await this.waitForOptions(options);
		return await this.locator(selector).isVisible();
	}

	async areVisible(selector: string | Locator, options?: IList) {
		if (!this._page) {
			throw new Error("Page is not initialized");
		}
		const selections = await this.locatorAll(selector);
		if (selections.length === 0) {
			return false;
		}
		if (!options || options?.type === "oneof") {
			return Promise.all(
				selections.map(async (selection) => await selection.isVisible()),
			).then((results) => results.some(Boolean));
		}
		if (options?.type === "all") {
			return Promise.all(
				selections.map(async (selection) => await selection.isVisible()),
			).then((results) => results.every(Boolean));
		}
		if (options?.type === "none") {
			return Promise.all(
				selections.map(async (selection) => !(await selection.isVisible())),
			).then((results) => results.every(Boolean));
		}
		return false; // default return statement
	}
}
