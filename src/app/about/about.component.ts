import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  selectedIndex = 0

  constructor(private router: Router) { }

  ngOnInit() {
    if (this.router.url == '/about/pricing') {
      this.selectTab(3)
    }
  }

  selectTab(index: number): void {
    this.selectedIndex = index;
  }

}
