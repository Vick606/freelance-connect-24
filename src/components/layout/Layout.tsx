import Head from 'next/head'
import React from 'react'

type LayoutProps = {
  children: React.ReactNode
  title?: string
}

export default function Layout({ children, title = 'FreelanceConnect' }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Connect with freelancers for your projects" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}