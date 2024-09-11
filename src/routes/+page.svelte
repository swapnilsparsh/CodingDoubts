<script lang="ts">
	let context = ''
	let answer = ''
	let isLoading = false
	let isDisabled = false

	const handleSubmit = async () => {
		isLoading = true
		isDisabled = true

		try {
			const response = await fetch('/api', {
				method: 'POST',
				body: JSON.stringify({ context })
			})

			const data = await response.json()
			answer = data.message.replace(/\*\*(.*?)\*\*/g, '$1') || 'No response message received'
		} catch (error) {
			console.error('Error:', error)
			answer = 'An error occurred while fetching the response'
		} finally {
			isLoading = false
			isDisabled = false
		}
	}
</script>

<svelte:head>
	<title>CodingDoubts</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div class="text-primary-white">
		<form
			class="flex flex-col items-center w-full gap-0 mt-8 md:flex-row md:gap-10"
			on:submit|preventDefault={() => handleSubmit()}
		>
			<div class="flex w-full h-[20rem] flex-col lg:h-[40rem]">
				<label class="font-bold" for="context">Input</label>
				<textarea
					class="w-full p-4 mt-2 overflow-auto border rounded-md textarea grow bg-primary-grayBlack border-primary-OffGray focus:ring-4 focus:ring-primary-CetaceanBlue focus:border-primary-CetaceanBlue focus:outline-none"
					placeholder="Type here..."
					name="context"
					rows="5"
					bind:value={context}
				/>
			</div>
			<div>
				<button
					class="bg-primary-CetaceanBlue py-2 px-4 w-max rounded-md mt-8
					{context.trim() === '' || isDisabled ? 'cursor-not-allowed opacity-50' : ''}"
					disabled={context.trim() === '' || isDisabled}
				>
					{isLoading ? 'Loading...' : 'Get Answer'}
				</button>
			</div>
			<div class="flex w-full h-[20rem] flex-col lg:h-[40rem]">
				<label class="font-bold" for="answer">Output</label>
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
