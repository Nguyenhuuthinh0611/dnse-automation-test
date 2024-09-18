import BasePage from "../../base/base-page";
import logger from "../../ultils/logger";
import type { Locator, Page } from "@playwright/test";
import { DropdownList } from "../../base/base-widget";
import { DNSE_UI } from "../ui/dnse-ui";
export default class DnsePage extends BasePage {
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
	lnkShare: Locator;

	constructor(page: Page) {
		super(page);
		this._url = "https://www.dnse.com.vn/";

		this.lblThiTruong = this.locator(DNSE_UI.lblThiTruong);
		this.optSenses = this.locator(DNSE_UI.optSenses);
		this.txtSearch = this.locator(DNSE_UI.txtSearch);
		this.ddlMaChungKhoan = new DropdownList(page, {
			root: this.locator(DNSE_UI.ddlMaChungKhoan),
			trigger: this.locator(DNSE_UI.otpDSE),
			rowsLocator: this.locator(DNSE_UI.otpDSE),
		});
		this.btnShare = this.locator(DNSE_UI.btnShare);
		this.btnClosePopUp = this.locator(DNSE_UI.btnClosePopUp);
		this.lblItem3rd = this.locator(DNSE_UI.lblItem3rd);
		this.lblPageTop3rdMaChungKhoan = this.locator(
			DNSE_UI.lblPageTop3rdMaChungKhoan,
		);
		this.lnkShare = this.locator(DNSE_UI.lnkShare);
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

	async printShareLink() {
		const shareLink = await this.getInnerText(this.lnkShare);
		logger.info(`Share link: ${shareLink}`);
		return shareLink;
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
