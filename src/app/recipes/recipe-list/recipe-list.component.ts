import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe('A test recipe', 'Sample description', 'http://www.fnstatic.co.uk/images/content/recipe/fried-chicken_1.jpg'),
    new Recipe('A test recipe', 'Sample description', 'http://www.fnstatic.co.uk/images/content/recipe/fried-chicken_1.jpg'),
  ];

  constructor() { }

  ngOnInit() {
  }

}
