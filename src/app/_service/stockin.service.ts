import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class StockinService {
  baseUrl = environment.apiurl + 'ProductApi/';
constructor(private http: HttpClient) { }
GetstockIn(){
  return this.http.get<any>(this.baseUrl+'AllInventory')
};
AddInventory(form:any){
  return this.http.post<any>(this.baseUrl+'AddInventory',form)

};
UpdateInventory(form:any){
  debugger
  return this.http.post<any>(this.baseUrl+'UpdateInventory',form)

};
ChangeStatus(id:any){
  return this.http.post<any>(this.baseUrl+'Changestatus',id)
};
}
