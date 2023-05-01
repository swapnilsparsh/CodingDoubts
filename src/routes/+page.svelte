<script lang="ts">
	import { SSE } from 'sse.js'
	import type { CreateCompletionResponse } from 'openai'
	let context = ''
	let loading = false
	let errror = false
	let answer = ''

	const handleSubmit = async () => {
		loading = true
		errror = false
		answer = ''

		const eventSource = new SSE('/api', {
			headers: {
				'Content-Type': 'application/json'
			},
			payload: JSON.stringify({ context })
		})

		context = ''

		eventSource.addEventListener('error', (e) => {
			errror = true
			loading = false
			alert('Something went wrong, please try again')
		})

		eventSource.addEventListener('message', (e) => {
			try {
				loading = false

				if (e.data === '[DONE]') {
					return
				}
				const completionResponse: CreateCompletionResponse = JSON.parse(e.data)

				const [{ text }] = completionResponse.choices

				answer = (answer ?? '') + text
			} catch (err) {
				errror = true
				loading = false
				console.error(err)
				alert('Something went wrong, please try again')
			}
		})
		eventSource.stream()
	}
</script>

<svelte:head>
	<title>CodingDoubts</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div class="text-primary-white">
		<form
			class="flex flex-col md:flex-row items-center gap-0 md:gap-10 mt-8 w-full"
			on:submit|preventDefault={() => handleSubmit()}
		>
			<div class="flex w-full h-[20rem] flex-col lg:h-[40rem]">
				<label class=" font-bold" for="context">Input</label>
				<textarea
					class="textarea mt-2 w-full grow overflow-auto p-4 rounded-md bg-primary-grayBlack border border-primary-OffGray focus:ring-4 focus:ring-primary-CetaceanBlue focus:border-primary-CetaceanBlue focus:outline-none"
					placeholder="Type here..."
					name="context"
					rows="5"
					bind:value={context}
				/>
			</div>
			<div>
				<button
					class=" bg-primary-CetaceanBlue py-2 px-4 w-max rounded-md mt-8
					{context.trim() === '' ? 'cursor-not-allowed opacity-50' : ''}"
					disabled={context.trim() === ''}
				>
					Get Answer
				</button>
			</div>
			<div class="flex w-full h-[20rem] flex-col lg:h-[40rem]">
				<label class=" font-bold" for="context">Output</label>
				<textarea
					class="textarea mt-2 w-full grow overflow-auto p-4 rounded-md bg-primary-grayBlack border border-primary-OffGray
					{answer.trim() === ''
						? 'focus:outline-none pointer-events-none'
						: 'focus:ring-4 focus:ring-primary-CetaceanBlue focus:border-primary-CetaceanBlue focus:outline-none'}"
					placeholder="Awaiting answers..."
					name="answer"
					rows="5"
					bind:value={answer}
				/>
			</div>
		</form>
	</div>
</section>
