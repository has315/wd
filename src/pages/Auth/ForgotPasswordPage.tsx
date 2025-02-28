import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { forgotPassword, login, register } from "@/store/slices/auth";
import { dispatch, useDispatch } from "@/store/store";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// Form validation schema
const forgotPasswordSchema = z.object({
    email: z.string().min(1, "Email is required"),

});
export default function ForgotPasswordPage() {
    const [activeTab, setActiveTab] = useState("login");
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const forgotPasswordForm = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });



    const onSubmit = async ({ email }: { email: string }) => {

        const result = await dispatch(forgotPassword({ email: email }))

        if (result?.status === 200) {
            toast("Please check your email for instructions", { type: "success" })
        } else {
            toast("Something went wrong", { type: "error" })
        }

        navigate("/auth/login")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Forgot password</CardTitle>
                    <CardDescription>
                        Please enter email to receive password reset instructions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...forgotPasswordForm}>
                        <form onSubmit={forgotPasswordForm.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={forgotPasswordForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full">
                                Send
                            </Button>

                        </form>
                        <Link
                            to={"/auth/login"}
                        >
                            Return to sign in
                        </Link>
                    </Form>

                </CardContent>
            </Card>
        </div>
    );
}