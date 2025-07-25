import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-record',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NavBarComponent],
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // TODO: Initialiser le formulaire avec la date du jour
  }
} 