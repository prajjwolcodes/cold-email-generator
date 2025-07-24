import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";

export async function WebScraper(url) {
  const loader = new PuppeteerWebBaseLoader(
    url,
    {
      launchOptions: {
        headless: true, // This controls if Puppeteer runs in headless mode
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          // Add any other necessary args here, e.g., for performance
          // '--disable-gpu',
          // '--disable-dev-shm-usage',
        ],
      },
      // The 'evaluate' function runs in the browser context
      evaluate: (page) => page.evaluate(() => document.body.innerText)
    }
  );
  const docs = await loader.load();

  return docs.map(doc => ({
    content: doc.pageContent,
    metadata: doc.metadata
  }));
}

export async function WebScraperController(req, res) {
    const { url } = req.body();
    if (!url) {
        return res.json({ error: 'URL is required' }, { status: 400 });
    }
    const docs = await WebScraper(url);

    return res.json({docs}, { status: 200 });
}

