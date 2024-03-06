import "./MeetingForm.css";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import UserDataContext from "../../contexts/UserDataContext";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const MeetingForm = () => {
  const navigate = useNavigate();
  const { userDataContextValue } = useContext(UserDataContext);

  const [checkpoints, setCheckpoints] = useState(null);
  const [fetchFormError, setFetchFormError] = useState(null);
  const [distances, setDistances] = useState(null);
  const [error, setError] = useState(null);
  const [chosenCheckpoints, setChosenCheckpoints] = useState([]);
  const [distance, setDistance] = useState(0);
  const [date, setDate] = useState("");

  useEffect(() => {
    if (!userDataContextValue) {
      navigate("/");
    }

    axios
      .get("http://localhost:4001/checkpoints")
      .then((res) => {
        const checkpoints = res.data.map((checkpoint) => {
          return {
            name: checkpoint.name,
            id: checkpoint._id,
          };
        });
        setCheckpoints(checkpoints);
        setFetchFormError(false);
      })
      .catch((err) => {
        setFetchFormError(true);
      });

    axios
      .get("http://localhost:4001/distances")
      .then((res) => {
        const distances = res.data.map((distance) => {
          return {
            from: { id: distance.from._id, name: distance.from.name },
            to: { id: distance.to._id, name: distance.to.name },
            distance: distance.distance,
          };
        });
        setDistances(distances);
        setFetchFormError(false);
      })
      .catch((err) => {
        setFetchFormError(true);
      });
  }, [fetchFormError, navigate, userDataContextValue]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (chosenCheckpoints.length < 2) {
      setError("Please choose at least two checkpoint");
      return;
    }

    if (date.trim().length === 0) {
      setError("Date is required");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4001/meeting", {
        checkpoints: chosenCheckpoints.map((checkpoint) => checkpoint.id),
        date: date,
        distance: distance,
        attendees: [userDataContextValue.id],
      });

      if (res.status !== 201) {
        setError("Failed to create meeting");
        return;
      }

      setError(null);
      alert("Meeting created successfully");
      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="login-form">
      <h2>Create Meeting Route</h2>
      {error && <p className="error">{error}</p>}
      {fetchFormError && (
        <p className="error">
          Couldn't fetch data from server to create form please try again later
        </p>
      )}
      {checkpoints && distances ? (
        <div className="meeting-group-wrapper">
          <div className="groupper">
            {checkpoints.map((checkpoint, index) => (
              <>
                {!(
                  chosenCheckpoints.length > 0 &&
                  chosenCheckpoints[chosenCheckpoints.length - 1].id ===
                    checkpoint.id
                ) && (
                  <div key={index} className="form-group">
                    <label htmlFor={checkpoint.name}>{checkpoint.name}</label>
                    <button
                      className="add-checkpoint"
                      onClick={(e) => {
                        e.preventDefault();

                        if (chosenCheckpoints.length > 0) {
                          const lastChosenCheckpoint =
                            chosenCheckpoints[chosenCheckpoints.length - 1];
                          const newDistance = distances.find(
                            (distance) =>
                              distance.from.id === lastChosenCheckpoint.id &&
                              distance.to.id === checkpoint.id
                          );

                          if (!newDistance) {
                            setError(
                              `No distance found between ${lastChosenCheckpoint.name} and ${checkpoint.name}`
                            );
                            return;
                          }
                          setDistance(distance + newDistance.distance);
                        }

                        setChosenCheckpoints([
                          ...chosenCheckpoints,
                          checkpoint,
                        ]);
                      }}
                    >
                      Add to meeting route
                    </button>
                  </div>
                )}
              </>
            ))}
          </div>
          <div className="groupper">
            {chosenCheckpoints.length > 0 ? (
              <>
                {chosenCheckpoints.map((checkpoint, index) => (
                  <div key={index} className="form-group">
                    <label>{checkpoint.name}</label>
                    <X
                      size={24}
                      className="delete-checkpoint"
                      onClick={() => {
                        if (chosenCheckpoints.length > 1) {
                          if (index === chosenCheckpoints.length - 1) {
                            const checkpointBefore =
                              chosenCheckpoints[index - 1];
                            const newDistance = distances.find(
                              (distance) =>
                                distance.from.id === checkpointBefore.id &&
                                distance.to.id === checkpoint.id
                            );
                            if (!newDistance) {
                              setError(
                                `No distance found between ${checkpointBefore.name} and ${checkpoint.name}`
                              );
                              return;
                            }
                            setDistance(distance - newDistance.distance);
                          } else {
                            const checkpointAfter =
                              chosenCheckpoints[index + 1];
                            const newDistance = distances.find(
                              (distance) =>
                                distance.from.id === checkpoint.id &&
                                distance.to.id === checkpointAfter.id
                            );
                            if (!newDistance) {
                              setError(
                                `No distance found between ${checkpoint.name} and ${checkpointAfter.name}`
                              );
                              return;
                            }
                            setDistance(distance - newDistance.distance);
                          }
                        }

                        setChosenCheckpoints([
                          ...chosenCheckpoints.slice(0, index),
                          ...chosenCheckpoints.slice(index + 1),
                        ]);
                      }}
                    />
                  </div>
                ))}
                <h2>Current overall distance: {distance}km</h2>
              </>
            ) : (
              <h2>No chosen checkpoints</h2>
            )}
          </div>
        </div>
      ) : (
        fetchFormError === false && <p>Loading data from server</p>
      )}
      <div className="form-group">
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <button type="submit" className="submit" disabled={fetchFormError}>
        Submit
      </button>
    </form>
  );
};

export default MeetingForm;
