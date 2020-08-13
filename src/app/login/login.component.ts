import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import { FormsModule } from '@angular/forms'; 
import { AstMemoryEfficientTransformer } from '@angular/compiler';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user = {username: '', password: '', remember: false};

  constructor(public dialogRef: MatDialogRef<LoginComponent>) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log('User:', this.user);
    this.dialogRef.close();
  }

}