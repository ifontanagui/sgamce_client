"use client"

import "./style.css"
import React from "react";
import Table, { IRow } from "@/components/Table";
import { Drawer, IconButton } from "@mui/material";
import { AddLocation } from "@mui/icons-material";
import DefaultSkeleton from "@/components/DefaultSkeleton";
import DefaultActions from "@/components/DefaultActions";
import InputText from "@/components/InputText";
import Button from "@/components/Button";

const OGRows = [
  { data: ['Bloco 01'], subList: { headers: ["Sala", "Responsáveis"], title: "Salas", rows: [
    [200, "Responsável 01, Responsável 02, Responsável 03, Responsável 04, Responsável 05"],
    [200, "Responsável 01, Responsável 02, Responsável 03, Responsável 04, Responsável 05, Responsável 05, Responsável 05, Responsável 05, Responsável 05, Responsável 05, Responsável 05, Responsável 05, Responsável 05, Responsável 05, Responsável 05, Responsável 05"],
    [200, "Responsável 01, Responsável 02, Responsável 03, Responsável 04, Responsável 05"],
    [200, "Responsável 01, Responsável 02, Responsável 03, Responsável 04, Responsável 05"],
    [200, "Responsável 01, Responsável 02, Responsável 03, Responsável 04, Responsável 05"],
    [200, "Responsável 01, Responsável 02, Responsável 03, Responsável 04, Responsável 05"],
    [200, "Responsável 01, Responsável 02, Responsável 03, Responsável 04, Responsável 05"],
    [200, "Responsável 01, Responsável 02, Responsável 03, Responsável 04, Responsável 05"],
    [200, "Responsável 01, Responsável 02, Responsável 03, Responsável 04, Responsável 05"],
    [200, "Responsável 01, Responsável 02, Responsável 03, Responsável 04, Responsável 05"]
  ] } },
  { data: ['Bloco 02'] },
  { data: ['Bloco 03'] },
  { data: ['Bloco 04'] },
  { data: ['Bloco 05'] },
  { data: ['Bloco 06'] },
  { data: ['Bloco 07'] },
  { data: ['Bloco 08'] },
  { data: ['Bloco 09'] },
  { data: ['Bloco 10'] },
  { data: ['Bloco 11'] },
  { data: ['Bloco 12'] },
  { data: ['Bloco 13'] },
  { data: ['Bloco 14'] },
] as IRow[];
let rows = OGRows;

function headerActions() {
  return (
    <div className="add-room-action">
      <IconButton>
        <AddLocation className="add-room-action-icon"/>
      </IconButton>
    </div>
  )
}


function FilterDialog(props: {
  nameFilter: string, 
  setNameFilter: React.Dispatch<React.SetStateAction<string>>
}) {
  return (
    <div>
      <InputText
        type='text'
        placeholder='Nome'
        value={props.nameFilter}
        className='rooms-filter-input'
        onChange={(event) => { props.setNameFilter(event.target.value) }}
      />
    </div>
  )
}


export default function Rooms() {
  const [reload, setReload] = React.useState(true);
  const [nameFilter, setNameFilter] = React.useState("");
  const [name, setName] = React.useState("");
  const [newlyOpened, setNewlyOpened] = React.useState(true);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  
  React.useEffect(() => {
    if (reload) {
      (async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setReload(false);
      })().catch(console.error);
    }
  }, [reload]);
  
    const handleFilterClick = async () => {
      rows = OGRows;
      setReload(!reload);
  
      if (!nameFilter) return;
  
      rows = rows.filter(x => x.data[0].toString().toLowerCase().includes(nameFilter.toLowerCase()));
    }
  
    const handleAddURoomClick = async() => {
      setNewlyOpened(false);
      
      if (!name) return false;
  
      if (!isEdit)
        rows.push({
          data: [ name ]
        })
      
      setIsEdit(false);
      handleCloseAddRoom();
  
      return true;
    }
  
    const handleCloseAddRoom = () => {   
      setName("");
      setNewlyOpened(true);
    }
  
    const handleDeleteRoomClick = (row: IRow) => {
      rows = rows.filter(r => r.data[0] !== row.data[0])
  
      setReload(true);
    }
  
    const handleEditRoomAction = (row: IRow) => {
      setName(row.data[0].toString());
      setOpenDrawer(true);
    }
  
    const handleAddButtonClick = () => {
      setOpenDrawer(true)    
    }

  return (
    reload
      ? <DefaultSkeleton />
      : <div className="rooms">
          <div className="rooms-header">
            <strong className='rooms-header-title'>Categorias</strong>
            <DefaultActions
              refreshAction={handleFilterClick}
              filtersDialog={FilterDialog({nameFilter, setNameFilter})}
              filterAction={handleFilterClick}
              addAction={() => {handleAddButtonClick()}}
            />
          </div>
          <div className="room-tab-table">
            <Table
              headers={['Nome']}
              rows={rows}
              className="rooms-table"
              deleteAction={handleDeleteRoomClick}
              editAction={handleEditRoomAction}
              headerActions={headerActions()}
            />
          </div>
            <Drawer
              anchor='right'
              open={openDrawer}
              onClose={() => {
              // handleCloseAddUser();
              setOpenDrawer(false);
              }}
            >
              <div className='room-drawer'>
                <strong className='room-drawer-title'>Cadastrar Categoria</strong>
                <InputText
                  type='text'
                  placeholder='Nome'
                  required
                  value={name}
                  className='room-data-input'
                  error={!newlyOpened && !name}
                  helperText='É obrigatório informar o nome da categoria'
                  onChange={(event) => { setName(event.target.value) }}
                />
                <Button 
                  className="save-button"
                  onClick={async () => {
                    const result = await handleAddURoomClick();
                    if (result)
                      setOpenDrawer(false);
                  }} 
                  textContent='Salvar'
                />
              </div>
            </Drawer>
        </div>
  )
}