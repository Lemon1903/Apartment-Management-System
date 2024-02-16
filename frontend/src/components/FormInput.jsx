import { forwardRef } from "react";
import { FormControl, useFormField } from "./ui/form";
import { Input } from "./ui/input";

const FormInput = forwardRef((props, ref) => {
  const { error } = useFormField();

  return (
    <FormControl>
      <Input ref={ref} className={error && "border-2 border-destructive"} {...props} />
    </FormControl>
  );
});
export { FormInput };
