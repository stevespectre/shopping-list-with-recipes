import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from './store/recipes.actions';

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<any> {
  constructor(
    private store: Store<fromApp.AppState>,
    private recipeService: RecipeService,
    private actions$: Actions
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.store.dispatch(new RecipeActions.FetchRecipes());
    return this.actions$.pipe(
      ofType(RecipeActions.SET_RECIPES),
      take(1)
    );
    // const recipes = this.recipeService.getRecipes;
    // if (recipes.length) {
    //   return this.dataStorageService.fetchRecipes();
    // } else {
    //   return recipes;
    // }
  }
}
