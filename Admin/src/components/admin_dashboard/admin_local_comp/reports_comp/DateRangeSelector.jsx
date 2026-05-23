// import { useState } from "react";
// import { FiCalendar } from "react-icons/fi";

// const DateRangeSelector = () => {
//   const [range, setRange] = useState("7d");
//   const [customStart, setCustomStart] = useState("");
//   const [customEnd, setCustomEnd] = useState("");

//   return (
//     <div className="bg-white rounded-lg shadow p-4 flex flex-wrap items-center gap-4">
//       <div className="flex items-center space-x-2">
//         <FiCalendar className="text-gray-400" />
//         <span className="text-sm font-medium">Date Range:</span>
//       </div>
//       <div className="flex flex-wrap gap-2">
//         {["7d", "30d", "90d", "12m"].map((option) => (
//           <button
//             key={option}
//             onClick={() => setRange(option)}
//             className={`px-3 py-1 rounded-full text-sm ${
//               range === option
//                 ? "bg-indigo-600 text-white"
//                 : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//           >
//             {option === "7d" ? "Last 7 days" :
//              option === "30d" ? "Last 30 days" :
//              option === "90d" ? "Last 90 days" : "Last 12 months"}
//           </button>
//         ))}
//       </div>
//       <div className="flex items-center gap-2 ml-auto">
//         <input
//           type="date"
//           value={customStart}
//           onChange={(e) => setCustomStart(e.target.value)}
//           className="px-3 py-1 border rounded-lg text-sm"
//         />
//         <span>to</span>
//         <input
//           type="date"
//           value={customEnd}
//           onChange={(e) => setCustomEnd(e.target.value)}
//           className="px-3 py-1 border rounded-lg text-sm"
//         />
//         <button className="px-4 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
//           Apply
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DateRangeSelector;






import { useState } from "react";
import { FiCalendar } from "react-icons/fi";

const DateRangeSelector = () => {
  const [range, setRange] = useState("7d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-wrap items-center gap-4">
      <div className="flex items-center space-x-2">
        <FiCalendar className="text-gray-400" />
        <span className="text-sm font-medium">Date Range:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {["7d", "30d", "90d", "12m"].map((option) => (
          <button
            key={option}
            onClick={() => setRange(option)}
            className={`px-3 py-1 rounded-full text-sm ${
              range === option
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {option === "7d" ? "Last 7 days" :
             option === "30d" ? "Last 30 days" :
             option === "90d" ? "Last 90 days" : "Last 12 months"}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <input
          type="date"
          value={customStart}
          onChange={(e) => setCustomStart(e.target.value)}
          className="px-3 py-1 border rounded-lg text-sm"
        />
        <span>to</span>
        <input
          type="date"
          value={customEnd}
          onChange={(e) => setCustomEnd(e.target.value)}
          className="px-3 py-1 border rounded-lg text-sm"
        />
        <button className="px-4 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
          Apply
        </button>
      </div>
    </div>
  );
};

export default DateRangeSelector;