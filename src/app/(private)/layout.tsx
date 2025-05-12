"use client"

import React from "react";
import "./style.css"
import { useRouter } from 'next/navigation'
import { IconButton, Menu, MenuItem } from "@mui/material";
import { AccountCircle, Build, Science, PrecisionManufacturing, KeyboardDoubleArrowDown } from "@mui/icons-material";

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
  const [openMenu, setOpenMenu] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  return (
    <div className={`private-layout`}>
      <div className={`private-layout-screen-header`}>
        <div className={`private-layout-header`}>
          <IconButton onClick={() => setOpenMenu(!openMenu)} >
            <strong className="private-layout-header-menu-text">MENU</strong>
            <KeyboardDoubleArrowDown className={`private-layout-header-menu-icon ${openMenu && "open"}`} />
          </IconButton>
          <strong className="private-layout-header-text" onClick={() => {router.push("/")}}>SGAMCE</strong>
          <div>
            <IconButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)} >
              <AccountCircle className={`private-layout-header-user-icon`} />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={!!anchorEl}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={() => {router.push("/users")}}>Gerenciar Usuários</MenuItem>
              <MenuItem onClick={() => {router.push("/sign-in")}}>Sair</MenuItem>
            </Menu>
          </div>
        </div>
        <div className={`private-layout-header-menu-${openMenu ? "open" : "close"}`}>
          {openMenu && 
          <div className="private-layout-header-menu-list">
            {menuItems.map((item) => (
              <IconButton  onClick={() => router.push(`/${item.url}`)} key={item.description}>
                <div className="private-layout-header-menu-list-item">
                  {item.icon}
                  <span className="private-layout-header-menu-list-item-text">{item.description}</span>
                </div>
              </IconButton>
          ))}
          </div>}
        </div>
      </div>
      <div className={`private-layout-body`}>
        {children}
      </div>
    </div>
  );
}
