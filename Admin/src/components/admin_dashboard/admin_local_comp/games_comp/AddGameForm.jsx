import { useState } from "react";

const AddGameForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    reward: 0,
    category: "action",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call to add game
    console.log("New game:", form);
    alert("Game added (demo)");
    setForm({ title: "", description: "", reward: 0, category: "action" });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Add New Game</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Game Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            <option value="action">Action</option>
            <option value="puzzle">Puzzle</option>
            <option value="strategy">Strategy</option>
            <option value="trivia">Trivia</option>
          </select>
          <input
            type="number"
            placeholder="Reward ($)"
            value={form.reward}
            onChange={(e) => setForm({ ...form, reward: parseFloat(e.target.value) })}
            className="px-4 py-2 border rounded-lg"
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="px-4 py-2 border rounded-lg md:col-span-2"
            rows="3"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add Game
        </button>
      </form>
    </div>
  );
};

export default AddGameForm;