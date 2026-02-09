import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../../core/services/auth.service';
import { CreateUserFormComponent } from '../../components/create-user-form/create-user-form.component';

@Component({
  selector: 'app-create-user-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    CreateUserFormComponent,
  ],
  template: `
    <div class="page-container">
      <header class="page-header">
        <h1>Crear Usuario</h1>
        <p class="subtitle">Registrar un nuevo usuario en el sistema</p>
      </header>

      <div class="page-content">
        <app-create-user-form (userCreated)="onUserCreated()"></app-create-user-form>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .page-header {
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
    }
  `]
})
export class CreateUserPage {
  onUserCreated(): void {
    console.log('Usuario creado exitosamente');
  }
}
