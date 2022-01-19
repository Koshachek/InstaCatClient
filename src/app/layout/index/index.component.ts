import {Component, OnInit} from '@angular/core';
import {User} from "../../models/User";
import {Post} from "../../models/Post";
import {UserService} from "../../services/user.service";
import {PostService} from "../../services/post.service";
import {CommentService} from "../../services/comment.service";
import {NotificationService} from "../../services/notification.service";
import {ImageService} from "../../services/image.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  user!: User;
  posts!: Post[];
  isPostsLoaded = false;
  isUserDataLoaded = false;

  constructor(
    private userService: UserService,
    private postService: PostService,
    private commentService: CommentService,
    private imageService: ImageService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.postService.getAllPosts()
      .subscribe(postData => {
        console.log(postData);
        this.posts = postData;
        this.getImagesForPosts(this.posts);
        this.getCommentForPosts(this.posts);
        this.isPostsLoaded = true;
      });

    this.userService.getCurrentUser()
      .subscribe(userData => {
        console.log(userData);
        this.user = userData;
        this.isUserDataLoaded = true;
      });
  }

  getImagesForPosts(posts: Post[]): void {
    posts.forEach(post => {
      this.imageService.getPostImg(post.id!)
        .subscribe(imageData => {
          post.image = imageData.imageBytes;
        })
    });
  }


  getCommentForPosts(posts: Post[]): void {
    posts.forEach(post => {
      this.commentService.getCommentForPost(post.id!)
        .subscribe(commentData => {
          post.comments = commentData;
        })
    });
  }

  formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }

}
