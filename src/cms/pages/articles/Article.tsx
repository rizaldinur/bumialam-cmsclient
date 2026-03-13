import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Article {
  id: string;
  title: string;
  author: string;
  created_at: string;
  content: string;
  image_src?: string;
}

interface ArticleResponse {
  message: string;
  success: boolean;
  status_code: number;
  data: Article[];
}

const API_URL = "https://nkdvrw8s-3000.asse.devtunnels.ms/v1/article";

export default function Article() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) {
      return;
    }

    try {
      const token = localStorage.getItem("auth_token");

      const response = await fetch(
        "https://nkdvrw8s-3000.asse.devtunnels.ms/v1/articles",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ ids: [id] }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || "Failed to delete article");
      }

      // Refresh the list after successful deletion
      setArticles((prev) => prev.filter((article) => article.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete article");
    }
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ArticleResponse = await response.json();

        setArticles(result.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch articles",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  //kalo API fetch nyala tanda (!) dihapus
  if (loading) {
    return (
      <div className="max-w-6xl flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Articles</h1>
          <p className="text-gray-500 mt-1">
            Manage your articles and blog posts
          </p>
        </div>

        <button
          onClick={() => navigate("/cms/articles/add")}
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
              <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No articles found
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr
                  key={article.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {article.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2 max-w-2xl">
                        {article.content}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {article.author}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* Edit */}
                      <button
                        onClick={() =>
                          navigate(`/cms/articles/update/${article.id}`)
                        }
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-100 rounded-lg transition-colors"
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
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
