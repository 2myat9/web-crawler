const printReport = (pages) => {
  // sort pages by descending count
  const sortedPages = Object.entries(pages).sort(
    (page1, page2) => page2[1] - page1[1]
  );

  for (let [page, count] of sortedPages) {
    console.log(`Found ${count} instances of ${page}`);
  }

  return;
};

export { printReport };
