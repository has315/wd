import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/store/slices/profile";
import { useDispatch, useSelector } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-toastify";
import { PhoneNumberUtil } from "google-libphonenumber";
import { PhoneInputField } from "@/components/ui/phoneInput";

const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone: string) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

const profileSchema = z.object({
  profile: z.object({
    email: z.string().min(1, "Email is required"),
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .refine(isPhoneValid, { message: "Invalid phone number" }),
  }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { profile } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      profile: {
        email: "",
        phoneNumber: "",
      },
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    const result = await dispatch(updateProfile(data));

    if (result?.status === 200) {
      toast("Profile updated", { type: "success" });
      return;
    }
    toast("Profile failed to update", { type: "error" });
  };

  useEffect(() => {
    if (profile) {
      form.reset({ profile });
    }
  }, [profile]);

  return (
    <div className="mx-auto">
      <h2 className="text-2xl font-semibold mb-2">Profile settings</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="profile.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="At which email address do you want to receive your Wisdom Drops?"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profile.phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <PhoneInputField
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            SAVE
          </Button>
        </form>
      </Form>
    </div>
  );
}
