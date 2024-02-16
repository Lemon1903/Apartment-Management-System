import { FormInput } from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { auth } from "@/lib/firebase";
import { isAdmin } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInAnonymously, signInWithEmailAndPassword } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Please enter your email address",
    })
    .email({
      message: "Please enter a valid email address",
    }),
  password: z.string().min(1, {
    message: "Please enter your password",
  }),
});

export default function AuthPage() {
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSubmit(values) {
    const { email, password } = values;
    setIsLoading1(true);

    if (auth.currentUser?.isAnonymous) {
      await auth.currentUser.delete();
    }

    // sign in with email and password
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        // check if user is admin
        await isAdmin(value.user.uid)
          .then((val) => navigate(val ? "/admin" : "/tenant"))
          .catch((error) => console.log(error.message));
      })
      .catch((error) => console.log(error.message));

    setIsLoading1(false);
  }

  function viewAsGuest() {
    setIsLoading2(true);
    signInAnonymously(auth)
      .then(() => {
        navigate("/guest");
        setIsLoading2(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  return (
    <div className="grid w-screen max-w-md self-center rounded-3xl border-b-[12px] border-l-[12px] border-border bg-popover px-8 py-10">
      <h1 className="text-center text-5xl font-black  text-primary-foreground">TenAnts</h1>
      <Form {...form}>
        <form className="mt-8 grid gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-3xl font-medium text-primary-foreground">Email</FormLabel>
                <FormInput placeholder="juanitodelacruz@email.com" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-3xl font-medium text-primary-foreground">Password</FormLabel>
                <FormInput placeholder="•••••••••••" type="password" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Submit button */}
          <Button size="lg" className="mt-2" disabled={isLoading1 || isLoading2} type="submit">
            {isLoading1 ? <Loader2 className="animate-spin" /> : "Login"}
          </Button>
        </form>
      </Form>

      <div className="mt-2">
        <p className="text-center text-2xl text-primary-foreground">Want to inquire for rent?</p>
        <Button size="lg" className="mt-1 w-full" disabled={isLoading1 || isLoading2} onClick={viewAsGuest}>
          {isLoading2 ? <Loader2 className="animate-spin" /> : "Login as a Guest"}
        </Button>
      </div>
    </div>
  );
}
