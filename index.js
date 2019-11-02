const sendEmail = require("./mail");

require("dotenv").config();
const puppeteer = require("puppeteer");

const fs = require("fs");
const lastAd = fs.readFileSync(__dirname + "/currentTitle.txt").toString();

(async () => {
  const browser = await puppeteer.launch({
    args: [
      // Required for Docker version of Puppeteer
      "--no-sandbox",
      "--disable-setuid-sandbox",
      // This will write shared memory files into /tmp instead of /dev/shm,
      // because Docker’s default for /dev/shm is 64MB
      "--disable-dev-shm-usage"
    ]
  });
  const page = await browser.newPage();
  await page.goto("https://gensdeconfiance.fr/login");
  await page.waitFor(5000);
  await clickOnFacebookLoginButton(page);
  const popup = await getFacebookLoginPopup(browser);
  await fillInWithFacebookCredentials(
    popup,
    process.env.FACEBOOK_EMAIL,
    process.env.FACEBOOK_PASSWORD
  );
  await waitForLogin(page);
  await page.goto(process.env.GDC_SEARCH_URL);
  await waitForAdsToBeDisplayed(page);
  const currentAd = await page.evaluate(() => {
    return document.querySelector(".ClassifiedCard__Title-egXjTo").textContent;
  });
  if (lastAd != currentAd) {
    sendEmail(`<a href='${process.env.GDC_SEARCH_URL}'>${currentAd}</a>`);
    fs.writeFile("currentTitle.txt", currentAd, err => {
      if (err) return console.log(err);
    });
    fs.write;
  } else {
    console.log("dont notify");
  }
  await browser.close();
})();

function clickOnFacebookLoginButton(page) {
  return page.click(".zuck-login");
}

function getFacebookLoginPopup(browser) {
  return new Promise(x =>
    browser.once("targetcreated", target => x(target.page()))
  );
}

async function fillInWithFacebookCredentials(popup, email, password) {
  await popup.waitForSelector("input#email");
  await popup.type("input#email", email);
  await popup.type("input#pass", password);
  await popup.keyboard.press("Enter");
}

function waitForLogin(page) {
  return page.waitForSelector(".input__Input-fesozt-2.losHqh");
}

function waitForAdsToBeDisplayed(page) {
  return page.waitForSelector(".ClassifiedCard__Title-egXjTo");
}
