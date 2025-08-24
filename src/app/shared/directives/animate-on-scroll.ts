
import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Animation } from '../services/animation';

@Directive({
  selector: '[appAnimateOnScroll]'
})
export class AnimateOnScroll {

   @Input() animationType: string = 'fadeInUp';
  @Input() animationDelay: number = 0;
  @Input() animationDuration: number = 800;
  

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
        private animationService: Animation

  ) {}

  ngOnInit(): void {
    const element = this.elementRef.nativeElement;
    
    // Set initial state
    this.renderer.setStyle(element, 'opacity', '0');
    this.renderer.setStyle(element, 'transform', this.getInitialTransform());
    this.renderer.setStyle(element, 'transition', `all ${this.animationDuration}ms ease-out`);
    
    // Set animation delay
    if (this.animationDelay > 0) {
      this.renderer.setStyle(element, 'animation-delay', `${this.animationDelay}ms`);
    }

    // Observe element for scroll animation
    this.animationService.observeElement(element, (entry) => {
      if (entry.isIntersecting) {
        this.animateElement(element);
        this.animationService.unobserveElement(element);
      }
    });
  }

  ngOnDestroy(): void {
    this.animationService.unobserveElement(this.elementRef.nativeElement);
  }

  private getInitialTransform(): string {
    switch (this.animationType) {
      case 'fadeInUp': return 'translateY(50px)';
      case 'fadeInDown': return 'translateY(-50px)';
      case 'fadeInLeft': return 'translateX(-50px)';
      case 'fadeInRight': return 'translateX(50px)';
      case 'scaleIn': return 'scale(0.8)';
      case 'rotateIn': return 'rotate(-10deg) scale(0.8)';
      default: return 'translateY(50px)';
    }
  }

  private animateElement(element: HTMLElement): void {
    setTimeout(() => {
      this.renderer.setStyle(element, 'opacity', '1');
      this.renderer.setStyle(element, 'transform', 'translate(0) scale(1) rotate(0)');
    }, this.animationDelay);
  }
}

