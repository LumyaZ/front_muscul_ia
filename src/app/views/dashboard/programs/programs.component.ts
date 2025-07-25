import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NavBarComponent],
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // TODO: Charger les programmes de l'utilisateur
  }
} 