import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';



const MODULES = [
  // Angular
  CommonModule,
  FormsModule,

  // Material
  MatIconModule,
  MatSnackBarModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatCheckboxModule,
  MatCardModule,
  MatChipsModule,
  MatTooltipModule
]

const SERVICES = [AuthService]
const GUARDS = [AuthGuard]

@NgModule({
  declarations: [],
  imports: MODULES,
  exports: [MODULES],
  providers: [
    ...SERVICES,
    ...GUARDS,
    provideHttpClient(withInterceptorsFromDi()),
  ]
})
export class SharedModule { }
