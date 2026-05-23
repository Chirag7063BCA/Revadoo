const API_URL = "http://localhost:5000/api";

export const fetchQuizzes = async () => {
  const response = await fetch(`${API_URL}/quizzes`);
  if (!response.ok) throw new Error("Failed to fetch quizzes");
  return response.json();
};

export const fetchQuizById = async (id) => {
  const response = await fetch(`${API_URL}/quizzes/${id}`);
  if (!response.ok) throw new Error("Failed to fetch quiz");
  return response.json();
};

export const submitQuizAttempt = async (attemptData) => {
  const response = await fetch(`${API_URL}/attempts/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(attemptData),
  });
  if (!response.ok) throw new Error("Failed to submit quiz");
  return response.json();
};

export const createQuiz = async (quizData) => {
  const response = await fetch(`${API_URL}/quizzes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quizData),
  });

  if (!response.ok) {
    if (response.status === 413) {
      throw new Error(
        "Payload Too Large: Image is too large. Please use a smaller image.",
      );
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to create quiz (Status: ${response.status})`,
    );
  }
  return response.json();
};

export const deleteQuiz = async (quizId) => {
  const response = await fetch(`${API_URL}/quizzes/${quizId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete quiz");
  return response.json();
};
