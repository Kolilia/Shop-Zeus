/* eslint-disable jsx-a11y/anchor-is-valid */
import { DialogActions, LinearProgress } from "@material-ui/core";
import { green, orange } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import { Check, Warning } from "@material-ui/icons";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import orders from "../../../../store/orders";
import Alert from "../../../System/Alert";
import SearchField from "../../../System/SearchField";
import ZeusButton from "./../../../System/ZeusButton";
import ZeusTable from "./../../../System/ZeusTable";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    marginTop: "2rem",
    width: "100%",
    height: "100%",
  },
  block: {
    minWidth: 500,
    padding: "15px 20px",
    backgroundColor: "#fff",
    borderRadius: "1rem",
    whiteSpace: "nowrap",
    height: "min-content",
  },
  done: {
    color: green[600],
  },
  notDone: {
    color: orange[600],
  },
  text: {
    fontSize: "1em",
    fontWeight: 700,
    marginLeft: ".5rem",
  },
  iconExecute: {
    fontSize: "2rem",
    marginLeft: "1rem",
  },
});

const AllOrders = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [pages, setPages] = useState(1);

  const params = useRef({
    page: 1,
    perPage: 10,
  });

  const fetcher = useCallback(async (newParams) => {
    setLoading(true);

    params.current = {
      ...params.current,
      ...newParams,
    };

    const result = await orders.fetchOrdersByAdmin(params.current);

    if (result) {
      setItems(result?.data);

      setPages(result?.pages);
    }

    setLoading(false);
  }, []);

  const columns = useMemo(() => {
    return [
      {
        Header: "Клиент",
        disableSortBy: true,
        accessor: (rowData) => {
          return rowData?.clientName;
        },
      },
      {
        Header: "Продукты",
        disableSortBy: true,
        accessor: (rowData) => {
          const mapProducts = rowData?.products?.map((item) => {
            return (
              <div key={item?.productId} style={{ marginBottom: ".5rem" }}>
                <Link to={`/admin/all-products/${item?.productId}`}>
                  {item?.name}
                </Link>
              </div>
            );
          });

          return mapProducts;
        },
      },
      {
        Header: "Идентификатор заказа",
        disableSortBy: true,
        accessor: (rowData) => {
          return rowData?.orderId;
        },
      },
      {
        Header: "Адрес",
        disableSortBy: true,
        accessor: (rowData) => {
          return rowData?.address;
        },
      },
      {
        Header: "Город",
        disableSortBy: true,
        accessor: (rowData) => {
          return rowData?.city;
        },
      },
      {
        Header: "Почтовый индекс",
        disableSortBy: true,
        accessor: (rowData) => {
          return rowData?.postalCode;
        },
      },
      {
        Header: "Состояние",
        styleHead: {
          textAlign: "right",
        },
        disableSortBy: true,
        accessor: (rowData) => {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
              className={rowData?.execute ? classes.done : classes.notDone}
            >
              {rowData?.execute ? (
                <>
                  <Check className={classes.iconExecute} />
                  <span className={classes.text}>Доставлено</span>
                </>
              ) : (
                <>
                  <Warning className={classes.iconExecute} />
                  <span className={classes.text}>Доставляется...</span>
                </>
              )}
            </div>
          );
        },
      },

      {
        Header: "-",
        disableSortBy: true,
        accessor: (rowData) => {
          const Actions = ({ rowData }) => {
            const [loading, setLoading] = useState(false);
            const [open, setOpen] = useState(false);

            const complete = useCallback(async () => {
              setLoading(true);

              const result = await orders.completeOrder(rowData?.orderId);

              if (result) {
                fetcher({});
                setOpen(false);
              }

              setLoading(false);
            }, [rowData?.orderId]);

            return rowData?.execute ? null : (
              <>
                <a
                  onClick={() => {
                    if (loading) {
                      return;
                    }

                    setOpen(true);
                  }}
                >
                  Подтвердить доставку заказа
                </a>

                <Alert
                  open={open}
                  setOpen={setOpen}
                  content={
                    <div>
                      <p>Вы уверены, что заказ был доставлен ?</p>

                      <DialogActions>
                        <ZeusButton
                          onClick={() => setOpen(false)}
                          loading={loading}
                          disabled={loading}
                        >
                          Нет
                        </ZeusButton>
                        <ZeusButton
                          loading={loading}
                          disabled={loading}
                          style={{
                            backgroundColor: green[600],
                            marginLeft: "1rem",
                          }}
                          onClick={complete}
                        >
                          Да
                        </ZeusButton>
                      </DialogActions>
                    </div>
                  }
                />
              </>
            );
          };

          return <Actions rowData={rowData} />;
        },
      },
    ];
  }, [
    classes.done,
    classes.iconExecute,
    classes.notDone,
    classes.text,
    fetcher,
  ]);

  const memoData = useMemo(() => {
    return items;
  }, [items]);

  const onSearch = useCallback(
    (search) => {
      fetcher({ search });
    },
    [fetcher]
  );

  const downloadCsv = useCallback(async () => {
    setLoading(true);

    await orders.fetchOrderByAdminCsv(params.current);

    setLoading(false);
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.block}>
        <SearchField
          onSearch={onSearch}
          defaultValue={params?.current?.search}
          variant="standard"
        />
        <div style={{ height: 15 }} />

        <a onClick={downloadCsv}>Экспортировать текущие заказы в csv</a>

        <div style={{ height: 15 }} />

        {loading && <LinearProgress />}

        <ZeusTable
          data={memoData}
          fetchData={fetcher}
          columns={columns}
          pageCount={pages}
        />
      </div>
    </div>
  );
};

export default AllOrders;
