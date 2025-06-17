"use client"

import React from "react";
import "./style.css"
import { useRouter } from 'next/navigation'
import { Badge, Dialog, IconButton, Menu, MenuItem } from "@mui/material";
import { AccountCircle, Place, PrecisionManufacturing, KeyboardDoubleArrowDown, Category, Cable, Event, Notifications } from "@mui/icons-material";
import { deleteCookie, getCookie } from "cookies-next";
import { FindAlertsRows } from "@/services/notifications-service";
import Table, { IRow } from "@/components/Table";

const menuItems = [
  { description: "Categorias", url: "/categories", icon: <Category className="private-layout-header-sub-menu-list-item-icon"/>, onlyAdmin: false },
  { description: "Equipamentos", url: "/equipments", icon: <PrecisionManufacturing className="private-layout-header-sub-menu-list-item-icon"/>, onlyAdmin: false },
  { description: "Salas e Laboratórios", url: "/address", icon: <Place className="private-layout-header-sub-menu-list-item-icon"/>, onlyAdmin: false },
  { description: "Vincular à Salas", url: "/link-rooms", icon: <Cable className="private-layout-header-sub-menu-list-item-icon"/>, onlyAdmin: false },
  { description: "Eventos e Certificados", url: "/events-certificates", icon: <Event className="private-layout-header-sub-menu-list-item-icon"/>, onlyAdmin: false },
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
  const [alertsData, setAlertsData] = React.useState([] as IRow[]);
  const [openDialog, setOpenDialog] = React.useState(false);
  
  React.useEffect(() => {
    (async () => {
      const reply = await FindAlertsRows();
      setAlertsData(reply.data?.map(x => { return { data: [ x.Status, x.Sigla, x.Equipamento, x.TAG, x.CertificadoExpiraEm ], active: x.CertificadoExpiraEm > 0 } }) || []);
    })().catch(console.error);
  }, []);

  return (
    <div className={`private-layout`}>
      <div className={`private-layout-screen-header`}>
        <div className={`private-layout-header`}>
          <IconButton onClick={() => setOpenMenu(!openMenu)} >
            <KeyboardDoubleArrowDown className={`private-layout-header-menu-icon ${openMenu && "open"}`} />
          </IconButton>
          <strong className="private-layout-header-text" onClick={() => {router.push("/")}}>SGAMCE</strong>
          <div className="private-layout-header-icons">
            <IconButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              setOpenDialog(true);
            }} >
              <Badge badgeContent={alertsData.length}>
                <Notifications className={`private-layout-header-user-icon`} />
              </Badge>
            </IconButton>
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
        <Dialog
          open={openDialog}
          scroll='paper'
          maxWidth={"xl"}
          fullWidth
          onClose={() => setOpenDialog(false)}
        >
          <div className="private-layout-alert-dialog">
            <strong className="private-layout-alert-dialog-title">Avisos</strong>
            <Table
              headers={["Status", "Sigla", "Equipamento", "Tag", "Tempo até a expiração"]}
              rows={alertsData}
              className="private-layout-alert-dialog-table"
              deleteAction={() => {}}
              hiddenToolTip
            />
          </div>
        </Dialog>
    </div>
  );
}