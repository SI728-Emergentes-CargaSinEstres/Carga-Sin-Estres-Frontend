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
  company: any;
  currentServices = [];
  currentServicesLabel = '';
  services: { id: number, name: string }[] = []; 
  servicesIds:number[] = [];
  timeblock: any;

  constructor(private fb: FormBuilder, private api: CargaSinEstresDataService, private route: ActivatedRoute, private router: Router, private _snackBar: MatSnackBar) {//private http: HttpClient
   

    this.route.pathFromRoot[1].url.subscribe(
      url => {
        this.id = url[1].path;
      }
    ); 

    this.getCompany(this.id);
    this.getServices();
    this.getTimeblock();

      this.companySettingsForm = this.fb.group({
        name: [null],
        email: [null],
        direction: [null],
        phoneNumber: [null],
        password: [null],
        confirmPassword: [null],
        logo: [null],
        tic: [null],
        description: [null],
        startTime: [null],
        endTime: [null]
      });

  }

  ngOnInit(){}

  getCompany(id: any){
    this.api.getCompanyById(id).subscribe(
      (res: any) => 
      {
        this.company = res;
        this.currentServices = this.company.servicios.map((servicio: { name: any; }) => servicio.name);
        this.currentServicesLabel = this.currentServices.join(', ');
      }
    );
  }

  getTimeblock(){
    this.api.getTimeblock(this.id).subscribe(
      (res:any) =>{
        this.timeblock = res;
        this.companySettingsForm.patchValue({
          startTime: this.timeblock.startTime,
          endTime: this.timeblock.endTime
        });
      }
    )
    
  }

  getServices(){
    return this.api.getAllServices().subscribe(
      (res: any) => {
        this.services = res;
      }
    );
  }

  isServiceSelected(serviceId: number): boolean {
    return this.servicesIds.includes(serviceId);
  }

  toggleServiceSelection(serviceId: number): void {
      if (this.isServiceSelected(serviceId)) {
          this.servicesIds = this.servicesIds.filter(id => id !== serviceId);
      } else {
          this.servicesIds.push(serviceId);
      }
  }

  onSubmit(){
    const formData = this.companySettingsForm.value;

    // Verificar si todos los campos son nulos
    const allFieldsAreNull = Object.values(formData).every(value => value === null);

    if (allFieldsAreNull && this.servicesIds.length === 0) {
      this._snackBar.open('No hay cambios para guardar', 'Cerrar', {
        duration: 5000, // Duración en milisegundos
      });
      return;
    }

    const newCompanySettings={
      name: formData.name,
      email: formData.email,
      direction: formData.direction,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      logo: formData.logo,
      tic: formData.tic,
      description: formData.description,
      servicioIds: this.servicesIds
    }

    if (formData.password !== null) {
      if (formData.password !== formData.confirmPassword) {
        this._snackBar.open('La contraseña y la confirmación de contraseña no coinciden', 'Cerrar', {
          duration: 5000, // Duración en milisegundos
        });
        return;
      }
    }

    this.api.updateCompany(this.id, newCompanySettings).subscribe(
      (response) => {
        console.log('Respuesta del servidor: ', response);
        const newTimeblock = {
          companyId: this.id,
          startTime: formData.startTime,
          endTime: formData.endTime
        };

        this.api.updateTimeblock(this.timeblock.id, newTimeblock).subscribe(
          (res) =>
          {
            console.log ('Timeblock actualizado');
            
        this._snackBar.open('Edicion de datos exitoso', 'Cerrar', {
          duration: 2000, // Duración en milisegundos
        });

        setTimeout(() => { location.reload();}, 2000);
          }
        );
        
      },
      (error) => {
        console.log('Error al actualizar los ajustes: ', error);

        // Mostrar mensaje de error del servidor
        if (error && error.error && error.error.message) {
          this._snackBar.open(`${error.error.message}`, 'Cerrar', {
            duration: 5000, // Duración en milisegundos
          });
        } else {
          this._snackBar.open('Error desconocido del servidor', 'Cerrar', {
            duration: 5000, // Duración en milisegundos
          });
        }
      }
    );
  }

  cancelar(){
    this.router.navigate(['/company', this.id, 'membership']);
  }
}
