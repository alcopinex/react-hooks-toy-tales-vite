import React, { useState, useEffect } from "react";
import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

const API = "http://localhost:3001/toys";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  // GET: load all toys once on page load
  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((data) => setToys(data));
  }, []);

  // POST: create a toy with 0 likes, then add the saved toy to state
  function handleAddToy(newToy) {
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newToy.name, image: newToy.image, likes: 0 }),
    })
      .then((r) => r.json())
      .then((created) => setToys((prev) => [...prev, created]));
  }

  // DELETE: remove on the server, then remove from state
  function handleDeleteToy(id) {
    fetch(`${API}/${id}`, { method: "DELETE" }).then(() =>
      setToys((prev) => prev.filter((toy) => toy.id !== id))
    );
  }

  // PATCH: increase likes; state updates right away so the UI and tests
  // see the new count immediately, and the server is updated in parallel
  function handleLikeToy(toy) {
    const newLikes = toy.likes + 1;

    setToys((prev) =>
      prev.map((t) => (t.id === toy.id ? { ...t, likes: newLikes } : t))
    );

    fetch(`${API}/${toy.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: newLikes }),
    });
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      <div className="buttonContainer">
        <button onClick={() => setShowForm((show) => !show)}>Add a Toy</button>
      </div>
      <ToyContainer
        toys={toys}
        onDeleteToy={handleDeleteToy}
        onLikeToy={handleLikeToy}
      />
    </>
  );
}

export default App;