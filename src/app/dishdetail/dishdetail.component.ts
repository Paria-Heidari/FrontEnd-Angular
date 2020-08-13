import { Component, OnInit, ViewChild,Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { visibility } from '../animations/app.animations';
import {flyInOut, expand } from '../animations/app.animations';


import { DishService } from '../services/dish.service';

import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
  animations: [
    visibility(),
    expand(),
    flyInOut()
  ]
})
export class DishdetailComponent implements OnInit {

    
    dish: Dish;
    dishIds: string[];
    prev: string;
    next: string;
    message: Comment;
    commentForm: FormGroup;
    errMess: string;
    dishcopy: Dish;
    @ViewChild('fform') commentFormDirective;
    visibility = 'shown';


    msgErrors = {
        'author': '',
        'comment': ''
      };
    
    validationMsg={
        'author':{
            'required': "Author name is required.",
            'minlength':"Author name must be at least 2 characters long.",
        },
        'comment':{
            'required': "Comment is required.",  
    
        }        
    }
    constructor(
        private dishService: DishService,
        private route: ActivatedRoute,
        private location: Location,
        private formbuilder: FormBuilder,
        @Inject('BaseURL') private BaseURL) {
            this.createCommentForm();
         }

    ngOnInit() {
        this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
        this.route.params
            .pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(+params['id']); }))
            .subscribe(dish => { this.dish = dish; this.dishcopy= dish; this.setPrevNext(dish.id); this.visibility = 'shown';},
                errmess => this.errMess = <any>errmess);
    }
    setPrevNext(dishId: string) {
        const index = this.dishIds.indexOf(dishId);
        this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
        this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
      }
    
    goBack(): void {
        this.location.back();
    }
    
    createCommentForm(){
        this.commentForm = this.formbuilder.group({
            author:['', [Validators.required, Validators.minLength(2)]],
            rating: 5,
            comment: ['', Validators.required],
            date: ''
        });
        this.commentForm.valueChanges
            .subscribe(data => this.onValueChanged(data));

        this.onValueChanged(); //set validation messages now
    }

    onValueChanged(data?:any){
        if (!this.commentForm) { return; }
        const form = this.commentForm;
        for (const field in this.msgErrors) {
        if (this.msgErrors.hasOwnProperty(field)) {
            // clear previous error message (if any)
            this.msgErrors[field] = '';
            const control = form.get(field);
            if (control && control.touched && control.dirty && !control.valid ) {
            const messages = this.validationMsg[field];
            for (const key in control.errors) {
                if (control.errors.hasOwnProperty(key)) {
                    this.msgErrors[field] += messages[key] + ' ';
                }
                }
            }
            }
        }
        }
        
    onSubmit(){
        this.message = this.commentForm.value;
        this.message.date = new Date().toISOString();
        console.log(this.message);
        this.dishcopy.comments.push(this.message);
        this.dishService.putDish(this.dishcopy)
        .subscribe(dish => {
            this.dish = dish; this.dishcopy = dish;
        },
        errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
        
        this.commentForm.reset({
            author: '',
            rating:5,
            message: '',
        });
        this.commentFormDirective.resetForm({
            author: '',
            rating:5,
            message: '',
        });
    }
}
