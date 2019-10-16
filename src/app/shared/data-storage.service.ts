import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  recipes: Recipe[] = [];
  recipesChanged = new Subject<Recipe[]>();

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put(
      'https://ng-course-recipes-9d033.firebaseio.com/recipes.json',
      recipes
    )
    .subscribe(response => console.log(response));
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>('https://ng-course-recipes-9d033.firebaseio.com/recipes.json')
    .pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}
