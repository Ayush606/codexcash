import HeroSection from "@/components/ui/hero-section";
import ContestCard from "@/components/ui/contest-card";
import FeatureSection from "@/components/ui/features-section";
import FAQSection from "@/components/ui/faq-section";
import { Card, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CodeAnimation from "@/components/ui/code-animation";
import type { Metadata } from 'next'

export const metadata: Metadata = ({
  title: "CodeXcash - Unlock Top Dev Talent With Solana Coding Contests",
  description: "Host coding contests with Solana rewards to find the perfect solution for your project",
  openGraph: {
    images: [
      {
        url: "https://codexcash.com/images/hero.jpeg",
        width: 1200,
        height: 630,
        alt: "CodeXcash - Unlock Top Dev Talent With Solana Coding Contests"
      }
    ]
  }
});
export default function Home() {

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start">

        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <hr id="features" />
        <FeatureSection />


        {/* Curated Explore Contest Section */}
        <hr id="explore" />
        <Card className="container w-full p-4 rounded-md bg-background">
          <CardTitle className="text-3xl font-bold text-center my-4 py-4">Explore Contests</CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" >
             <Link href="/post/67060991002ae14618c8">
              <ContestCard
                title="Develop a Secure Peer-to-Peer File Sharing DApp"
                description="Build a decentralized application (DApp) that enables users to securely share files peer-to-peer. The app should encrypt files and use Solana for authentication and verification."
                amount={0.5}
                endDate={new Date('2024-12-24T06:30:00')}
              />
            </Link>

            <Link href="/post/67060954002457283bf2">
              <ContestCard
                title="Build a Decentralized Crowdfunding Platform on Solana"
                description="Design and build a decentralized crowdfunding platform where users can start campaigns and receive funds in SOL. Implement wallet authentication and automatic fund distribution based on campaign goals."
                amount={1.5}
                endDate={new Date('2024-11-30T06:30:00')}
              />
            </Link>

            <Link href="/post/670608df0017282dfb05">
              <ContestCard
                title="Create a Real-Time Stock Price Tracker Using Solana Blockchain"
                description="Develop a stock price tracker that updates in real-time and records all changes on the Solana blockchain for transparency. The app should allow users to track multiple stocks and view historical data."
                amount={1}
                endDate={new Date('2024-11-24T06:30:00')}
              />
            </Link>

            <Link href="/post/6705f356000aeced62ac">
              <ContestCard
                title="Build an NFT Marketplace with Auction Features"
                description="Create a fully functional NFT marketplace where users can mint, buy, and auction NFTs. The platform should include wallet integration, Solana token support, and real-time auction updates."
                amount={1}
                endDate={new Date('2024-11-28T06:30:00')}
              />
            </Link>

            <Link href="/post/6705f2f0002d46ee632f">
              <ContestCard
                title="Design a Decentralized Voting DApp for Community Governance"
                description="Develop a decentralized voting system for Solana projects, allowing communities to vote on governance proposals. The DApp should ensure security, anonymity, and tamper-proof voting via Solana smart contracts."
                amount={0.1}
                endDate={new Date('2024-11-24T06:30:00')}
              />
            </Link>

            <Link href="/post/6705932e000341660c50">
              <ContestCard
                title="Build a Code Collaboration Platform for Solana DApp Developers"
                description="Create a platform where Solana DApp developers can collaborate on code in real-time. The platform should include version control features, live coding sessions, and chat functionality."
                amount={1}
                endDate={new Date('2024-11-13T06:30:00')}
              />
            </Link>
          </div>
          <div className="text-center m-2">
            <Link href='/explore'>
              <span className=" bg-secondary rounded-md py-2 px-4  shadow-md hover:bg-primary ">Explore More</span>
            </Link>
          </div>
        </Card>


        {/* FAQ Section */}
        <hr id="faq" />
        <FAQSection />

      </main>
    </div>
  );
}
