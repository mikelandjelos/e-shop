import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { GeoService } from '../services/geo.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WarehouseService } from '../services/warehouse.service';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';
@Component({
  selector: 'app-warehouse-form',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  templateUrl: './warehouse-form.component.html',
  styleUrl: './warehouse-form.component.scss',
})
export class WarehouseFormComponent {
  wareHouseForm: FormGroup;
  suggestions: string[] = [];
  constructor(
    private geoService: GeoService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<WarehouseFormComponent>,
    private warehouseService: WarehouseService, private dialog:MatDialog
  ) {
    this.wareHouseForm = this.formBuilder.group({
      wareHouse: '',
      location: '',
    });
  }
  selectSuggestion(suggestion: string): void {
    console.log(suggestion);
    this.wareHouseForm.get('location')?.setValue(suggestion);

    this.suggestions = [];
  }
  onChange(): void {
    const location = this.wareHouseForm.value.location;
    if (location.length > 1)
      this.geoService.searchCities(location).subscribe(
        (data: any) => {
          data.results.forEach((element: any) => {
            console.log(element.formatted);
            this.suggestions = data.results.map(
              (element: any) => element.formatted
            );
          });
        },

        (error) => {
          console.error('Greška prilikom HTTP poziva:', error);
          this.suggestions = [];
        }
      );
    else this.suggestions = [];
  }
  getCoordinates(
    location: string
  ): Observable<{ name: string; longitude: number; latitude: number }> {
    return new Observable((observer) => {
      this.geoService.getCoordinates(location).subscribe(
        (data: any) => {
          console.log('Odgovor od API-ja:', data);

          if (data.results && data.results.length > 0) {
            const location = data.results[0].geometry;
            const center = {
              lat: location.lat,
              lng: location.lng,
            };
            console.log('Koordinate grada:', center);
            const result = {
              name: location,
              longitude: center.lng,
              latitude: center.lat,
            };
            observer.next(result);
          } else {
            console.error('Nije moguće dobiti koordinate za uneseni grad.');
          }
        },
        (error) => {
          console.error('Greška prilikom HTTP poziva:', error);
        },
        () => {
          observer.complete();
        }
      );
    });
  }
  async onSubmit() {
    console.log(this.wareHouseForm.value.location);
    this.getCoordinates(this.wareHouseForm.value.location).subscribe((resp) => {
      console.log(this.wareHouseForm.value.wareHouse);
      console.log(resp.longitude);
      console.log(resp.latitude);
      this.warehouseService
        .create(
          this.wareHouseForm.value.wareHouse,
          resp.longitude,
          resp.latitude
        )
        .subscribe(
          (respo)=>{console.log(respo);
            this.dialog.open(NotificationPopupComponent, {
              data: {
                title: 'Notification',
                text: 'WareHouse was created',
              },
            });
          }
        );
    });
  }
}
