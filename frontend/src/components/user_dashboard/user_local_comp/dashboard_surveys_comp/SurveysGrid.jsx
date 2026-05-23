import React from 'react';
import SurveyCard from './SurveyCard';

const SurveysGrid = ({ surveys, onStartSurvey, completedSurveyIds }) => {
  if (!surveys || surveys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <div className="text-5xl mb-4">📭</div>
        <h3 className="text-xl font-bold text-gray-900">No Surveys Available</h3>
        <p className="text-gray-500 mt-2">Check back later for new earning opportunities!</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Latest Opportunities</h2>
        <span className="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">{surveys.length} Active</span>
      </div>
      
      <div className="max-h-[600px] overflow-y-auto pr-2 pb-4 space-y-2 relative" 
           style={{ scrollbarWidth: 'thin', scrollbarColor: '#fed7aa transparent' }}>
           
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {surveys.map((survey) => (
            <SurveyCard 
              key={survey._id} 
              survey={survey} 
              onStart={onStartSurvey} 
              /* Check karega ki kya ye ID completed list mein hai */
              isCompleted={completedSurveyIds?.includes(survey._id)} 
            />
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default SurveysGrid;