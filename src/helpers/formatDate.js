export default function formatDate(dateInput, format = "dd/MM/yyyy") {
  if (!dateInput) return "";

  let date;

  if (typeof dateInput === "number") {
    if (dateInput > 9999999999) {
      date = new Date(dateInput);
    } else {
      date = new Date(dateInput * 1000); 
    }
  } else if (typeof dateInput === "string") {
    if (isNaN(Date.parse(dateInput))) {
      throw new Error(`Invalid date string: ${dateInput}`);
    }
    date = new Date(dateInput);
  } else {
    throw new Error(`Unsupported date format: ${dateInput}`);
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  if (format === "yyyy-MM-dd") {
    return `${year}-${month}-${day}`;
  }

  return `${day}/${month}/${year}`;
}
