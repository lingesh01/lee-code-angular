
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnimateOnScroll } from '../../directives/animate-on-scroll';


interface Feature {
  icon: string;
  title: string;
  description: string;
  progress: number;
  color: string;
  status: 'planning' | 'development' | 'testing' | 'ready';
}

interface PageInfo {
  title: string;
  subtitle: string;
  icon: string;
  launchDate: string;
  progress: number;
  features: string[];
}


@Component({
  selector: 'app-coming-soon',
  imports: [CommonModule, RouterModule, FormsModule, AnimateOnScroll],
  templateUrl: './coming-soon.html',
  styleUrl: './coming-soon.scss'
})
export class ComingSoon implements OnInit, OnDestroy {

  @Input() pageType: 'articles' | 'videos' | 'courses' | 'projects' = 'articles';

  isLoaded = false;
  notifyEmail = '';
  currentSkillIndex = 0;
  animationInterval: any;

  get pageInfo(): PageInfo {
    const pages = {
      articles: {
        title: 'Advanced Articles',
        subtitle: 'In-depth system design and architecture tutorials',
        icon: 'fas fa-file-alt',
        launchDate: 'Q2 2025',
        progress: 75,
        features: ['System Design', 'Database Architecture', 'Cloud Solutions', 'Security Best Practices']
      },
      videos: {
        title: 'Video Tutorials',
        subtitle: 'Step-by-step coding sessions and live problem solving',
        icon: 'fas fa-video',
        launchDate: 'Q3 2025',
        progress: 60,
        features: ['Live Coding', 'Interactive Tutorials', 'Q&A Sessions', 'Challenge Solutions']
      },
      courses: {
        title: 'Online Courses',
        subtitle: 'Complete learning paths with hands-on projects',
        icon: 'fas fa-graduation-cap',
        launchDate: 'Q4 2025',
        progress: 45,
        features: ['DSA Mastery', 'System Design', 'Interview Prep', 'Full-Stack Dev']
      },
      projects: {
        title: 'Open Source Projects',
        subtitle: 'Tools and libraries for developers',
        icon: 'fas fa-tools',
        launchDate: 'Q1 2025',
        progress: 80,
        features: ['CLI Tools', 'React Components', 'Algorithm Visualizer', 'Mobile Apps']
      }
    };
    return pages[this.pageType];
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoaded = true;
      this.startFeatureRotation();
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  startFeatureRotation(): void {
    this.animationInterval = setInterval(() => {
      this.currentSkillIndex = (this.currentSkillIndex + 1) % this.pageInfo.features.length;
    }, 3000);
  }

  subscribeNotification(): void {
    if (this.notifyEmail && this.isValidEmail(this.notifyEmail)) {
      console.log('Newsletter subscription:', this.notifyEmail);
      alert('Thanks! We\'ll notify you when it\'s ready 🚀');
      this.notifyEmail = '';
    }
  }

   isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  goBack(): void {
    window.history.back();
  }

  goToHome(): void {
    window.location.href = '/';
  }

  shareOnTwitter(): void {
    const text = `Excited about ${this.pageInfo.title} by @leecodetamil! 🚀`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }
}
