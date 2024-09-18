import { test } from "@playwright/test";
import DnseHomePage from "../src/pom/pages/dnse-home-page";
import { assertStringContains } from "../src/ultils/assertion";

test("DNSE examination", async ({ page }) => {
	test.setTimeout(100000);
	const dnseHomePage = new DnseHomePage(page);
	await dnseHomePage.selfNavigate();
	await dnseHomePage.navigateToSenses();
	assertStringContains(await dnseHomePage.getCurrentUrl(), "senses");
	await dnseHomePage.search("DS");
	await dnseHomePage.navigateToPageChungKhoanDetail("DSE");
	assertStringContains(await dnseHomePage.getCurrentUrl(), "DSE");
	await dnseHomePage.clickToShare();
	await dnseHomePage.closePopUp();
	await dnseHomePage.screenshotAndAttach("ClosePopUp");
	await dnseHomePage.backToPreviousPage();
	assertStringContains(await dnseHomePage.getCurrentUrl(), "senses");
	const nameTop3rdItem = await dnseHomePage.getNameOfTop3rdItemSearching();
	await dnseHomePage.screenshotAndAttach("BackToPreviousPage");
	await dnseHomePage.selectTop3rdItemSearching();
	const labelNameTop3rdMaChungKhoan =
		await dnseHomePage.getLabelPageChungKhoan();
	assertStringContains(nameTop3rdItem, labelNameTop3rdMaChungKhoan);
	await dnseHomePage.clickToShare();
	await dnseHomePage.closePopUp();
});
