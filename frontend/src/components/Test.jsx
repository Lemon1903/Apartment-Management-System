import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { FormInput } from "./FormInput";
import { Form, FormField, FormItem, FormMessage } from "./ui/form";

export default function Test() {
  const [fields, setFields] = useState(["test1"]);
  const [schema, setSchema] = useState(
    z.object({
      test1: z.string().min(1, {
        message: "This field is required",
      }),
      // test3: z.string().min(1, {
      //   message: "This field is required",
      // }),
    })
  );
  const form = useForm({
    resolver: zodResolver(schema),
  });
  const [counter, setCounter] = useState(1);

  function onSubmit(data) {
    console.log(data);
  }

  function onClick() {
    if (fields.length === 5) return;
    setFields([...fields, `test${counter + 1}`]);
    setSchema(schema.extend({ [`test${counter + 1}`]: z.string().min(1, { message: "This field is required" }) }));
    setCounter(counter + 1);
  }

  function onDelete(index) {
    if (fields.length === 1) return;
    if (index) {
      console.log(fields.filter((_, idx) => idx !== index));
      setFields(fields.filter((_, idx) => idx !== index));
      setSchema(
        z.object(
          Object.keys(schema.shape)
            .filter((key) => key !== `test${index}`)
            .reduce((acc, key) => {
              acc[key] = schema.shape[key];
              return acc;
            }, {})
        )
      );
    }
    // setFields(fields.slice(0, -1));
    // setSchema(schema.omit([`test${fields.length}`]));
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <FormField
              key={uuidv4()}
              control={form.control}
              name={field}
              defaultValue={`id-${counter}`}
              render={({ field }) => (
                <FormItem>
                  <FormInput className="h-20 w-52 bg-input" placeholder="Optional second number..." {...field} />
                  <FormMessage />
                  <button type="button" onClick={() => onDelete(index)}>
                    del
                  </button>
                </FormItem>
              )}
            />
          ))}
          <button>submit</button>
        </form>
        <button onClick={onClick}>add</button>
        <button className="ml-4" onClick={() => onDelete(2)}>
          delete
        </button>
      </Form>
    </div>
  );
}
