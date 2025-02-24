import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Form validation schema
const profileSchema = z.object({
  email: z.string().min(1, "Email is required"),
  phoneNumber: z.string().min(1, "Phone number is required")
});

type ProfileFormValues = z.infer<typeof profileSchema>;



export default function ProfilePage() {



  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: "",
      phoneNumber: ""
    }
  });

  const onSubmit = (values: any) => {
    console.log(values)
  }


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
              name="email"
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
              name="phoneNumber"
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
            >SUBMIT</Button>

          </form>
        </Form>

      </div>
    </>
  );
}
