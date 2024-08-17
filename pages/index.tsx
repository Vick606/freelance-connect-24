import Head from 'next/head'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>FreelanceConnect</title>
        <meta name="description" content="Connect with freelancers for your projects" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to FreelanceConnect</h1>
        <p className="text-center text-xl">Find the perfect freelancer for your project</p>
      </main>
    </div>
  )
}