"use client"

import "./style.css"
import React from "react";
import Table, { IRow } from "@/components/Table";
import { Dialog, Drawer, IconButton } from "@mui/material";
import { AddCircleOutline, AddLocation } from "@mui/icons-material";
import DefaultSkeleton from "@/components/DefaultSkeleton";
import DefaultActions from "@/components/DefaultActions";
import InputText from "@/components/InputText";
import Button from "@/components/Button";


const OGRows = [
  { data: ['Prédio 01'], subList: { headers: ["Sala", "Responsáveis"], title: "Salas", rows: [
    ["Sala 200", "Responsável 01, Responsável 02, Responsável 03, Responsável 04, Responsável 05"],
    ["Laboratório 200", "Responsável 01, Responsável 02, Responsável 03, Responsável 04, Responsável 05, Responsável 05, Responsável 05, Responsável 05, Responsável 05, Responsável 05, Responsável 05, Responsável 05, Responsável 05, Responsável 05, Responsável 05, Responsável 05"],
    ["Sala 201", "Responsável 01, Responsável 02, Responsável 03, Responsável 04, Responsável 05"],
    ["Laboratório 201", "Responsável 01, Responsável 02, Responsável 03, Responsável 04, Responsável 05"],
    ["Sala 202", "Responsável 01, Responsável 02, Responsável 03, Responsável 04, Responsável 05"],
    ["Laboratório 202", "Responsável 01, Responsável 02, Responsável 03, Responsável 04, Responsável 05"],
    ["Sala 203", "Responsável 01, Responsável 02, Responsável 03, Responsável 04, Responsável 05"],
    ["Laboratório 203", "Responsável 01, Responsável 02, Responsável 03, Responsável 04, Responsável 05"],
    ["Sala 204", "Responsável 01, Responsável 02, Responsável 03, Responsável 04, Responsável 05"],
    ["Laboratório 201", "Responsável 01, Responsável 02, Responsável 03, Responsável 04, Responsável 05"],
  ] } },
  { data: ['Prédio 02'] },
  { data: ['Prédio 03'] },
  { data: ['Prédio 04'] },
  { data: ['Prédio 05'] },
  { data: ['Prédio 06'] },
  { data: ['Prédio 07'] },
  { data: ['Prédio 08'] },
  { data: ['Prédio 09'] },
  { data: ['Prédio 10'] },
  { data: ['Prédio 11'] },
  { data: ['Prédio 12'] },
  { data: ['Prédio 13'] },
  { data: ['Prédio 14'] },
] as IRow[];
let rows = OGRows;

function rowActions(onClickAction:  React.Dispatch<React.SetStateAction<boolean>>) {
  return (
    <div className="add-room-action">
      <IconButton onClick={() => onClickAction(true)}>
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
  const [name, setName] = React.useState("");
  const [extraInfos, setExtraInfos] = React.useState("");
  const [nameFilter, setNameFilter] = React.useState("");
  const [newlyOpened, setNewlyOpened] = React.useState(true);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [openAddRoom, setOpenAddRoom] = React.useState(false);
  const [openAddRoomForm, setOpenAddRoomForm] = React.useState(false);
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
  
    const handleAddBuildClick = async() => {
      setNewlyOpened(false);
      
      if (!name) return false;
  
      if (!isEdit)
        rows.push({
          data: [ name ]
        })
      
      setIsEdit(false);
      handleCloseAddBuild();
  
      return true;
    }

    const handleAddRoomClick = async() => {
      setNewlyOpened(false);
      
      if (!name) return false;
  
      if (rows[0].subList?.rows)
        rows[0].subList.rows.push([name])
      
      setIsEdit(false);
      handleCloseAddBuild();
  
      return true;
    }
  
    const handleCloseAddBuild = () => {   
      setName("");
      setExtraInfos("");
      setNewlyOpened(true);
    }
  
    const handleDeleteBuildClick = (row: IRow) => {
      rows = rows.filter(r => r.data[0] !== row.data[0])
  
      setReload(true);
    }
  
    const handleDeleteRoomClick = (row: IRow) => {
      if (rows[0].subList?.rows)
        rows[0].subList.rows = rows[0].subList.rows.filter(r => r[0] !== row.data[0])
  
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
            <strong className='rooms-header-title'>Prédios</strong>
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
              deleteAction={handleDeleteBuildClick}
              editAction={handleEditRoomAction}
              rowActions={rowActions(setOpenAddRoom)}
            />
          </div>
          <Drawer
            anchor='right'
            open={openDrawer}
            onClose={() => {
              handleCloseAddBuild();
              setOpenDrawer(false);
            }}
          >
            <div className='room-drawer'>
              <strong className='room-drawer-title'>Cadastrar Prédio</strong>
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
              <InputText
                type='text'
                placeholder='Informações extras'
                value={extraInfos}
                className='room-data-input'
                onChange={(event) => { setExtraInfos(event.target.value) }}
                multiline
                defaultRows={10}
              />
              <Button 
                className="save-button"
                onClick={async () => {
                  const result = await handleAddBuildClick();
                  if (result)
                    setOpenDrawer(false);
                }} 
                textContent='Salvar'
              />
            </div>
          </Drawer>
          <Dialog
            open={openAddRoom}
            onClose={() => setOpenAddRoom(false)}
            scroll='paper'
            maxWidth={"xl"}
            fullWidth
          >
            <div className='add-room-dialog'>
              <div className="add-room-dialog-header">
                <strong className="add-room-dialog-header-comp">Salas e Laboratórios do Prédio 1</strong>
                <IconButton onClick={() => {setOpenAddRoomForm(!openAddRoomForm)}}>
                  <AddCircleOutline className='add-room-dialog-header-comp' />
                </IconButton>
              </div>
              <div className={`add-room-dialog-header-form-${openAddRoomForm ? "open" : "close"}`}>
                <InputText
                  type='text'
                  placeholder='Nome da Sala/Laboratório'
                  value={name}
                  required
                  error={!newlyOpened && !name}
                  helperText="É obrigatório informar o nome da sala/laboratório"
                  onChange={(event) => { setName(event.target.value) }}
                />
                
                <Button 
                  className="save-room-button"
                  onClick={async () => {
                    const result = await handleAddRoomClick();
                    if (result)
                      setOpenDrawer(false);
                  }} 
                  textContent='Salvar'
                />
              </div>
              <div className={`add-room-dialog-content ${!openAddRoomForm ? "filled" : ""}`} >
                <Table
                  headers={['Nome']}
                  rows={rows[0].subList?.rows?.map(x => { return { data: x.map((v, i) => i === 0 ? v : null ).filter(x => !!x) } as IRow }) || []}
                  className="rooms-table"
                  deleteAction={handleDeleteRoomClick}
                />
              </div>
            </div>
          </Dialog>
        </div>
  )
}