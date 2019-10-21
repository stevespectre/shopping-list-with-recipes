import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth/auth.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'recipes', loadChildren: './recipes/recipes.module#RecipesModule'}, // For lazy loading
  {
    path: 'shopping-list',
    loadChildren: './shopping-list/shopping-list.module#ShoppingListModule' // For lazy loading
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule' // For lazy loading
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
