import React, { FormEvent, useEffect, useRef, useState } from "react";
import { XIcon } from "lucide-react";
import { toast } from "react-toastify";

export interface AdminFormProps<T> {
  initialData?: T;
  title: string;
  fields: {
    label: string;
    key: keyof T;
    type?: "text" | "number" | "select" | "password";
    options?: { label: string; value: string | number }[];
    required?: boolean;
  }[];
  onClose?: () => void;
  onSubmit?: (data: T) => void;
  submitLabel: string;
}

export default function AdminForm<T>({
  initialData,
  title,
  fields,
  onClose,
  onSubmit,
  submitLabel,
}: AdminFormProps<T>) {
  const [formData, setFormData] = useState<T>(initialData || ({} as T));
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [formData]);

  const handleChange = (key: keyof T, value: string) => {
    const field = fields.find((f) => f.key === key);
    if (!field) return;

    let parsedValue: string | number | null = null;
    switch (field.type) {
      case "number":
        parsedValue = Number.isNaN(parseInt(value, 10)) ? null : parseInt(value, 10);
        break;
      case "text":
      case "password":
        parsedValue = value === "" ? null : value;
        break;
      case "select": {
        const option = field.options?.find((item) => String(item.value) === value);
        parsedValue = option ? option.value : null;
        break;
      }
      default:
        parsedValue = value === "" ? null : value;
    }

    setFormData((prev) => ({ ...prev, [key]: parsedValue }));
  };

  const validateFields = () => {
    const requiredFields = fields.filter((field) => field.required);
    const missingFields = requiredFields.filter(
      (field) => formData[field.key] === "" || formData[field.key] === undefined
    );

    if (missingFields.length > 0) {
      toast.error(`Vui lòng nhập ${missingFields.map((field) => field.label).join(", ")}`, {
        toastId: "missing-fields",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;

    if (onSubmit) {
      const filteredData = fields.reduce((acc, field) => {
        acc[field.key] = formData[field.key];
        return acc;
      }, {} as T);
      onSubmit(filteredData);
    }
  };

  const textInput = (field: AdminFormProps<T>["fields"][0]) => (
    <>
      <label className="py-1 text-gray-700 dark:text-gray-200">{field.label}</label>
      <input
        type={field.type || "text"}
        value={(formData[field.key] as unknown as string) || ""}
        onChange={(e) => handleChange(field.key, e.target.value)}
        className="w-full rounded-md bg-zinc-50 px-4 py-2 outline outline-black/20 focus:outline-none focus:ring-2 focus:ring-violet-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
        placeholder={`Nhập ${field.label}`}
      />
    </>
  );

  const selectInput = (field: AdminFormProps<T>["fields"][0]) => (
    <>
      <label className="py-1 text-gray-700 dark:text-gray-200">{field.label}</label>
      <select
        value={(formData[field.key] as unknown as string) || ""}
        onChange={(e) => handleChange(field.key, e.target.value)}
        className="w-full rounded-md bg-zinc-50 px-4 py-2 outline outline-black/20 focus:outline-none focus:ring-2 focus:ring-violet-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
      >
        <option value="">Chưa chọn</option>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
      <div
        ref={formRef}
        className="relative flex w-full max-w-xs flex-col rounded-lg bg-white/90 transition-all duration-300 dark:bg-gray-700 sm:max-w-[20rem] md:max-w-[22rem] lg:max-w-[24rem]"
      >
        <div className="form-header rounded-t-lg bg-violet-400 p-4 dark:bg-gray-900">
          <h3 className="text-center text-xl font-bold text-white dark:text-gray-200">{title}</h3>

          <button
            type="button"
            onClick={onClose}
            className="absolute right-2 top-2 cursor-pointer rounded-lg bg-violet-300 p-1 text-gray-100 outline outline-black/20 hover:bg-zinc-100 hover:text-gray-600 dark:bg-gray-700 dark:text-gray-200"
          >
            <XIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 rounded-b-lg bg-white/90 p-2 dark:bg-gray-700">
          {fields.map((field) => (
            <div
              key={String(field.key)}
              className="flex flex-col rounded-md bg-zinc-50 p-2 shadow-lg outline outline-black/15 hover:bg-zinc-100 dark:bg-gray-800 hover:dark:bg-gray-500"
            >
              {field.type === "select" ? selectInput(field) : textInput(field)}
            </div>
          ))}

          <div className="flex justify-end space-x-2">
            <button
              type="reset"
              onClick={() => setFormData(initialData || ({} as T))}
              className="w-full rounded-xl bg-zinc-100 px-4 py-2 font-bold text-gray-600 shadow-lg outline outline-black/20 hover:bg-violet-300 hover:text-gray-900 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              Xóa hết
            </button>

            <button
              type="submit"
              className="w-full rounded-xl bg-zinc-100 px-4 py-2 font-bold text-gray-600 shadow-lg outline outline-black/20 hover:bg-violet-300 hover:text-gray-900 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
