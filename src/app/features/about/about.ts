import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  type: 'education' | 'work' | 'achievement' | 'milestone';
  icon: string;
  color: string;
}

interface Skill {
  name: string;
  level: number;
  category: string;
  years: number;
}

interface SocialLink {
  name: string;
  icon: string;
  url: string;
  color: string;
  followers?: string;
}


@Component({
  selector: 'app-about',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {

   @ViewChild('timelineRef', { static: false }) timelineRef!: ElementRef;

  newsletterEmail = '';

  skills: Skill[] = [
    { name: 'JavaScript/TypeScript', level: 95, category: 'Programming Languages', years: 5 },
    { name: 'Java', level: 90, category: 'Programming Languages', years: 4 },
    { name: 'Python', level: 85, category: 'Programming Languages', years: 3 },
    { name: 'Angular', level: 92, category: 'Frontend Frameworks', years: 4 },
    { name: 'React', level: 88, category: 'Frontend Frameworks', years: 3 },
    { name: 'Spring Boot', level: 89, category: 'Backend Frameworks', years: 4 },
    { name: 'Node.js', level: 87, category: 'Backend Technologies', years: 3 },
    { name: 'PostgreSQL', level: 85, category: 'Databases', years: 4 },
    { name: 'MongoDB', level: 82, category: 'Databases', years: 3 },
    { name: 'AWS', level: 78, category: 'Cloud Services', years: 2 },
    { name: 'Docker', level: 80, category: 'DevOps Tools', years: 2 },
    { name: 'Data Structures', level: 95, category: 'Computer Science', years: 5 }
  ];

  values = [
    {
      icon: 'fas fa-lightbulb',
      title: 'Simplicity First',
      description: 'I believe complex concepts can be explained simply. My goal is to make programming accessible to everyone, regardless of their background.'
    },
    {
      icon: 'fas fa-users',
      title: 'Community Driven',
      description: 'Learning happens best in communities. I foster an environment where everyone can ask questions, share knowledge, and grow together.'
    },
    {
      icon: 'fas fa-rocket',
      title: 'Practical Learning',
      description: 'Theory is important, but practical application is key. I focus on real-world projects and interview-relevant problems.'
    },
    {
      icon: 'fas fa-infinity',
      title: 'Continuous Growth',
      description: 'Technology evolves rapidly, and so should we. I\'m committed to staying current and sharing the latest best practices.'
    }
  ];

  funFacts = [
    {
      icon: '☕',
      title: 'Coffee Enthusiast',
      description: 'I consume about 4-5 cups of coffee daily. My best algorithms are usually written between 2-4 AM!'
    },
    {
      icon: '🎮',
      title: 'Gaming Geek',
      description: 'When not coding, you\'ll find me playing strategy games. They actually help improve problem-solving skills!'
    },
    {
      icon: '📚',
      title: 'Bookworm',
      description: 'I read at least 2 technical books per month and maintain detailed notes that I often share with my community.'
    },
    {
      icon: '🌱',
      title: 'Plant Parent',
      description: 'I have 15+ plants in my home office. Taking care of them helps me stay calm and focused during intense coding sessions.'
    },
    {
      icon: '🍳',
      title: 'Cooking Experiments',
      description: 'I love experimenting with South Indian cuisine. Cooking algorithms are just as interesting as programming ones!'
    },
    {
      icon: '🏃‍♂️',
      title: 'Morning Runner',
      description: 'I start each day with a 5km run. Some of my best code solutions come to me during these morning runs.'
    }
  ];

  socialLinks: SocialLink[] = [
    {
      name: 'YouTube',
      icon: 'fab fa-youtube',
      url: 'https://youtube.com/@leecodetamil',
      color: '#ff0000',
      followers: '10K+'
    },
    {
      name: 'GitHub',
      icon: 'fab fa-github',
      url: 'https://github.com/leecode',
      color: '#333333',
      followers: '2K+'
    },
    {
      name: 'LinkedIn',
      icon: 'fab fa-linkedin',
      url: 'https://linkedin.com/in/leecode',
      color: '#0077b5',
      followers: '5K+'
    },
    {
      name: 'Twitter',
      icon: 'fab fa-twitter',
      url: 'https://twitter.com/leecodetamil',
      color: '#1da1f2',
      followers: '3K+'
    },
    {
      name: 'Instagram',
      icon: 'fab fa-instagram',
      url: 'https://instagram.com/leecodetamil',
      color: '#e4405f',
      followers: '1K+'
    },
    {
      name: 'Discord',
      icon: 'fab fa-discord',
      url: 'https://discord.gg/leecode',
      color: '#7289da',
      followers: 'Join Community'
    }
  ];

  ngOnInit(): void {
    this.animateSkillBars();
  }

  animateSkillBars(): void {
    // Animation will be handled by CSS
    setTimeout(() => {
      const skillBars = document.querySelectorAll('.skill-progress');
      skillBars.forEach(bar => {
        bar.classList.add('animate');
      });
    }, 1000);
  }

  subscribeNewsletter(): void {
    if (this.newsletterEmail && this.isValidEmail(this.newsletterEmail)) {
      // TODO: Implement newsletter subscription
      console.log('Newsletter subscription:', this.newsletterEmail);
      // Show success message
      this.newsletterEmail = '';
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

}
