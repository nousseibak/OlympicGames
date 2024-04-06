import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-titre1',
  templateUrl: './titre1.component.html',
  styleUrls: ['./titre1.component.scss']
})
export class Titre1Component  {

  @Input() customText: string = 'Ligne de texte personnalisée';
  
}
