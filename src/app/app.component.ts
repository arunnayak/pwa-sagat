import { Component, OnInit, HostListener } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  isUpdateAvailable = false;
  showAHSButton = false;
  deferredPrompt: any;

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: any) {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;
    this.showAHSButton = true;
  }

  constructor(
    private _swUpdate: SwUpdate
  ){}

  ngOnInit(){
    this._swUpdate.available.subscribe(() => this.isUpdateAvailable = true);
  }

  updateApp() {
    this._swUpdate.activateUpdate().then(() => document.location.reload())
  }

  installApp(){
    this.showAHSButton = false;
    this.deferredPrompt.prompt();

    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.deferredPrompt = null;
      });

  }
}
