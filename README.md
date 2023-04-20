# carbon-now-scraper
Create a beautiful image with some Highlight With Your Codes

## What's News?
- Now With Promise so you can check If the file has finished downloading!

## Argument
To use the carbon-now-scraper, 2 arguments and 1 optional are needed.
Argument | Type | Needed | Description
--- | --- | --- | ---
code | string | `Needed` | Code to be used as Image
output | string | `Needed` | Output for Image file
options | object | `Optional` | Options to customize themes, languages, and others

## Options
Options | Type | Description | Default
--- | --- | --- | ---
lang | string | Program Languages | `auto`
theme | string | Set Themes for Image | `dracula`
background | string | Set Background for Image | `rgba(171, 184, 195, 1)`
font | string | Set Font for Write | `Hack`
window-controls| boolean | Show 3 Colored dots in the top left corner | `true`
width-adjustment | boolean | Auto new line if the text is too long in 1 line | `true`
line | boolean | Show Line numbers | `true`
first-line | int | First Line Numbers | `0`
watermark | boolean | Show Carbon Watermark | `true`

## Basic Usage
With No Options
```nodejs
const carbon = require('carbon-now-scraper');

let code = `<?php
    echo "Hi There!";
?>`
let output = "./php.png"

carbon(code, output)
```
With Options
```nodejs
const carbon = require('carbon-now-scraper');

let code = `<?php
    echo "Hi There!";
?>`
let output = "./php.png"
let options = {
    lang: "php",
    theme: "a11y-dark"
}

carbon(code, output, options)
```
With Promise
```nodejs
const carbon = require('carbon-now-scraper');

let code = `<?php
    echo "Hi There!";
?>`
let output = "./php.png"
let options = {
    lang: "php",
    theme: "a11y-dark"
}

carbon(code, output, options).then((downloaded) => {
    console.log(`File successfully downloaded in ${downloaded}`)
})
```
Output:</br>
![php.png](https://i.ibb.co/KWStY3j/php.png)

## Note
- This is Unofficial [carbon.now.sh](https://carbon.now.sh) Package
- You can use Hex Color for Background Color
- You Can Check all Available Themes, Languages, and Font in [here](https://raw.githubusercontent.com/XanderID/carbon-now-Scraper/main/options.js)