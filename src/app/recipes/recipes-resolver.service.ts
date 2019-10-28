import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { take, map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as RecipeActions from './store/recipes.actions';
import { of } from 'rxjs';

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<any> {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('recipes').pipe(
      take(1),
      map(recipesState => recipesState.recipes),
      switchMap(recipes => {
        if (recipes.length === 0) {
          this.store.dispatch(new RecipeActions.FetchRecipes());
          return this.actions$.pipe(
            ofType(RecipeActions.SET_RECIPES),
            take(1)
          );
        } else {
          return of(recipes);
        }
      })
    );


    // const recipes = this.recipeService.getRecipes;
    // if (recipes.length) {
    //   return this.dataStorageService.fetchRecipes();
    // } else {
    //   return recipes;
    // }
  }
}
