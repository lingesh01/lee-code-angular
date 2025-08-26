import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit, OnDestroy {

  isScrolled = false;
  isMobileMenuOpen = false;
  isMenuAnimating = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // Close mobile menu on desktop resize
    if (window.innerWidth >= 769 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  @HostListener('document:keydown.escape', [])
  onEscapePress() {
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    // Clean up - restore body overflow if component is destroyed while menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = '';
    }
  }

  toggleMobileMenu(): void {
    if (this.isMenuAnimating) return;

    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu(): void {
    this.isMenuAnimating = true;
    this.isMobileMenuOpen = true;
    document.body.style.overflow = 'hidden'; // Prevent background scroll
    
    // Reset animation flag after animation completes
    setTimeout(() => {
      this.isMenuAnimating = false;
    }, 500);
  }

  closeMobileMenu(): void {
    this.isMenuAnimating = true;
    document.body.style.overflow = ''; // Restore background scroll
    
    // Delay closing to allow exit animation
    setTimeout(() => {
      this.isMobileMenuOpen = false;
      this.isMenuAnimating = false;
    }, 300);
  }

  onMobileMenuItemClick(): void {
    // Close menu when navigation item is clicked
    this.closeMobileMenu();
  }

  onBackdropClick(event: Event): void {
    // Close menu when backdrop is clicked
    if (event.target === event.currentTarget) {
      this.closeMobileMenu();
    }
  }

}
