"use client"

import React from "react";
import "./style.css"
import { useRouter } from 'next/navigation'
import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { ChevronLeft, AccountCircle, Build, Science, PrecisionManufacturing } from "@mui/icons-material";
import MenuIcon from '@mui/icons-material/Menu';

const menuItems = [
  {url: "equipments", description: "Equipamentos", icon: <PrecisionManufacturing />},
  {url: "items", description: "Itens", icon: <><Science /><Science /></>},
  {url: "maintenance", description: "Manutenções", icon: <Build />},
] as const;

export default function PrivateLayout({

  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [openAsideMenu, setOpenAsideMenu] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  return (
    <div className={`private-layout`}>     
      <div className={`private-layout-aside-${openAsideMenu ? "open" : "close"}`}>
        <div className="private-layout-aside-header">
          <IconButton
            className="private-layout-menu-icon"
            onClick={() => setOpenAsideMenu(!openAsideMenu)}
          >
            <ChevronLeft />
          </IconButton>
        </div>
        <List className="private-layout-aside-menu">
          {menuItems.map((item) => (
            <ListItem disablePadding key={item.url} >
              <ListItemButton onClick={() => router.push(`/${item.url}`)}>
                <ListItemIcon className="menu-item-icon">
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  className="manu-item-text"
                  primary={item.description}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
      <div className={`private-layout-screen`}>
        <div className={`private-layout-header`}>
          <IconButton
            className={`private-layout-header-menu-icon ${openAsideMenu && "hidden"}`}
            onClick={() => setOpenAsideMenu(!openAsideMenu)}
          >
            <MenuIcon />
          </IconButton>
          <strong className="private-layout-header-text">SGAMCE</strong>
          <div>
            <IconButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)} >
              <AccountCircle className={`private-layout-header-user-icon ${openAsideMenu && "hidden"}`} />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={!!anchorEl}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => {router.push("/sign-in")}}>Sair</MenuItem>
            </Menu>
          </div>
        </div>
        <div className={`private-layout-body`}>
          {children}
        </div>
      </div>
    </div>
  );
}
