import "./styles.scss";
import { useEffect, useState } from "react";
import axios from "axios";
// @ts-ignore
import SearchField from "react-search-field";
import ReactPaginate from "react-paginate";
import { ImCheckboxUnchecked } from "react-icons/im";
import { ImCheckboxChecked } from "react-icons/im";
import Row from "./components/Row";
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isChecked?: boolean;
}
const getLastPageNumber = (n: number) => {
  return n % 10 === 0 ? n / 10 - 1 : Math.floor(n / 10);
};
export default function App() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentUsers, setCurrentUsers] = useState<User[]>([]);
  const [paginatedUsers, setPaginatedUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    (async () => {
      const { data } = await axios.get<User[]>(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      setCurrentUsers(data.map((user) => ({ ...user, isChecked: false })));
      setAllUsers(data.map((user) => ({ ...user, isChecked: false })));
    })();
  }, []);

  const selectionHandler = (id: number) => {
    setAllUsers(
      allUsers.map((user) => {
        if (id === user.id) {
          return { ...user, isChecked: !user.isChecked };
        }
        return user;
      })
    );
  };

  const deleteHandler = (id: number) => {
    setAllUsers(allUsers.filter((user) => user.id !== id));
  };

  const editHandler = (newUser: User) => {
    setAllUsers(
      allUsers.map((user) => {
        if (user.id === newUser.id) {
          return { ...user, ...newUser };
        }
        return user;
      })
    );
  };

  const comparator = (text: string, user: User) => {
    const userString = Object.values(user)
      .map((word) => word.toString().toLowerCase())
      .join(" ");
    const textArray: string[] = text
      .split(" ")
      .map((word) => word.toLowerCase());
    return textArray.some((word) => userString.match(word));
  };
  const onPageChange = (page: { selected: number }) => {
    setCurrentPage(page.selected);
  };

  const batchDelete = () => {
    setAllUsers(allUsers.filter((user) => !user.isChecked));
    setIsAllSelected(false);
  };
  const selectVisibleUsers = () => {
    setAllUsers(
      allUsers.map((user) => {
        if (paginatedUsers.find((pUser) => pUser.id === user.id)) {
          return {
            ...user,
            isChecked: !user.isChecked
          };
        }
        return user;
      })
    );
  };
  useEffect(() => {
    setPaginatedUsers(
      currentUsers.filter(
        (_, index) =>
          index >= 10 * currentPage && index < 10 * (currentPage + 1)
      )
    );
  }, [currentPage, currentUsers]);

  useEffect(() => {
    if (!searchText) {
      setCurrentUsers(allUsers);
    } else {
      setCurrentUsers(allUsers.filter((user) => comparator(searchText, user)));
    }
  }, [searchText, allUsers]);
  return (
    <div className="App">
      <SearchField
        onChange={(text: string, _: React.ChangeEvent<HTMLInputElement>) =>
          setSearchText(text)
        }
        placeholder="Search..."
        searchText={searchText}
        classNames="search-bar"
      />

      <div className="rows">
        <div className="row-container headers">
          <strong className="name">
            {isAllSelected ? (
              <ImCheckboxChecked
                size={20}
                onClick={() => {
                  selectVisibleUsers();
                  setIsAllSelected(false);
                }}
              />
            ) : (
              <ImCheckboxUnchecked
                size={20}
                onClick={() => {
                  selectVisibleUsers();
                  setIsAllSelected(true);
                }}
              />
            )}
            Name
          </strong>
          <strong className="email">Email</strong>
          <strong className="role">Role</strong>
          <strong className="actions">Actions</strong>
        </div>
        {paginatedUsers.map((user) => (
          <Row
            editHandler={editHandler}
            deleteHandler={deleteHandler}
            selectionHandler={selectionHandler}
            key={user.id}
            {...user}
          />
        ))}
      </div>
      <div className="footer">
        <button onClick={batchDelete} className="batch-delete">
          Delete Selected
        </button>
        <div className="pagination-container">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(0)}
            className="first-page"
          >
            {`<<`}{" "}
          </button>
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={<a href="">...</a>}
            breakClassName={"break-me"}
            pageCount={currentUsers.length / 10}
            marginPagesDisplayed={2}
            pageRangeDisplayed={currentUsers.length / 10}
            onPageChange={onPageChange}
            containerClassName={"pagination"}
            activeClassName={"active"}
            forcePage={currentPage}
            nextClassName={`next ${
              currentPage >= currentUsers.length / 10 - 1 ? "disabled" : ""
            }`}
          />
          <button
            disabled={currentPage === getLastPageNumber(currentUsers.length)}
            className="last-page"
            onClick={() =>
              setCurrentPage(getLastPageNumber(currentUsers.length))
            }
          >
            {`>>`}{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
