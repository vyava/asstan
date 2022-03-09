import { useContext } from "react";

import List from "src/components/list";
import MainLayout from "src/layouts/Main";

import { BAYILER_LIST_HEADERS } from "src/utils/common";
import { mapContext } from "src/contexts/map.context";
import { Pagination } from "src/components/pagination";

const BayilerPage = () => {

  const { useBayiler, usePagination } = useContext(mapContext);

  const { data } = useBayiler();
  const {data : paginator} = usePagination();

  return (
    <MainLayout title="Bayiler">
          <List _pathname="/bayiler">
            <List.Header headers={BAYILER_LIST_HEADERS} />

            <List.Body rows={data} />
          </List>
          <Pagination config={{_pathname : "/bayiler"}}>
              <Pagination.First number={1} />
              <Pagination.Prev number={paginator?.prev} />
              <Pagination.Items totalItems={paginator?.totalItems} currentPage={paginator?.currentPage} pageSize={paginator?.pageSize}/>
              <Pagination.Next number={paginator?.next} />
              <Pagination.Last number={paginator?.totalPages} />
          </Pagination>
    </MainLayout>
  );
};

export default BayilerPage;
