const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const path = require("path");

const { options, themes, langs, fonts } = require("./options.js");

/**
 * @param {Object} obj - a Array for Convert to Parameter
 */
function createParameter(obj) {
  const parameter = Object.entries(obj).map(
    ([key, value]) => `${key}=${encodeURIComponent(value)}`
  );

  return parameter.join("&");
}

/**
 *
 * @param {String} code - a Program code for Carbon
 * @param {String} outputPath - Output File Name Path
 * @param {Object} option - a additional Argument Option for Carbon
 * @returns
 */
async function carbon(code, outputPath, option = {}) {
  const {
    lang,
    background,
    theme,
    font,
    "window-controls": windowControls,
    "width-adjustment": widthAdjustment,
    line,
    "first-line": firstLine,
    watermark,
  } = { ...options, ...option };

  // Checking
  if (typeof code === "undefined")
    throw new Error("Program Code argument cannot be empty!");
  if (!langs.includes(lang))
    throw new Error(
      `There is no ${lang} programming language, please check at carbon.now.sh for a list of programming languages`
    );
  if (!themes.includes(theme))
    throw new Error(
      `There is no ${theme} Carbon Themes, please check at carbon.now.sh for a list of Theme`
    );
  if (!fonts.includes(font))
    throw new Error(
      `There is no ${font} Carbon Fonts, please check at carbon.now.sh for a list of Fonts`
    );

  let fontParam = font.replace("-", " ");
  // Parameter Url
  let parameter = {
    code: code,
    l: lang,
    bg: background,
    t: theme,
    fm: fontParam,
    wc: windowControls,
    wa: widthAdjustment,
    ln: line,
    fl: firstLine,
    wm: watermark,
  };
  let url = "https://carbon.now.sh?" + createParameter(parameter);

  return openBrowser(url, outputPath);
}

/**
 *
 * @param {String} url - Url for Downloading
 * @param {String} outputPath - Output for File
 */
async function openBrowser(url, outputPath) {
  // Parse Output Folder
  let output = path.resolve(outputPath);
  let folder = path.dirname(output);
  let filename = path.basename(output);
  if (!path.extname(filename)) {
    folder = output;
    filename = "Downloaded.png";
  }

  // Start Puppeteer Session
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
  });

  // Open Page and Go to Carbon Site
  const page = await browser.newPage();
  await page.goto(url);

  // Make Downloaded file more HD
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 2,
  });

  // Download
  let downloaded = null;

  // Event
  let client = await page.target().createCDPSession();
  await client.send("Browser.setDownloadBehavior", {
    behavior: "allowAndName",
    downloadPath: folder,
    eventsEnabled: true,
  });

  client.on("Browser.downloadProgress", async (event) => {
    // Identify if File Downloaded
    if (event.state === "completed") {
      let newfilename = path.resolve(folder, filename)
      fs.renameSync(
        path.resolve(folder, event.guid),
        newfilename
      );

      // Close Browser after Success Download
      await browser.close();
      downloaded = newfilename
    }
  });

  // Click Export in Carbon.now.sh Site
  await page.waitForSelector(".editor");
  await page.waitForSelector(".jsx-2184717013");
  await page.click(".jsx-2184717013");

  return new Promise(async (resolve, reject) => {
    let checkDownloaded = setInterval(() => {
      if (downloaded !== null) {
        clearInterval(checkDownloaded);
        resolve(downloaded);
      }
    }, 100);
  });
}

module.exports = carbon;
