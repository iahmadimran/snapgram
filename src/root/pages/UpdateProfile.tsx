import { ProfileValidation } from "@/lib/formValidation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuthContext } from "@/context/AuthContext"
import { useNavigate, useParams } from "react-router-dom"
import { useGetUserById, useUpdateUser } from "@/lib/react-query/queries"
import Loader from "@/components/shared/Loader"
import { toast } from "sonner"
import ProfileUploader from "@/components/shared/ProfileUploader"
import { Textarea } from "@/components/ui/textarea"


function UpdateProfile() {
  const { user, setUser } = useAuthContext()
  const { id } = useParams()
  const navigate = useNavigate()

  // 1. Define your form.
  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: user.name,
      username: user.username,
      bio: user.bio || "",
      email: user.email,
    },
  })

  const { data: currentUser } = useGetUserById(id || "")
  // @ts-ignore
  const { mutateAsync: updateUser, isLoading: isLoadingUpdate } = useUpdateUser();

  if (!currentUser) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    )
  }

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ProfileValidation>) {
    const updatedUser = await updateUser({
      // @ts-ignore
      userId: currentUser?.$id,
      name: values.name,
      bio: values.bio,
      file: values.file,
      imageUrl: currentUser?.imageUrl,
      imageId: currentUser?.imageId,
    })

    if (!updatedUser) {
      toast("Update user failed. Please try again.")
    }

    setUser({
      ...user,
      name: updateUser?.name,
      bio: updatedUser?.bio,
      imageUrl: updatedUser?.imageUrl,
    })

    return navigate(`/profile/${id}`)
  }


  return (
    <>
      <div className="flex flex-1">
        <div className="common-container flex-start">
          <div className="flex-start gap-3 justify-start w-full max-w-5xl">
            <img
              src="/assets/icons/edit.svg"
              alt="edit"
              width={36}
              height={36}
              className="invert-white"
            />
            <h2 className="h3-bold md:h2-bold text-left w-full">
              Edit Profile
            </h2>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-7 w-full mt-4 max-w-5xl">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ProfileUploader
                        fieldChange={field.onChange}
                        mediaUrl={currentUser.imageUrl}
                      />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Name</FormLabel>
                    <FormControl>
                      <Input type="text" className="h-12 bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3" {...field} />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="h-12 bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3"
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="h-12 bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3"
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-36 bg-dark-3 rounded-xl border-none focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 custom-scrollbar"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 items-center justify-end">
                <Button
                  type="button"
                  className="shad-button_dark_4"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="shad-button_primary whitespace-nowrap"
                  disabled={isLoadingUpdate}
                >
                  {isLoadingUpdate && <Loader />}
                  Update Profile
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}

export default UpdateProfile
