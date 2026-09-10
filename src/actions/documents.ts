"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { documentChecks, schemes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export type UploadedFileMeta = {
  name: string;
  path: string;
  size: number;
};

export async function analyzeDocuments(schemeId: string, uploadedFiles: UploadedFileMeta[]) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Fetch the scheme details
    const schemeData = await db
      .select({
        id: schemes.id,
        title: schemes.title,
        requiredDocuments: schemes.requiredDocuments,
      })
      .from(schemes)
      .where(eq(schemes.id, schemeId))
      .limit(1);

    if (schemeData.length === 0) {
      return { success: false, error: "Scheme not found" };
    }

    const scheme = schemeData[0];
    const requiredDocs = scheme.requiredDocuments || [];

    // Call Gemini to analyze the files
    const systemInstruction = `You are an expert AI Document Reviewer for a Government Scheme Discovery Platform.
    
    Task: Compare the User's Uploaded Files against the Scheme's Required Documents.
    
    Inputs:
    - Scheme: ${scheme.title}
    - Required Documents: ${JSON.stringify(requiredDocs)}
    - User's Uploaded Files: ${JSON.stringify(uploadedFiles.map(f => f.name))}
    
    You must return a JSON object with EXACTLY the following structure:
    - readiness_score: An integer from 0 to 100 indicating the completion percentage
    - missing_documents: An array of strings listing the required documents that have NOT been uploaded
    - ai_summary: A brief 1-2 sentence summary of the document status
    - document_feedback: An array of objects providing feedback for EACH uploaded file. Each object must have:
      - filename: The exact name of the uploaded file.
      - status: 'valid', 'invalid', or 'unrelated'.
      - feedback: Specific feedback about this document.
      - confidence: An integer from 0 to 100 indicating how confident you are that this document is valid and correct.
      - mappedRequirement: (Optional) Which required document this file maps to, if any.`;

    const prompt = `Review the documents and provide the readiness score, missing documents, a summary, and specific feedback for each uploaded file.`;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        readiness_score: {
          type: Type.INTEGER,
          description: "An integer from 0 to 100 indicating the completion percentage.",
        },
        missing_documents: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
          description: "An array of strings listing the required documents that have NOT been uploaded.",
        },
        ai_summary: {
          type: Type.STRING,
          description: "A brief 1-2 sentence summary of the document status.",
        },
        document_feedback: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              filename: { type: Type.STRING, description: "The exact name of the uploaded file." },
              status: { type: Type.STRING, description: "'valid', 'invalid', or 'unrelated'." },
              feedback: { type: Type.STRING, description: "Specific feedback about this document." },
              confidence: { type: Type.INTEGER, description: "An integer from 0 to 100 indicating how confident you are that this document is valid and correct." },
              mappedRequirement: { type: Type.STRING, description: "Which required document this file maps to, if any." },
            },
            required: ["filename", "status", "feedback", "confidence"],
          },
          description: "An array of objects providing feedback for EACH uploaded file.",
        },
      },
      required: ["readiness_score", "missing_documents", "ai_summary", "document_feedback"],
    };

    const response = await ai.models.generateContent({
      model: process.env.AI_MODEL || "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1,
      },
    });

    const content = response.text;
    if (!content) {
      throw new Error("Empty response from AI");
    }

    const aiResult = JSON.parse(content) as {
      readiness_score: number;
      missing_documents: string[];
      ai_summary: string;
      document_feedback: Array<{ filename: string, status: 'valid' | 'invalid' | 'unrelated', feedback: string, confidence: number, mappedRequirement?: string }>;
    };

    // Store the check in the database
    // We update if it exists, or insert new
    const existingCheck = await db
      .select()
      .from(documentChecks)
      .where(and(eq(documentChecks.userId, user.id), eq(documentChecks.schemeId, schemeId)))
      .limit(1);

    const uploadedDocNames = uploadedFiles.map(f => f.name);

    let checkId: string;

    if (existingCheck.length > 0) {
      checkId = existingCheck[0].id;
      await db
        .update(documentChecks)
        .set({
          readinessScore: aiResult.readiness_score,
          status: aiResult.readiness_score === 100 ? 'completed' : 'pending',
          uploadedDocuments: uploadedDocNames,
          missingDocuments: aiResult.missing_documents,
          aiSummary: aiResult.ai_summary,
          documentFeedback: aiResult.document_feedback,
        })
        .where(eq(documentChecks.id, checkId));
    } else {
      const inserted = await db
        .insert(documentChecks)
        .values({
          userId: user.id,
          schemeId: schemeId,
          readinessScore: aiResult.readiness_score,
          status: aiResult.readiness_score === 100 ? 'completed' : 'pending',
          uploadedDocuments: uploadedDocNames,
          missingDocuments: aiResult.missing_documents,
          aiSummary: aiResult.ai_summary,
          documentFeedback: aiResult.document_feedback,
        })
        .returning({ id: documentChecks.id });
      checkId = inserted[0].id;
    }

    return { 
      success: true, 
      data: {
        id: checkId,
        readinessScore: aiResult.readiness_score,
        missingDocuments: aiResult.missing_documents,
        aiSummary: aiResult.ai_summary,
        uploadedDocuments: uploadedDocNames,
        documentFeedback: aiResult.document_feedback
      } 
    };
  } catch (error) {
    console.error("Error in analyzeDocuments:", error);
    return { success: false, error: "Failed to process document analysis." };
  }
}
