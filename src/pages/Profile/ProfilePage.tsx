import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/store/slices/profile";
import { useDispatch, useSelector } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-toastify";

// Form validation schema
const profileSchema = z.object({
  profile: z.object({
    email: z.string().min(1, "Email is required"),
    phoneNumber: z.string().min(1, "Phone number is required")
  })
});

type ProfileFormValues = z.infer<typeof profileSchema>;



export default function ProfilePage() {

  const { profile } = useSelector(state => state.profile)
  const dispatch = useDispatch()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      profile: {
        email: "",
        phoneNumber: ""
      }
    }
  });

  const onSubmit = async (data: any) => {
    const result = await dispatch(updateProfile({ profile: data }))

    if (result?.status === 200) {
      toast('Course created', { type: "success" })
      return
    }
    toast('Course failed to create', { type: "error" })
  }


  useEffect(() => {
    if (profile) {
      form.reset({ profile })
    }
  }, [profile])

  return (
    <>
      <div className="mx-auto">
        <h2 className="text-2xl font-semibold mb-2">
          Profile settings
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="profile.email"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormMessage />
                  <FormControl>
                    <Input {...field} placeholder="At which email address do you want to receive your Wisdom Drops?" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profile.phoneNumber"
              defaultValue=""
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>

                  <FormMessage />
                  <FormControl>
                    <Input {...field} placeholder="At which whatsapp address do you want to receive your Wisdom Drops?" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
            >SAVE</Button>

          </form>
        </Form>

      </div>
    </>
  );
}
