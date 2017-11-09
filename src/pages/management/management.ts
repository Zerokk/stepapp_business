import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PlaceProducts } from '../placeproducts/placeproducts';

import Parse from 'parse';

@Component({
  selector: 'management',
  templateUrl: 'management.html',
  animations: [
    trigger('openItem', [
      state('closed', style({
        height: "0px",
        opacity: 0
      })),
      state('opened', style({
        height: "240px",   // <-- TODO, hay que solucionar esto
        opacity: 1
      })),
      transition('* => *', animate('.35s'))
    ])
  ]
})
export class Management {

  place;
  visitBuffer = [];
  openstatus = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    const placeId = localStorage.getItem("placeId");
    console.log("LOCALSTORAGE placeId ", placeId)
    this.getPlace(placeId)
        .then( place => {
          this.place = place;
          console.log(this.place)
          // Subscribe to normal Visits
          this.subscribeVisits(place).then( subscription => {
            let s = <any> subscription;
            s.on('create', (visit) => {
              this.visitBuffer.push(visit);
            });
          })
          // Subscribe to GroupVisits
          this.subscribeGroupVisits(place).then( subscription => {
            let s = <any> subscription;
            s.on('create', (visit) => {
              this.visitBuffer.push(visit);
            });
          })
        })
  }

  
  getPlace(placeId){
    return new Promise((resolve, reject) => {
      let query = new Parse.Query("Place");
      query.equalTo("objectId", placeId);
      query.find().then( d => {
        if(d){
          resolve(d[0]);
        }
        reject("not found");
      }).catch(e => reject(e));
    });
  }

  subscribeVisits(place){
    return new Promise((resolve, reject) => {
    let query = new Parse.Query("Visit");
        query.equalTo("placeId", place);
        query.limit(50);
        query.include("userId");
        query.descending("createdAt");
        query.find().then( data => {
          if(data[0]){
            console.log("fetched: ", data)
            data.map((v) => this.visitBuffer.push(v));
          }
          resolve(query.subscribe());
        }).catch(e => {
          console.log("ERROR: ",e)
        })
  });
}

subscribeGroupVisits(place){
  return new Promise((resolve, reject) => {
  let query = new Parse.Query("GroupVisit");
      query.equalTo("placeId", place);
      query.limit(50);
      query.descending("createdAt");
      query.find().then( data => {
        if(data[0]){
          data.map((v) => this.visitBuffer.push(v));
        }
        resolve(query.subscribe());
      }).catch(e => {
        console.log("ERROR: ",e)
      })
});
}

calcTotal(prices){
  if(prices && prices.length > 1){
    return prices.reduce( (oldVal, currVal) => oldVal + currVal);
  }else{
    return 0
  }
}

openItem(index){
  if(this.visitBuffer[index].get("consumitions") != null){
    if(this.openstatus[index] == "closed"){
      this.openstatus[index] = "opened";
      document.getElementById("item-"+index).classList.remove("visit-item");
    }else{
      this.openstatus[index] = "closed";
      setTimeout(() => {
        document.getElementById("item-"+index).classList.add("visit-item");
      }, 350)
    }
  }
}

checkStatus(index){
  if(this.openstatus[index] == null){
    console.log("this item has a null status")
    this.openstatus[index] = "closed";
    return "closed";
  }else{
    console.log("current item status: ", this.openstatus[index])
    return this.openstatus[index];
  }
}

mapConsumitions(consumitions){
  if(consumitions){
      let mappedItems = [];
      consumitions.map(value => {
        if(mappedItems.length == 0){
          mappedItems.push({item: value, quantity: 1});
        }else{
          for(let i=0;i<mappedItems.length;i++){
            if(value == mappedItems[i].item){
              mappedItems[i].quantity++;
            }else if(i == mappedItems.length-1){
              mappedItems.push({item: value, quantity: 1});
            }
          }
        }
      });
      console.log("mapped items: ", mappedItems)
      return mappedItems;
  }else{
    return null;
  }
}

getTotalPrice(consumitions){
  return consumitions.reduce( (oldVal, currVal) => oldVal+=currVal);
}

openProducts(visit){
  this.navCtrl.push(PlaceProducts, {placeId: this.place.id, visit: visit});
}

}
