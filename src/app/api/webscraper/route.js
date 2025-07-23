import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";

export async function WebScraper(url) {
  const loader = new PuppeteerWebBaseLoader(
    url,
    {
      launchOptions: { headless: true },
      evaluate: (page) => page.evaluate(() => document.body.innerText)
    }
  );
  const docs = await loader.load();

  return docs.map(doc => ({
  content: doc.pageContent,
  metadata: doc.metadata
}));
}

export async function POST(req) {
    const { url } = await req.json();
    if (!url) {
        return Response.json({ error: 'URL is required' }, { status: 400 });
    }
    const docs = await WebScraper(url);

    return Response.json({docs}, { status: 200 });
}

