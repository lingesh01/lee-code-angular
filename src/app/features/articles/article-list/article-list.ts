import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComingSoon } from '../../../shared/components/coming-soon/coming-soon';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: Date;
  readingTime: number;
  category: string;
  tags: string[];
  featured: boolean;
  imageUrl: string;
  views: number;
  likes: number;
  comments: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  slug: string;
  bookmarked?: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

@Component({
  selector: 'app-article-list',
  imports: [CommonModule, RouterModule, FormsModule, ComingSoon],
  // templateUrl: './article-list.html',
  template:  `<app-coming-soon pageType="articles"></app-coming-soon>`,
  styleUrl: './article-list.scss'
})
export class ArticleList implements OnInit {

  // Mock data - replace with service calls
  articles: Article[] = [
    {
      id: '1',
      title: 'Mastering Dynamic Programming: From Fibonacci to Complex Optimization',
      excerpt: 'A comprehensive guide to understanding and implementing dynamic programming solutions with practical examples and optimization techniques.',
      content: '',
      author: 'Lee Code',
      publishDate: new Date('2024-01-15'),
      readingTime: 12,
      category: 'Algorithms',
      tags: ['dynamic-programming', 'optimization', 'algorithms', 'problem-solving'],
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
      views: 15420,
      likes: 342,
      comments: 89,
      difficulty: 'Intermediate',
      slug: 'mastering-dynamic-programming'
    },
    {
      id: '2',
      title: 'System Design: Building Scalable Microservices Architecture',
      excerpt: 'Learn how to design and implement scalable microservices with Spring Boot, including service discovery, load balancing, and fault tolerance.',
      content: '',
      author: 'Lee Code',
      publishDate: new Date('2024-01-10'),
      readingTime: 18,
      category: 'System Design',
      tags: ['microservices', 'spring-boot', 'scalability', 'architecture'],
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
      views: 23100,
      likes: 567,
      comments: 134,
      difficulty: 'Advanced',
      slug: 'scalable-microservices-architecture'
    },
    {
      id: '3',
      title: 'Angular Performance Optimization: Advanced Techniques',
      excerpt: 'Discover advanced techniques to optimize Angular applications including lazy loading, OnPush strategy, and bundle optimization.',
      content: '',
      author: 'Lee Code',
      publishDate: new Date('2024-01-05'),
      readingTime: 8,
      category: 'Frontend',
      tags: ['angular', 'performance', 'optimization', 'lazy-loading'],
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&h=400&fit=crop',
      views: 8750,
      likes: 198,
      comments: 45,
      difficulty: 'Intermediate',
      slug: 'angular-performance-optimization'
    },
    // Add more mock articles...
  ];

  categories: Category[] = [
    { id: 'algorithms', name: 'Algorithms', icon: 'fas fa-sitemap', color: '#22d3ee', count: 45 },
    { id: 'system-design', name: 'System Design', icon: 'fas fa-building', color: '#10b981', count: 23 },
    { id: 'frontend', name: 'Frontend', icon: 'fas fa-laptop-code', color: '#f59e0b', count: 18 },
    { id: 'backend', name: 'Backend', icon: 'fas fa-server', color: '#ef4444', count: 31 },
    { id: 'tutorials', name: 'Tutorials', icon: 'fas fa-graduation-cap', color: '#8b5cf6', count: 67 }
  ];

  quickFilters = [
    { id: 'recent', label: 'Recent', icon: 'fas fa-clock' },
    { id: 'popular', label: 'Popular', icon: 'fas fa-fire' },
    { id: 'beginner', label: 'Beginner', icon: 'fas fa-seedling' },
    { id: 'bookmarked', label: 'Bookmarked', icon: 'fas fa-bookmark' }
  ];

  // Component state
  searchQuery = '';
  selectedCategory = 'all';
  activeQuickFilter = '';
  sortBy = 'publishDate';
  currentPage = 1;
  articlesPerPage = 9;
  loading = false;
  newsletterEmail = '';

  // Carousel state
  currentFeatured = 0;
  carouselInterval: any;

