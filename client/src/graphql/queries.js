import { gql } from '@apollo/client';

const FETCH_POSTS = gql`
  {
  getPosts{
    id
    body
    author
    liked
    liker
    authorId
    createdAt
    comments {
      body
      id
      author
    }
    likes{
      author
    }
    likesCount
    commentsCount
  }
}
`
export { FETCH_POSTS }