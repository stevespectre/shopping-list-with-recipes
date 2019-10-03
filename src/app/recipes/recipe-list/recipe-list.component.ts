import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  @Output() selectRecipe = new EventEmitter<Recipe>();
  recipes: Recipe[] = [
    new Recipe(
      'A test recipe',
      'Sample description',
      'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/delish-190731-air-fryer-pizza-0188-portrait-pf-1565820597.jpg'
    ),
    new Recipe(
      'Another test recipe',
      'Sample description',
      'https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe/recipe-image/2019/09/aubergine-chickpea-stew.jpg'
    ),
  ];

  constructor() { }

  ngOnInit() {
  }

  onRecipeSelected(recipe: Recipe) {
    this.selectRecipe.emit(recipe);
  }

}
