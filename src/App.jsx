import "./App.css";
import { useState, useEffect } from "react";
import { backend } from "./axios";
import axios from "axios";

function App() {
  const [rate, setRate] = useState(null);
  const [field, setField] = useState("");
  const [result, setResult] = useState(0);
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState([]);
  const [currencyHidden, setCurrencyHidden] = useState(false);
  const [repoHidden, setRepoHidden] = useState(false);
  const [bookName, setBookName] = useState("");
  const [books, setBooks] = useState([]);
  const [booksHidden, setBooksHidden] = useState(false);

  useEffect(() => {
    backend
      .get(`fetch-one?api_key=${import.meta.env.VITE_API_KEY}&from=USD&to=UZS`)
      .then((response) => {
        if (response.status === 200) {
          setRate(response.data.result.UZS);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function validateCurrency() {
    if (field.trim() === "") {
      alert("Please enter amount in USD");
      return false;
    }
    return true;
  }

  function validateSearch() {
    if (username.trim() === "") {
      alert("Please enter GitHub username");
      return false;
    }
    return true;
  }

  function handleConvert(e) {
    e.preventDefault();
    if (validateCurrency()) {
      setResult((Number(field) * rate).toFixed(2));
      setCurrencyHidden(true);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (validateSearch()) {
      axios
        .get(`https://api.github.com/users/${username}/repos`, {
          headers: {
            Authorization: `token ${import.meta.env.VITE_API_TOKEN}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setRepos(response.data);
            setRepoHidden(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  function handleSearchBooks(e) {
    e.preventDefault();
    if (bookName.trim() === "") {
      alert("Please enter book name...");
      return;
    }
    axios
      .get(`https://www.googleapis.com/books/v1/volumes?q=${bookName}`)
      .then((response) => {
        console.log(response.data);
        setBooks(response.data.items);
        setBooksHidden(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="flex flex-col items-center justify-center mt-[25px]">
      <form className="flex flex-col bg-white p-[2.2rem] w-[420px] rounded-md mb-[30px] ">
        <h1 className="text-[25px] font-semibold mb-6">
          Currency Converter USD to UZS
        </h1>
        <input
          className="border border-blue-950 px-4 py-3 rounded-md outline-none mb-6"
          value={field}
          onChange={(e) => setField(e.target.value)}
          placeholder="Enter amount in USD..."
          type="number"
        />
        <button
          className="bg-blue-500 text-white font-medium p-3 rounded-md mb-6"
          onClick={handleConvert}
        >
          Convert
        </button>
        {currencyHidden && (
          <h2 className="text-4xl">
            {field} USD = {result} SUM
          </h2>
        )}
      </form>

      <form className="flex flex-col bg-white p-[2.2rem] w-[420px] rounded-md mb-10">
        <h1 className="text-[25px] font-semibold mb-6">
          Top 10 Git Hub Repository
        </h1>
        <input
          className="border border-blue-950 px-4 py-3 rounded-md outline-none mb-6"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username..."
          type="text"
        />
        <button
          className="bg-blue-500 text-white font-medium p-3 rounded-md mb-6"
          onClick={handleSearch}
        >
          Search
        </button>
      </form>
      {repoHidden && (
        <div className="flex bg-white p-[2.2rem] w-[420px] rounded-md items-start justify-center mb-10">
          {repos.length > 0 && (
            <ol className="list-decimal">
              {repos
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 10)
                .map((repo, index) => (
                  <li className="mb-1" key={index}>
                    {repo.name} - {repo.stargazers_count} stars
                  </li>
                ))}
            </ol>
          )}
        </div>
      )}

      <form className="flex flex-col bg-white p-[2.2rem] w-[420px] rounded-md mb-10">
        <h1 className="text-[25px] font-semibold mb-6">Book Search</h1>
        <input
          className="border border-blue-950 px-4 py-3 rounded-md outline-none mb-6"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
          placeholder="Enter Book name..."
          type="text"
        />
        <button
          className="bg-blue-500 text-white font-medium p-3 rounded-md mb-6"
          onClick={handleSearchBooks}
        >
          Search Books
        </button>
        <button
          className="bg-green-500 text-white font-medium p-3 rounded-md"
          onClick={handleSearchBooks}
        >
          Reload
        </button>
      </form>
      {booksHidden && (
        <div className="flex flex-wrap justify-center">
          {books.map((book, index) => (
            <div
              className="border border-blue-950 p-5 m-2 w-[300px] text-center "
              key={index}
            >
              <img
                src={book.volumeInfo.imageLinks?.thumbnail}
                alt={book.volumeInfo.title}
                className="mb-2 w-full h-[300px] object-cover"
              />
              <h3 className="text-3xl text-[#333] font-semibold mb-2">
                Name Book:{book.volumeInfo.title}
              </h3>
              <p className="text-3xl font-medium">
                Author:{" "}
                {book.volumeInfo.authors
                  ? book.volumeInfo.authors
                  : "Author Not defined"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
