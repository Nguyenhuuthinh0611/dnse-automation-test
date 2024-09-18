import { test } from "@playwright/test";
import { expect } from "@playwright/test";
import { assertStringContains } from "../src/ultils/assertion";
import DnsePage from "../src/pom/pages/dnse-page";

test("DNSE examination", async ({ page }) => {
	test.setTimeout(100000);
	const dnsePage = new DnsePage(page);
	await dnsePage.selfNavigate();
	await dnsePage.navigateToSenses();
	assertStringContains(await dnsePage.getCurrentUrl(), "senses");
	await dnsePage.search("DS");
	await dnsePage.navigateToPageChungKhoanDetail("DSE");
	assertStringContains(await dnsePage.getCurrentUrl(), "DSE");
	await dnsePage.clickToShare();
	await dnsePage.printShareLink();
	await dnsePage.closePopUp();
	await dnsePage.screenshotAndAttach("ClosePopUp");
	await dnsePage.backToPreviousPage();
	assertStringContains(await dnsePage.getCurrentUrl(), "senses");
	const nameTop3rdItem = await dnsePage.getNameOfTop3rdItemSearching();
	await dnsePage.screenshotAndAttach("BackToPreviousPage");
	await dnsePage.selectTop3rdItemSearching();
	const labelNameTop3rdMaChungKhoan = await dnsePage.getLabelPageChungKhoan();
	assertStringContains(nameTop3rdItem, labelNameTop3rdMaChungKhoan);
	await dnsePage.clickToShare();
	await dnsePage.closePopUp();
});
