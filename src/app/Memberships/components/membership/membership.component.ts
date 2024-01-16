import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss']
})
export class MembershipComponent {

  vigencia1: string = '3 mes';
  vigencia2: string = '6 meses';
  vigencia3: string = '12 meses';

  userId: string = '';
  constructor(private router: Router, private route: ActivatedRoute) {
    // Obtiene el id del usuario
    this.route.pathFromRoot[1].url.subscribe(
      url => {
        this.userId = url[1].path;
      }
    );
  }

  IrAFormulario() {
    this.router.navigate(['company/'+this.userId+'/payment-form']);
  }


}

