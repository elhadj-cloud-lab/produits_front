import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Categorie} from '../model/categorie.model';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../services/auth-service';

@Component({
  selector: 'app-update-categorie',
  imports: [FormsModule],
  templateUrl: './update-categorie.html',
  styleUrl: './update-categorie.css',
})
export class UpdateCategorie {

  constructor(public authService: AuthService) {}

  @Input() categorie!: Categorie;

  @Input() ajout!:boolean;

  @Output() categorieUpdated = new EventEmitter<Categorie>();
  @Output() annulerEvent = new EventEmitter<void>();

  annuler() {
    this.annulerEvent.emit();
  }

  saveCategorie(){
    this.categorieUpdated.emit(this.categorie);
  }

}
