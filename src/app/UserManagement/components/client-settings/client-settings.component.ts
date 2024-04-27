import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargaSinEstresDataService } from 'src/app/services/carga-sin-estres-data.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-client-settings',
  templateUrl: './client-settings.component.html',
  styleUrls: ['./client-settings.component.scss']
})

export class ClientSettingsComponent {
  userSettingsForm: FormGroup;
  errorMessage: string = '';
  id: any;

  constructor(private fb: FormBuilder, private api: CargaSinEstresDataService, private route: ActivatedRoute, private router: Router, private _snackBar: MatSnackBar) {
    this.userSettingsForm = this.fb.group({
      name: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      celular: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarpassword: ['', Validators.required],
    });

    this.route.pathFromRoot[1].url.subscribe(
      url => {
        this.id = url[1].path;
      }
    ); 
  }

  

  ngOnInit(){}

  onSubmit(){
    this.errorMessage = '';
    const formData = this.userSettingsForm.value;
    let warnings = '';

    if (!formData.name) {
      warnings += 'El nuevo nombre no puede estar vacío.<br>';
    }

    if (!formData.apellidoPaterno) {
      warnings += 'El nuevo apellido paterno no puede estar vacío.<br>';
    }

    if (!formData.apellidoMaterno) {
      warnings += 'El nuevo apellido materno no puede estar vacío.<br>';
    }

    if (!formData.celular || !/^\d+$/.test(formData.celular)) {
      warnings += 'El nuevo celular debe contener solo dígitos enteros.<br>';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      warnings += 'La nueva dirección de email electronico no es válida.<br>';
    }

    if (formData.password.length < 6) {
      warnings += `La nueva contraseña no es valida <br>`;
    }

    if (formData.password !== formData.confirmarpassword) {
      warnings += 'La confirmación de la nueva contraseña no coincide.<br>';
    }

    this.errorMessage = warnings;

    if(this.errorMessage == ''){
      const newClientSettings={
        name: formData.name,
        apellidoMaterno: formData.apellidoMaterno,
        apellidoPaterno: formData.apellidoPaterno,
        celular: formData.celular,
        direccion: formData.direccion,
        email: formData.email,
        password: formData.password,
      }

      this.api.updateClient(this.id, newClientSettings).subscribe(
        (response) => {
          console.log('Respuesta del servidor: ', response);
          this._snackBar.open('Edicion de datos exitoso', 'Cerrar', {
            duration: 2000, // Duración en milisegundos
          });
        },
        (error) => {
          //console.log('Error al actualizar los ajustes: ', error);
        }
      );

    }

  }

  cancelar(){
    this.router.navigate(['/client', this.id, 'company-table']);
  }

}
