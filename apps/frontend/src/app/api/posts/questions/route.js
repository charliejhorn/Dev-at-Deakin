import { NextResponse } from "next/server";
import { fetchQuestionsDAL } from "@/app/lib/dal/posts";

export async function GET() {
    try {
        const questions = await fetchQuestionsDAL();
        return NextResponse.json(questions);
    } catch (error) {
        const status = error?.status || 500;
        const message =
            error instanceof Error
                ? error.message
                : "failed to fetch questions";
        const info = error?.info;

        return NextResponse.json(
            {
                error: message,
                info: info && typeof info === "object" ? info : undefined,
            },
            { status }
        );
    }
}
