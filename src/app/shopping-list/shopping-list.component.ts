import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromShoppingList from './store/shopping-list.reducer';
import * as shoppingListAction from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(
    private store: Store<fromShoppingList.AppState>
  ) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
  }

  onEditItem(index: number) {
    this.store.dispatch(new shoppingListAction.StartEdit(index));
  }
}
