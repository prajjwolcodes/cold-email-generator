import { ChatGroq } from "@langchain/groq";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { WebScraper } from "../webscraper/route";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";

function cleanJson(text) {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = match ? match[1] : text;
  return jsonStr.trim();
}

export async function POST(req) {
  const { url, fullname } = await req.json();
  if (!url) {
    return Response.json({ error: "URL is required" }, { status: 400 });
  }

  const content = await WebScraper(url);

  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY, // Default value.
    model: "llama-3.3-70b-versatile",
  });

  const scrapingTemplate = `
You are an information extractor.

Extract and return job details from the following unstructured web page content. Only return the output in the following JSON format:

{{
  "title": "<job title from the content>",
  "role": "<short summary of the role>",
  "responsibilities": "<brief description of the job responsibilities>",
  "location": "<job location>",
  "company": "<company name>",
  "description": "<brief job description or requirements>",
  "skills": "<comma-separated list of skills required or preferred>"
}}

Only extract what's available. If any value is missing, leave it as an empty string.

CONTENT:
---
{content}
---
ONLY return valid JSON output. Do not explain anything.
`;

  const coldEmailTemplate = `
You are {fullname}, a professional Full Stack Developer with experience in the MERN stack. Write a cold email applying for the following job. The tone should be professional, confident, and personalized—as if Prajjwol is writing it himself.

Use the following job details to tailor the message:

Job Title: {title}  
Role Summary: {role}  
Responsibilities: {responsibilities}  
Location: {location}  
Company: {company}  
Job Description: {description}  
Skills Required: {skills}

Write the email in this format:

---
Subject: [Strong, relevant, and personalized subject line]

Hi [Hiring Manager or Team at {company}],

[Introduction: Who you are, where you're based, your current role or experience]

[Why you're interested: Connect your interests/skills to their mission, responsibilities, or stack]

[What you bring: Mention specific skills or past experiences that match what they need]

[Close: Ask for a short call or opportunity to connect, thank them (Give different everytime you write this email)]

Best regards,  
{fullname}
${fullname === 'Prajjwol Shrestha' ? `
LinkedIn: https://www.linkedin.com/in/prajjwol-shrestha-078884321/
GitHub: https://github.com/prajjwolcodes` : ''}
---

Only return the full email content in the format shown. Do not explain anything.
`;

  const scrapingPrompt = PromptTemplate.fromTemplate(scrapingTemplate);
  const coldEmailPrompt = PromptTemplate.fromTemplate(coldEmailTemplate);

  const scrapingChain = scrapingPrompt
    .pipe(model)
    .pipe(new StringOutputParser())
    .pipe(async (rawJson) => {
      try {
        return JSON.parse(cleanJson(rawJson)); // parse into object for next step
      } catch (e) {
        console.error("Parsing failed:", rawJson);
        throw new Error("Failed to parse JSON");
      }
    });

  const emailChain = coldEmailPrompt.pipe(model).pipe(new StringOutputParser());

    const chain = RunnableSequence.from([
    RunnablePassthrough.assign({ fullname: (i) => i.fullname }),
    async ({ content, fullname }) => {
      const detail = await scrapingChain.invoke({ content });
      return { ...detail, fullname };
    },
    emailChain
  ]);

  const response = await chain.invoke({ content,fullname });

  console.log(response);

  return Response.json({ response }, { status: 200 });
}
