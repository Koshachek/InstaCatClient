import  {Comment} from "./Comment";

export interface Post {
  id: number;
  title: string;
  caption: string;
  image?: File;
  likes?: number;
  location: string;
  likedUsers?: string[];
  comments?: Comment[];
  username?: string;
}
