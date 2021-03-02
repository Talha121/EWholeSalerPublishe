import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from './../../../../../src/environments/environment.prod';
import { FileuploadService } from '../../../../../src/app/_service/fileupload.service';
import { ProductService } from '../../../../../src/app/_service/product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Category } from '../../../../../src/app/Models/Category';
import { AlertifyService } from '../../../../../src/app/_service/alertify.service';

@Component({
  selector: 'app-Allcategories',
  templateUrl: './Allcategories.component.html',
  styleUrls: ['./Allcategories.component.scss']
})
export class AllcategoriesComponent implements OnInit {
    form: FormGroup;
    ImagebaseUrl = environment.Imagebaseurl + 'CategoryImages/';
  CategoriesList:any;
  key:string='rowid';
  reverse:boolean=false;
  p:number=1;
  categotyid:number;
  noimage="";
  showform:boolean=false;  
  Singlecategory:Category;
  progress: number = 0;
  constructor(private categorymodel:Category,private alertify: AlertifyService,private SpinnerService: NgxSpinnerService,private productservice:ProductService,private modalService: NgbModal,private uploadfileservice:FileuploadService,private fb:FormBuilder) { }

  ngOnInit() {
    this.SpinnerService.show();
    this.Getcategorey();
    this.form = this.fb.group({
    
      avatar: [null]
    })
    this.SpinnerService.hide();
  }
  showinput()
  {
   this.showform=true;
  }
  CategoryForm:FormGroup=new FormGroup({
    category_Name: new FormControl(this.categorymodel.category_Name),
    category_Id: new FormControl(0),
    category_Name_Urdu: new FormControl(this.categorymodel.category_Name_Urdu),
    status: new FormControl(true),
    category_Image: new FormControl(""),

   });
   AddCategory(){
    debugger;
   this.productservice.Addcateogry(this.CategoryForm.value).subscribe(next => {
  
    this.modalService.dismissAll();
     this.CategoryForm.reset();
     this.Getcategorey();
     this.alertify.success('Category Updated seccussfully');
    
   }, error => {
    this.alertify.error('already exists');
     console.log(error);
   });
    console.log(this.CategoryForm.value)
  }
  UpdateCategory(){
    debugger;
   this.productservice.UpdateCategory(this.CategoryForm.value).subscribe(next => {
  
    this.modalService.dismissAll();
     this.CategoryForm.reset();
     this.Getcategorey();
     this.alertify.success('Category Updated seccussfully');
    
   }, error => {
    this.modalService.dismissAll();
    this.CategoryForm.reset();
    this.alertify.success('Category Updated seccussfully');
     console.log(error);
   });
    console.log(this.CategoryForm.value)
  }

  Getcategorey(){
    this.SpinnerService.show();
    this.productservice.GetCategorey().subscribe((next:any) => {
      this.CategoriesList=[];
      this.CategoriesList=next.resp;
      
      console.log(this.CategoriesList)
    }, error => {
      console.log(error);
    });
    this.SpinnerService.hide();
  }
  Sort(key){
    this.key=key;
    this.reverse=!this.reverse;
  }
  openLg(content,id:number) {
    
    this.categotyid=id;
 
    this.modalService.open(content, { size: 'lg' });
  }

 UpdateView(content,id:number) {
  var data=this.CategoriesList.find(res=>res.category_Id==id);
  debugger;
  this.Singlecategory=data;
  this.CategoryForm.setValue({
    category_Id:this.Singlecategory.category_Id,
    category_Name_Urdu:this.Singlecategory.category_Name_Urdu,
    category_Name:this.Singlecategory.category_Name,
    category_Image:this.Singlecategory.category_Image,
    status:this.Singlecategory.status
  });

 
    this.modalService.open(content, { size: 'lg' });
  }
  uploadFile(event) {

    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      avatar: file
    });
    this.form.get('avatar').updateValueAndValidity();
   
  }
  
  SubmitImage() {
    debugger;
    if(this.form.value.avatar!=null){
      var apipath="UploadImageCategory";
      
      this.uploadfileservice.uploadbrandimage(
     
        this.form.value.avatar,apipath,
        this.categotyid
      ).subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');

            this.form.reset();
    this.modalService.dismissAll();
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event.total * 100);
            console.log(`Uploaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:

            console.log('User successfully created!', event.body);
            setTimeout(() => {
              this.progress = 0;
            }, 1500);
    
        }
        this.Getcategorey();
      })
    }
  }
}
