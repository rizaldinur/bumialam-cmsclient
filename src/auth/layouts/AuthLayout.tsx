import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left - Form Section */}
      <div className="w-1/2 flex items-center justify-center bg-white px-12">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Right - Image Section */}
      <div className="w-1/2 hidden lg:flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-500">
        <div className="text-center text-white px-8">
          <h1 className="text-5xl font-bold mb-4">Bumi Alam</h1>
          <p className="text-xl text-sky-100">
            Connect with Nature, Grow with Sustainability
          </p>
        </div>
      </div>
    </div>
  );
}
