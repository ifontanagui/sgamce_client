"use client"

import React from "react";
import "./style.css"
import { useRouter } from 'next/navigation'
import { IconButton, Menu, MenuItem } from "@mui/material";
import { AccountCircle, Attractions, Place, PrecisionManufacturing, KeyboardDoubleArrowDown, Category, CorporateFare } from "@mui/icons-material";

const menuItems = [
  { description: "Categorias", url: "/categories", icon: <Category className="private-layout-header-sub-menu-list-item-icon"/> },
  { description: "Equipamentos", url: "/equipments", icon: <PrecisionManufacturing className="private-layout-header-sub-menu-list-item-icon"/> },
  { description: "Blocos", url: "/building", icon: <CorporateFare className="private-layout-header-sub-menu-list-item-icon"/> },
  { description: "Salas", url: "/rooms", icon: <Place className="private-layout-header-sub-menu-list-item-icon"/> },
  { description: "Eventos", url: "/events", icon: <Attractions className=".private-layout-header-menu-item-icon"/> },
] as const;


export default function PrivateLayout({

  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = React.useState(true);
  const [openUserMenu, setOpenUserMenu] = React.useState(false);
  const [anchorUserMenu, setAnchorUserMenu] = React.useState<null | HTMLElement>(null);
  
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
            <IconButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              setOpenUserMenu(!openUserMenu);
              setAnchorUserMenu(event.currentTarget);
            }} >
              <AccountCircle className={`private-layout-header-user-icon`} />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorUserMenu}
              open={!!anchorUserMenu}
              onClose={() => setAnchorUserMenu(null)}
            >
              <MenuItem onClick={() => {router.push("/users")}}>Gerenciar Usuários</MenuItem>
              <MenuItem onClick={() => {router.push("/sign-in")}}>Sair</MenuItem>
            </Menu>
          </div>
        </div>
        <div className={`private-layout-header-menu-${openMenu ? "open" : "close"}`}>
          {openMenu && 
          <div className="private-layout-header-menu-list">
            {menuItems.map((menu) => (
              <div className="private-layout-header-menu-list-item flex" onClick={() => router.push(menu.url)} key={menu.description}>
                {menu.icon}
                <span className="private-layout-header-menu-list-item-text">{menu.description}</span>
              </div>
            ))}
          </div>}
        </div>
      </div>
      <div className={`private-layout-body`}>
        {children}
      </div>
      <div className={`private-layout-footer`}>
        <span>By:&nbsp;</span>
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/ifontanagui">Guilherme Fontana</a>
        <span>&nbsp;✌️</span>
      </div>
    </div>
  );
}