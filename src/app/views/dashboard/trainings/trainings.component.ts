import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NavBarComponent],
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.scss']
})
export class TrainingsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // TODO: Charger les entraînements de l'utilisateur
  }
} 