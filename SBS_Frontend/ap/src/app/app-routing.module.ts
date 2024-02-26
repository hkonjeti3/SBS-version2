// Import necessary modules and components
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
//import { Route } from '@angular/router';
// Import the routes array from your routes file
import { routes } from './app.routes'; // Update the path

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
export { routes };

