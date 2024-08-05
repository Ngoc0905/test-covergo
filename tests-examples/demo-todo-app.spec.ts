import { test, expect, type Page } from '@playwright/test';

const email = 'testerngoc@yopmail.com';
const password = 'Ticketgo2024@';
const userName = 'Le Ngoc';
const expectedMusicTicketUrl = 'https://ticketgo.vn/event/category/am-nhac';
const hochiminhCity = 'Hồ Chí Minh';
const defaultLocation = 'Chọn địa điểm';
const weeklyEventLabel = 'Sự kiện trong tuần';

test.describe('Exemple 10 tests', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('https://ticketgo.vn/');
    await page.waitForLoadState("domcontentloaded");
  });
  test('Check login with valide input', async ({ page }) => {
    // Click on the button register
    await page.click('#login')
    // Complet input valide
    await page.fill('#form-login input[name="email"]', email);
    await page.fill('#form-login input[name="password"]', password);
    await page.click('#login-button');

    const headerUserName = await page.locator('.user_name').textContent();

    await expect(headerUserName).toBe(userName);
  });

  test('Check Navbar Music Ticket', async ({ page }) => {
    // Click on the button Music Ticket
    const musicTicketUrl = await page.locator('.navbar__top .row_pc ul.nav.navbar-nav li:nth-child(1) a');
    const url = await musicTicketUrl.getAttribute('href');

    await expect(url).toBe(expectedMusicTicketUrl);
  });

  test('search empty input', async ({ page }) => {
    // Complet the input on the search bar with empty input
    await page.click('#search_button');

    const dataEvents = await page.locator('#load_data_event');

    await expect(dataEvents).not.toBeEmpty();
  });
  
  test('select english language', async ({ page }) => {
    // select the english option
    await page.click('#lang_title');
    await page.click('#lang_child ul li:nth-child(1)');

    await expect(page.locator('#lang_child ul li:nth-child(1)')).toHaveClass('enabled _msddli_ selected');
  });

  test('change location', async ({ page }) => {
    // Check dropdown list of location
    // Chosing location " Ho Chi Minh "
    await page.locator('#option_city').selectOption({
      label: hochiminhCity
    });
    await expect(page.locator('#option_city option[selected]')).toHaveText(hochiminhCity);
    // Chosing default location
    await page.locator('#option_city').selectOption({
      label: defaultLocation
    });

    await expect(page.locator('#option_city option[selected]')).toBeEmpty();
  });

  test('check the link on the banner', async ({ page }) => {
    const count = await page.locator('#slideshow > div:nth-child(1) > div > div.owl-stage-outer > div > div > div > a').count();

    await expect(count).toBeGreaterThan(0);
  });

  test('check the button Event calender', async ({ page }) => {
    // Click on the button Event calender
    await page.click('#create_event_button > div > div:nth-child(1) > a');
    const breadcrumb = await page.locator('body > div.body_wrapper > section > div > div > div > div.col-xs-12 > div > ul').textContent();

    // Check the event on the month
    await expect(breadcrumb).toContain(weeklyEventLabel);
  });

  test('checking Send Event', async ({ page }) => {
    await page.click('#create_event_button > div > div:nth-child(2) > span');
    await expect(page.locator('#sendEventButton')).toBeVisible();

    // TODO: test form to be sent because it is production environment
  });

  test('check button View more upcoming event ', async ({ page }) => {  
    const countBeforeClicked = await page.locator('.cover_list_event').count();
    // Start waiting for response before clicking. Note no await.
    const responsePromise = page.waitForResponse('https://ticketgo.vn/?page=2');
    await page.click('#loadMoreEvent');
    await responsePromise;

    const countAfterClicked = await page.locator('.cover_list_event').count();

    await expect(countAfterClicked).toEqual(countBeforeClicked + 5);
  });

  test('check all the links on the Footer', async ({ page }) => { 
    await expect(page.locator('body > div.body_wrapper > div.footer > div > div > div:nth-child(2) > ul > li:nth-child(1) a')).toHaveCount(1)
  });
});