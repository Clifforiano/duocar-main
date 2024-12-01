import { Component } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform, private alertController: AlertController) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.blockBackButton();
    });
  }

  blockBackButton() {
    this.platform.backButton.subscribeWithPriority(10, async () => {
      
    });
  }

}
