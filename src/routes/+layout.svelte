<script>
	import '../app.css'
	import Footer from '../components/Footer.svelte'
	import Header from '../components/Header.svelte'
</script>

<div class="relative flex min-h-screen flex-col justify-between gap-4 overflow-hidden pb-8">
	<div class="radial-gradient" />
	<div class="mx-auto w-11/12 max-w-7xl px-2 lg:px-4">
		<Header />

		<main>
			<slot />
		</main>

		<Footer />
	</div>
</div>
