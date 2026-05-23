import { useState, useEffect } from "react";
import {
  fetchQuizzes,
  fetchQuizById,
  submitQuizAttempt,
  deleteQuiz,
} from "../services/api";

export const useQuiz = () => {
  // Initialize with empty array, not undefined
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all quizzes
  const loadQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchQuizzes();
      setQuizzes(Array.isArray(data) ? data : []); // Ensure it's always an array
    } catch (err) {
      console.error("Load quizzes error:", err);
      setError(err.message);
      setQuizzes([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Start a quiz
  const startQuiz = async (quizId) => {
    setLoading(true);
    setError(null);
    try {
      const quiz = await fetchQuizById(quizId);
      setActiveQuiz(quiz);
      setCurrentQuestionIndex(0);
      setUserAnswers(new Array(quiz.questions.length).fill(null));
      setResult(null);
    } catch (err) {
      console.error("Start quiz error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Answer current question
  const answerQuestion = (answer) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = answer;
    setUserAnswers(updatedAnswers);
  };

  // Next question
  const nextQuestion = () => {
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Previous question
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit completed quiz
  const submitQuiz = async (userId) => {
    if (!activeQuiz) return;

    // Determine userId: argument or from localStorage
    let finalUserId = typeof userId === "string" && userId ? userId : null;

    if (!finalUserId) {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const user = JSON.parse(stored);
          finalUserId = user._id || user.id || null;
        }
      } catch (e) {
        console.error("Failed to get user from storage:", e);
      }
    }

    if (!finalUserId) finalUserId = "anonymous";

    setLoading(true);
    setError(null);
    try {
      const resultData = await submitQuizAttempt({
        userId: finalUserId,
        quizId: activeQuiz._id,
        userAnswers,
      });
      console.log("Quiz result:", resultData);
      setResult(resultData);
      setActiveQuiz(null);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);

      // Dispatch event to refresh balance in header
      window.dispatchEvent(
        new CustomEvent("balanceUpdated", {
          detail: {
            newBalance: resultData.totalCreds || resultData.earnedCoins,
          },
        }),
      );

      return resultData;
    } catch (err) {
      console.error("Submit quiz error:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Close quiz without submitting
  const closeQuiz = () => {
    setActiveQuiz(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setResult(null);
    setError(null);
  };

  // Delete a quiz
  const removeQuiz = async (quizId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteQuiz(quizId);
      // Immediately remove from UI and then reload from server
      setQuizzes((prev) => prev.filter((q) => q._id !== quizId));
      // Reload after a brief delay to ensure server has processed the delete
      setTimeout(() => {
        loadQuizzes();
      }, 500);
      return true;
    } catch (err) {
      console.error("Delete quiz error:", err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load quizzes on mount
  useEffect(() => {
    loadQuizzes();
  }, []);

  return {
    quizzes,
    activeQuiz,
    currentQuestionIndex,
    userAnswers,
    result,
    loading,
    error,
    startQuiz,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    submitQuiz,
    closeQuiz,
    removeQuiz,
    loadQuizzes,
  };
};
