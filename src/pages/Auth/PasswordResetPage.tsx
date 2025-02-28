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
import { login, register, resetPassword } from "@/store/slices/auth";
import { dispatch } from "@/store/store";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const passwordResetSchema = z.object({
    password: z.string().min(1, "Password is required"),
    passwordConfirm: z.string().min(1, "Password confirm is required"),
}).refine(
    (values) => {
        return values.password === values.passwordConfirm;
    },
    {
        message: "Passwords must match!",
        path: ["passwordConfirm"],
    }
);

export default function PasswordResetPage() {
    const [activeTab, setActiveTab] = useState("login");
    const navigate = useNavigate()
    const { id, token } = useParams();
    if(!id || ! token) return <></>
    const passwordResetForm = useForm({
        resolver: zodResolver(passwordResetSchema),
        defaultValues: {
            password: "",
            passwordConfirm: "",
        },
    });



    const onSubmit = async ({ password, passwordConfirm }: { password: string, passwordConfirm: string }) => {
        const result = await dispatch(resetPassword({ password: password, id: Number(id), token: token }))



        if (result?.status === 200) {
            toast("Password changed successfully", { type: "success" })
        } else {
            toast("Something went wrong", { type: "error" })
        }

        navigate("/auth/login")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Password reset</CardTitle>
                    <CardDescription>
                        Please enter new password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...passwordResetForm}>
                        <form onSubmit={passwordResetForm.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={passwordResetForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={passwordResetForm.control}
                                name="passwordConfirm"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">
                                Save
                            </Button>

                        </form>
                    </Form>

                </CardContent>
            </Card>
        </div>
    );
}