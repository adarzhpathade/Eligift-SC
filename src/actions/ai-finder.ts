"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { schemes, aiSchemeSearches, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function findMeScheme(userPrompt: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let userProfileText = "";
    if (user) {
      const profileData = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, user.id))
        .limit(1);

      if (profileData.length > 0) {
        const p = profileData[0];
        userProfileText = `User Profile Context (use this to help matching if relevant): Age: ${p.age}, Gender: ${p.gender}, State: ${p.state}, Occupation: ${p.occupation}, Income: ${p.annualIncome}, Education: ${p.education}.`;
      }
    }

    // 1. Retrieve Candidate Schemes
    const candidateSchemes = await db
      .select({
        id: schemes.id,
        title: schemes.title,
        description: schemes.description,
        targetGroup: schemes.targetGroup,
        eligibility: schemes.eligibility,
        category: schemes.category,
        occupationTags: schemes.occupationTags,
        stateTags: schemes.stateTags,
        ageMin: schemes.ageMin,
        ageMax: schemes.ageMax,
        incomeLimit: schemes.incomeLimit,
      })
      .from(schemes)
      .where(eq(schemes.isActive, true));

    if (candidateSchemes.length === 0) {
      return { success: false, error: "No candidate schemes available for matching." };
    }

    // 2. Call Gemini to rank and match
    const minimalSchemes = candidateSchemes.map(s => ({
      id: s.id,
      title: s.title,
      category: s.category,
      targetGroup: s.targetGroup,
      eligibility: s.eligibility,
    }));

    const systemInstruction = `You are an expert government scheme discovery assistant. Your job is to match the user's prompt with the best candidate schemes.
    
    You will receive a JSON list of Candidate Schemes and the User's Prompt.
    ${userProfileText}

    Task: Analyze the user's prompt and select exactly 1 scheme that best addresses their needs.
    You must return a JSON array containing the selected scheme. Each object must have scheme_id, relevance_score, and explanation.`;

    const prompt = `Candidate Schemes: ${JSON.stringify(minimalSchemes)}\n\nUser Prompt: ${userPrompt}`;

    const responseSchema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          scheme_id: {
            type: Type.STRING,
            description: "The exact string of the candidate scheme's id.",
          },
          relevance_score: {
            type: Type.INTEGER,
            description: "An integer from 0 to 100 indicating how well the scheme matches the user's prompt.",
          },
          explanation: {
            type: Type.STRING,
            description: "A brief, 1-2 sentence explanation of why this scheme is a good match based on the user's prompt.",
          },
        },
        required: ["scheme_id", "relevance_score", "explanation"],
      },
    };

    const response = await ai.models.generateContent({
      model: process.env.AI_MODEL || "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const content = response.text;
    if (!content) {
      throw new Error("Empty response from AI");
    }

    const aiResults = JSON.parse(content) as Array<{
      scheme_id: string;
      relevance_score: number;
      explanation: string;
    }>;

    // 3. Log the search in the database
    if (user) {
      await db.insert(aiSchemeSearches).values({
        userId: user.id,
        userPrompt: userPrompt,
        matchedSchemeIds: aiResults.map((r) => r.scheme_id),
      });
    }

    // 4. Enrich results with full scheme details to return to the UI
    const enrichedResults = aiResults.map((result) => {
      const schemeDetails = candidateSchemes.find((s) => s.id === result.scheme_id);
      return {
        ...result,
        schemeDetails,
      };
    }).filter((r): r is typeof r & { schemeDetails: NonNullable<typeof r["schemeDetails"]> } => r.schemeDetails !== undefined);

    // Sort by relevance score descending
    enrichedResults.sort((a, b) => b.relevance_score - a.relevance_score);

    return { success: true, data: enrichedResults.slice(0, 1) };
  } catch (error) {
    console.error("Error in Find Me Scheme:", error);
    return { success: false, error: "Failed to process Find Me Scheme request." };
  }
}
