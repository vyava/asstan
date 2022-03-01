import { useState } from "react";
import { useRouter } from "next/router";
import { bayiFetcher } from "src/fetchers/bayiler";
import { useQuery } from "react-query";

import List from "src/components/list";
import MainLayout from "src/layouts/Main";

import { BAYILER_LIST_HEADERS } from "src/utils/common";

const BayilerPage = () => {
  const router = useRouter();

  const { page, limit} = router.query;

  const { isLoading, error, data, isSuccess } = useQuery(["bayilerJson", { page, limit }], bayiFetcher, {
    initialData: {data : [], currentPage : 0, totalPages : 0},
    select: res => res.data
  });

  return (
    <MainLayout title="Bayiler">
      {error ? (
        <h1>
          Hata oluştu <br /> {JSON.stringify(error)}
        </h1>
      ) : isLoading ? <h1>Yükleniyor..</h1> : (
        (isSuccess && data) ? (
          <List>
            <List.Header headers={BAYILER_LIST_HEADERS} />

            <List.Body rows={data} />
          </List>
        ) : <h1>Yükleniyor</h1>
      )}
    </MainLayout>
  );
};

export default BayilerPage;
