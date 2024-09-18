import type { Locator, Page, TestInfo } from "@playwright/test";
import BaseComponent, { type IWait } from "./base-component";
import logger from "../ultils/logger";

export default class BasePage extends BaseComponent {
	protected _url!: string;
	public static _testInfo: TestInfo;

	constructor(page: Page, testInfo?: TestInfo) {
		super(page);
		BasePage._testInfo = BasePage._testInfo || testInfo;
	}

	async isPageClosed() {
		return this.getPage().isClosed();
	}

	// Actions

	/**
	 * Navigates to the current page URL and takes a screenshot.
	 *
	 * @return {Promise<void>} A promise that resolves when the navigation and screenshot are complete.
	 */
	async selfNavigate() {
		try {
			logger.info(`Self navigating to: ${this._url}`);
			if (this.getCurrentUrl() !== this._url) {
				await this.getPage().goto(this._url);
				await this.screenshotAndAttach(`Self navigate to: ${this._url}`, {
					state: "domcontentloaded",
					sleep: 2000,
				});
			}
		} catch (err) {
			logger.error(err);
		}
	}

	/**
	 * Reloads the current page.
	 *
	 * @return {Promise<void>} A promise that resolves when the page is successfully reloaded.
	 */
	async reload() {
		try {
			await this.getPage().reload();
		} catch (err) {
			logger.error(err);
		}
	}

	/**
	 * Navigates to the specified URL.
	 * @param {string} url - The URL to navigate to.
	 */
	async goto(url: string) {
		try {
			logger.info(`Navigating to: ${url}`);
			await this.getPage()?.goto(url);
		} catch (err) {
			logger.error(err);
		}
	}

	// Get information

	/**
	 * Returns the current URL of the page.
	 * @returns {Promise<string>} - The current URL.
	 */

	getCurrentUrl(): string {
		if (!this.getPage()) {
			throw new Error("Page is not initialized");
		}
		try {
			return this.getPage().url();
		} catch (err) {
			logger.error(err);
			throw new Error("Failed to get current URL");
		}
	}

	/**
	 * Retrieves the URL of the page.
	 * @returns A promise that resolves to the URL of the page.
	 */
	async getUrl(): Promise<string> {
		return this._url;
	}

	/**
	 * Retrieves the title of the current page.
	 * @returns A promise that resolves to a string representing the title of the page.
	 */
	async getTitle(): Promise<string> {
		return this.getPage().title();
	}

	async screenshotAndAttach(title: string, options?: IWait) {
		try {
			logger.info(`Taking screenshot and attaching: ${title} after...`);
			if (process.env.CAPTURE === "1") {
				await this.waitForOptions(options || { sleep: 3000 });
				const screenshot = await this.screenshot();
				if (BasePage._testInfo) {
					await BasePage._testInfo?.attach(title, {
						body: screenshot,
						contentType: "image/png",
					});
				}
			}
		} catch (err) {
			logger.error(err);
		}
	}
}
