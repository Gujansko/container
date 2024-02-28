import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:4000/notes")
      .then((res) => {
        console.log(res.data);
        setNotes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="App">
      <h1>Notes</h1>
      <div>
        {notes ? (
          notes.map((note) => {
            return (
              <div key={note._id}>
                <h2>{note.title}</h2>
                <p>{note.content}</p>
              </div>
            );
          })
        ) : (
          <h2>Loading ...</h2>
        )}
      </div>
    </div>
  );
}

export default App;
