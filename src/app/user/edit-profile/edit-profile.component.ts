import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NotificationService} from "../../services/notification.service";
import {UserService} from "../../services/user.service";
import {User} from "../../models/User";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  public profileEditForm!: FormGroup;

  constructor(private dialogRef: MatDialogRef<EditProfileComponent>,
              private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              @Inject(MAT_DIALOG_DATA) public userData, /*если будет ругаться на этот параметр ошибкой 'TS7006: Parameter implicitly has an 'any' type.' идем по пути: InstaCatClient\tsconfig.json, ставим параметр strict=false */
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.profileEditForm = this.createProfileForm();
  }

  createProfileForm(): FormGroup {
    return this.formBuilder.group({
      firstname: [
        this.userData.user.firstname,
        Validators.compose([Validators.required])
      ],

      lastname: [
        this.userData.user.lastname,
        Validators.compose([Validators.required])
      ],

      info: [
        this.userData.user.info,
        Validators.compose([Validators.required])
      ]

    });
  }

  public createNewUserData(): User {
    this.userData.user.firstname = this.profileEditForm.value.firstname;
    this.userData.user.lastname = this.profileEditForm.value.lastname;
    this.userData.user.info = this.profileEditForm.value.info;
    return this.userData.user;
  }

  public submitUpdateUserData(): void {
    this.userService.updateUser(this.createNewUserData())
      .subscribe(() => {
        this.notificationService.showSnackBar('User update successfully');
        this.dialogRef.close();
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
