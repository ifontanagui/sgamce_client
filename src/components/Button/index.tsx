import React from "react";
import { Button as MUIButton } from "@mui/material";

interface ButtonProps {
  className?: string
  disabled?: boolean
  isLoading?: boolean
  textContent: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

export default function Button(props: ButtonProps) {
  return (
    <MUIButton
      className={props.className}
      disabled={props.disabled}
      loading={props.isLoading}
      onClick={props.onClick}
      variant="contained"
      type="submit"
    >
      {props.textContent}
    </MUIButton>
  )
}