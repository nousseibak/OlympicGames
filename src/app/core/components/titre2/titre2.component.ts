import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-titre2',
  templateUrl: './titre2.component.html',
  styleUrls: ['./titre2.component.scss']
})
export class Titre2Component {

  @Input() darkGrayText: string = 'Texte en gris foncé centré';
  @Input() blackText: string = 'Texte centré en noir';

}
