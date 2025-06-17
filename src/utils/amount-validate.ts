export function AmountValidate(value: string): boolean {
  const regex = /^\d+(\.(\d{1,2})?)?$/;
  const val =value.replace(',', '.')

  return regex.test(val);
}