import { Component } from '@angular/core';

import { MatIconRegistryService } from '../app/services/mat-icon-registry-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  title = 'Constellations';

  constructor(
    private matIconRegistryService: MatIconRegistryService) {}

  

}
