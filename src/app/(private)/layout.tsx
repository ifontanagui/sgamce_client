"use client"

import React from "react";
import "./style.css"
import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { ChevronLeft, AccountCircle } from "@mui/icons-material";
import MenuIcon from '@mui/icons-material/Menu';

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = React.useState(false);
  
  return (
    <div className={`private-layout`}>     
      <div className={`private-layout-aside-${open ? "open" : "close"}`}>
        <div className="private-layout-aside-header">
          <IconButton
            className="private-layout-menu-icon"
            onClick={() => setOpen(!open)}
          >
            <ChevronLeft />
          </IconButton>
        </div>
        <List className="private-layout-aside-menu">
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem disablePadding key={text} >
              <ListItemButton >
                <ListItemIcon >
                  <ChevronLeft /> 
                </ListItemIcon>
                <ListItemText className="manu-item-text"
                  primary={text + index}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
      <div className={`private-layout-screen`}>
        <div className={`private-layout-header`}>
          <IconButton
            className={`private-layout-header-menu-icon ${open && "hidden"}`}
            onClick={() => setOpen(!open)}
          >
            <MenuIcon />
          </IconButton>
          <strong className="private-layout-header-text">SGAMCE</strong>
          <IconButton>
            <AccountCircle className="private-layout-header-user-icon"/>
          </IconButton>
        </div>
        <div className={`private-layout-body`}>
          {children}
        </div>
      </div>
    </div>
  );
}
