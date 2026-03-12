import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Article {
  id: string;
  title: string;
  author: string;
  created_at: string;
  content: string;
  image_src?: string;
}

interface ArticleFormData {
  title: string;
  author: string;
  content: string;
  image_src?: string;
}

export default function ArticleUpdate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    author: "",
    content: "",
    image_src: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      console.log("ArticleUpdate - ID from params:", id);

      if (!id) {
        console.error("ArticleUpdate - No ID provided");
        alert("Article ID is required");
        navigate("/cms/articles");
        return;
      }

      try {
        const token = localStorage.getItem("auth_token");
        const url = `https://nkdvrw8s-3000.asse.devtunnels.ms/v1/article/${id}`;
        console.log("ArticleUpdate - Fetching from:", url);

        const response = await fetch(url, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        console.log("ArticleUpdate - Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("ArticleUpdate - API Error:", {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          });
          throw new Error(
            `Failed to fetch: ${response.status} ${response.statusText}`,
          );
        }

        const result = await response.json();
        console.log("ArticleUpdate - Response data:", result);

        const article: Article = result.data;

        if (article) {
          setFormData({
            title: article.title || "",
            author: article.author || "",
            content: article.content || "",
            image_src: article.image_src || "",
          });
        }
      } catch (error) {
        console.error("ArticleUpdate - Error:", error);
        alert(
          `Failed to fetch article data: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        navigate("/cms/articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("auth_token");

      // ID dimasukkan ke dalam body JSON sesuai requirement backend
      const payload = {
        id: id,
        title: formData.title,
        author: formData.author,
        content: formData.content,
        image_src: formData.image_src || undefined,
      };

      console.log("Sending payload:", payload);

      // PUT endpoint tanpa ID di URL
      const url = `https://nkdvrw8s-3000.asse.devtunnels.ms/v1/article`;
      console.log("Updating article from:", url);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        }
        const errorData = await response.json().catch(() => ({}));
        console.error("API error:", errorData);
        throw new Error(errorData?.message || "Failed to update article");
      }

      alert("Article updated successfully!");
      navigate("/cms/articles");
    } catch (error) {
      console.error("Error updating article:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update article",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async () => {
    if (!id) {
      alert("Article ID not found");
      return;
    }

    if (!confirm("Are you sure you want to delete this article?")) {
      return;
    }

    try {
      const token = localStorage.getItem("auth_token");

      const url = `https://nkdvrw8s-3000.asse.devtunnels.ms/v1/articles`;

      const payload = {
        ids: [id], // backend membutuhkan array
      };

      console.log("Deleting payload:", payload);

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || "Failed to delete article");
      }

      alert("Article deleted successfully!");
      navigate("/cms/articles");
    } catch (error) {
      console.error("Delete error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to delete article",
      );
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-2 my-2">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Article</h1>
        <p className="text-gray-500 mt-1">Update your article content</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 px-10 py-6 space-y-6"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none resize-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="image_src"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Image URL (Optional)
          </label>
          <input
            type="text"
            id="image_src"
            name="image_src"
            value={formData.image_src}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
          />
          {formData.image_src && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">Preview:</p>
              <div className="relative w-full max-w-md rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={formData.image_src}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='192'%3E%3Crect fill='%23e5e7eb' width='320' height='192'/%3E%3Ctext fill='%239ca3af' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EInvalid URL%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/cms/articles")}
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-red-300 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
          >
            Delete Article
          </button>
        </div>
      </form>
    </div>
  );
}
