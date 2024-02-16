import { FormControl, useFormField } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { forwardRef } from "react";

const FormTextArea = forwardRef((props, ref) => {
  const { error } = useFormField();

  return (
    <FormControl>
      <Textarea ref={ref} className={error && "border-2 border-destructive"} {...props} />
    </FormControl>
  );
});
export { FormTextArea };
