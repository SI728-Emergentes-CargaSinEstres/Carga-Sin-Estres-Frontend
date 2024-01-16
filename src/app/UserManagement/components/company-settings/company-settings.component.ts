import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargaSinEstresDataService } from 'src/app/services/carga-sin-estres-data.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-company-settings',
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.scss']
})
export class CompanySettingsComponent {
  companySettingsForm: FormGroup;
  errorMessage: string = '';
  id: any;

  constructor(private fb: FormBuilder, private api: CargaSinEstresDataService,
     private route: ActivatedRoute, private router: Router, private _snackBar: MatSnackBar) {//private http: HttpClient
    this.companySettingsForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      numeroContacto: ['', Validators.pattern(/^\d+$/)],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarpassword: ['', Validators.required],
      photo: ['', Validators.required],
      transporte: [false],
      carga: [false],
      embalaje: [false],
      montaje: [false],
      desmontaje: [false],
      description: ['']
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
    const formData = this.companySettingsForm.value;
    let warnings = "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      warnings += `La nueva dirección de email electronico no es válida.<br>`;
    }

    if (!/^\d+$/.test(formData.numeroContacto)) {
      warnings += `El numero de contacto nuevo no es valido <br>`;
    }

    if (formData.password.length < 6) {
      warnings += `La nueva contraseña no es valida <br>`;
    }

    if (formData.password !== formData.confirmarpassword) {
      warnings += `No se confirmo la nueva contraseña correctamente <br>`;
    }

    // Handle checkbox validation
    const services = [];
    const checkboxes = [
      'transporte', 'carga', 'embalaje', 'montaje', 'desmontaje'
    ];

    checkboxes.forEach(checkboxName => {
      const control = this.companySettingsForm.get(checkboxName);
      if (control && control.value) {
        services.push(checkboxName);
      }
    });

    if (services.length === 0) {
      warnings += 'Seleccione al menos un servicio <br>';
    }

    if (!formData.description || formData.description.length < 4) {
      warnings += `La descripcion es muy corta <br>`;
    }

    this.errorMessage = warnings;

    if(this.errorMessage == ''){
      const newCompanySettings={
        name: formData.name,
        email: formData.email,
        direccion: formData.direccion,
        numeroContacto: formData.numeroContacto,
        password: formData.password,
        photo: formData.photo,
        transporte: formData.transporte,
        carga: formData.carga,
        embalaje: formData.embalaje,
        montaje: formData.montaje,
        desmontaje: formData.desmontaje,
        description: formData.description,
      }

      this.api.updateCompany(this.id, newCompanySettings).subscribe(
        data => {
          this._snackBar.open('Se actualizo correctamente los datos de su compañia', 'Cerrar', {
            duration: 2000, // Duración en milisegundos
          });
          alert('Los ajustes se han actualizado correctamente');
        },
        error => {
          this._snackBar.open('Hubo un error actualizando los datos de su compañia', 'Cerrar', {
            duration: 2000, // Duración en milisegundos
          });
          alert('Ha ocurrido un error al actualizar los ajustes de tu empresa, por favor inténtalo de nuevo más tarde');
        }
      )
      
    }

  }

  cancelar(){
    this.router.navigate(['/company', this.id, 'membership']);
  }

}
