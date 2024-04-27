import { Component, Input } from '@angular/core';
import { CargaSinEstresDataService } from 'src/app/services/carga-sin-estres-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent {

  constructor(private dataService: CargaSinEstresDataService, private fb: FormBuilder ,private route: ActivatedRoute, private _snackBar: MatSnackBar) {
    this.subscriptionForm = this.fb.group({
      correo: ['', Validators.required],
      password: ['', Validators.required],
      ruc: ['', Validators.required],
      direccion: ['', Validators.required],
      vigenciaSuscripcion: ['', Validators.required],
      numeroTarjeta: ['', Validators.required],
      CVV: ['', Validators.required],
      fechaVencimiento: ['', Validators.required],
    });

    // Obtiene el id del usuario
    this.route.pathFromRoot[1].url.subscribe(
      url => {
        this.userId = url[1].path;
      }
    ); 
  }

  //para obtener el id del usuario
  userId: string = '';

  //heredan los datos de un parent
  @Input() companyId: any; 
  @Input() companyName: any; 
  @Input() companyLogo: any; 

  subscriptionForm: FormGroup;

  correo: string = '';
  contrasenia: string = '';
  ruc: string = '';
  direccion: string = '';
  vigenciaSuscripcion: string = '';
  numeroTarjeta: string = '';
  CVV: string = '';
  fechaVencimiento: string = '';

  //para mostrar el mensaje de confirmacion
  confirmacionVisible: boolean = false;
  //para desactivar el boton de confirmacion (no hacer spam de subscripciones)
  botonDesactivado: boolean = true;

  //incializar la firma aleatoria
  firma: string = this.generarCodigoAleatorio();

  onSubmit() {
      this.confirmacionVisible = true;
      //this.botonDesactivado = true;
      this.ruc = this.subscriptionForm.value.ruc;
      this.direccion = this.subscriptionForm.value.direccion;
      this.vigenciaSuscripcion = this.subscriptionForm.value.vigenciaSuscripcion;
      this.numeroTarjeta = this.subscriptionForm.value.numeroTarjeta;
      this.correo = this.subscriptionForm.value.correo;
      

      // Obtener la información de la empresa
      this.dataService.getCompanyById(this.userId).subscribe(
        (companyResponse: any) => {
            
            const nuevaSuscripcion: any = {
              firma: this.firma,
              subscriptionType: this.subscriptionForm.value.vigenciaSuscripcion,
              paymentMethod: this.subscriptionForm.value.numeroTarjeta,
            };
            
          // Crear la suscripción
          this.dataService.createSubscription(companyResponse.id ,nuevaSuscripcion).subscribe(
            (response) => {
              this._snackBar.open('Suscripción creada con éxito', 'Cerrar', {
                duration: 2000, // Duración en milisegundos
              });
            }
          );
        }
      );
  }
  
  generarCodigoAleatorio(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let codigo = '';
    const longitudCodigo = 6;

    for (let i = 0; i < longitudCodigo; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      codigo += caracteres.charAt(indice);
    }

    return codigo;
  }

  firmar() {
    this.firma = this.generarCodigoAleatorio();
  }


  descargarBoleta() {
    const contenidoBoleta = this.generarContenidoBoleta();
    
    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contenidoBoleta));
    enlaceDescarga.setAttribute('download', 'boleta.txt');
    
    enlaceDescarga.style.display = 'none';
    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    document.body.removeChild(enlaceDescarga);
    this._snackBar.open('Boleta descargada con éxito', 'Cerrar', {
      duration: 2000, // Duración en milisegundos
    });
  }

  generarContenidoBoleta(): string {
    const contenido = `
    Información de la Boleta:

    Correo: ${this.correo}
    contrasenia: ${this.contrasenia}
    RUC: ${this.ruc}
    Dirección: ${this.direccion}
    Vigencia de Suscripción: ${this.vigenciaSuscripcion}
    Numero de Tarjeta: ${this.numeroTarjeta}
    Firma: ${this.firma}
    `;
    return contenido;
  }

}