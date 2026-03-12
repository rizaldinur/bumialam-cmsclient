import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "../auth/pages/Login";
import { CMSLayout, HeroEdit } from "../cms";
import Hero from "../cms/pages/hero/Hero";
import ArticleUpdate from "../cms/pages/articles/ArticleUpdate";
import ArticleAdd from "../cms/pages/articles/ArticleAdd";
import Article from "../cms/pages/articles/Article";
import ProtectedRoute from "../auth/components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/cms/hero" replace />} />
        <Route path="/cms/login" element={<Login />} />
        <Route path="/cms/" element={<CMSLayout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <Hero />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cms/hero"
            element={
              <ProtectedRoute>
                <Hero />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cms/hero/edit"
            element={
              <ProtectedRoute>
                <HeroEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cms/articles"
            element={
              <ProtectedRoute>
                <Article />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cms/articles/add"
            element={
              <ProtectedRoute>
                <ArticleAdd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cms/articles/update/:id"
            element={
              <ProtectedRoute>
                <ArticleUpdate />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
