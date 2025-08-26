import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth, User } from '../../../core/services/auth';

interface DashboardStats {
  totalArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  publishedArticles: number;
  draftArticles: number;
  subscribers: number;
  monthlyVisitors: number;
}

interface RecentActivity {
  id: string;
  type: 'article_published' | 'comment_received' | 'new_subscriber' | 'article_liked';
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard {

   currentUser: User | null = null;
  
  stats: DashboardStats = {
    totalArticles: 42,
    totalViews: 125400,
    totalLikes: 8900,
    totalComments: 1234,
    publishedArticles: 38,
    draftArticles: 4,
    subscribers: 12500,
    monthlyVisitors: 45600
  };

  recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'article_published',
      title: 'New Article Published',
      description: '"Mastering Dynamic Programming" has been published',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      icon: 'fas fa-file-alt',
      color: '#22d3ee'
    },
    {
      id: '2',
      type: 'comment_received',
      title: 'New Comment',
      description: 'John Doe commented on "Angular Performance Tips"',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      icon: 'fas fa-comment',
      color: '#10b981'
    },
    {
      id: '3',
      type: 'new_subscriber',
      title: '25 New Subscribers',
      description: 'Your newsletter gained 25 new subscribers today',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      icon: 'fas fa-user-plus',
      color: '#8b5cf6'
    },
    {
      id: '4',
      type: 'article_liked',
      title: 'Article Milestone',
      description: '"System Design Basics" reached 1000 likes',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      icon: 'fas fa-heart',
      color: '#ef4444'
    }
  ];

  constructor(private authService: Auth) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }

}
