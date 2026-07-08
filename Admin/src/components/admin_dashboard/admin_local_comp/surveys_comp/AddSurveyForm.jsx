import { useState } from "react";
import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

const AddSurveyForm = ({ onSurveyCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [reward, setReward] = useState(10);
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [questions, setQuestions] = useState([{ text: "", options: ["", ""] }]);

  const addQuestion = () => setQuestions([...questions, { text: "", options: ["", ""] }]);
  const removeQuestion = (index) => setQuestions(questions.filter((_, i) => i !== index));
  const updateQuestion = (index, value) => {
    const updated = [...questions];
    updated[index].text = value;
    setQuestions(updated);
  };
  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  // 🔥 SUPER FAST IMAGE COMPRESSOR: Reduces large images to ~50KB instantly
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return alert("File size should be less than 5MB");
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 400; // Small optimized width
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Convert to highly optimized JPEG Base64
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          setThumbnail(compressedBase64);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    const validQuestions = questions.filter(q => q.text.trim() && q.options.every(opt => opt.trim()));

    if (validQuestions.length === 0) return setError("Add at least one complete question");
    if (!expiresAt) return setError("Set an expiration time for Auto-Delete.");

    const surveyData = {
      title, description, thumbnail, reward: Number(reward), expiresAt, questions: validQuestions, category: "General"
    };

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/surveys/add`, surveyData);
      setSuccess("Survey created! It will auto-delete after the set time.");
      setTitle(""); setDescription(""); setThumbnail(""); setExpiresAt(""); setReward(10);
      setQuestions([{ text: "", options: ["", ""] }]);
      
      setTimeout(() => setSuccess(""), 3000);
      
      // Refresh the admin table instantly
      if (onSurveyCreated) onSurveyCreated();
    } catch {
      setError("Failed to create survey. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-4xl mx-auto">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Create New Survey</h2>
      </div>

      {success && <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded text-green-700 font-semibold">{success}</div>}
      {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 font-semibold">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Survey Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" rows="3" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Reward (Coins)</label>
          <input type="number" value={reward} onChange={(e) => setReward(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" min="0" required />
          <p className="text-[10px] text-orange-500 mt-1 uppercase font-bold">* User gets this amount + 10 Bonus coins!</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-orange-600 mb-2">Expiration Date & Time (Auto Delete)</label>
          <input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="w-full p-3 border border-orange-200 bg-orange-50 text-orange-800 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Survey Thumbnail</label>
          <div className="flex items-center gap-4">
            <label className="flex-1 cursor-pointer bg-gray-50 border border-dashed border-gray-300 rounded-lg p-3 text-center group">
              <span className="text-sm font-bold text-gray-600 group-hover:text-orange-600">📁 Browse Image</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
            {thumbnail && <button type="button" onClick={() => setThumbnail("")} className="px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg">Clear</button>}
          </div>
          {thumbnail && <img src={thumbnail} alt="Preview" className="mt-4 w-full h-32 rounded-xl object-cover border" />}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Questions</h3>
          <button type="button" onClick={addQuestion} className="text-sm font-bold text-orange-600">+ Add Question</button>
        </div>
        {questions.map((q, qIdx) => (
          <div key={qIdx} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-500 border">Question {qIdx + 1}</span>
              {questions.length > 1 && <button type="button" onClick={() => removeQuestion(qIdx)} className="text-red-500 text-sm font-medium">Remove</button>}
            </div>
            <input type="text" placeholder="Question text..." value={q.text} onChange={(e) => updateQuestion(qIdx, e.target.value)} className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {q.options.map((opt, oIdx) => (
                <input key={oIdx} type="text" placeholder={`Option ${oIdx + 1}`} value={opt} onChange={(e) => updateOption(qIdx, oIdx, e.target.value)} className="p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" required />
              ))}
            </div>
          </div>
        ))}
      </div>

      <button type="submit" disabled={loading} className="w-full py-4 rounded-lg text-white font-bold bg-gradient-to-r from-[#FF6B00] to-[#ff8c00] hover:shadow-lg">
        {loading ? "Creating Fast..." : "Create Auto-Deleting Survey"}
      </button>
    </form>
  );
};

export default AddSurveyForm;