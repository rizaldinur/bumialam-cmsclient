import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ArticleFormData {
  title: string;
  content: string;
  img_file: File | null;
}

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function ArticleAdd() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    content: "",
    img_file: null,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("auth_token");

      // Gunakan FormData untuk multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      if (formData.img_file) {
        formDataToSend.append("img_file", formData.img_file);
      }

      const response = await fetch(
        API_URL + "/v1/article",
        {
          method: "POST",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            // Jangan set Content-Type, biarkan browser set otomatis dengan boundary
          },
          body: formDataToSend,
        },
      );

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        }
        throw new Error(responseData?.message || "Failed to create article");
      }

      alert("Article created successfully!");
      navigate("/cms/articles");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to create article",
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, img_file: file }));
  };

  return (
    <div className="max-w-6xl mx-auto my-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add Article</h1>
        <p className="text-gray-500 mt-2">Create a new article</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 space-y-6"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
            placeholder="Enter article title"
            required
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none resize-none transition-all"
            placeholder="Write your article content here"
            required
          />
        </div>

        <div>
          <label
            htmlFor="img_file"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Image <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="file"
            id="img_file"
            name="img_file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
          />
          {formData.img_file && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2 font-medium">Preview:</p>
              <div className="relative w-full max-w-md rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <img
                  src={URL.createObjectURL(formData.img_file)}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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
              "Create Article"
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/cms/articles")}
            className="inline-flex items-center gap-2 px-8 py-3 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
