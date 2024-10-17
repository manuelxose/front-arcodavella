import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'overview-header',
  templateUrl: './overview-header.component.html',
  standalone: true,
})
export class OverviewHeaderComponent implements OnInit {
  ngOnInit(): void {}
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
