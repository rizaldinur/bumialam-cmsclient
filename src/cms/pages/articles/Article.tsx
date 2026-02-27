import { useNavigate } from "react-router-dom";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  status: "published" | "draft";
}

const mockArticles: Article[] = [
  {
    id: 1,
    title: "Getting Started with Nature Photography",
    excerpt: "Learn the basics of capturing stunning nature photos...",
    author: "John Doe",
    date: "2025-02-25",
    status: "published",
  },
  {
    id: 2,
    title: "Top 10 Hiking Trails in Indonesia",
    excerpt: "Discover the most beautiful hiking destinations...",
    author: "Jane Smith",
    date: "2025-02-24",
    status: "published",
  },
  {
    id: 3,
    title: "Sustainable Travel Tips",
    excerpt: "How to explore the world while minimizing your impact...",
    author: "John Doe",
    date: "2025-02-23",
    status: "draft",
  },
];

export default function ArticleList() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Articles</h1>
          <p className="text-gray-500 mt-1">Manage your articles and blog posts</p>
        </div>
        <button
          onClick={() => navigate("/articles/add")}
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Article
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                Title
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                Author
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                Date
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                Status
              </th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockArticles.map((article) => (
              <tr
                key={article.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{article.title}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {article.excerpt}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">
                    {article.author}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{article.date}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      article.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
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
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
