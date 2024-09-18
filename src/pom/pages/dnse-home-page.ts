import BasePage from "../../base/base-page";
import logger from "../../ultils/logger";
import type { Locator, Page } from "@playwright/test";
import DNSE_HOME_UI from "../ui/dnse-home-ui";
import { DropdownList } from "../../base/base-widget";
export default class DnseHomePage extends BasePage {
	protected _url: string;
	lblThiTruong: Locator;
	optSenses: Locator;
	txtSearch: Locator;
	ddlMaChungKhoan: DropdownList;
	otpMaChungKhoan: Locator;
	otpDSE: Locator;
	btnShare: Locator;
	btnClosePopUp: Locator;
	lblItem3rd: Locator;
	lblPageTop3rdMaChungKhoan: Locator;

	constructor(page: Page) {
		super(page);
		this._url = "https://www.dnse.com.vn/";

		this.lblThiTruong = this.locator(DNSE_HOME_UI.lblThiTruong);
		this.optSenses = this.locator(DNSE_HOME_UI.optSenses);
		this.txtSearch = this.locator(DNSE_HOME_UI.txtSearch);
		this.ddlMaChungKhoan = new DropdownList(page, {
			root: this.locator(DNSE_HOME_UI.ddlMaChungKhoan),
			trigger: this.locator(DNSE_HOME_UI.otpDSE),
			rowsLocator: this.locator(DNSE_HOME_UI.otpDSE),
		});
		this.btnShare = this.locator(DNSE_HOME_UI.btnShare);
		this.btnClosePopUp = this.locator(DNSE_HOME_UI.btnClosePopUp);
		this.lblItem3rd = this.locator(DNSE_HOME_UI.lblItem3rd);
		this.lblPageTop3rdMaChungKhoan = this.locator(
			DNSE_HOME_UI.lblPageTop3rdMaChungKhoan,
		);
	}

	// Actions

	async selfNavigate() {
		logger.info(`Self navigating to: ${this._url}`);
		if (this.getCurrentUrl() !== this._url) {
			await this.getPage().goto(this._url);
			await this.screenshotAndAttach(`Self navigate to: ${this._url}`);
		}
	}

	// Methods

	async navigateToSenses() {
		await this.locator(this.lblThiTruong).hover();
		await this.sleep(1000);
		await this.click(this.optSenses);
	}

	async search(text: string) {
		await this.fill(this.txtSearch, text);
		await this.sleep(4000);
	}

	async navigateToPageChungKhoanDetail(text: string) {
		await this.ddlMaChungKhoan.selectByContainingText(text);
		await this.sleep(2000);
	}

	async clickToShare() {
		await this.click(this.btnShare);
		await this.sleep(1000);
		await this.screenshotAndAttach("In ra ma co phieu");
	}

	async closePopUp() {
		await this.click(this.btnClosePopUp);
	}

	async backToPreviousPage() {
		await this.getPage().goBack();
		await this.sleep(2000);
	}

	async getNameOfTop3rdItemSearching() {
		const nameTop3rdItem = await this.getInnerText(this.lblItem3rd);
		logger.info(`Name of top 3rd item searching: ${nameTop3rdItem}`);
		return nameTop3rdItem;
	}

	async selectTop3rdItemSearching() {
		await this.click(this.lblItem3rd);
	}

	async getLabelPageChungKhoan() {
		const lableNameTop3rdMaChungKhoan = await this.getInnerText(
			this.lblPageTop3rdMaChungKhoan,
		);
		logger.info(`Name of Lable Page : ${lableNameTop3rdMaChungKhoan}`);
		return lableNameTop3rdMaChungKhoan;
	}
}
