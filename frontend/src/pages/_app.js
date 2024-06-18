import "../styles/globals.css";
import Layout from "../components/Layout";
import { GlobalContextProvider } from "../context/Store";
import { ArweaveWalletKit } from "arweave-wallet-kit";

export default function App({ Component, pageProps }) {
  return (
    <ArweaveWalletKit>
      <GlobalContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GlobalContextProvider>
    </ArweaveWalletKit>
  );
}
