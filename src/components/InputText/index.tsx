"use client"

import React from "react";
import "./style.css"
import { Box, Icon, IconButton, TextField } from "@mui/material";
import { AccountCircle, Lock, Visibility, VisibilityOff } from "@mui/icons-material";

interface InputTextProps {
  className?: string
  error?: boolean;
  helperText?: string
  icon?: React.ReactNode; 
  placeholder: string;
  required?: boolean
  type: "email" | "number" | "password" | "text"
  value: string | number;
  multiline?: boolean
  defaultRows?: number
  hiddenDefaultIcon?: boolean
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

export default function InputText(props: InputTextProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  
  return (
    <Box className={`input-text flex ${props.className}`} sx={{ display: 'flex', alignItems: props.error ? 'center' : 'flex-end' }}>
      {
        (props.icon && <div className={`input-text-custom-icon ${props.error ? " icon-error" : " icon-default"}`}>{props.icon}</div>) ||
        (!props.icon && !props.hiddenDefaultIcon && props.type === "email" && <AccountCircle className={props.error ? "icon-error" : "icon-default"} sx={{ mr: 1, my: 0.5 }} />) ||
        (!props.icon && !props.hiddenDefaultIcon && props.type === "password" && <Lock className={props.error ? "icon-error" : "icon-default"} sx={{ mr: 1, my: 0.5 }} />) ||
        (!props.icon && props.hiddenDefaultIcon && props.type !== "email" && props.type !== "password" && <Icon />)
      }
      <TextField 
        className="input-text-input"
        type={props.type !== "password" || !showPassword ? props.type : "text"}
        label={props.placeholder} 
        required={props.required}
        error={props.error}
        helperText={props.error && props.helperText}
        value={props.value}
        onChange={props.onChange}
        variant="standard" 
        multiline={props.multiline}
        rows={props.multiline && props.defaultRows ? props.defaultRows : 1}
        slotProps={{
          input: {
            endAdornment: (
              (props.type !== "password" && 
                <IconButton disabled>
                  <Icon />
                </IconButton>) ||
              (props.type === "password" && 
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )
            ),
          },
        }}
      />
    </Box>
  )
}