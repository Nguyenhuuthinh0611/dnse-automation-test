import { type Locator, type Page, expect } from "@playwright/test";
import logger from "../ultils/logger";
import BaseComponent, { type IWait } from "./base-component";

export interface IWidget {
	root?: string | Locator;
	trigger?: string | Locator;
}

export default class Widget extends BaseComponent {
	protected root?: string | Locator;
	protected trigger?: string | Locator;
	constructor(page: Page, options?: IWidget) {
		super(page);
		this.root = options?.root;
		this.trigger = options?.trigger;
	}
	getRoot() {
		return this.root;
	}
	getTrigger() {
		return this.trigger;
	}
	async checkIn(): Promise<void> {
		if (this.trigger) {
			await this.assertVisible(this.trigger);
		}
	}
}

export interface IList extends IWidget {
	rowsLocator: string | Locator;
}

/**
 * Represents a list widget. The rowsLocator is the locator that matches all of the rows in the list. If you want to use selectByText, make sure that locator match the text you want to select.
 */
export class List extends Widget {
	protected rowsLocator: string | Locator;
	constructor(page: Page, options: IList) {
		super(page, options);
		this.rowsLocator = options.rowsLocator;
	}
	/**
	 * Selects an item in the list by its text.
	 * @param text - The text of the item to select. If text is an array, it will select all items in the array.
	 */
	async selectByText(text: string | string[], options?: IWait) {
		logger.debug(`Select by text: ${text}`);
		await this.waitForOptions(options || { sleep: 2000 });
		const rowsLocator = this.root
			? this.locator(this.root).locator(this.rowsLocator)
			: this.locator(this.rowsLocator);
		const rows = await this.locator(rowsLocator).all();
		if (Array.isArray(text)) {
			for (const t of text) {
				await this.selectByText(t);
			}
		} else {
			for (const row of rows) {
				const selectionText = await row.innerText();
				if (selectionText === text) {
					await this.click(row);
					break;
				}
			}
		}
	}
	/**
	 * Selects an item in the list by its index.
	 * @param index - The index of the item to select.
	 * @throws Error if the index is out of range.
	 */
	async selectByIndex(index: number, options?: IWait) {
		logger.debug(`Select by index: ${index}`);
		await this.waitForOptions(options || { sleep: 2000 });
		const matchedCount = await this.locator(this.rowsLocator).count();
		if (index < 1 || index > matchedCount) {
			throw new Error(
				`Index ${index} is out of range. The dropdownlist has ${matchedCount} items.`,
			);
		}
		await this.click(this.locator(this.rowsLocator).nth(index - 1));
	}
	/**
	 * Gets the number of rows in the list.
	 * @returns The number of rows in the list.
	 */
	async getRowsCount(options: IWait) {
		logger.debug("Getting rows count.");
		await this.waitForOptions(options || { sleep: 1000 });
		const rows = await this.locator(this.rowsLocator).all();
		return rows.length;
	}
	/**
	 * Gets the full text of an item in the list by its index.
	 * @param index - The index of the item.
	 * @returns The full text of the item.
	 */
	async getFullTextByIndex(index: number, options: IWait) {
		logger.debug(`Getting full text by index: ${index}`);
		await this.waitForOptions(options || { sleep: 1000 });
		const rows = await this.locator(this.rowsLocator).all();
		const row = rows[index];
		return row.innerText();
	}
}
interface IDropdownList extends IList {
	txtSearch?: string | Locator;
	btnApply?: string | Locator;
	hideTriggerAfterSelected?: boolean;
	trigger: string | Locator;
}
export class DropdownList extends Widget {
	private rowsLocator: Locator | string;
	private txtSearch: Locator | string | undefined;
	private btnApply: Locator | string | undefined;
	private hideTriggerAfterSelected: boolean;
	protected trigger: string | Locator;
	constructor(page: Page, options: IDropdownList) {
		super(page, options);
		this.trigger = options.trigger;
		this.rowsLocator = options.rowsLocator;
		this.txtSearch = options.txtSearch;
		this.btnApply = options.btnApply;
		this.hideTriggerAfterSelected = options.hideTriggerAfterSelected || true;
	}
	async isOpened() {
		const isRootVisible = await this.isVisible(this.locator(this.trigger));
		if (this.hideTriggerAfterSelected && isRootVisible) {
			logger.debug(`Dropdownlist root ${this.trigger} is not hidden.`);
			return false;
		}
		return await this.areVisible(this.rowsLocator, { type: "oneof" });
	}
	async isClosed() {
		return await this.isVisible(this.locator(this.trigger));
	}

