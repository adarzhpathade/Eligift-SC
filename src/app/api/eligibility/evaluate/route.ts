import { NextResponse } from 'next/server';
import { db } from '@/db';
import { schemes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { evaluateEligibility, EligibilityInput } from '@/features/eligibility';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { category, annualIncome, projectCost, gender, age, isSafaiKaramchari } = body as Partial<EligibilityInput>;

    if (!category || typeof annualIncome !== 'number' || typeof projectCost !== 'number') {
      return NextResponse.json({ 
        error: 'Missing required fields: category, annualIncome, projectCost' 
      }, { status: 400 });
    }

    const input: EligibilityInput = {
      category,
      annualIncome,
      projectCost,
      gender,
      age,
      isSafaiKaramchari,
    };

    // Fetch active schemes
    const activeSchemes = await db
      .select()
      .from(schemes)
      .where(eq(schemes.isActive, true));

    // Evaluate
    const start = performance.now();
    const result = evaluateEligibility(input, activeSchemes);
    const end = performance.now();

    // Log the performance in headers
    const response = NextResponse.json(result);
    response.headers.set('X-Response-Time', `${(end - start).toFixed(2)}ms`);

    return response;
  } catch (error: any) {
    console.error('Eligibility evaluation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
