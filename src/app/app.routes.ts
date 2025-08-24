import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Portfolio } from './features/portfolio/portfolio';
import { About } from './features/about/about';
import { ArticleList } from './features/articles/article-list/article-list';
import { ArticleDetail } from './features/articles/article-detail/article-detail';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'portfolio', component: Portfolio },
  { path: 'about', component: About },
  { path: 'articles', component: ArticleList },
  { path: 'articles/:id', component: ArticleDetail },
  { path: '**', redirectTo: '' }
];