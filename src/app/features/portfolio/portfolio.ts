import { Component } from '@angular/core';
import { ComingSoon } from '../../shared/components/coming-soon/coming-soon';

@Component({
  selector: 'app-portfolio',
  imports: [ComingSoon],
  // templateUrl: './portfolio.html',
  template: `
    <app-coming-soon pageType="videos"></app-coming-soon>
  `,

  styleUrl: './portfolio.scss'
})
export class Portfolio {

}
