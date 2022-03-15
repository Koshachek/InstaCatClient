import {Component, OnInit} from '@angular/core';
import {Post} from "../../models/Post";
import {ImageService} from "../../services/image.service";
import {PostService} from "../../services/post.service";
import {CommentService} from "../../services/comment.service";
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css']
})
export class UserPostsComponent implements OnInit {

  posts: Post[];
  isPostsLoaded: boolean;

  constructor(private imageService: ImageService,
              private postService: PostService,
              private commentService: CommentService,
              private notificationService: NotificationService) {
  }

  getImagesForPost(posts: Post[]): void {
    posts.forEach(post => {
      this.imageService.getImagesForPost(post.id)
        .subscribe(data => {
          post.image = data.imageBytes;
        });
    });
  }

  getCommentsForPost(posts: Post[]): void {
    posts.forEach(post => {
      this.commentService.getCommentsForPost(post.id)
        .subscribe(data => {
          post.comments = data;
        });
    });
  }

  deletePost(post: Post, index: number): void {
    console.log(post);
    const result = confirm('Do you want remove this post?');
    if (result) {
      this.postService.deletePost(post.id)
        .subscribe(() => {
          this.posts.slice(index, 1);
          this.notificationService.showSnackBar('Post has been deleted');
        });
    }
  }

  deleteComment(commentId: number, postIndex: number, commentIndex: number): void {
    const post = this.posts[postIndex];

    this.commentService.deleteComment(commentId)
      .subscribe(() => {
        this.notificationService.showSnackBar('Comment has been deleted');
        post.comments.splice(commentIndex, 1);
      });
  }

  ngOnInit(): void {
    this.postService.getPostsForCurrentUser()
      .subscribe(data => {
        console.log(data);
        this.posts = data;
        this.getImagesForPost(this.posts);
        this.getCommentsForPost(this.posts);
        this.isPostsLoaded = true;
      });
  }

  formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }

}
