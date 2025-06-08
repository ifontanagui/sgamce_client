"use client"

import React from "react";
import "./style.css"
import { useRouter } from 'next/navigation'
import { IconButton, Menu, MenuItem } from "@mui/material";
import { AccountCircle, Place, PrecisionManufacturing, KeyboardDoubleArrowDown, Category, Cable } from "@mui/icons-material";
import { deleteCookie, getCookie } from "cookies-next";

const menuItems = [
  { description: "Categorias", url: "/categories", icon: <Category className="private-layout-header-sub-menu-list-item-icon"/>, onlyAdmin: false },
  { description: "Equipamentos", url: "/equipments", icon: <PrecisionManufacturing className="private-layout-header-sub-menu-list-item-icon"/>, onlyAdmin: false },
  { description: "Salas e Laboratórios", url: "/rooms", icon: <Place className="private-layout-header-sub-menu-list-item-icon"/>, onlyAdmin: true },
  { description: "Vincular à Salas", url: "/link-rooms", icon: <Cable className="private-layout-header-sub-menu-list-item-icon"/>, onlyAdmin: true },
] as const;


export default function PrivateLayout({

  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const payload = JSON.parse(getCookie('payload')?.toString() || "{}");
  
  const router = useRouter();
  const [openMenu, setOpenMenu] = React.useState(true);
  const [openUserMenu, setOpenUserMenu] = React.useState(false);
  const [anchorUserMenu, setAnchorUserMenu] = React.useState<null | HTMLElement>(null);
  
  return (
    <div className={`private-layout`}>
      <div className={`private-layout-screen-header`}>
        <div className={`private-layout-header`}>
          <IconButton onClick={() => setOpenMenu(!openMenu)} >
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
              {!!payload.admin && <MenuItem onClick={() => {router.push("/users")}}>Gerenciar Usuários</MenuItem>}
              <MenuItem onClick={() => {
                deleteCookie('token')
                deleteCookie('payload')
                
                router.push("/sign-in")
              }}>Sair</MenuItem>
            </Menu>
          </div>
        </div>
        <div className={`private-layout-header-menu-${openMenu ? "open" : "close"}`}>
          {openMenu && 
          <div className="private-layout-header-menu-list">
            {menuItems.filter(x => !!payload.admin || !x.onlyAdmin).map((menu) => (
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