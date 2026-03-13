import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface HeroData {
  id: number;
  hero_text: string;
  hero_sub_text: string;
  hero_img_src: string;
}

export default function Hero() {
  const navigate = useNavigate();
  const [heroData, setHeroData] = useState<HeroData | null>(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch(
          "https://nkdvrw8s-3000.asse.devtunnels.ms/v1/hero",
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );

        const result = await response.json();

        // Ambil data pertama dari array
        const hero = result.data?.[0] || null;

        setHeroData(hero);
      } catch (error) {
        console.error("Error fetching hero data:", error);
      }
    };

    fetchHeroData();
  }, []);

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
        <div className="relative mx-auto grid max-w-7xl items-center px-6 pt-14 pb-16 md:px-20 md:pt-36 md:pb-20 lg:grid-cols-2">
          <div className="order-2 flex flex-col justify-center lg:order-1 lg:pr-4">
            {/* hero text */}
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-[3.25rem] xl:leading-[1.15]">
              {heroData?.hero_text ??
                "Solusi event yang terorganisir dari awal sampai selesai."}
            </h1>
            {/* sub-text */}
            <p className="mt-6 max-w-[530px] text-lg text-muted-foreground">
              {heroData?.hero_sub_text ??
                "Satu platform untuk tiket, checkout, dan pelaporan. Bikin acara Anda berjalan mulus dan tamu merasa dihargai."}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 md:text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Mulai Sekarang
                {/* <ArrowRight className="size-4" aria-hidden /> */}
              </a>
              <a
                href="#our-services"
                className="inline-flex items-center rounded-full border-2 border-primary px-6 py-3 md:text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Lihat Layanan
              </a>
            </div>
          </div>

          {/* image */}
          <div className="order-1 flex items-center justify-center lg:order-2 lg:justify-end">
            <div className=" max-w-lg">
              {/* White isolation layer */}
              <div className="rounded-3xl bg-white p-2 shadow-xl">
                <div className="overflow-hidden rounded-2xl lg:rounded-3xl">
                  <img
                    src={heroData?.hero_img_src ?? "/rafi2.PNG"}
                    alt="Ilustrasi manajemen event dan tiket"
                    className="w-[500px] h-[350px] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => navigate("/cms/hero/edit")}
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
