import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService } from '../../../../../src/app/_service/alertify.service';
import { InventoryDto } from '../../../../../src/app/Models/inventoryDto';
import { StockinService } from './../../../../../src/app/_service/stockin.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-AllInventory',
  templateUrl: './AllInventory.component.html',
  styleUrls: ['./AllInventory.component.scss']
})
export class AllInventoryComponent implements OnInit {
  key:string='rowid';
  reverse:boolean=false;
  invertorylist:any[];
  Searchinvertorylist:any[];
  p:number=1;
  Barcode:any;
  status :boolean;
  showform:boolean=false;
  sinleinventroyda:any;
  constructor(private modalService: NgbModal,private alertify: AlertifyService,private SpinnerService: NgxSpinnerService,private  inventorymodal:InventoryDto,private service:StockinService,private fb:FormBuilder) { }

  ngOnInit() {
    this.GetInventory();
  }
  Sort(key){
    this.key=key;
    this.reverse=!this.reverse;
  }
  GetInventory(){
    this.SpinnerService.show();
    this.service.GetstockIn().subscribe((next:any) => {
      this.invertorylist=[];
      this.invertorylist=next.resp;
      this.Searchinvertorylist=next.resp;
      this.SpinnerService.hide();
      console.log(this.invertorylist)
    }, error => {
      console.log(error);
    });
  
  }
  inventoryform:FormGroup=new FormGroup({
    Barcode: new FormControl(this.inventorymodal.Barcode),
    singleunitpurchaseprice: new FormControl(this.inventorymodal.singleunitpurchaseprice),
    psingleunit_SellingPrice: new FormControl(this.inventorymodal.psingleunit_SellingPrice),
    ProductInventory_Qty: new FormControl(0),
   });
   inventoryform1:FormGroup=new FormGroup({
    Barcode: new FormControl(this.inventorymodal.Barcode),
    productInvertory_Id:new FormControl(0),
    singleunitpurchaseprice: new FormControl(this.inventorymodal.singleunitpurchaseprice),
    psingleunit_SellingPrice: new FormControl(this.inventorymodal.psingleunit_SellingPrice),
    ProductInventory_Qty: new FormControl(0),
   });
   checkform()
  {
    
    this.showform=true;
  }
  openLgEdit(Updateinventroy,id:number){

    
debugger

var data=this.Searchinvertorylist.find(res=>res.productInvertory_Id==id);
this.sinleinventroyda=data;
this.inventoryform1.setValue({
  Barcode:this.sinleinventroyda.barcode,
  productInvertory_Id:this.sinleinventroyda.productInvertory_Id,
  singleunitpurchaseprice:this.sinleinventroyda.productInventory_UnitPrice,
  psingleunit_SellingPrice:this.sinleinventroyda.productInventory_SellingPrice,
  ProductInventory_Qty:this.sinleinventroyda.purchasedQty,

});
this.modalService.open(Updateinventroy, { size: 'lg' });
  };

  SearchProduct(){
    if(this.Barcode==""){
      this.Searchinvertorylist=[];
     this.Searchinvertorylist=this.invertorylist
    }
    else{
      if(this.invertorylist!=null){
        this.Searchinvertorylist=this.invertorylist.filter(res=>{
          return res.barcode.match(this.Barcode)
        })
      }
   
    }
  }
  oncancel()
  {
    this.showform=false;
    this.inventoryform.reset();
  }
  saveinventory()
  {
    debugger;
    console.log(this.inventoryform.value);

        this.service.AddInventory(this.inventoryform.value).subscribe(next => {
       
      
          this.inventoryform.reset();
           this.GetInventory();
           this.showform=false;
          this.alertify.success('Inventory Add seccussfully');
         
        }, error => {
         this.alertify.error('Barcode not exists');
          console.log(error);
        });
  }
  UpdateInventory()
  {
    debugger;
    console.log(this.inventoryform1.value);

        this.service.UpdateInventory(this.inventoryform1.value).subscribe(next => {
       
      
          this.inventoryform1.reset();
           this.GetInventory();
           this.showform=false;
           this.modalService.dismissAll();
           
          this.alertify.success('Inventory Updated seccussfully');
         
        }, error => {
         this.alertify.error('Barcode not exists');
          console.log(error);
        });
  }
  onOptionsSelected(num){
    debugger;
    if(num=="0"){
      this.Searchinvertorylist=this.invertorylist;
    }
    if(num=="1"){
      this.status=true;
      this.Searchinvertorylist=this.invertorylist.filter(x=>x.productInventory_Status==this.status);
    }
    if(num=="2"){
    
      this.status=false;
      this.Searchinvertorylist=this.invertorylist.filter(x=>x.productInventory_Status==this.status);
    }

  }
  changestatus(id:number){
this.service.ChangeStatus(id).subscribe((next:any)=>{
  this.invertorylist.forEach(x=>{if(x.productInvertory_Id==id){x.productInventory_Status=!x.productInventory_Status}});
}, error => {
      console.log(error);
    })
  }
}
