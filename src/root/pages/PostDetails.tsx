import Loader from '@/components/shared/Loader'
import PostStats from '@/components/shared/PostStats'
import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/context/AuthContext'
import { useDeletePost, useDeleteSavedPost, useGetCurrentUser, useGetPostById } from '@/lib/react-query/queries'
import { multiFormatDateString } from '@/lib/utils'
import { Link, useNavigate, useParams } from 'react-router-dom'

function PostDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: post, isPending } = useGetPostById(id || '')
  const { user } = useAuthContext()
  const { mutate: deleteSavedPost, isPending: isDeletingSaved } = useDeleteSavedPost()

  const { data: currentUser } = useGetCurrentUser();
  const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post?.$id === post?.$id);

  const { mutate: deletePost } = useDeletePost()

  const handleDeletePost = () => {
    deletePost({ postId: id, imageId: post?.imageId });
    navigate(-1);
    deleteSavedPost(savedPostRecord.$id)
  }


  return (
    <div className='post_details-container'>
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost">
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isPending || !post ? <Loader /> : (
        <div className="post_details-card ">
          <img
            src={post?.imageUrl} alt="Images cannot be shown because I am using free plan of appwrite and I can't afford paid version now." className='post_details-img' />

          <div className="post_details-info">
            <div className='flex-between w-full'>
              <Link to={`/profile/${post?.creator.$id}`} className='flex items-center gap-3' >
                <img src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'}
                  alt="creator"
                  className="rounded-full w-10 h-10 lg:h-12 lg:w-12" />

                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>
                    -
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className='flex-center'>
                <Link to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && 'hidden'}`} >
                  <img src='/assets/icons/edit.svg' width={24} height={24} alt='edit' />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ghost_details-delete_btn cursor-pointer ${user.id !== post?.creator.$id && "hidden"}`} >
                  <img src='/assets/icons/delete.svg' alt='delete' width={24} height={24} />
                </Button>
              </div>
            </div>

            <hr className='border border-dark-4/80 w-full' />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string, index: number) => (
                  <li key={`${tag}${index}`} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className='w-full'>
              <PostStats post={post || ""} userId={user.id} />
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetails
