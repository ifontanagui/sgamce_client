import "./style.css"
import { FormControl, InputLabel, NativeSelect } from "@mui/material";

export interface ComboProps {
  title: string
  value: string | number
  valuesList: {
    description: string,
    value: string | number
  }[]
  onChange: (value: string | number) => void
  required?: boolean
  className?: string
  emptyValue?: boolean
}

export default function Combo(props: ComboProps) {
  return (
    <FormControl className={`combo ${props.className || ""}`}>
      <InputLabel>{props.title}{props.required && ' *'}</InputLabel>
      <NativeSelect
        className="select"
        value={props.value}
        onChange={((event) => props.onChange(event.target.value))}
      >
        {props.emptyValue && <option aria-label="None" value="" />}
        {props.valuesList.map((x, i) => <option key={`combo-option-${i}`} value={x.value}>{x.description}</option>)}
      </NativeSelect>
    </FormControl>
  )
}