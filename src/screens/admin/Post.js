import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

//

import usePost from '../../hooks/usePost'
import useSavePost from '../../hooks/useSavePost'
import useDeletePost from '../../hooks/useDeletePost'

import PostForm from '../../components/PostForm'
import { Loader } from '../../components/styled'

export default function Post() {
  const { postId } = useParams()
  const navigate = useNavigate()

  const postQuery = usePost(postId)
  const savePost = useSavePost()
  const deletePost = useDeletePost()

  const onSubmit = (values) => {
    savePost.mutate(values)
  }

  const onDelete = async () => {
    await deletePost.mutateAsync(postId)
    navigate('/admin')
  }

  return (
    <>
      {postQuery.isLoading ? (
        <span>
          <Loader /> Loading...
        </span>
      ) : (
        <div>
          <h3>{postQuery.data.title}</h3>
          <p>
            <Link to={`/blog/${postQuery.data.id}`}>View Post</Link>
          </p>
          <PostForm
            initialValues={postQuery.data}
            onSubmit={onSubmit}
            submitText={
              savePost.isLoading
                ? 'Saving...'
                : savePost.isError
                ? 'Error!'
                : savePost.isSuccess
                ? 'Saved!'
                : 'Save Post'
            }
          />

          <p>
            <button onClick={onDelete}>
              {deletePost.isLoading
                ? 'Deleting...'
                : deletePost.isError
                ? 'Error!'
                : deletePost.isSuccess
                ? 'Deleted!'
                : 'Delete Post'}
            </button>
          </p>
        </div>
      )}
    </>
  )
}
