import "./Table.css";
import { useTable } from "react-table";
import {
  React,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import UserDataContext from "../../contexts/UserDataContext";
import { useNavigate } from "react-router-dom";
import { X, Check } from "lucide-react";

const Table = ({ isUserTable }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { userDataContextValue } = useContext(UserDataContext);

  useEffect(() => {
    if (!userDataContextValue) {
      navigate("/");
    }

    const serviceUrl = isUserTable
      ? `http://localhost:4001/meetings/${userDataContextValue.id}`
      : "http://localhost:4001/meetings";
    axios
      .get(serviceUrl)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setError("Failed to fetch meetings");
      });
  });

  const handleAction = useCallback(
    async (data, action) => {
      const serviceUrl = isUserTable
        ? `http://localhost:4001/meetings/${userDataContextValue.id}`
        : "http://localhost:4001/meetings";

      try {
        await axios.post(`http://localhost:4001/meeting/${action}`, {
          meetingId: data._id,
          userId: userDataContextValue.id,
        });
      } catch (err) {
        setError(err.response.data.message);
        return;
      }

      axios
        .get(serviceUrl)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          setError("Failed to fetch meetings");
        });
    },
    [isUserTable, userDataContextValue.id]
  );

  const columns = useMemo(
    () => [
      {
        Header: "Checkpoints",
        accessor: "checkpoints",
        Cell: ({ value }) => (
          <div>
            {value.map((checkpoint, index) => (
              <div key={index}>{checkpoint.name}</div>
            ))}
          </div>
        ),
      },
      {
        Header: "Date (dd-mm-yyyy)",
        accessor: "date",
        Cell: ({ value }) => <div>{formatDate(value)}</div>,
      },
      {
        Header: "Distance (km)",
        accessor: "distance",
      },
      {
        Header: "Attendees",
        accessor: "attendees",
        Cell: ({ value }) => (
          <div>
            {value.map((attendee, index) => (
              <div key={index}>{attendee.userName}</div>
            ))}
          </div>
        ),
      },
      {
        Header: "Route",
        accessor: "googleMapsLink",
        Cell: ({ value }) => (
          <a
            href={value}
            className="outside-link"
            target="_blank"
            rel="noreferrer noopener"
          >
            View Route
          </a>
        ),
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <>
            {row.original.attendees.find(
              (attendee) => attendee._id === userDataContextValue.id
            ) ? (
              <button
                className="submit table-delete"
                onClick={() => handleAction(row.original, "unattend")}
              >
                <span className="wrap-action">
                  <X size={20} />
                  <span>Leave</span>
                </span>
              </button>
            ) : (
              <button
                className="submit table-add"
                onClick={() => handleAction(row.original, "attend")}
              >
                <span className="wrap-action">
                  <Check size={20} />
                  <span>Attend</span>
                </span>
              </button>
            )}
          </>
        ),
      },
    ],
    [userDataContextValue.id, handleAction]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <section>
      <h1>{isUserTable ? "My meetings" : "Meetings"}</h1>
      {error && <p className="error">{error}</p>}
      {data.length === 0 ? (
        <h2>Loading data from server</h2>
      ) : (
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default Table;
