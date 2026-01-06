export const scrollToHash = (hash: string) => {
  if (!hash) return;

  // Remove the leading # if present
  const id = hash.startsWith("#") ? hash.substring(1) : hash;
  if (!id) return;

  // Find the element
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};
