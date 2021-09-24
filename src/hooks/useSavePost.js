import axios from 'axios'
import { useMutation, useQueryClient } from 'react-query'

export default function useSavePost() {
  const queryClient = useQueryClient()

  return useMutation(
    (newPost) =>
      axios.patch(`/api/posts/${newPost.id}`, newPost).then((res) => res.data),
    {
      onMutate: (newPost) => {
        // update the data
        queryClient.setQueryData(['posts', newPost.id], newPost)
      },
      onSuccess: (newPost) => {
        queryClient.setQueryData(['posts', newPost.id], newPost)

        if (queryClient.getQueryData('posts')) {
          queryClient.setQueryData('posts', (old) => {
            return old.map((d) => {
              if (d.id === newPost.id) {
                return newPost
              }
              return d
            })
          })
        } else {
          queryClient.setQueryData('posts', [newPost])
          queryClient.invalidateQueries('posts')
        }
      },
    }
  )
}