  // Computed properties
  get filteredArticles(): Article[] {
    let filtered = [...this.articles];

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(article => 
        article.category.toLowerCase().replace(' ', '-') === this.selectedCategory
      );
    }

    // Quick filters
    if (this.activeQuickFilter) {
      switch (this.activeQuickFilter) {
        case 'recent':
          filtered.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
          break;
        case 'popular':
          filtered.sort((a, b) => b.views - a.views);
          break;
        case 'beginner':
          filtered = filtered.filter(article => article.difficulty === 'Beginner');
          break;
        case 'bookmarked':
          filtered = filtered.filter(article => article.bookmarked);
          break;
      }
    }

    // Sort
    return this.sortArticles(filtered);
  }

  get paginatedArticles(): Article[] {
    const start = 0;
    const end = this.currentPage * this.articlesPerPage;
    return this.filteredArticles.slice(start, end);
  }

  get featuredArticles(): Article[] {
    return this.articles.filter(article => article.featured);
  }

  get totalArticles(): number {
    return this.articles.length;
  }

  ngOnInit(): void {
    this.startFeaturedCarousel();
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  // Search and filter methods
  onSearch(): void {
    this.currentPage = 1;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.currentPage = 1;
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.currentPage = 1;
    this.activeQuickFilter = '';
  }

  applyQuickFilter(filterId: string): void {
    if (this.activeQuickFilter === filterId) {
      this.activeQuickFilter = '';
    } else {
      this.activeQuickFilter = filterId;
      this.selectedCategory = 'all';
    }
    this.currentPage = 1;
  }

  onSortChange(): void {
    this.currentPage = 1;
  }

  clearAllFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.activeQuickFilter = '';
    this.sortBy = 'publishDate';
    this.currentPage = 1;
  }

  // Utility methods
  sortArticles(articles: Article[]): Article[] {
    return articles.sort((a, b) => {
      switch (this.sortBy) {
        case 'publishDate':
          return b.publishDate.getTime() - a.publishDate.getTime();
        case 'views':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        case 'comments':
          return b.comments - a.comments;
        case 'readingTime':
          return a.readingTime - b.readingTime;
        default:
          return 0;
      }
    });
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  getCategoryColor(categoryName: string): string {
    const category = this.categories.find(cat => 
      cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    return category?.color || '#6b7280';
  }

  getCategoryIcon(categoryName: string): string {
    const category = this.categories.find(cat => 
      cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    return category?.icon || 'fas fa-file-alt';
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown';
  }

  toggleBookmark(article: Article, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    article.bookmarked = !article.bookmarked;
    // TODO: Save to backend
  }

  // Pagination
  loadMore(): void {
    this.loading = true;
    setTimeout(() => {
      this.currentPage++;
      this.loading = false;
    }, 500);
  }

  hasMoreArticles(): boolean {
    return this.currentPage * this.articlesPerPage < this.filteredArticles.length;
  }

  trackByArticle(index: number, article: Article): string {
    return article.id;
  }

  // Featured carousel
  startFeaturedCarousel(): void {
    if (this.featuredArticles.length > 1) {
      this.carouselInterval = setInterval(() => {
        this.nextFeatured();
      }, 5000);
    }
  }

  nextFeatured(): void {
    if (this.currentFeatured < this.featuredArticles.length - 1) {
      this.currentFeatured++;
    } else {
      this.currentFeatured = 0;
    }
  }

  prevFeatured(): void {
    if (this.currentFeatured > 0) {
      this.currentFeatured--;
    } else {
      this.currentFeatured = this.featuredArticles.length - 1;
    }
  }

  // @HostListener('mouseenter', ['$event.target'])
  // onCarouselHover(): void {
  //   if (this.carouselInterval) {
  //     clearInterval(this.carouselInterval);
  //   }
  // }

  // @HostListener('mouseleave', ['$event.target'])
  // onCarouselLeave(): void {
  //   this.startFeaturedCarousel();
  // }

  // Newsletter
  subscribeNewsletter(): void {
    if (this.newsletterEmail) {
      // TODO: Implement newsletter subscription
      console.log('Newsletter subscription:', this.newsletterEmail);
      this.newsletterEmail = '';
    }
  }

}
