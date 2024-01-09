import { crawlPage } from "./crawl.js";
import { printReport } from "./report.js";

async function main() {
  const args = process.argv.slice(2);
  if (args.length > 1 || args.length < 1) {
    throw new Error(
      "Wrong number of arguments. Make sure to pass in one argument that is a valid URL you wish to crawl."
    );
  }
  const baseURL = args[0];

  console.log(`starting at url: ${baseURL}`);
  const result = await crawlPage(baseURL, baseURL, {});
  return printReport(result);
}

main();
