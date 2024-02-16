import Trashbin from "@/assets/icons/trash-bin.svg?react";
import { useForm } from "@/contexts/FormContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

function FormField({ input, index }) {
  const form = useForm();
  const { id, name, email, contact_num, alt_contact_num, emergency_num, alt_emergency_num } = input;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black">Tenant {index + 1}</h2>
        <Button
          type="button"
          variant="icon"
          size="icon"
          className="h-10 w-10 border-none bg-transparent hover:bg-transparent"
          onClick={() => form.handleDelete(index)}
        >
          <Trashbin className="fill-border hover:fill-accent" />
        </Button>
      </div>
      <div className="space-y-1">
        <Label htmlFor="tenantName" className="text-2xl font-medium">
          Name
        </Label>
        <div>
          <Input
            className={form.errors[index]?.name && "border-2 border-destructive"}
            onChange={(e) => form.handleChange(e, id)}
            name="name"
            id="tenantName"
            type="text"
            placeholder="Juanito Dela Cruz"
            value={name}
          />
          <p className="text-base text-destructive">{form.errors[index]?.name}</p>
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="tenantEmail" className="text-2xl font-medium">
          Email
        </Label>
        <div>
          <Input
            className={form.errors[index]?.email && "border-2 border-destructive"}
            onChange={(e) => form.handleChange(e, id)}
            name="email"
            id="tenantEmail"
            type="text"
            placeholder="juanitodelacruz@gmail.com"
            value={email}
          />
          <p className="text-base text-destructive">{form.errors[index]?.email}</p>
        </div>
      </div>
      <div className="space-y-1">
        <Label className="space-y-2 text-2xl font-medium">
          Contact Number
          <div>
            <Input
              className={form.errors[index]?.contact_num && "border-2 border-destructive"}
              onChange={(e) => form.handleChange(e, id)}
              name="contact_num"
              id="tenantContact"
              type="text"
              placeholder="09#########"
              value={contact_num}
            />
            <p className="text-base text-destructive">{form.errors[index]?.contact_num}</p>
          </div>
          <div>
            <Input
              className={form.errors[index]?.alt_contact_num && "border-2 border-destructive"}
              onChange={(e) => form.handleChange(e, id)}
              name="alt_contact_num"
              id="tenantContact"
              type="text"
              placeholder="09#########"
              value={alt_contact_num}
            />
            <p className="text-base text-destructive">{form.errors[index]?.alt_contact_num}</p>
          </div>
        </Label>
      </div>
      <div className="space-y-1">
        <Label className="space-y-2 text-2xl font-medium">
          Emergency Contact Number
          <div>
            <Input
              className={form.errors[index]?.emergency_num && "border-2 border-destructive"}
              onChange={(e) => form.handleChange(e, id)}
              name="emergency_num"
              id="tenantContact"
              type="text"
              placeholder="09#########"
              value={emergency_num}
            />
            <p className="text-base text-destructive">{form.errors[index]?.emergency_num}</p>
          </div>
          <div>
            <Input
              className={form.errors[index]?.alt_emergency_num && "border-2 border-destructive"}
              onChange={(e) => form.handleChange(e, id)}
              name="alt_emergency_num"
              id="tenantContact"
              type="text"
              placeholder="09#########"
              value={alt_emergency_num}
            />
            <p className="text-base text-destructive">{form.errors[index]?.alt_emergency_num}</p>
          </div>
        </Label>
      </div>
    </div>
  );
}

export default function TenantForm({ tenants, onSubmit }) {
  const form = useForm();

  return (
    <form
      id="tenant-form"
      className="max-h-[410px] space-y-8 overflow-y-scroll px-1 pb-2 pr-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {form.inputs.map((input, index) => (
        <FormField key={index} input={input} index={index} />
      ))}
    </form>
  );
}
