import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
})
export class FiltersComponent {
  filtersForm: FormGroup;
  @Output() filtersSelected: EventEmitter<{
    searchPattern: string;
    radius: number;
  }> = new EventEmitter();
  constructor(private formBuilder: FormBuilder) {
    this.filtersForm = this.formBuilder.group({
      range: '',
      search: '',
    });
  }
  onSubmit() {
    event?.preventDefault();
    const range = parseInt(this.filtersForm.value.range);
    const selectedFilters = {
      searchPattern: this.filtersForm.value.search,
      radius: range,
    };
    this.filtersSelected.emit(selectedFilters);
    console.log(selectedFilters);
  }
}
