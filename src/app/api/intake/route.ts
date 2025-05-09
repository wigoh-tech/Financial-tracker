// pages/api/intake-submission/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers, clientId } = body;

    if (!clientId) {
      return NextResponse.json({ message: 'Client ID is required' }, { status: 400 });
    }

    if (!Array.isArray(answers)) {
      return NextResponse.json({ message: 'Answers should be an array' }, { status: 400 });
    }

    // Proceed to save answers
    const answerData = answers.map((ans: { questionId: number; answer: string }) => ({
      questionId: ans.questionId,
      answer: ans.answer,
      clientId,
    }));

    await prisma.intakeAnswer.createMany({ data: answerData });

    return NextResponse.json({ message: 'Answers submitted successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error submitting answers:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Server error saving answers', error: errorMessage }, { status: 500 });
  }
}
