import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-toolbar-client',
  templateUrl: './toolbar-client.component.html',
  styleUrls: ['./toolbar-client.component.scss']
})
export class ToolbarClientComponent implements OnInit {

  userId: string = '';
  userType: string = '';
  constructor(private router: Router, private route: ActivatedRoute, private _snackBar: MatSnackBar) {
    // Obtiene el id del usuario
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });
    
    // Obtiene el tipo de usuario
    this.route.url.subscribe(url => {
      this.userType = url[0].path;
    });
  }

  ngOnInit(): void {}

  pageLanding(){
    this.router.navigateByUrl('/landing-page');
    this._snackBar.open('Se cerro sesión con éxito', 'Cerrar', {
      duration: 2000, // Duración en milisegundos
    });
  }

  pageHistoryCards(){
    this.router.navigateByUrl(`client/${this.userId}/history-cards`);
  }
  pageCompanyTable(){
    this.router.navigateByUrl(`client/${this.userId}/company-table`);
  }
  pageSettings(){
    this.router.navigateByUrl(`client/${this.userId}/client-settings`);
  }
}
