import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";

const columns = [
  {
    field: "name",
    header: "Name",
  },
  {
    field: "status",
    header: "Status",
  },
  {
    field: "species",
    header: "Species",
  },
];

const getDataFromApi = async (page) => {
  const limit = 30;
  const response = await fetch(
    `localhost:3001/api/customers?offset=${page * limit}`
  );
};

function App() {
  const [data, setData] = useState(null);
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(0);
  const getDataFromRickAndMorty = async (
    endpoint = "https://rickandmortyapi.com/api/character"
  ) => {
    const response = await fetch(endpoint);
    const resData = await response.json();
    setData(resData);
  };
  useEffect(() => {
    getDataFromRickAndMorty();
  }, []);
  if (!data) return <div>Loading...</div>;
  return (
    <>
      <DataTable value={data.results} rows={20}>
        {columns.map((col) => {
          return (
            <Column
              field={col.field}
              header={col.header}
              key={`${col.field}-table`}
            />
          );
        })}
      </DataTable>
      <Paginator
        first={first}
        rows={20}
        totalRecords={data.info?.count}
        rowsPerPageOptions={[10, 20, 30]}
        onPageChange={(e) => {
          console.log(e);
          if (e.page > page) {
            getDataFromRickAndMorty(data.info?.next);
            getDataFromApi(e.page);
          } else if (e.page < page) {
            getDataFromRickAndMorty(data.info?.prev);
          }
          setFirst(e.first);
          setPage(e.page);
        }}
      />
    </>
  );
}

export default App;
