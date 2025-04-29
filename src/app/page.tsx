// pages/index.js
import Head from 'next/head';
import ChatInterface from '../components/ChatInterface';

export default function Home() {
  return (
    <div>
      <Head>
        <title>News Query Chatbot</title>
        <meta name="description" content="A chatbot for querying the latest news" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <ChatInterface />
      </main>
    </div>
  );
}