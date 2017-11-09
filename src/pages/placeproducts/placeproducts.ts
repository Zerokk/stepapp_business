import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, ToastController } from 'ionic-angular';
import { Parse } from 'parse';

@Component({
    selector: 'place-products',
    templateUrl: 'placeproducts.html'
})
 export class PlaceProducts{
   
   productList;
   visit;
 
   constructor(public navParams:NavParams, public viewCtrl: ViewController, public toastCtrl: ToastController){
     const id = this.navParams.get("placeId");
     this.visit = this.navParams.get("visit");
 
     let query = new Parse.Query('PlaceProduct');
       query.equalTo('placeId', id)
       query.find().then((d) => {
           this.productList = d;
       });
   }

   addProduct(product){
      if(this.visit){
        let consumitions = this.visit.get("consumitions");
        if(consumitions){
            // no previous consumitions
            consumitions = [];
            consumitions.push({
                    item: product.get("item"),
                    quantity: 1
            });
        }else{
            // there are previous consumitions
            const newItem = product.get("item");
            let found = false;
            for(let cons of consumitions){
                if(cons.item == newItem){
                    cons.quantity++;
                    found = true;
                    break;
                }
            }
            if(!found){
                consumitions.push({
                    item: product.get("item"),
                    quantity: 1
                });
            }
        }
        // save visit obj
        this.visit.save().then( res => {
            // correctly saved
            this.toastify("Product added for "+this.visit.userId.get("username"), 1000);
        }).catch(err => {
            // fail saving
            this.toastify("ERROR adding product for "+this.visit.userId.get("username"), 2000);
        });
      }
   }
 
   close(){
       this.viewCtrl.dismiss();
   }

      
   toastify(message, duration){       
    this.toastCtrl.create({
           message: message,
           duration: duration
    }).present();
 }
 }