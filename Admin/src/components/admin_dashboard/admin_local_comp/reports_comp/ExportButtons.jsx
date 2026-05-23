import { FiDownload, FiPrinter, FiMail } from "react-icons/fi";

const ExportButtons = ({ onExportPdf }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
      <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100">
        <FiDownload />
        <span>Export as CSV</span>
      </button>
      <button onClick={onExportPdf} className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
        <FiDownload />
        <span>Export as PDF</span>
      </button>
      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
        <FiPrinter />
        <span>Print Report</span>
      </button>
      <button className="flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">
        <FiMail />
        <span>Email Report</span>
      </button>
    </div>
  );
};

export default ExportButtons;
