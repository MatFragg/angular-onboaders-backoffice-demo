import { Component, inject, signal, OnInit } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UsersService } from '../../services/users.service';
import { UsuarioListResponse } from '../../models/user.model';
import { CreateUserDialogComponent } from '../../components/create-user-form/create-user-form.component';
import { EditUserDialogComponent } from '../../components/edit-user-dialog/edit-user-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-users-list-page',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule
],
  template: `
    <div class="page-container">
      <header class="page-header">
        <div class="header-content">
          <h1>Usuarios</h1>
          <p class="subtitle">Lista de usuarios registrados en el sistema</p>
        </div>
        <button mat-flat-button color="primary" (click)="openCreateUserDialog()">
          <mat-icon>person_add</mat-icon>
          Nuevo Usuario
        </button>
      </header>

      <div class="page-content">
        @if (isLoading()) {
          <div class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
            <span>Cargando usuarios...</span>
          </div>
        } @else if (errorMessage()) {
          <div class="error-state">
            <mat-icon>error_outline</mat-icon>
            <h3>Error al cargar usuarios</h3>
            <p>{{ errorMessage() }}</p>
            <button mat-stroked-button color="primary" (click)="loadUsers()">
              <mat-icon>refresh</mat-icon>
              Reintentar
            </button>
          </div>
        } @else if (users().length === 0) {
          <div class="empty-state">
            <mat-icon>people_outline</mat-icon>
            <h3>No hay usuarios registrados</h3>
            <p>Comienza creando un nuevo usuario</p>
            <button mat-flat-button color="primary" (click)="openCreateUserDialog()">
              <mat-icon>person_add</mat-icon>
              Crear Usuario
            </button>
          </div>
        } @else {
          <div class="table-container">
            <table mat-table [dataSource]="users()">
              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let user">{{ user.nombre }}</td>
              </ng-container>

              <ng-container matColumnDef="acjMail">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let user">{{ user.acjMail }}</td>
              </ng-container>

              <ng-container matColumnDef="rol">
                <th mat-header-cell *matHeaderCellDef>Rol</th>
                <td mat-cell *matCellDef="let user">
                  <span class="badge" [class]="user.rol.toLowerCase()">
                    {{ user.rol }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="subRol">
                <th mat-header-cell *matHeaderCellDef>Sub-rol</th>
                <td mat-cell *matCellDef="let user">{{ user.subRol || '-' }}</td>
              </ng-container>

              <ng-container matColumnDef="activo">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let user">
                  <span class="status" [class.active]="user.activo">
                    {{ user.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let user">
                  <div class="actions-cell">
                    <button mat-icon-button color="primary" (click)="openEditUserDialog(user)" matTooltip="Editar">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button [color]="user.activo ? 'warn' : 'primary'" (click)="toggleUserActive(user)" [matTooltip]="user.activo ? 'Desactivar' : 'Activar'">
                      <mat-icon>{{ user.activo ? 'person_off' : 'person' }}</mat-icon>
                    </button>
                    <button mat-icon-button color="warn" (click)="confirmDeleteUser(user)" matTooltip="Eliminar">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        }
      </div>
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
      margin-bottom: 24px;

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

    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;

      &.admin {
        background: var(--color-primary-100);
        color: var(--color-primary-700);
      }

      &.user {
        background: var(--color-neutral-200);
        color: var(--color-neutral-700);
      }
    }

    .status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      
      &::before {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--color-neutral-400);
      }

      &.active::before {
        background: var(--color-success-500);
      }
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
export class UsersListPage implements OnInit {
  private usersService = inject(UsersService);
  private dialog = inject(MatDialog);

  users = signal<UsuarioListResponse[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  displayedColumns = ['nombre', 'acjMail', 'rol', 'subRol', 'activo', 'acciones'];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.errorMessage.set(err.error?.message || 'No se pudieron cargar los usuarios');
        this.isLoading.set(false);
      }
    });
  }

  openCreateUserDialog(): void {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      width: '600px',
      disableClose: true,
      panelClass: 'create-user-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  openEditUserDialog(user: UsuarioListResponse): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  toggleUserActive(user: UsuarioListResponse): void {
    const action = user.activo ? 'desactivar' : 'activar';
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: `${user.activo ? 'Desactivar' : 'Activar'} Usuario`,
        message: `¿Estás seguro de que deseas ${action} a "${user.nombre}"?`,
        confirmText: user.activo ? 'Desactivar' : 'Activar',
        confirmColor: user.activo ? 'warn' : 'primary',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.usersService.toggleUserActive(user.id).subscribe({
          next: () => this.loadUsers(),
          error: (err) => console.error('Error toggling user:', err),
        });
      }
    });
  }

  confirmDeleteUser(user: UsuarioListResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Usuario',
        message: `¿Estás seguro de que deseas eliminar a "${user.nombre}"? Esta acción desactivará al usuario.`,
        confirmText: 'Eliminar',
        confirmColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.usersService.deleteUser(user.id).subscribe({
          next: () => this.loadUsers(),
          error: (err) => console.error('Error deleting user:', err),
        });
      }
    });
  }
}
