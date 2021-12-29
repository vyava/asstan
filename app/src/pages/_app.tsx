import { AppProps, AppContext } from "next/app";
import Head from "next/head";
import "src/utils/fontawesome";
import "src/styles/globals.scss";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

import ProgressBar from "src/components/progressbar";
import TıtleManager from "src/components/title-manager";

// if (process.env.NODE_ENV === "development") {
//   require("../__mocks__");
// }

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ProgressBar />
        <TıtleManager />

        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        </Head>

        <div className="container-fluid h-full flex w-full">
          <Component {...pageProps} />
        </div>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
};

export default MyApp;
