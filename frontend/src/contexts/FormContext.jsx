import { firestore } from "@/lib/firebase";
import { arrayRemove, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const FormContext = createContext();

export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a <FormContextProvider />");
  }
  return context;
}

const tenantSchema = z.object({
  name: z.string().min(1, { message: "This field is required" }),
  email: z.string().min(1, { message: "This field is required" }).email({ message: "Invalid email" }),
  contact_num: z
    .string()
    .min(1, { message: "This field is required" })
    .regex(/^(09|\+639)\d{9}$/, { message: "Invalid Philippine contact number" }),
  alt_contact_num: z.string().regex(/^(09|\+639)\d{9}$|^$/, { message: "Invalid Philippine contact number" }),
  emergency_num: z
    .string()
    .min(1, { message: "This field is required" })
    .regex(/^(09|\+639)\d{9}$/, { message: "Invalid Philippine contact number" }),
  alt_emergency_num: z.string().regex(/^(09|\+639)\d{9}$|^$/, { message: "Invalid Philippine contact number" }),
});

const defaultValues = {
  name: "",
  email: "",
  contact_num: "",
  alt_contact_num: "",
  emergency_num: "",
  alt_emergency_num: "",
};

export default function FormContextProvider({ children }) {
  const [inputs, setInputs] = useState([{ id: uuidv4(), ...defaultValues }]);
  const [errors, setErrors] = useState([{ ...defaultValues }]);
  const [isEditing, setIsEditing] = useState(false);

  function initializeTenants(tenants) {
    if (tenants === undefined) {
      setIsEditing(false);
      return;
    }

    setIsEditing(true);
    setInputs(
      tenants.map((tenant) => ({
        id: tenant.id,
        name: tenant.name,
        email: tenant.email,
        contact_num: tenant.contact_num,
        alt_contact_num: tenant.alt_contact_num,
        emergency_num: tenant.emergency_num,
        alt_emergency_num: tenant.alt_emergency_num,
      }))
    );
    setErrors(tenants.map(() => ({ ...defaultValues })));
  }

  function handleChange(event, id) {
    const { name, value } = event.target;
    const newInputs = inputs.map((input) => {
      if (input.id === id) {
        return { ...input, [name]: value };
      }
      return input;
    });
    setInputs(newInputs);
  }

  function handleAdd() {
    if (inputs.length === 4) return;
    setInputs([...inputs, { id: uuidv4(), ...defaultValues }]);
  }

  async function handleDelete(index) {
    if (isEditing) {
      const tenantUid = inputs[index].id;
      const tenantRef = doc(firestore, "users", tenantUid);
      console.log("Deleting tenant with uid: ", tenantUid);

      // delete user aithentication
      const response = await fetch(`http://localhost:3001/deleteUser/${tenantUid}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      const data = await response.json();
      console.log(data.message);

      // delete the tenant from the room
      const q = query(collection(firestore, "rooms"), where("tenants", "array-contains", tenantRef));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        try {
          await updateDoc(doc.ref, {
            tenants: arrayRemove(tenantRef),
          });
          console.log("Tenant successfully removed from room: ", doc.id);
        } catch (error) {
          console.error("Error removing tenant from room: ", error);
        }
      });

      // delete the user document
      try {
        await deleteDoc(doc(firestore, "users", tenantUid));
        console.log("Tenant successfully deleted!");
      } catch (error) {
        console.error("Error removing document: ", error);
      }

      setIsEditing(false);
    }

    if (inputs.length === 1) return;
    const newInputs = inputs.filter((_, idx) => idx !== index);
    setInputs(newInputs);
  }

  function handleSubmit(callback) {
    return (e) => {
      e.preventDefault();
      if (validateInput()) {
        setInputs(inputs.map(() => ({ ...defaultValues })));
        setErrors(errors.map(() => ({ ...defaultValues })));
        callback(inputs);
      }
    };
  }

  function validateInput() {
    let valid = true;
    const newErrors = errors.slice();
    inputs.forEach((input, index) => {
      const result = tenantSchema.safeParse(input);
      if (!result.success) {
        valid = false;
        const formatted = result.error.format();
        newErrors[index] = {
          name: formatted.name?._errors[0] ?? "",
          email: formatted.email?._errors[0] ?? "",
          contact_num: formatted.contact_num?._errors[0] ?? "",
          alt_contact_num: formatted.alt_contact_num?._errors[0] ?? "",
          emergency_num: formatted.emergency_num?._errors[0] ?? "",
          alt_emergency_num: formatted.alt_emergency_num?._errors[0] ?? "",
        };
      }
    });
    setErrors(newErrors);
    return valid;
  }

  return (
    <FormContext.Provider
      value={{ inputs, errors, isEditing, initializeTenants, handleSubmit, handleAdd, handleChange, handleDelete }}
    >
      {children}
    </FormContext.Provider>
  );
}
