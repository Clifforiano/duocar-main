import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-c-header',
  templateUrl: './c-header.component.html',
  styleUrls: ['./c-header.component.scss'],
})


export class CHeaderComponent  implements OnInit {


  @Input() titulo!: string;
  @Input() volver: boolean = true;
  @Input () home: boolean = true;


  constructor(private navCtrl: NavController) { }

  goBack() {
    this.navCtrl.back();
    }

  ngOnInit() {}

}
