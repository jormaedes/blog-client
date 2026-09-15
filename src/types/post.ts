export interface PostAuthor {
	username: string;
	firstName: string;
	lastName: string;
}

export interface Post {
	id: number;
	title: string;
	content: string;
	published: boolean;
	timestamp: string;
	authorId: number;
	author: PostAuthor;
	likesCount: number;
	commentsCount: number;
	likedByMe: boolean;
}