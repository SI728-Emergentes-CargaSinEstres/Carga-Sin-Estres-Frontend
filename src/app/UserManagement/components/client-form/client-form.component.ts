import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargaSinEstresDataService } from 'src/app/services/carga-sin-estres-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent {
  clientRegistrationForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router, private api: CargaSinEstresDataService, private _snackBar: MatSnackBar) { //private http: HttpClient
    this.clientRegistrationForm = this.fb.group({
      name: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      celular: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{12,}$/)]],
      confirmarpassword: ['', Validators.required],
    });
  }

  onSubmit() {
    this.errorMessage = '';
    const formData = this.clientRegistrationForm.value;
    let warnings = '';
    
    if (!formData.name || !formData.apellidoMaterno || !formData.apellidoPaterno || !formData.celular || !formData.direccion || !formData.email || !formData.password || !formData.confirmarpassword) {
      warnings += 'Todos los campos son obligatorios. <br>';
    }

    if (!formData.celular || !/^\d+$/.test(formData.celular)) {
      warnings += 'El celular debe contener solo dígitos enteros.<br>';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      warnings += 'El email electrónico no es válido.<br>';
    }

    if (!formData.password || formData.password.length < 6) {
      warnings += 'La contraseña debe tener al menos una letra en mayúscula, 12 caracteres y al menos 2 números.<br>';
    }

    if (formData.password !== formData.confirmarpassword) {
      warnings += 'Las contraseñas no coinciden.<br>';
    }

    this.errorMessage = warnings;

    if (this.errorMessage == '') { // Si no hay errores, se registra el usuario
      const clientData={
        name: formData.name,
        apellidoMaterno: formData.apellidoMaterno,
        apellidoPaterno: formData.apellidoPaterno,
        celular: formData.celular,
        direccion: formData.direccion,
        email: formData.email,
        password: formData.password,
        userType: 'client',
      }

      this.api.createClient(clientData).subscribe((clientResponse: any) => {
        if (clientResponse && clientResponse.id) { //se crea automaticamente el id del cliente
          this._snackBar.open('Registro exitoso', 'Cerrar', {
            duration: 2000, // Duración en milisegundos
          });
          this.router.navigate(['login']);
        }
      });

    }

  }

  cancelar(){
    this.router.navigate(['landing-page']);
  }
}
