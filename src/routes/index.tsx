import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../auth/pages/Login";
import { ArticleList, CMSLayout, HeroEdit } from "../cms";
import Hero from "../cms/pages/hero/Hero";
import ArticleUpdate from "../cms/pages/articles/ArticleUpdate";
import ArticleAdd from "../cms/pages/articles/ArticleAdd";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<CMSLayout />}>
          <Route index element={<Hero />} />
          <Route path="hero" element={<Hero />} />
          <Route path="hero/edit" element={<HeroEdit />} />
          <Route path="articles" element={<ArticleList />} />
          <Route path="articles/add" element={<ArticleAdd />} />
          <Route path="articles/update/:id" element={<ArticleUpdate />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
