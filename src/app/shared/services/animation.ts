import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Animation {

    private observers: Map<Element, IntersectionObserver> = new Map();

  // Intersection Observer for scroll animations
  observeElement(
    element: Element, 
    callback: (entry: IntersectionObserverEntry) => void,
    options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  ): void {
    if (this.observers.has(element)) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(callback);
    }, options);

    observer.observe(element);
    this.observers.set(element, observer);
  }

  unobserveElement(element: Element): void {
    const observer = this.observers.get(element);
    if (observer) {
      observer.unobserve(element);
      observer.disconnect();
      this.observers.delete(element);
    }
  }

  // Staggered animation utility
  staggerElements(elements: NodeListOf<Element>, delay = 100): void {
    elements.forEach((element, index) => {
      (element as HTMLElement).style.animationDelay = `${index * delay}ms`;
    });
  }

  // Typing animation effect
  typeWriter(element: HTMLElement, text: string, speed = 50): Promise<void> {
    return new Promise((resolve) => {
      let i = 0;
      element.textContent = '';
      
      const timer = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  }
  
}
