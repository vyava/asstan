import React from "react";
import { AppProps, AppContext } from "next/app";
import Head from "next/head";
import "src/utils/fontawesome";
import "src/styles/globals.scss";

import { QueryClient, QueryClientProvider, Hydrate } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: false,
//       keepPreviousData : true,
//       retry : 2
//     }
//   }
// });

import ProgressBar from "src/components/progressbar";
import TıtleManager from "src/components/title-manager";
import { MapContextProvider } from "src/contexts/map.context";

// if (process.env.NODE_ENV === "development") {
//   require("../__mocks__");
// }

function MyApp({ Component, pageProps }: AppProps) {

  const [queryClient] = React.useState(() => new QueryClient(
    {
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          keepPreviousData: true,
          retry: 2,
          // refetchOnMount : false,
          // refetchOnReconnect: false
        }
      }
    }
  ));

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {/* <Hydrate state={pageProps.dehydratedState}> */}
          <MapContextProvider>
            <ProgressBar />
            <TıtleManager />

            <Head>
              <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
            </Head>

            <div className="container-fluid h-full flex w-full">
              <Component {...pageProps} />
            </div>
          </MapContextProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        {/* </Hydrate> */}
      </QueryClientProvider>
    </>
  );
};

export default MyApp;
