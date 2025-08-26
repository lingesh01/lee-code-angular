import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Portfolio } from './features/portfolio/portfolio';
import { About } from './features/about/about';
import { ArticleList } from './features/articles/article-list/article-list';
import { ArticleDetail } from './features/articles/article-detail/article-detail';
import { Login } from './features/auth/login/login';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { CreateArticle } from './features/admin/articles/create-article/create-article';


export const routes: Routes = [
  { path: '', component: Home },
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'admin/dashboard', component: AdminDashboard },
  { path: 'admin/articles/new', component: CreateArticle },
  { path: 'portfolio', component: Portfolio },
  { path: 'about', component: About },
  { path: 'articles', component: ArticleList },
  { path: 'articles/:id', component: ArticleDetail },
  { path: '**', redirectTo: '' }
];