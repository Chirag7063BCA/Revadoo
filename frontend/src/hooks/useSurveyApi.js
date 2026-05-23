import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../services/apiConfig';

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
    const savedStats = localStorage.getItem('userSurveyStats');
    if (savedStats) setUserStats(JSON.parse(savedStats));

    const savedIds = localStorage.getItem('completedSurveyIds');
    if (savedIds) setCompletedSurveyIds(JSON.parse(savedIds));
  }, []);

  const loadSurveys = async () => {
    if (surveys.length === 0) setLoading(true); 
    
    try {
      const res = await axios.get(apiUrl('/surveys/all'));
      setSurveys(res.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load surveys');
    } finally {
      setLoading(false);
    }
  };

  const removeSurvey = async (id) => {
    setSurveys(prev => prev.filter(s => s._id !== id));
    try {
      await axios.delete(apiUrl(`/surveys/delete/${id}`));
    } catch (err) {
      loadSurveys(); 
    }
  };

  const startSurvey = (id) => {
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
      let currentCreds = 0;
      
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const parsed = JSON.parse(userStr);
        userId = parsed.id || parsed._id;
        currentCreds = parsed.creds || 0;
      }

      if (!userId) {
        throw new Error('User is required to submit a survey');
      }

      const res = await axios.post(apiUrl(`/surveys/submit/${activeSurvey._id}`), { userId });
      
      const earned = res.data.earnedCoins || (activeSurvey.reward + 10);
      const baseReward = res.data.baseReward || (activeSurvey.reward + 10);
      const multiplier = res.data.multiplier || 1;
      const isJackpot = res.data.isJackpot || false;
      
      const newBalance = typeof res.data.newBalance === "number" && res.data.newBalance > 0 
        ? res.data.newBalance 
        : currentCreds + earned; 
      
      setResult({ 
        surveyTitle: activeSurvey.title, 
        earnedCoins: earned,
        baseReward: baseReward,
        multiplier: multiplier,
        isJackpot: isJackpot,
        newBalance: newBalance
      });

      const newStats = { completed: userStats.completed + 1, earned: userStats.earned + earned };
      setUserStats(newStats);
      localStorage.setItem('userSurveyStats', JSON.stringify(newStats));

      const newCompletedIds = [...completedSurveyIds, activeSurvey._id];
      setCompletedSurveyIds(newCompletedIds);
      localStorage.setItem('completedSurveyIds', JSON.stringify(newCompletedIds));
      
    } catch (err) {
      alert("Submission Failed: Make sure Backend is running!");
    }
  };

  const closeSurvey = () => {
    setActiveSurvey(null);
    setResult(null);
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