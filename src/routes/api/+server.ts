import { GEMINI_KEY } from '$env/static/private'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(GEMINI_KEY)

const model = genAI.getGenerativeModel({
	model: 'gemini-2.0-flash',
	systemInstruction:
		'You are enthusiastic and senior software engineer who loves helping others. Provide a better answer or solution in 5 points without using Markdown format for the coding question, doubts and topics which is being asked by the user.',
	generationConfig: {
		temperature: 0.9,
		topP: 1,
		topK: 1,
		maxOutputTokens: 2048,
		responseMimeType: 'text/plain'
	}
})

import { json, type RequestHandler } from '@sveltejs/kit'

export const POST = (async ({ request }) => {
	const data = await request.json()

	const result = await model.generateContent(data.context)
	return json({ message: result.response.text() })
}) satisfies RequestHandler
