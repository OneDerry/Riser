import { Control, useWatch } from "react-hook-form";
import { Calendar } from "../../../shared/common";
import { format } from "date-fns";
import { getStates, getLGAsByState } from "../../../data/nigeria-states-lgas";
import { FormInput, FormSelect, FormCheckbox } from "./FormFields";
import {
  GENDER_OPTIONS,
  GRADE_LEVEL_OPTIONS,
  STUDENT_TYPE_OPTIONS,
} from "../constants/formOptions";
import { FormValues } from "../validations";

interface StudentFormSectionProps {
  control: Control<FormValues>;
  index: number;
  onRemove: (index: number) => void;
  canRemove: boolean;
  showCalendar: string | null;
  setShowCalendar: (calendar: string | null) => void;
}

export default function StudentFormSection({
  control,
  index,
  onRemove,
  canRemove,
  showCalendar,
  setShowCalendar,
}: StudentFormSectionProps) {
  const studentType = useWatch({
    control,
    name: `students.${index}.studentType`,
  });
  const studentState = useWatch({
    control,
    name: `students.${index}.studentState`,
  });
  const sameAsParent = useWatch({
    control,
    name: `students.${index}.sameAsParent`,
  });

  const studentLgas = studentState ? getLGAsByState(studentState) : [];
  const states = getStates();

  const handleRemove = () => {
    if (canRemove) {
      onRemove(index);
    }
  };

  return (
    <div className="mb-8 rounded-lg border p-4 overflow-x-hidden">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="font-medium">Student {index + 1}</h4>
        {canRemove && (
          <button
            type="button"
            className="text-red-500 hover:bg-red-50 px-3 py-1 rounded text-sm"
            onClick={handleRemove}
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-4 sm:grid-cols-2 md:grid-cols-3">
        <FormInput
          control={control}
          name={`students.${index}.firstName`}
          label="First Name"
          placeholder="Enter first name"
          required
        />

        <FormInput
          control={control}
          name={`students.${index}.lastName`}
          label="Last Name"
          placeholder="Enter last name"
          required
        />

        <FormInput
          control={control}
          name={`students.${index}.middleName`}
          label="Middle Name (Optional)"
          placeholder="Enter middle name"
        />

        <div>
          <label className="text-sm font-medium">Date of Birth</label>
          <div className="relative">
            <input
              readOnly
              value={
                showCalendar === `${index}-dob` ? "" : format(new Date(), "PP")
              }
              onClick={() => setShowCalendar(`${index}-dob`)}
              placeholder="Select date"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer mt-1"
            />
            {showCalendar === `${index}-dob` && (
              <div className="absolute left-0 right-0 z-10 mt-1 sm:w-auto">
                <Calendar
                  mode="single"
                  selected={new Date()}
                  onSelect={() => setShowCalendar(null)}
                  className="rounded-md border p-4 w-full bg-white shadow-sm"
                  captionLayout="dropdown"
                />
              </div>
            )}
          </div>
        </div>

        <FormSelect
          control={control}
          name={`students.${index}.studentState`}
          label="State of Origin"
          options={states.map((state) => ({ value: state, label: state }))}
        />

        <FormSelect
          control={control}
          name={`students.${index}.studentLga`}
          label="LGA"
          options={studentLgas.map((lga) => ({ value: lga, label: lga }))}
          disabled={!studentState}
          placeholder={!studentState ? "Select state first" : "Select LGA"}
        />

        <FormSelect
          control={control}
          name={`students.${index}.gender`}
          label="Gender"
          options={GENDER_OPTIONS}
          required
        />

        <FormSelect
          control={control}
          name={`students.${index}.gradeLevel`}
          label="Grade Level"
          options={GRADE_LEVEL_OPTIONS}
          required
        />

        <FormSelect
          control={control}
          name={`students.${index}.studentType`}
          label="Student Type"
          options={STUDENT_TYPE_OPTIONS}
          required
        />

        {studentType !== "returning" && (
          <>
            <FormInput
              control={control}
              name={`students.${index}.previousSchool`}
              label="Previous School Attended"
              placeholder="Enter previous school name"
            />

            <FormInput
              control={control}
              name={`students.${index}.transferReason`}
              label="Reason for Transfer"
              placeholder="Please provide reason for transfer"
            />
          </>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:col-span-2">
          <div className="sm:col-span-2">
            <FormInput
              control={control}
              name={`students.${index}.studentAddress`}
              label="Student Address"
              placeholder="Enter student's home address"
              disabled={sameAsParent}
              className={sameAsParent ? "bg-gray-100" : ""}
            />
          </div>
          <FormCheckbox
            control={control}
            name={`students.${index}.sameAsParent`}
            label="Same as Parent Address"
            className="sm:mt-4"
          />
        </div>

        <FormInput
          control={control}
          name={`students.${index}.allergies`}
          label="Allergies (Optional)"
          placeholder="List any known allergies"
        />

        <FormInput
          control={control}
          name={`students.${index}.medicalConditions`}
          label="Medical Conditions (Optional)"
          placeholder="List any medical conditions"
        />
        <div>
          <FormInput
            control={control}
            name={`students.${index}.emergencyContactName`}
            label="Emergency Contact Name"
            placeholder="Enter name (if different from parent)"
          />
        </div>

        <div>
          <FormInput
            control={control}
            name={`students.${index}.emergencyContactPhone`}
            label="Emergency Contact Phone"
            type="tel"
            placeholder="Enter phone (if different from parent)"
          />
        </div>
      </div>
    </div>
  );
}
