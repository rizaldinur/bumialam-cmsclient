import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Hero Section</h1>
        <p className="text-gray-500 mt-1">Manage your hero section content</p>
      </div>

      {/* Hero Preview Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Hero Preview */}
        <div className="h-64 bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center">
          <div className="text-center px-4">
            <h2 className="text-4xl font-bold text-white mb-4">
              Welcome to Bumi Alam
            </h2>
            <p className="text-gray-300 text-lg max-w-md mx-auto">
              Explore the beauty of nature with us
            </p>
          </div>
        </div>

        {/* Edit Button */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => navigate("/hero/edit")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Hero
          </button>
        </div>
      </div>
    </>
  );
}