	async open() {
		if (await this.isOpened()) {
			logger.debug(`Dropdownlist ${this.trigger} is already opened.`);
			return;
		}
		logger.debug(`Opening dropdownlist ${this.trigger}.`);
		await this.click(this.trigger);
	}
	async close() {
		if (!this.isOpened()) {
			logger.debug(`Dropdownlist ${this.trigger} is already closed.`);
			return;
		}
		logger.debug(`Closing dropdownlist ${this.trigger}.`);
		await this.click(this.trigger);
	}
	async selectByIndex(index: number, search?: string, wait?: number) {
		await this.open();
		await this.sleep(2000);
		if (this.txtSearch && search) {
			await this.search(search);
		}
		await this.waitForTimeout(wait || 1000);
		const matchedCount = await this.locator(this.rowsLocator).count();
		if (index < 1 || index > matchedCount) {
			throw new Error(
				`Index ${index} is out of range. The dropdownlist has ${matchedCount} items.`,
			);
		}
		await this.click(this.locator(this.rowsLocator).nth(index - 1));
		if (this.btnApply) {
			logger.debug(`Clicking apply button in dropdownlist ${this.trigger}.`);
			await this.click(this.locator(this.btnApply));
		}
	}
	async selectByText(text: string | string[], search?: string) {
		logger.debug(`Selecting "${text}" from dropdownlist ${this.trigger}.`);
		await this.open();
		await this.sleep(5000);
		const rows = await this.locator(this.rowsLocator).all();
		if (rows.length === 0) {
			throw new Error("No row found.");
		}
		if (this.txtSearch && search) {
			await this.search(search);
		}
		if (Array.isArray(text)) {
			for (const t of text) {
				await this.selectByText(t);
			}
		} else {
			for (const row of rows) {
				const selectionText = await row.innerText();
				if (selectionText === text) {
					await this.click(row);
					break;
				}
			}
		}
		if (this.btnApply) {
			await this.click(this.locator(this.btnApply));
		}
	}
	async selectByContainingText(text: string) {
		await this.open();
		await this.sleep(2000);
		const rows = await this.locator(this.rowsLocator).all();
		for (const row of rows) {
			const selectionText = await row.innerText();
			if (selectionText.includes(text)) {
				await this.click(row, { force: true, blank: false });
				break;
			}
			if (rows.indexOf(row) === rows.length - 1) {
				throw new Error(`No row contains text "${text}".`);
			}
		}
		if (this.btnApply) {
			await this.click(this.locator(this.btnApply));
		}
	}
	async search(text: string, hold?: number) {
		if (!this.txtSearch) {
			throw new Error("This dropdown list does not have search feature.");
		}
		await this.open();
		await this.fill(this.locator(this.txtSearch), text);
		await this.sleep(hold || 1000);
	}
	async checkByText(_choices: Array<string>) {
		const choices = new Set(_choices);
		logger.debug(`Checking by text: ${choices}`);
		await this.open();
		const rows = await this.locator(this.rowsLocator).all();
		for (const row of rows) {
			const selectionText = await row.innerText();
			logger.trace(`Checking row: ${selectionText}`);
			const chkSelector = row.locator("//input[@type='checkbox']");
			const match = (await chkSelector.count()) === 1;
			logger.trace(`Match: ${match}`);
			if (await chkSelector.isVisible()) {
				await chkSelector.waitFor({
					state: "visible",
				});
				if (choices.has(selectionText)) {
					if (!(await chkSelector.isChecked())) {
						await chkSelector.click({
							force: true,
						});
					}
				} else {
					if (await chkSelector.isChecked()) {
						await chkSelector.click({
							force: true,
						});
					}
				}
			}
		}
		if (this.btnApply) {
			await this.click(this.locator(this.btnApply));
		}
	}
}
