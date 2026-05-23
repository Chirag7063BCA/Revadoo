import { useCallback, useState } from "react";
import { createQuiz } from "../../../../services/api";

const createEmptyQuestion = () => ({
  text: "",
  options: ["", "", "", ""],
  correctAnswer: "",
});

const AddQuizForm = ({ onQuizCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [reward, setReward] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [questions, setQuestions] = useState([createEmptyQuestion()]);

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setThumbnail("");
    setReward(10);
    setQuestions([createEmptyQuestion()]);
  }, []);

  const addQuestion = useCallback(() => {
    setQuestions((prev) => [...prev, createEmptyQuestion()]);
  }, []);

  const removeQuestion = useCallback((index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuestion = useCallback((index, field, value) => {
    setQuestions((prev) =>
      prev.map((question, questionIndex) =>
        questionIndex === index
          ? { ...question, [field]: value }
          : question,
      ),
    );
  }, []);

  const updateOption = useCallback((questionIndex, optionIndex, value) => {
    setQuestions((prev) =>
      prev.map((question, currentQuestionIndex) => {
        if (currentQuestionIndex !== questionIndex) return question;

        const updatedOptions = question.options.map((option, currentOptionIndex) =>
          currentOptionIndex === optionIndex ? value : option,
        );

        const currentAnswerStillExists = updatedOptions.includes(
          question.correctAnswer,
        );

        return {
          ...question,
          options: updatedOptions,
          correctAnswer: currentAnswerStillExists ? question.correctAnswer : "",
        };
      }),
    );
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        compressImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const compressImage = useCallback((dataUrl) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      const maxWidth = 800;
      const maxHeight = 600;
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setError("Failed to process image. Please try another file.");
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      const compressedData = canvas.toDataURL("image/jpeg", 0.7);
      setThumbnail(compressedData);
    };
    img.onerror = () => {
      alert("Failed to process image. Please try another file.");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validQuestions = questions.filter(
      (q) =>
        q.text.trim() &&
        q.options.every((opt) => opt.trim()) &&
        q.correctAnswer,
    );

    if (!title.trim()) {
      setError("Please enter a quiz title");
      return;
    }

    if (validQuestions.length === 0) {
      setError("Please add at least one complete question");
      return;
    }

    const quizData = {
      title,
      description,
      thumbnail,
      reward: Number(reward),
      questions: validQuestions,
    };

    setLoading(true);
    try {
      const createdQuiz = await createQuiz(quizData);
      setSuccess("Quiz created successfully!");
      resetForm();

      setTimeout(() => setSuccess(""), 3000);
      if (onQuizCreated) onQuizCreated(createdQuiz);
    } catch (error) {
      const errMessage = error.message || "Failed to create quiz";
      if (errMessage.includes("413") || errMessage.includes("Payload")) {
        setError("Image is too large. Please upload a smaller image.");
      } else {
        setError(`Failed to create quiz: ${errMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-4xl mx-auto"
    >
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Create New Quiz</h2>
        <p className="text-gray-500 text-sm mt-1">
          Fill in the details below to launch a new quiz.
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-green-700 font-semibold">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700 font-semibold">{error}</p>
        </div>
      )}

      {/* Quiz Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Quiz Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            placeholder="e.g., General Knowledge Challenge"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            rows="3"
            placeholder="Describe what this quiz is about..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Reward (Coins)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🪙
            </span>
            <input
              type="number"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              min="0"
              required
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Quiz Thumbnail
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🖼️
                </span>
                <input
                  type="text"
                  value={
                    thumbnail && !thumbnail.startsWith("data:") ? thumbnail : ""
                  }
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder="Paste image URL here..."
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 rounded-lg p-3 text-center transition-all group">
                  <span className="text-sm font-bold text-gray-600 group-hover:text-orange-600 transition-colors">
                    📁 Browse Local Image
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
                {thumbnail && (
                  <button
                    type="button"
                    onClick={() => setThumbnail("")}
                    className="px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {thumbnail && (
              <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={thumbnail}
                  alt="Thumbnail Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-[10px] font-bold text-white uppercase tracking-wider">
                  Preview
                </div>
              </div>
            )}
          </div>
          <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest font-bold">
            Recommended: 16:9 Aspect Ratio • Max 2MB
          </p>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Questions</h3>
          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-100">
              +
            </span>
            Add Question
          </button>
        </div>

        {questions.map((question, qIndex) => (
          <div
            key={qIndex}
            className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative group"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-500 border border-gray-200">
                Question {qIndex + 1}
              </span>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Type your question here..."
                value={question.text}
                onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white transition-all"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {question.options.map((option, oIndex) => (
                  <input
                    key={oIndex}
                    type="text"
                    placeholder={`Option ${oIndex + 1}`}
                    value={option}
                    onChange={(e) =>
                      updateOption(qIndex, oIndex, e.target.value)
                    }
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white transition-all"
                    required
                  />
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Correct Answer
                </label>
                <select
                  value={question.correctAnswer}
                  onChange={(e) =>
                    updateQuestion(qIndex, "correctAnswer", e.target.value)
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white transition-all"
                  required
                >
                  <option value="">Select correct option</option>
                  {question.options.map(
                    (option, idx) =>
                      option && (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ),
                  )}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 rounded-lg text-white font-bold text-lg shadow-lg transition-all duration-200 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-[#FF6B00] to-[#ff8c00] hover:shadow-orange-200 hover:-translate-y-0.5"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⚙️</span> Creating Quiz...
          </span>
        ) : (
          "Create Quiz"
        )}
      </button>
    </form>
  );
};

export default AddQuizForm;
