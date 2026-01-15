export const PREFIX_OPTIONS = [
  { value: "Mr", label: "Mr" },
  { value: "Mrs", label: "Mrs" },
  { value: "Miss", label: "Miss" },
  { value: "Ms", label: "Ms" },
];

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export const GRADE_LEVEL_OPTIONS = [
  "Kindergarten",
  "Nursery 1",
  "Nursery 2",
  "Nursery 3",
  "Primary 1",
  "Primary 2",
  "Primary 3",
  "Primary 4",
  "Primary 5",
  "Primary 6",
  "JSS1",
  "JSS2",
  "JSS3",
  "SS1",
  "SS2",
  "SS3",
].map((grade) => ({ value: grade, label: grade }));

export const STUDENT_TYPE_OPTIONS = [
  { value: "returning", label: "Returning Student" },
  { value: "new", label: "New Student" },
  { value: "transfer", label: "Transfer Student" },
];

export const TERM_OPTIONS = [
  { value: "First term", label: "First term" },
  { value: "Second term", label: "Second term" },
  { value: "Third Term", label: "Third Term" },
];

export const FEE_TYPES = [
  { name: "Tuition Fee" },
  { name: "Registration Fee" },
  { name: "Library & Books Fee" },
  { name: "Full Package" },
];

export const generateAcademicYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => {
    const startYear = currentYear + i;
    const year = `${startYear}-${startYear + 1}`;
    return { value: year, label: year };
  });
};
