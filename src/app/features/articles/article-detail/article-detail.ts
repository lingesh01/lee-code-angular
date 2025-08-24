import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies?: Comment[];
  avatar?: string;
}

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
  element?: HTMLElement;
}

@Component({
  selector: 'app-article-detail',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.scss'
})
export class ArticleDetail implements OnInit, OnDestroy {

  @ViewChild('articleContent', { static: false }) articleContentRef!: ElementRef;
  @ViewChild('commentsSection', { static: false }) commentsSectionRef!: ElementRef;

  article: any = null;
  relatedArticles: any[] = [];
  comments: Comment[] = [];
  displayedComments: Comment[] = [];
  tableOfContents: TableOfContentsItem[] = [];
  codeExamples: any[] = [];

  // Component state
  readingProgress = 0;
  activeSection = '';
  tocSticky = false;
  isLiked = false;
  isBookmarked = false;
  isFollowing = false;
  showShareMenu = false;

  // Comments state
  newComment = '';
  commentsSortBy = 'newest';
  commentsPerPage = 10;
  currentCommentsPage = 1;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadArticle();
    this.loadComments();
    this.generateTableOfContents();
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    // Cleanup observers
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.updateReadingProgress();
    this.updateActiveSection();
    this.updateTocStickyState();
  }

  // Article loading
  loadArticle(): void {
    const slug = this.route.snapshot.params['slug'];
    // TODO: Replace with actual API call
    this.article = {
      id: '1',
      title: 'Mastering Dynamic Programming: From Fibonacci to Complex Optimization',
      content: this.getSampleContent(),
      author: 'Lee Code',
      publishDate: new Date('2024-01-15'),
      readingTime: 12,
      category: 'Algorithms',
      tags: ['dynamic-programming', 'optimization', 'algorithms', 'problem-solving'],
      imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=600&fit=crop',
      views: 15420,
      likes: 342,
      comments: 89,
      difficulty: 'Intermediate',
      slug: 'mastering-dynamic-programming'
    };

    this.loadRelatedArticles();
    this.loadCodeExamples();
  }

  loadRelatedArticles(): void {
    // TODO: Load related articles from API
    this.relatedArticles = [
      {
        title: 'Graph Algorithms: DFS vs BFS Explained',
        slug: 'graph-algorithms-dfs-bfs',
        category: 'Algorithms',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
        readingTime: 8,
        views: 12300
      },
      {
        title: 'System Design: Designing a URL Shortener',
        slug: 'system-design-url-shortener',
        category: 'System Design',
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop',
        readingTime: 15,
        views: 18700
      }
    ];
  }

  loadCodeExamples(): void {
    this.codeExamples = [
      {
        title: 'Fibonacci with Memoization',
        language: 'javascript',
        code: `function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 2) return 1;
  
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

console.log(fibonacci(10)); // Output: 55`,
        output: '55'
      }
    ];
  }

  // Content formatting
  getFormattedContent(): string {
    if (!this.article?.content) return '';
    
    // Process content to add IDs to headings for TOC
    let content = this.article.content;
    
    // Add IDs to headings
    content = content.replace(/<h([1-6])[^>]*>([^<]+)<\/h[1-6]>/g, (match: any, level: any, text: any) => {
      const id = this.generateId(text);
      return `<h${level} id="${id}">${text}</h${level}>`;
    });

    return content;
  }

  generateId(text: string): string {
    return text.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }

  // Table of Contents
  generateTableOfContents(): void {
    setTimeout(() => {
      if (this.articleContentRef) {
        const headings = this.articleContentRef.nativeElement.querySelectorAll('h1, h2, h3');
        this.tableOfContents = Array.from(headings).map((heading: any) => ({
          id: heading.id,
          text: heading.textContent,
          level: parseInt(heading.tagName.charAt(1)),
          element: heading
        }));
      }
    }, 100);
  }

  scrollToSection(sectionId: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Reading progress tracking
  updateReadingProgress(): void {
    if (!this.articleContentRef) return;

    const article = this.articleContentRef.nativeElement;
    const articleTop = article.offsetTop;
    const articleHeight = article.offsetHeight;
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;

    const progress = Math.min(
      Math.max((scrollTop - articleTop + windowHeight) / articleHeight * 100, 0),
      100
    );

    this.readingProgress = progress;
  }

  updateActiveSection(): void {
    const headings = document.querySelectorAll('h1[id], h2[id], h3[id]');
    let activeId = '';

    headings.forEach(heading => {
      const rect = heading.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 0) {
        activeId = heading.id;
      }
    });

    this.activeSection = activeId;
  }

  updateTocStickyState(): void {
    this.tocSticky = window.pageYOffset > 200;
  }

  // Interaction handlers
  toggleLike(): void {
    this.isLiked = !this.isLiked;
    this.article.likes += this.isLiked ? 1 : -1;
    // TODO: API call
  }

  toggleBookmark(): void {
    this.isBookmarked = !this.isBookmarked;
    // TODO: API call
  }

  toggleFollow(): void {
    this.isFollowing = !this.isFollowing;
    // TODO: API call
  }

  // Share functionality
  openShareMenu(): void {
    this.showShareMenu = true;
  }

  closeShareMenu(): void {
    this.showShareMenu = false;
  }

  shareOnTwitter(): void {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(this.article.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  }

  shareOnLinkedIn(): void {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  }

  shareOnFacebook(): void {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      // TODO: Show toast notification
      console.log('Link copied!');
    });
  }

  // Comments functionality
  loadComments(): void {
    // TODO: Load from API
    this.comments = [
      {
        id: '1',
        author: 'John Doe',
        content: 'Great explanation! The memoization approach really clicked for me.',
        timestamp: new Date('2024-01-16T10:30:00'),
        likes: 12,
        avatar: 'https://via.placeholder.com/40x40'
      },
      {
        id: '2',
        author: 'Jane Smith',
        content: 'This is exactly what I needed for my interview prep. Thank you!',
        timestamp: new Date('2024-01-16T14:20:00'),
        likes: 8,
        replies: [
          {
            id: '2a',
            author: 'Lee Code',
            content: 'Glad it helped! Good luck with your interviews!',
            timestamp: new Date('2024-01-16T15:45:00'),
            likes: 3,
            avatar: 'https://via.placeholder.com/32x32'
          }
        ]
      }
    ];

    this.sortComments();
  }

  sortComments(): void {
    let sorted = [...this.comments];
    
    switch (this.commentsSortBy) {
      case 'newest':
        sorted.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        break;
      case 'oldest':
        sorted.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        break;
      case 'popular':
        sorted.sort((a, b) => b.likes - a.likes);
        break;
    }

    this.displayedComments = sorted.slice(0, this.currentCommentsPage * this.commentsPerPage);
  }

  submitComment(): void {
    if (!this.newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'You',
      content: this.newComment,
      timestamp: new Date(),
      likes: 0,
      avatar: 'https://via.placeholder.com/40x40'
    };

    this.comments.unshift(comment);
    this.newComment = '';
    this.sortComments();
    // TODO: API call
  }

  loadMoreComments(): void {
    this.currentCommentsPage++;
    this.sortComments();
  }

  hasMoreComments(): boolean {
    return this.displayedComments.length < this.comments.length;
  }

  scrollToComments(): void {
    if (this.commentsSectionRef) {
      this.commentsSectionRef.nativeElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }

  // Code execution
  runCode(index: number): void {
    const example = this.codeExamples[index];
    // TODO: Implement code execution in sandbox
    console.log('Running code:', example.code);
  }

  highlightCode(code: string, language: string): string {
    // TODO: Implement syntax highlighting
    return code.replace(/\n/g, '<br>');
  }

  // Utility methods
  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Algorithms': '#22d3ee',
      'System Design': '#10b981',
      'Frontend': '#f59e0b',
      'Backend': '#ef4444'
    };
    return colors[category] || '#6b7280';
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Algorithms': 'fas fa-sitemap',
      'System Design': 'fas fa-building',
      'Frontend': 'fas fa-laptop-code',
      'Backend': 'fas fa-server'
    };
    return icons[category] || 'fas fa-file-alt';
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }

  trackByTocItem(index: number, item: TableOfContentsItem): string {
    return item.id;
  }

  trackByComment(index: number, comment: Comment): string {
    return comment.id;
  }

  setupIntersectionObserver(): void {
    // TODO: Implement intersection observer for active section tracking
  }

  getSampleContent(): string {
    return `
      <p>Dynamic Programming (DP) is one of the most powerful problem-solving techniques in computer science. It's particularly useful for optimization problems where we need to find the best solution among many possible solutions.</p>
      
      <h2 id="what-is-dynamic-programming">What is Dynamic Programming?</h2>
      <p>Dynamic Programming is an algorithmic paradigm that solves complex problems by breaking them down into simpler subproblems. It is applicable when the subproblems are not independent, that is, when subproblems share sub-subproblems.</p>
      
      <h2 id="key-characteristics">Key Characteristics</h2>
      <p>DP problems have two key characteristics:</p>
      <ul>
        <li><strong>Overlapping Subproblems:</strong> The same subproblems are solved multiple times</li>
        <li><strong>Optimal Substructure:</strong> The optimal solution can be constructed from optimal solutions of its subproblems</li>
      </ul>
      
      <h2 id="memoization-vs-tabulation">Memoization vs Tabulation</h2>
      <p>There are two main approaches to implement DP:</p>
      
      <h3 id="memoization-top-down">Memoization (Top-Down)</h3>
      <p>In this approach, we solve the problem recursively and store the results of subproblems to avoid redundant calculations.</p>
      
      <h3 id="tabulation-bottom-up">Tabulation (Bottom-Up)</h3>
      <p>In this approach, we solve all subproblems starting from the smallest ones and build up to the solution of the original problem.</p>
      
      <h2 id="common-patterns">Common DP Patterns</h2>
      <p>Understanding common patterns can help you recognize when to apply dynamic programming:</p>
      
      <h3 id="linear-dp">Linear DP</h3>
      <p>Problems where the state depends on previous states in a linear fashion.</p>
      
      <h3 id="grid-dp">Grid DP</h3>
      <p>Problems involving 2D grids where you need to find optimal paths or counts.</p>
      
      <h2 id="practice-problems">Practice Problems</h2>
      <p>Here are some classic problems to help you master DP:</p>
      <ul>
        <li>Fibonacci Sequence</li>
        <li>Longest Common Subsequence</li>
        <li>Knapsack Problem</li>
        <li>Coin Change</li>
        <li>Edit Distance</li>
      </ul>
      
      <h2 id="conclusion">Conclusion</h2>
      <p>Dynamic Programming is a powerful technique that can dramatically improve the efficiency of your algorithms. With practice and pattern recognition, you'll be able to identify DP problems and implement elegant solutions.</p>
   `;
  }

}
