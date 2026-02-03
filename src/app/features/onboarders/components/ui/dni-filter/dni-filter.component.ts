import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

/**
 * DniFilterComponent
 * Custom styled filter input for DNI search (no Material form-field)
 */
@Component({
  selector: 'app-dni-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
  ],
  template: `
    <div class="filter-wrapper">
      <mat-icon class="search-icon">search</mat-icon>
      <input 
        type="text"
        class="filter-input"
        [placeholder]="placeholder"
        [(ngModel)]="value"
        (keyup)="onKeyup($event)"
        (input)="onInput($event)">
      @if (value) {
        <button class="clear-btn" (click)="clearFilter()">
          <mat-icon>close</mat-icon>
        </button>
      }
    </div>
  `,
  styles: [`
    .filter-wrapper {
      display: flex;
      align-items: center;
      width: 280px;
      height: 48px;
      background-color: var(--color-neutral-100);
      border: 1px solid var(--color-neutral-400);
      border-radius: 8px;
      padding: 0 12px;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      
      &:hover {
        border-color: var(--color-neutral-600);
      }
      
      &:focus-within {
        border-color: var(--color-primary-600);
        box-shadow: 0 0 0 2px rgba(103, 80, 164, 0.1);
      }
    }
    
    .search-icon {
      color: var(--color-neutral-600);
      font-size: 20px;
      width: 20px;
      height: 20px;
      margin-right: 12px;
      flex-shrink: 0;
    }
    
    .filter-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: 14px;
      color: var(--color-neutral-900);
      
      &::placeholder {
        color: var(--color-neutral-500);
      }
    }
    
    .clear-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: var(--color-neutral-500);
      border-radius: 50%;
      
      &:hover {
        background-color: var(--color-neutral-200);
        color: var(--color-neutral-700);
      }
      
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }
  `]
})
export class DniFilterComponent {
  @Input() placeholder = 'Filtrar por DNI';
  @Input() debounceTime = 300;

  @Output() filterChange = new EventEmitter<string>();

  value = '';
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  onKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.emitValue(this.value);
    }
  }

  onInput(event: Event): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    this.debounceTimer = setTimeout(() => {
      this.emitValue(this.value);
    }, this.debounceTime);
  }

  clearFilter(): void {
    this.value = '';
    this.emitValue('');
  }

  private emitValue(value: string): void {
    this.filterChange.emit(value.trim().toLowerCase());
  }
}
