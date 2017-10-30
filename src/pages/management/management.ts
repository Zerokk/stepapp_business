import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import Parse from 'parse';

@Component({
  selector: 'management',
  templateUrl: 'management.html'
})
export class Management {

  place;
  visitBuffer = [];

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
        query.descending("createdAt");
        query.find().then( initialData => {
          if(initialData.length > 1){
            console.log(" >> SubscribeVisits: found array, mapping. Array: ", initialData);
            initialData.map((v) => this.visitBuffer.push(v));
          }else if(initialData != [] && initialData[0]){
            console.log(" >> SubscribeVisits: found obj, pushing. Obj: ", initialData[0]);
            this.visitBuffer.push(initialData[0]);
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
      query.find().then( initialData => {
        if(initialData.length > 1){
          console.log(" >> SubscribeGroupVisits: found array, mapping. Array: ", initialData);
          initialData.map((v) => this.visitBuffer.push(v));
        }else if(initialData != [] && initialData[0]){
          console.log(" >> SubscribeGroupVisits: found obj, pushing. Obj: ", initialData[0]);
          this.visitBuffer.push(initialData[0]);
        }
        resolve(query.subscribe());
      }).catch(e => {
        console.log("ERROR: ",e)
      })
});
}
}
