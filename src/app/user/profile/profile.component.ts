import {Component, OnInit} from '@angular/core';
import {User} from "../../models/User";
import {TokenStorageService} from "../../services/token-storage.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {UserService} from "../../services/user.service";
import {PostService} from "../../services/post.service";
import {NotificationService} from "../../services/notification.service";
import {ImageService} from "../../services/image.service";
import {EditProfileComponent} from "../edit-profile/edit-profile.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user!: User;
  selectedFile!: File;
  userProfileImage!: File;
  previewImageUrl!: any;
  isUserDataLoaded = false;

  constructor(private tokenServie: TokenStorageService,
              private dialog: MatDialog,
              private userService: UserService,
              private postService: PostService,
              private notificationService: NotificationService,
              private imageService: ImageService) {
  }

  ngOnInit(): void {
    //получаем данные нашего пользователя
    this.userService.getCurrentUser()
      .subscribe(userData => {
        this.user = userData;
        this.isUserDataLoaded = true;
      });

    this.imageService.getUserProfileImg()
      .subscribe(userImg => {
        this.userProfileImage = userImg.imageBytes;
      });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.previewImageUrl = reader.result;
    };
  }

  openEditDialog(): void {
    //создадим конфигурацию нашего диалога
    const dialogEditUserProfileConfig = new MatDialogConfig();
    dialogEditUserProfileConfig.width = '500px';
    //и передаем данные нашего пользователя
    dialogEditUserProfileConfig.data = {
      user: this.user
    }
    this.dialog.open(EditProfileComponent, dialogEditUserProfileConfig);
  }

  formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }

  onUpload(): void {
    if (this.selectedFile != null) {
      this.imageService.uploadImgToProfile(this.selectedFile)
        .subscribe(() => {
          this.notificationService.showSnackBar('Image updated successfully');
        });
    }
  }
}
