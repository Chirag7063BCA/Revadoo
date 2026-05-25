import React, { useEffect } from "react";
import { useSurvey } from "../../../../hooks/useSurvey"; 

import SurveysHeader from "./SurveysHeader";
import SurveysStats from "./SurveysStats";
import SurveysGrid from "./SurveysGrid";
import ActiveSurvey from "./ActiveSurvey";
import SurveysResult from "./SurveyResults";

const DashboardSurveys = () => {
  const {
    surveys, activeSurvey, currentQuestionIndex, userAnswers, result, loading, error, 
    userStats, completedSurveyIds, 
    loadSurveys, startSurvey, answerQuestion, nextQuestion, prevQuestion, submitSurvey, closeSurvey
  } = useSurvey();

  useEffect(() => {
    loadSurveys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <SurveysHeader />
      
      {!activeSurvey && !result && (
        <SurveysStats available={surveys.length} completed={userStats.completed} earned={userStats.earned} />
      )}

      {error && <div className="bg-red-50 p-4 mb-4 rounded-md text-red-700 font-bold shadow-sm border-l-4 border-red-500">{error}</div>}

      {/* ZERO-LAG FIX: Agar initial load ho raha hai tabhi spinner dikhao, refresh pe nahi */}
      {loading && surveys.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#FF6B00] border-t-transparent"></div>
        </div>
      ) : (
        <>
          {!activeSurvey && !result && (
            <SurveysGrid surveys={surveys} onStartSurvey={startSurvey} completedSurveyIds={completedSurveyIds} />
          )}

          {activeSurvey && !result && (
            <ActiveSurvey
              survey={activeSurvey} currentQuestionIndex={currentQuestionIndex} userAnswers={userAnswers}
              onAnswer={answerQuestion} onNext={nextQuestion} onPrev={prevQuestion} onSubmit={submitSurvey}
            />
          )}

          {result && <SurveysResult result={result} onClose={closeSurvey} />}
        </>
      )}
    </div>
  );
};

export default DashboardSurveys;