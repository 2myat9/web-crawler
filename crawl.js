import { JSDOM } from "jsdom";

const normalizeURL = (url) => {
  const urlObj = new URL(url);
  let normalizedURL = urlObj.host + urlObj.pathname;

  if (normalizedURL.length > 0 && normalizedURL.slice(-1) === "/") {
    normalizedURL = normalizedURL.slice(0, -1);
  }
  return normalizedURL;
};

const getURLsFromHTML = (htmlBody, baseURL) => {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const aTags = dom.window.document.querySelectorAll("a");
  for (let aTag of aTags) {
    try {
      let fullURL;
      if (aTag.href.slice(0, 1) === "/") {
        // for valid relative urls that start with /
        fullURL = new URL(aTag.href, baseURL);
      } else {
        // will throw error here when passing in invalid url into URL
        fullURL = new URL(aTag.href);
      }
      urls.push(fullURL.href);
    } catch (error) {
      console.error(
        `error occurred while retrieving URLs from HTML: ${error.message}`
      );
    }
  }
  return urls;
};

const crawlPage = async (baseURL, currentURL, pages) => {
  // base case: we stop crawling when we are outside the given domain
  if (new URL(baseURL).hostname !== new URL(currentURL).hostname) {
    return pages;
  }

  const normalizedCurrentURL = normalizeURL(currentURL);
  // if we've already seen currentURL, no need to keep crawling
  if (normalizedCurrentURL in pages) {
    pages[normalizedCurrentURL]++;
    return pages;
  }

  // mark current url as visited
  pages[normalizedCurrentURL] = normalizedCurrentURL === baseURL ? 0 : 1;

  // crawl current url to find nested urls
  console.log(`fetching ${currentURL}`);

  const response = await fetch(currentURL, {
    method: "GET",
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error("Error fetching page from provided URL");
  }

  const contentType = response.headers.get("Content-Type").split(";")[0];
  if (contentType !== "text/html") {
    console.log("found non-html type link. stopping crawling.");
    return pages;
  }

  const htmlContent = await response.text();
  const urls = getURLsFromHTML(htmlContent, currentURL);

  // recursively crawl nested urls, if any
  for (let url of urls) {
    pages = await crawlPage(baseURL, url, pages);
  }

  return pages;
};

export { normalizeURL, getURLsFromHTML, crawlPage };
