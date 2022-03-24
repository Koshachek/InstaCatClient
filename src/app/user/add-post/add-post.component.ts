import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotificationService} from "../../services/notification.service";
import {PostService} from "../../services/post.service";
import {Post} from "../../models/Post";
import {ImageService} from "../../services/image.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  public postEditForm: FormGroup;
  public selectedFile: File;
  public isPostCreated = false;
  public createdPost: Post;
  public previewImageUrl: any;

  constructor(private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private postService: PostService,
              private imageService: ImageService,
              private router: Router) {
  }

  initPostForm(): FormGroup {
    return this.formBuilder.group({
      title: ['', Validators.compose([Validators.required])],
      caption: ['', Validators.compose([Validators.required])],
      location: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit(): void {
    this.postEditForm = this.initPostForm();
  }

  submitPostDate(): void {
    this.postService.createPost({
      title: this.postEditForm.value.title,
      caption: this.postEditForm.value.caption,
      location: this.postEditForm.value.location
    }).subscribe(
      postData => {
        this.createdPost = postData;
        console.log(postData);

        if (this.createdPost.id != null) {
          this.imageService.uploadImgToPost(this.selectedFile, this.createdPost.id)
            .subscribe(() => {
              this.notificationService.showSnackBar('Post was created');
              this.isPostCreated = true;
              this.router.navigate(['/profile']);
            });
        }
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

}
