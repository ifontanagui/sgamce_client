import "./style.css"
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PickerValue } from '@mui/x-date-pickers/internals';
import dayjs from 'dayjs';

interface InputDateProps {
  id?: string
  label: string
  value: string;
  onChange(value: string): void
  defaultValue?: PickerValue
  disabled?: boolean
  className?: string
  helperText?: string
  error?: boolean
}

export default function InputDate(props: InputDateProps) {
  React.useEffect(() => {
    const div = document.getElementById(props.id || '_');
    if (div)
      div.setAttribute('error-text', props.error && props.helperText ? props.helperText : '');
  }, [props.error, props.helperText, props.id]);
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer sx={{ width: "100%", marginTop: '10px' }} components={['DatePicker']}>
        <div id={props.id} className={`input-date ${props.className}`}>
          <div id={props.id} className={`input-date-container${props.error ? '-error' : ''} ${props.className}`}>
            <DatePicker 
              className="input-date-input"
              label={props.label}
              format='DD/MM/YYYY'
              value={dayjs(props.value, "DD/MM/YYYY")}
              onChange={(event) => {
                if (!event) 
                  props.onChange('');
                else
                  props.onChange(event.format("DD/MM/YYYY"));
              }}
              defaultValue={props.defaultValue}
              disabled={props.disabled}
            />
          </div>
        </div>
      </DemoContainer>
    </LocalizationProvider>
  );
}