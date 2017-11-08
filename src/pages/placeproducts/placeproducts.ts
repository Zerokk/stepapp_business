import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { Parse } from 'parse';

@Component({
    selector: 'place-products',
    templateUrl: 'placeproducts.html'
})
 export class PlaceProducts{
   
   productList;
 
   constructor(public navParams:NavParams, public viewCtrl: ViewController){
     const id = this.navParams.get("placeId");
 
     let query = new Parse.Query('PlaceProduct');
       query.equalTo('placeId', id)
       query.find().then((d) => {
           this.productList = d;
       })
   }
 
 
   close(){
       this.viewCtrl.dismiss();
   }
 }