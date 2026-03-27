import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? ""
);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.8, // Slightly higher for more variety, but still focused
  },
});

/**
 * Generates an objective, non-biased summary of a GitHub developer profile.
 * It uses the full context: profile, repos, and total stars/forks.
 */
export async function generateDeveloperSummary(
  fullContext: {
    profile: any;
    topRepos: any[];
    languages: Record<string, number>;
    totalStars: number;
    contributionStats?: any;
  }
): Promise<string> {
  try {
    const prompt = `EXACT DATA ONLY. DO NOT HALLUCINATE. DO NOT USE GENERIC PRAISE.
Analyze this GitHub developer data and write a 3-sentence professional summary in the third person.
- Sentence 1: Core tech stack and primary focus based on actual language distribution and repository topics.
- Sentence 2: Experience level and impact (mention their largest project or total star count of ${fullContext.totalStars} stars across their work).
- Sentence 3: Noteworthy contribution pattern (based on recent events or contribution frequency).

Strictly use the provided numbers and names. If they lack data, be direct. Avoid words like "passionate", "vibrant", or "enthusiastic".

Context:
Profile: ${JSON.stringify(fullContext.profile, null, 1)}
Top Repos: ${fullContext.topRepos.slice(0, 5).map(r => ({ name: r.name, lang: r.language, stars: r.stargazers_count }))}
Languages: ${JSON.stringify(fullContext.languages)}
Total Stars: ${fullContext.totalStars}`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    
    // Safety check against "samey" AI output: ensure it's at least 20 chars long or fallback
    if (text.length < 20) throw new Error("AI output too sparse");
    
    return text;
  } catch (error) {
    console.error("generateDeveloperSummary error:", error);
    const p = fullContext.profile;
    return `${p.name || p.login} is a developer primarily using ${Object.keys(fullContext.languages)[0] || 'various languages'}. With ${fullContext.totalStars} total stars across ${p.public_repos} repositories, they show a consistent focus on open-source development. Their GitHub activity reflects a steady engagement with the software engineering community.`;
  }
}

/**
 * Generates a strictly descriptive one-sentence overview of a repository.
 */
export async function generateRepoInsight(repoData: any): Promise<string> {
  try {
    const prompt = `STRICTLY FACTUAL. NO FLUFF. NO BIAS.
Describe this GitHub repository in exactly one sentence (max 18 words). 
Focus on functionality: what it DOES and what TECHNOLOGY it uses.

Repo Data:
Name: ${repoData.name}
Description: ${repoData.description}
Language: ${repoData.language}
Topics: ${repoData.topics?.join(", ")}
Stars: ${repoData.stargazers_count}`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    return repoData.description || "A software repository containing code and documentation for specialized development tasks.";
  }
}

/**
 * Generates a creative yet data-accurate tech personality description.
 */
export async function generateLanguagePersonality(
  languages: Record<string, number>
): Promise<string> {
  try {
    const topLangs = Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name]) => name);

    const prompt = `Analyze this language distribution and create a precise, fun one-sentence "tech persona" label (max 12 words).
Example: "A Rust systems specialist with a secret React hobby."
Current Stack: ${topLangs.join(", ")}
Full Data: ${JSON.stringify(languages)}`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    return "A multi-faceted developer exploring various technologies across the stack.";
  }
}

/**
 * Factual description of work pattern.
 */
export async function generateActivityInsight(
  events: any[]
): Promise<string> {
  try {
    if (!events || events.length === 0) return "No recent public activity recorded on GitHub.";
    
    const types = events.slice(0, 10).map(e => e.type);
    const prompt = `Describe this developer's recent work rhythm in one sentence based on these event types: ${types.join(", ")}. 
    Be objective. For example: "Regularly pushing code updates and managing issues across multiple projects."`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    return "Consistent contributor with steady repository maintenance and community interaction.";
  }
}
