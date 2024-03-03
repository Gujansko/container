import "./CheckpointForm.css";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import UserDataContext from "../../contexts/UserDataContext";
import { useNavigate } from "react-router-dom";

const CheckpointForm = () => {
  const navigate = useNavigate();
  const { userDataContextValue } = useContext(UserDataContext);

  const [name, setName] = useState("");
  const [checkpoints, setCheckpoints] = useState(null);
  const [fetchFormError, setFetchFormError] = useState(null);
  const [distance, setDistance] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userDataContextValue) {
      navigate("/");
    }

    axios
      .get("http://localhost:4001/checkpoints")
      .then((res) => {
        console.log(res.data);
        const checkpoints = res.data.map((checkpoint) => {
          console.log(checkpoint);
          return {
            name: checkpoint.name,
            id: checkpoint._id,
          };
        });
        setCheckpoints(checkpoints);
        setDistance(new Array(checkpoints.length).fill(""));
        setFetchFormError(false);
      })
      .catch((err) => {
        setFetchFormError(true);
      });
  }, [fetchFormError, navigate, userDataContextValue]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (checkpoints.length !== distance.length) {
      setError("Please fill all distances");
      return;
    }

    if (
      distance.some((d) => d.length === 0) ||
      distance.some((d) => parseFloat(d) <= 0)
    ) {
      setError("Please fill all distances with positive numbers");
      return;
    }

    if (name.trim().length === 0) {
      setError("Name is required");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4001/checkpoint", {
        name: name.trim(),
      });

      const checkpointId = res.data._id;
      for (let i = 0; i < checkpoints.length; i++) {
        await axios.post("http://localhost:4001/distance", {
          from: checkpointId,
          to: checkpoints[i].id,
          distance: distance[i],
        });
      }

      setError(null);
      alert("Checkpoint created successfully");
      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="login-form">
      <h2>Create checkpoint</h2>
      {error && <p className="error">{error}</p>}
      {fetchFormError && (
        <p className="error">
          Couldn't fetch data from server to create form please try again later
        </p>
      )}
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          placeholder="Enter name for a new checkpoint"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      {checkpoints ? (
        <>
          {checkpoints.length > 0 && (
            <h3>Set distances to checkpoints in km</h3>
          )}
          {checkpoints.map((checkpoint, index) => (
            <div key={index} className="form-group">
              <label htmlFor={checkpoint.name}>{checkpoint.name}</label>
              <input
                type="number"
                id={checkpoint.name}
                placeholder={`Enter distance to ${checkpoint.name}`}
                required
                value={distance[index]}
                onChange={(e) => {
                  const newDistance = [...distance];
                  newDistance[index] = e.target.value;
                  setDistance(newDistance);
                }}
              />
            </div>
          ))}
        </>
      ) : (
        fetchFormError === false && <p>Loading data from server</p>
      )}
      <button type="submit" className="submit" disabled={fetchFormError}>
        Submit
      </button>
    </form>
  );
};

export default CheckpointForm;
