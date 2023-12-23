import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { FormsModule } from '@angular/forms';
import { GeoService } from '../services/geo.service';
import { HttpClientModule } from '@angular/common/http';
import { debounceTime } from 'rxjs';
@Component({
  selector: 'app-geo',
  standalone: true,
  imports: [GoogleMapsModule, FormsModule],
  templateUrl: './geo.component.html',
  styleUrl: './geo.component.scss'
})
export class GeoComponent {
  constructor(private geoService:GeoService) {}
  title = 'e-shop-client';
  display: any;
  cityInput = '';
  center: google.maps.LatLngLiteral = {
    lat: 44.787197,
    lng: 20.457273,
  };

  zoom = 6;

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = event.latLng.toJSON();
  }
  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }
  getView()
  {
    // if(this.cityInput.length>1)
    // this.geoService.searchCities(this.cityInput).pipe(debounceTime(300)).subscribe(
    //   (data: any) => {
    //     data.results.forEach((element: any) => {
    //       console.log(element.formatted);
    //     });
        
    //   },
    //   (error) => {
    //     console.error('Greška prilikom HTTP poziva:', error);
    //   }
    // );
  }
  getCoordinates() {
    this.geoService.getCoordinates(this.cityInput).subscribe(
      (data: any) => {
        console.log('Odgovor od API-ja:', data);

        if (data.results && data.results.length > 0) {
          const location = data.results[0].geometry;
          this.center = {
            lat: location.lat,
            lng: location.lng,
          };
          console.log('Koordinate grada:', this.center);
        } else {
          console.error('Nije moguće dobiti koordinate za uneseni grad.');
        }
      },
      (error) => {
        console.error('Greška prilikom HTTP poziva:', error);
      }
    );
  }
}
