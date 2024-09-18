export const DNSE_UI = {
	lblThiTruong: "//button[@data-testid='nav-parent-thi-truong']",
	optSenses: "//li[@data-testid='header-menu-item-senses']",
	txtSearch: "//input[@data-testid='input-search-symbol']",
	ddlMaChungKhoan: "//div[@data-testid='modal-result']",
	otpMaChungKhoan: "//div[@data-testid='modal-result']//li",
	otpDSE: "//li[@data-testid='symbol-DSE']",
	btnShare: "//p[contains(text(), 'Chia sẻ')]/..",
	lnkShare: "//p[contains(text(), 'https')]",
	btnClosePopUp: "//p[contains(text(), 'Chia sẻ')]/..//button",
	lblItem3rd: "//button[@data-category='Top_search'][3]",
	lblPageTop3rdMaChungKhoan:
		"//span[contains(text(), 'CTCP Chứng khoán VIX')]//preceding::h2",
};
export default DNSE_UI;
