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
  const { url } = req.body; // <--- CHANGE req.body() to req.body

  if (!url) {
    return res.status(400).json({ error: 'URL is required' }); // <--- CORRECT RESPONSE FORMAT
  }

  try {
    const docs = await WebScraper(url);
    return res.status(200).json({ docs });
  } catch (error) {
    console.error("Error during web scraping:", error);
    return res.status(500).json({ error: 'Failed to scrape the URL', details: error.message });
  }
}

