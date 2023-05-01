import { OPENAI_KEY } from '$env/static/private'
import { oneLine, stripIndent } from 'common-tags'
import type { CreateCompletionRequest } from 'openai'
import { error, type RequestHandler, type Config } from '@sveltejs/kit'

export const config: Config = {
	runtime: 'edge'
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		if (!OPENAI_KEY) {
			throw new Error('OPENAI_KEY env var not set')
		}

		const requestData = await request.json()

		if (!requestData) {
			throw new Error('Request data not found')
		}

		const { context } = requestData

		if (!context) {
			throw new Error('Context not found')
		}

		const prompt = stripIndent`
    ${oneLine`You are enthusiastic and senior software engineer who loves helping
    others. Provide a better answer or solution in points for the coding question or doubts which
    is being asked below in the Context
    `}
    
    Context:"""${context.trim()}"""
    
    Answer:""
    `
		const completionOpts: CreateCompletionRequest = {
			model: 'text-davinci-003',
			prompt,
			max_tokens: 256,
			temperature: 0.9,
			stream: true
		}

		const response = await fetch('https://api.openai.com/v1/completions', {
			headers: {
				Authorization: `Bearer ${OPENAI_KEY}`,
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(completionOpts)
		})

		if (!response.ok) {
			const error = await response.json()
			console.log(error)
			throw new Error('OpenAI API call failed', error)
		}

		return new Response(response.body, {
			headers: {
				'Content-Type': 'text/event-stream'
			}
		})
	} catch (err) {
		console.error(err)
		throw error(500, 'Internal Server Error')
	}
}
