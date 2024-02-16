import { FormInput } from "@/components/FormInput";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormTextArea } from "./FormTextArea";

const announcementSchema = z.object({
  subject: z.string().min(1, {
    message: "Subject is required",
  }),
  body: z
    .string()
    .min(1, {
      message: "Body is required",
    })
    .max(765, {
      message: "Body should not exceed 765 characters",
    }),
});

export default function SimpleForm({ onSubmit }) {
  const form = useForm({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      subject: "",
      body: "",
    },
  });

  return (
    <Form {...form}>
      <form id="simple-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Subject */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl font-medium">Subject</FormLabel>
              <FormInput placeholder="Enter the subject or title..." {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Body */}
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl font-medium">Body</FormLabel>
              <FormTextArea placeholder="What's on your mind..." {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
