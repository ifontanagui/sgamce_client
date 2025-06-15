export function APIToView(date: string): string {
  const [year, month, day] = date.split("T")[0].split("-")

  return `${day}/${month}/${year}`;
}

export function ViewToAPI(date: string): string {
  const [day, month, year] = date.split("/")

  return `${year}-${month}-${day}`;
}