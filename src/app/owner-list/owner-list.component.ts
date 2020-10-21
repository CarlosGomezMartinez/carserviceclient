import { Component, OnInit } from '@angular/core';
import { OwnerService } from '../shared/owner/owner.service';
import { Router } from '@angular/router';
import {CarService } from '../shared/car/car.service';

@Component({
  selector: 'app-owner-list',
  templateUrl: './owner-list.component.html',
  styleUrls: ['./owner-list.component.css']
})
export class OwnerListComponent implements OnInit {
  owners: Array<any>
  public id
  public vector = []
  cars: Array<any>

  constructor(private ownerService: OwnerService, private carService: CarService, private route: Router) { }

  ngOnInit() {
    this.ownerService.getAll().subscribe(data => {
      this.owners = data._embedded.owners;
    });
  }

  obtainID(href){
    this.id = href.substring(50, href.length);
    this.route.navigate(['/owner-edit/' + this.id]);        
  }

  activo(href, otro){
    if(otro == true ){
      this.vector.push(href);
    }
    else{
      let posicion = this.vector.indexOf(href);
      this.vector.slice(posicion, 1);
    }
  }

  remove(){
    this.carService.getAll().subscribe(data => {
      console.log(data);
      this.cars = data._embedded.cars;
      for(let owner of this.vector ){
        for(let j of this.owners){
          if(owner == j._links.self.href){
            for (let car of this.cars) {
              if(car.ownerDni == j.dni){
                car.ownerDni = null;
                car.href = car._links.self.href;
                this.carService.save(car).subscribe();
              }
            }
          }
        }
        this.ownerService.remove(owner).subscribe();
      }
    });

    window.location.reload();
  }
}
