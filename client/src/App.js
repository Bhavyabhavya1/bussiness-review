import { useState } from "react";
import "./App.css"; // Make sure to import the CSS

function App() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3001/business-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `Server error: ${res.status}`);
      }

      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const regenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:3001/regenerate-headline?name=${encodeURIComponent(
          name
        )}&location=${encodeURIComponent(location)}`
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `Server error: ${res.status}`);
      }

      const result = await res.json();
      setData((prev) => ({ ...prev, headline: result.headline }));
    } catch (err) {
      setError(err.message || "Something went wrong.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Local Business Dashboard</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Business Name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location"
          className="input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {data && (
        <div className="card">
          <p><strong>Rating:</strong> {data.rating}</p>
          <p><strong>Reviews:</strong> {data.reviews}</p>
          <p><strong>Headline:</strong> {data.headline}</p>
          <button
            onClick={regenerate}
            disabled={loading}
            className="regenerate-button"
          >
            {loading ? "Loading..." : "Regenerate Headline"}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
