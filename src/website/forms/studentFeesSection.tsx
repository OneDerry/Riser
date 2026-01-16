import { type Dispatch, type SetStateAction } from "react";
import { Control, useFieldArray } from "react-hook-form";
import { Button, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "../../shared/common";
import { formatCurrency, parseCurrency } from "../../lib/helpers";
import { FormValues } from "./validations";

export default function StudentFeesSection({
  studentIndex,
  control,
  feeTypes,
  formattedAmounts,
  setFormattedAmounts,
}: {
  studentIndex: number;
  control: Control<FormValues>;
  feeTypes: Array<{ name: string }>;
  formattedAmounts: Record<string, string>;
  setFormattedAmounts: Dispatch<SetStateAction<Record<string, string>>>;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `students.${studentIndex}.fees`,
  });

  const addFee = () => {
    append({ type: "", amount: 0 });
  };

  const removeFee = (feeIndex: number) => {
    if (fields.length > 1) {
      remove(feeIndex);
    }
  };

  return (
    <div className="mt-4">
      {fields.map((feeField, feeIndex) => {
        const formattedKey = `${studentIndex}-${feeField.id}`;
        return (
          <div
            key={feeField.id}
            className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
          >
            <div className="">
              <FormField
                control={control}
                name={`students.${studentIndex}.fees.${feeIndex}.type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required={feeIndex === 0}>Fee Type</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        <option value="">Select fee type</option>
                        {feeTypes.map((fee) => (
                          <option key={fee.name} value={fee.name}>
                            {fee.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="">
              <FormField
                control={control}
                name={`students.${studentIndex}.fees.${feeIndex}.amount`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required={feeIndex === 0}>Amount (₦)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="h-10"
                        placeholder="Enter amount (e.g., N1,000)"
                        value={formattedAmounts[formattedKey] || ""}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          setFormattedAmounts((prev) => ({
                            ...prev,
                            [formattedKey]: inputValue,
                          }));
                          const numericValue = parseCurrency(inputValue);
                          field.onChange(numericValue);
                        }}
                        onBlur={() => {
                          const numericValue = parseCurrency(
                            formattedAmounts[formattedKey] || "0"
                          );
                          if (numericValue > 0) {
                            const formatted = formatCurrency(numericValue);
                            setFormattedAmounts((prev) => ({
                              ...prev,
                              [formattedKey]: formatted,
                            }));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-end ">
              {feeIndex === 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFee}
                  className="w-full h-10 bg-blue-800 text-white mt-4 sm:mt-0"
                >
                  Add Fee
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500"
                  onClick={() => removeFee(feeIndex)}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}