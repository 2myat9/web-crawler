const { test, expect } = require("@jest/globals");
const { normalizeURL, getURLsFromHTML } = require("./crawl.js");

// NORMALIZE URL
test("Testing normalizeURL: remove protocol", () => {
  expect(normalizeURL("https://blog.boot.dev/path")).toBe("blog.boot.dev/path");
});

test("Testing normalizeURL: remove ending slash", () => {
  expect(normalizeURL("https://blog.boot.dev/path/")).toBe(
    "blog.boot.dev/path"
  );
});

test("Testing normalizeURL: ignore casing", () => {
  expect(normalizeURL("http://BLOG.boot.dev/path")).toBe("blog.boot.dev/path");
});

// GET URLS FROM HTML
test("Testing getURLsFromHTML: absolute urls", () => {
  const baseURL = "https://blog.boot.dev";
  const testHtml = `<html>
            <body>
                <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
            </body>
        </html>`;
  const actual = getURLsFromHTML(testHtml, baseURL);
  const tagsArray = ["https://blog.boot.dev/"];
  expect(actual).toStrictEqual(tagsArray);
});

test("Testing getURLsFromHTML: relative urls", () => {
  const baseURL = "https://blog.boot.dev";
  const htmlBody =
    '<html><body><a href="/path/one"><span>Boot.dev></span></a></body></html>';
  const actual = getURLsFromHTML(htmlBody, baseURL);
  const expected = ["https://blog.boot.dev/path/one"];
  expect(actual).toEqual(expected);
});

test("Testing getURLsFromHTML: both absolute and relative", () => {
  const baseURL = "https://blog.boot.dev";
  const htmlBody =
    '<html><body><a href="/path/one"><span>Boot.dev></span></a><a href="https://other.com/path/one"><span>Boot.dev></span></a></body></html>';
  const actual = getURLsFromHTML(htmlBody, baseURL);
  const expected = [
    "https://blog.boot.dev/path/one",
    "https://other.com/path/one",
  ];
  expect(actual).toEqual(expected);
});

test("Testing getURLsFromHTML: handle invalid urls", () => {
  const baseURL = "https://blog.boot.dev";
  const htmlBody =
    '<html><body><a href="?weird-link"><span>Boot.dev></span></a></body></html>';
  const actual = getURLsFromHTML(htmlBody, baseURL);
  const expected = [];
  expect(actual).toEqual(expected);
});
