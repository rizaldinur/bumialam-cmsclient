import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface HeroFormData {
  hero_text: string;
  hero_sub_text: string;
}

const API_URL = import.meta.env.VITE_API_BASE_URL;


export default function HeroEdit() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [heroId, setHeroId] = useState<string>("");
  const [formData, setFormData] = useState<HeroFormData>({
    hero_text: "",
    hero_sub_text: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        // const token = localStorage.getItem("auth_token");
        const response = await fetch(
          API_URL+"/v1/hero",
          // {
          //   headers: {
          //     ...(token ? { Authorization: `Bearer ${token}` } : {}),
          //   },
          // },
        );
        const result = await response.json();
        const hero = result.data?.[0] || null;

        if (hero) {
          setHeroId(hero.id || "");
          setFormData({
            hero_text: hero.hero_text || "",
            hero_sub_text: hero.hero_sub_text || "",
          });
          setPreviewUrl(hero.hero_img_src || "");
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // const token = localStorage.getItem("auth_token");

      const body = new FormData();
      body.append("id", heroId);
      body.append("hero_text", formData.hero_text);
      body.append("hero_sub_text", formData.hero_sub_text);

      if (selectedFile) {
        body.append("img_file", selectedFile);
      } else if (previewUrl) {
        // Kirim existing image URL jika tidak ada file baru
        body.append("existing_img_url", previewUrl);
      }

      const response = await fetch(
        API_URL+"/v1/hero",
        {
          method: "PUT",
          // headers: {
          //   ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // },
          body,
        },
      );

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        }
        console.error("API error:", responseData);
        throw new Error(responseData?.message || "Failed to update hero data");
      }

      alert("Hero data updated successfully!");
      navigate("/cms/hero");
    } catch (error) {
      console.error("Error updating hero data:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update hero data",
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

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-2 my-2">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Edit Hero Section
        </h1>
        <p className="text-gray-500 mt-1">Update your hero section content</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 px-10 py-6 space-y-6"
      >
        <div>
          <label
            htmlFor="hero_text"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Hero Text
          </label>
          <input
            type="text"
            id="hero_text"
            name="hero_text"
            value={formData.hero_text}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="hero_sub_text"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Hero Sub Text
          </label>
          <textarea
            id="hero_sub_text"
            name="hero_sub_text"
            value={formData.hero_sub_text}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none resize-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="hero_img_src"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Hero Image
          </label>
          <input
            type="file"
            id="hero_img_src"
            name="hero_img_src"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
          />
          {previewUrl && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">Preview:</p>
              <div className="relative w-full max-w-md rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={previewUrl}
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
            onClick={() => navigate("/cms/hero")}
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
