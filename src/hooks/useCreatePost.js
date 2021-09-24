import axios from 'axios'
import { useMutation, useQueryClient } from 'react-query'

export default function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation(
    (values) => axios.post('/api/posts', values).then((res) => res.data),
    {
      onMutate: (newPost) => {
        const oldPosts = queryClient.getQueryData('posts')

        if (queryClient.getQueryData('posts')) {
          queryClient.setQueryData('posts', (old) => [...old, newPost])
        }

        return () => queryClient.setQueryData('posts', oldPosts)
      },
      onError: (error, _newPost, rollback) => {
        console.error(error)
        if (rollback) rollback()
      },
      onSettled: () => {
        queryClient.invalidateQueries('posts')
      },
    }
  )
}
