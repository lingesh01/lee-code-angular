import { Component, ElementRef, ViewChild } from '@angular/core';
import { AnimateOnScroll } from '../../shared/directives/animate-on-scroll';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Animation } from '../../shared/services/animation';

interface Skill {
  title: string;
  icon: string;
  skills: string[];
  color: string;
}


@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, AnimateOnScroll],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  
  @ViewChild('heroTitle', { static: false }) heroTitle!: ElementRef;
  @ViewChild('heroSubtitle', { static: false }) heroSubtitle!: ElementRef;
  @ViewChild('rotatingText', { static: false }) rotatingText!: ElementRef;

  isLoaded = false;
  currentSkillIndex = 0;
  isAnimating = false;
  animationInterval: any;
  
  // Enhanced skills with more variety
  skills = [
    'Full-Stack Developer', 
    'Algorithm Expert', 
    'System Designer', 
    'Code Educator',
    'Problem Solver',
    'Tech Mentor'
  ];

  skillsData: Skill[] = [
    {
      title: 'Frontend Development',
      icon: 'fas fa-code',
      skills: ['Angular', 'React', 'TypeScript', 'JavaScript', 'HTML5/CSS3'],
      color: '#22d3ee'
    },
    {
      title: 'Backend Development', 
      icon: 'fas fa-server',
      skills: ['Spring Boot', 'Node.js', 'Java', 'Python', 'REST APIs'],
      color: '#10b981'
    },
    {
      title: 'Data Structures & Algorithms',
      icon: 'fas fa-sitemap',
      skills: ['Problem Solving', 'Dynamic Programming', 'System Design', 'Optimization'],
      color: '#f59e0b'
    },
    {
      title: 'Databases & Tools',
      icon: 'fas fa-database',
      skills: ['PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'AWS'],
      color: '#ef4444'
    }
  ];

  constructor(private animationService: Animation) {}

  ngOnInit(): void {
    this.startEnhancedSkillRotation();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isLoaded = true;
      this.animateHeroSection();
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  private animateHeroSection(): void {
    // Enhanced typewriter effect for hero title
    if (this.heroTitle) {
      this.animationService.typeWriter(
        this.heroTitle.nativeElement, 
        'Lee Code', 
        150
      ).then(() => {
        // After title animation, show subtitle
        if (this.heroSubtitle) {
          this.heroSubtitle.nativeElement.style.opacity = '1';
          this.heroSubtitle.nativeElement.style.transform = 'translateY(0)';
        }
      });
    }
  }

  private startEnhancedSkillRotation(): void {
    this.animationInterval = setInterval(() => {
      if (!this.isAnimating) {
        this.animateToNextSkill();
      }
    }, 4000); // Longer interval for better effect
  }

  private async animateToNextSkill(): Promise<void> {
    this.isAnimating = true;
    
    // Get current and next skill elements
    const currentElement = document.querySelector('.skill-text.active') as HTMLElement;
    const nextIndex = (this.currentSkillIndex + 1) % this.skills.length;
    
    // Animate current skill out with random effect
    if (currentElement) {
      await this.animateOut(currentElement);
    }
    
    // Update index
    this.currentSkillIndex = nextIndex;
    
    // Small delay before animating in
    setTimeout(async () => {
      const nextElement = document.querySelector('.skill-text.active') as HTMLElement;
      if (nextElement) {
        await this.animateIn(nextElement);
      }
      this.isAnimating = false;
    }, 200);
  }

  private async animateOut(element: HTMLElement): Promise<void> {
    const animations = ['slideUp', 'slideDown', 'slideLeft', 'slideRight', 'scaleOut', 'rotateOut'];
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    
    return new Promise((resolve) => {
      element.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      
      switch (randomAnimation) {
        case 'slideUp':
          element.style.transform = 'translateX(-50%) translateY(-100%)';
          break;
        case 'slideDown':
          element.style.transform = 'translateX(-50%) translateY(200%)';
          break;
        case 'slideLeft':
          element.style.transform = 'translateX(-200%) translateY(0)';
          break;
        case 'slideRight':
          element.style.transform = 'translateX(100%) translateY(0)';
          break;
        case 'scaleOut':
          element.style.transform = 'translateX(-50%) translateY(0) scale(0)';
          break;
        case 'rotateOut':
          element.style.transform = 'translateX(-50%) translateY(0) rotate(90deg) scale(0)';
          break;
      }
      
      element.style.opacity = '0';
      
      setTimeout(() => resolve(), 600);
    });
  }

  private async animateIn(element: HTMLElement): Promise<void> {
    const animations = ['typewriter', 'slideIn', 'scaleIn', 'bounceIn', 'flipIn'];
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    
    return new Promise((resolve) => {
      switch (randomAnimation) {
        case 'typewriter':
          this.typewriterEffect(element).then(() => resolve());
          break;
        case 'slideIn':
          this.slideInEffect(element).then(() => resolve());
          break;
        case 'scaleIn':
          this.scaleInEffect(element).then(() => resolve());
          break;
        case 'bounceIn':
          this.bounceInEffect(element).then(() => resolve());
          break;
        case 'flipIn':
          this.flipInEffect(element).then(() => resolve());
          break;
        default:
          this.slideInEffect(element).then(() => resolve());
      }
    });
  }

  private async typewriterEffect(element: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      const text = element.textContent || '';
      element.textContent = '';
      element.style.opacity = '1';
      element.style.transform = 'translateX(-50%) translateY(0)';
      element.style.transition = 'none';
      
      let i = 0;
      const interval = setInterval(() => {
        element.textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, 80);
    });
  }

  private async slideInEffect(element: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      element.style.transform = 'translateX(-50%) translateY(100%)';
      element.style.opacity = '0';
      element.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      
      setTimeout(() => {
        element.style.transform = 'translateX(-50%) translateY(0)';
        element.style.opacity = '1';
        setTimeout(() => resolve(), 800);
      }, 50);
    });
  }

  private async scaleInEffect(element: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      element.style.transform = 'translateX(-50%) translateY(0) scale(0)';
      element.style.opacity = '0';
      element.style.transition = 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      
      setTimeout(() => {
        element.style.transform = 'translateX(-50%) translateY(0) scale(1)';
        element.style.opacity = '1';
        setTimeout(() => resolve(), 700);
      }, 50);
    });
  }

  private async bounceInEffect(element: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      element.style.transform = 'translateX(-50%) translateY(-50px) scale(0.3)';
      element.style.opacity = '0';
      element.style.transition = 'all 0.9s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      
      setTimeout(() => {
        element.style.transform = 'translateX(-50%) translateY(0) scale(1)';
        element.style.opacity = '1';
        setTimeout(() => resolve(), 900);
      }, 50);
    });
  }

  private async flipInEffect(element: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      element.style.transform = 'translateX(-50%) translateY(0) rotateY(-90deg)';
      element.style.opacity = '0';
      element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      
      setTimeout(() => {
        element.style.transform = 'translateX(-50%) translateY(0) rotateY(0)';
        element.style.opacity = '1';
        setTimeout(() => resolve(), 800);
      }, 50);
    });
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }

}
