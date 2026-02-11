import { Component, inject, signal, OnInit } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';

import { EmpresasService } from '../../services/empresas.service';
import { EmpresaResponse } from '../../models/empresa.model';
import { CreateEmpresaDialogComponent } from '../../components/create-empresa-dialog/create-empresa-dialog.component';
import { EditEmpresaDialogComponent } from '../../components/edit-empresa-dialog/edit-empresa-dialog.component';
import { ViewTokenDialogComponent } from '../../components/view-token-dialog/view-token-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-empresas-list-page',
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  template: `
    <div class="page-container">
      <header class="page-header">
        <div class="header-content">
          <h1>Empresas</h1>
          <p class="subtitle">Lista de empresas registradas en el sistema</p>
        </div>
        <button mat-flat-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add_business</mat-icon>
          Nueva Empresa
        </button>
      </header>

      <!-- Search bar -->
      <div class="search-bar">
        <mat-form-field appearance="outline" class="search-field">
          <mat-icon matPrefix>search</mat-icon>
          <mat-label>Buscar por nombre o RUC</mat-label>
          <input matInput
            [(ngModel)]="searchFilter"
            (keyup.enter)="loadEmpresas()"
            placeholder="Buscar...">
        </mat-form-field>
      </div>

      <div class="page-content">
        @if (isLoading()) {
          <div class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
            <span>Cargando empresas...</span>
          </div>
        } @else if (errorMessage()) {
          <div class="error-state">
            <mat-icon>error_outline</mat-icon>
            <h3>Error al cargar empresas</h3>
            <p>{{ errorMessage() }}</p>
            <button mat-stroked-button color="primary" (click)="loadEmpresas()">
              <mat-icon>refresh</mat-icon>
              Reintentar
            </button>
          </div>
        } @else if (empresas().length === 0) {
          <div class="empty-state">
            <mat-icon>business</mat-icon>
            <h3>No hay empresas registradas</h3>
            <p>Comienza registrando una nueva empresa</p>
            <button mat-flat-button color="primary" (click)="openCreateDialog()">
              <mat-icon>add_business</mat-icon>
              Nueva Empresa
            </button>
          </div>
        } @else {
          <div class="table-container">
            <table mat-table [dataSource]="empresas()" matSort>
              <ng-container matColumnDef="ruc">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>RUC</th>
                <td mat-cell *matCellDef="let empresa">
                  <span class="ruc-cell">{{ empresa.ruc }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
                <td mat-cell *matCellDef="let empresa">{{ empresa.nombre }}</td>
              </ng-container>

              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
                <td mat-cell *matCellDef="let empresa">{{ empresa.email }}</td>
              </ng-container>

              <ng-container matColumnDef="encargado">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Encargado</th>
                <td mat-cell *matCellDef="let empresa">
                  {{ empresa.nombreUsuarioEncargado || 'Sin asignar' }}
                </td>
              </ng-container>

              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let empresa">
                  <div class="actions-cell">
                    <button mat-icon-button color="primary" (click)="openEditDialog(empresa)" matTooltip="Editar">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button (click)="viewToken(empresa)" matTooltip="Ver Token">
                      <mat-icon>vpn_key</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="confirmDelete(empresa)" matTooltip="Eliminar">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
            <mat-paginator
              [length]="totalElements"
              [pageSize]="pageSize"
              [pageIndex]="currentPage"
              [pageSizeOptions]="[5, 10, 25]"
              (page)="onPageChange($event)"
              showFirstLastButtons>
            </mat-paginator>
          </div>
        }
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;

      h1 {
        font-size: 28px;
        font-weight: 500;
        color: var(--color-neutral-900);
        margin: 0;
      }

      .subtitle {
        font-size: 14px;
        color: var(--color-neutral-600);
        margin: 4px 0 0;
      }

      button {
        mat-icon {
          margin-right: 8px;
        }
      }
    }

    .search-bar {
      margin-bottom: 16px;

      .search-field {
        width: 100%;
        max-width: 400px;
      }
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px;
      gap: 16px;
      color: var(--color-neutral-600);
    }

    .empty-state,
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px;
      text-align: center;
      background: var(--color-neutral-100);
      border-radius: 12px;
      border: 1px solid var(--color-neutral-300);

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: var(--color-neutral-400);
        margin-bottom: 16px;
      }

      h3 {
        font-size: 18px;
        font-weight: 500;
        color: var(--color-neutral-800);
        margin: 0 0 8px;
      }

      p {
        font-size: 14px;
        color: var(--color-neutral-600);
        margin: 0 0 24px;
      }

      button mat-icon {
        margin-right: 8px;
      }
    }

    .error-state {
      border-color: var(--color-error-300);
      background: var(--color-error-50);

      mat-icon {
        color: var(--color-error-400);
      }
    }

    .table-container {
      background: var(--color-neutral-100);
      border-radius: 12px;
      border: 1px solid var(--color-neutral-300);
      overflow: hidden;

      table {
        width: 100%;
      }

      th {
        background: var(--color-neutral-200);
        font-weight: 600;
        color: var(--color-neutral-700);
      }
    }

    .ruc-cell {
      font-family: 'Roboto Mono', monospace;
      font-size: 13px;
      color: var(--color-primary-700);
      font-weight: 500;
    }

    .actions-cell {
      display: flex;
      gap: 4px;

      button {
        width: 36px;
        height: 36px;
      }
    }

  `]
})
export class EmpresasListPage implements OnInit {
  private empresasService = inject(EmpresasService);
  private dialog = inject(MatDialog);

  empresas = signal<EmpresaResponse[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  displayedColumns = ['ruc', 'nombre', 'email', 'encargado', 'acciones'];

  searchFilter = '';
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 10;

  ngOnInit(): void {
    this.loadEmpresas();
  }

  loadEmpresas(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.empresasService.getEmpresas(this.searchFilter || undefined, this.currentPage, this.pageSize).subscribe({
      next: (page) => {
        this.empresas.set(page.content);
        this.totalPages = page.totalPages;
        this.totalElements = page.totalElements;
        this.currentPage = page.number;
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading empresas:', err);
        this.errorMessage.set(err.error?.message || 'No se pudieron cargar las empresas');
        this.isLoading.set(false);
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadEmpresas();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateEmpresaDialogComponent, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadEmpresas();
      }
    });
  }

  openEditDialog(empresa: EmpresaResponse): void {
    const dialogRef = this.dialog.open(EditEmpresaDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { empresa },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadEmpresas();
      }
    });
  }

  confirmDelete(empresa: EmpresaResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Empresa',
        message: `¿Estás seguro de que deseas eliminar "${empresa.nombre}" (RUC: ${empresa.ruc})? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.empresasService.deleteEmpresa(empresa.ruc).subscribe({
          next: () => this.loadEmpresas(),
          error: (err) => console.error('Error deleting empresa:', err),
        });
      }
    });
  }

  viewToken(empresa: EmpresaResponse): void {
    this.dialog.open(ViewTokenDialogComponent, {
      width: '500px',
      data: {
        ruc: empresa.ruc,
        empresaNombre: empresa.nombre,
      },
    });
  }
}
