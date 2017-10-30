import { Component } from '@angular/core';
import { NavController, ModalController, ViewController, AlertController } from 'ionic-angular';
import Parse from 'parse';

import { TabsPage } from '../tabs/tabs';

@Component({
   selector: 'page-login',
   templateUrl: 'login.html'
})
export class LoginPage{

   loginData;

   constructor(
      public navCtrl: NavController, 
      public modalCtrl: ModalController, 
      public alertCtrl: AlertController
   ){
      this.loginData = {};
   }

   openRegisterModal(){
      let registerModal = this.modalCtrl.create(RegisterModal);
      registerModal.present();
   }

   checkLoginForm(){
      let data = this.loginData;

      if(data.username == undefined||data.username == ""||data.username == " "){
         let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'No puedes dejar el nombre de usuario vacío.',
            buttons: ['Lo haré mejor esta vez']
         });
         alert.present();
      }else if(data.password == undefined||data.password == ""||data.password == " "){
         let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'No puedes dejar la contraseña en blanco.',
            buttons: ['Daré lo mejor de mi mismo']
         });
         alert.present();
      }else{
          // LOGIN SUCCESS
         Parse.User.logIn(data.username, data.password).then((success)=>{
             // Comprobamos que el usuario tenga un local registrado
            let query = new Parse.Query("placeManagers");
                query.equalTo("user", Parse.User.current());
                query.find().then( d => {
                    if(d){
                        // Actualmente escogemos automáticamente el primer registro, pero debe poderse elegir en una lista si hay varios
                        const placeId = d[0].get("place").id;
                        localStorage.setItem("placeId", placeId);
                        this.navCtrl.setRoot(TabsPage);
                    }
                }).catch(e => {
                    let alert = this.alertCtrl.create({
                        title: 'Error',
                        subTitle: 'No se ha encontrado ningún local asignado',
                        buttons: ['TODO']
                     });
                });
            
         },(error)=>{
            let alert = this.alertCtrl.create({
               title: 'Error',
            //   subTitle: 'Ha ocurrido un error al iniciar sesión, revisa los datos e inténtalo de nuevo',
              subTitle: error,
               buttons: ['No se os puede dejar solos']
            });
            alert.present();
         });
      }
   }

}

@Component({
   template: `
      <ion-header>
         <ion-toolbar>
            <ion-buttons left>
               <button ion-button clear icon-only (click)="closeModal()">
                  <ion-icon name="close"></ion-icon>
               </button>
            </ion-buttons>
            <ion-title>Crear una cuenta</ion-title>
         </ion-toolbar>
      </ion-header>
      <ion-content padding>
         <ion-list>
            <ion-item no-lines>
               <ion-label floating>Nombre de usuario</ion-label>
               <ion-input type="text" [(ngModel)]="registerData.username"></ion-input>
            </ion-item>
            <ion-item no-lines>
               <ion-label floating>Email</ion-label>
               <ion-input type="email" [(ngModel)]="registerData.email"></ion-input>
            </ion-item>
            <ion-item no-lines>
               <ion-label floating>Contraseña</ion-label>
               <ion-input type="password" [(ngModel)]="registerData.password"></ion-input>
            </ion-item>
         </ion-list>
         <button ion-button block color="primary" (click)="checkRegisterData()">Crear cuenta</button>
      </ion-content>
   `
})
export class RegisterModal{
   
   registerData;

   constructor(
      public viewCtrl: ViewController, 
      public alertCtrl: AlertController, 
      public navCtrl: NavController
   ){
      this.registerData = {};
   }

   checkRegisterData(){
      let data = this.registerData;
      if(data.username == undefined||data.username == ""||data.username == " "){
         let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'No puedes dejar el nombre de usuario vacío.',
            buttons: ['Lo haré mejor esta vez']
         });
         alert.present();
      }else if(data.email == undefined||data.email == ""||data.email == " "){
         let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'No puedes dejar el email vacío.',
            buttons: ['Daré lo mejor de mi mismo']
         });
         alert.present();
      }else if(data.password == undefined ||data.password == ""||data.password == " "){
         let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'La contraseña no puede estar vacía.',
            buttons: ['Prometo no volver a hacerlo']
         });
         alert.present();
      }else{
         //Everything is correct, no missing fields in the data
         //Other validation may apply in the future, like: Email validation, check username, password length
         //If everything is correct, proceed to user registration
         let self = this;
         let user = new Parse.User();
         user.set("username", data.username);
         user.set("password", data.password);
         user.set("currentPlans", []);
         user.set("friendList", []);
         user.set("groups", []);
         user.set("email", data.email);

         // TODO: Hay que también meter un paso para registrar locales y asignarlos a la cuenta de usuario.
         
         user.signUp(null, {
            success: function(user){
               self.navCtrl.setRoot(TabsPage);
            },
            error: function(user, error) {
               let alert = this.alertCtrl.create({
                  title: 'Error',
                  subTitle: 'Ha ocurrido un error al crear la cuenta, inténtalo de nuevo más tarde.',
                  buttons: ['Sois unos inútiles']
               });
               alert.present();
            }
         });
      }
   }

   closeModal(){
      this.viewCtrl.dismiss();
   }

}