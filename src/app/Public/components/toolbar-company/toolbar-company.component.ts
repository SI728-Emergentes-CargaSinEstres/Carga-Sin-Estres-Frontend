import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-toolbar-company',
  templateUrl: './toolbar-company.component.html',
  styleUrls: ['./toolbar-company.component.scss']
})
export class ToolbarCompanyComponent implements OnInit {

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

  pageSettings(){
    this.router.navigateByUrl(`company/${this.userId}/company-settings`);
  }

  pageMembership(){
    this.router.navigateByUrl(`company/${this.userId}/membership`);
  }

  pageHistoryCards(){
    this.router.navigateByUrl(`company/${this.userId}/history-cards`);
  }

}
