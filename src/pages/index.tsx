import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Dashboard from "../components/dashboard/Dashboard";
import ConnectWalletButton from "@/components/UI/ConnectWalletButton";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Not Aave</title>
        <meta name="description" content="A frontend that directly plugs into the Aave protocol contracts." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen">
        <div className="absolute right-5 top-5">
          <ConnectWalletButton />
        </div>
        <Dashboard />
      </main>
    </>
  );
};

export default Home;
