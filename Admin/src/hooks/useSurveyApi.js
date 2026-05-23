import { useState, useEffect } from 'react';
import axios from 'axios';

export const useSurvey = () => {
  const [surveys, setSurveys] = useState([]);
  const [activeSurvey, setActiveSurvey] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [userStats, setUserStats] = useState({ completed: 0, earned: 0 });
  const [completedSurveyIds, setCompletedSurveyIds] = useState([]);

  useEffect(() => {
    // Page load par stats aur completed surveys nikalna
    const savedStats = localStorage.getItem('userSurveyStats');
    if (savedStats) setUserStats(JSON.parse(savedStats));

    const savedIds = localStorage.getItem('completedSurveyIds');
    if (savedIds) setCompletedSurveyIds(JSON.parse(savedIds));
  }, []);

  const loadSurveys = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/surveys/all');
      setSurveys(res.data || []);
      setError('');
    } catch {
      setError('Failed to load surveys');
    } finally {
      setLoading(false);
    }
  };

  const removeSurvey = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/surveys/delete/${id}`);
      setSurveys(surveys.filter(s => s._id !== id));
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const startSurvey = (id) => {
    // Security check: Agar pehle se complete hai toh wapas bhej do
    if (completedSurveyIds.includes(id)) {
      alert("Aap yeh survey pehle hi complete kar chuke hain. Kripya koi naya survey try karein!");
      return;
    }

    const survey = surveys.find(s => s._id === id);
    if (survey) {
      setActiveSurvey(survey);
      setCurrentQuestionIndex(0);
      setUserAnswers(new Array(survey.questions.length).fill(null));
      setResult(null);
    }
  };

  const answerQuestion = (answer) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const submitSurvey = async () => {
    try {
      let userId = null;
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const parsed = JSON.parse(userStr);
        userId = parsed.id || parsed._id;
      }

      if (!userId) userId = "65f1a2b3c4d5e6f7a8b9c0d1"; // Test ID

      // Backend ko submit request bhejna
      const res = await axios.post(`http://localhost:5000/api/surveys/submit/${activeSurvey._id}`, { userId });
      
      // 🔥 NAYA MYSTERY CRATE LOGIC (Catching Gamified Data from Backend)
      // Agar backend se naya data nahi bhi aaya, toh purana logic fail na ho isliye fallback lagaya hai
      const earned = res.data.earnedCoins || (activeSurvey.reward + 10);
      const baseReward = res.data.baseReward || (activeSurvey.reward + 10);
      const multiplier = res.data.multiplier || 1;
      const isJackpot = res.data.isJackpot || false;
      
      setResult({ 
        surveyTitle: activeSurvey.title, 
        earnedCoins: earned,
        baseReward: baseReward,
        multiplier: multiplier,
        isJackpot: isJackpot
      });

      // Stats Update
      const newStats = { completed: userStats.completed + 1, earned: userStats.earned + earned };
      setUserStats(newStats);
      localStorage.setItem('userSurveyStats', JSON.stringify(newStats));

      // ID ko completed list mein daal kar save karna taaki dobara na kar sake
      const newCompletedIds = [...completedSurveyIds, activeSurvey._id];
      setCompletedSurveyIds(newCompletedIds);
      localStorage.setItem('completedSurveyIds', JSON.stringify(newCompletedIds));
      
      // Header balance update event
      window.dispatchEvent(new Event("balanceUpdated"));
      window.dispatchEvent(new Event("walletUpdated"));
      
    } catch {
      alert("Submission Failed: Make sure Backend is running!");
    }
  };

  const closeSurvey = () => {
    setActiveSurvey(null);
    setResult(null);
    loadSurveys();
  };

  return {
    surveys, activeSurvey, currentQuestionIndex, userAnswers, result, loading, error, 
    userStats, completedSurveyIds, 
    loadSurveys, removeSurvey, startSurvey, answerQuestion, 
    nextQuestion: () => setCurrentQuestionIndex(p => p + 1), 
    prevQuestion: () => setCurrentQuestionIndex(p => p - 1), 
    submitSurvey, closeSurvey
  };
};