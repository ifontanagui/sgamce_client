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
import { AddressData, FindAddressRows, ParseToIRow } from "@/services/address-service";
import Toast, { DispatchToastProps, DispatchToast } from "@/components/Toast";

function rowActions(onClickAction:  React.Dispatch<React.SetStateAction<boolean>>) {
  return (
    <div className="add-room-action">
      <IconButton onClick={() => {
        onClickAction(true)}
      }>
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


export default function Address() {  
  const [data, setData] = React.useState([] as AddressData[]);
  const [buildRows, setBuildRows] = React.useState([] as IRow[]);
  const [roomRows, setRoomRows] = React.useState([] as IRow[]);
  
  const [reload, setReload] = React.useState(true);
  const [buildId, setBuildId] = React.useState(0);
  const [roomId, setRoomId] = React.useState(0);
  const [name, setName] = React.useState("");
  const [nameFilter, setNameFilter] = React.useState("");
  const [newlyOpened, setNewlyOpened] = React.useState(true);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [openAddRoom, setOpenAddRoom] = React.useState(false);
  const [openAddRoomForm, setOpenAddRoomForm] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState({type: "success", message: ""} as DispatchToastProps);
  
  React.useEffect(() => {
    if (reload) {
      (async () => {
        const usersRowsReply = await FindAddressRows();
        setData(usersRowsReply.data);
        setBuildRows(ParseToIRow(usersRowsReply.data));

        if (!usersRowsReply.success) {
          setToastMessage({ type: "error", message: "Ocorreu um erro ao buscar os usuários, tente novamente" })
        }
        
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setReload(false);
      })().catch(console.error);
    }
  }, [reload]);
  
  React.useEffect(() => {
    if (isEdit) {
      (async () => {
        const build = data.find(x => x.id === buildId);
        
        if (build){
          setName(build.nome)
        }

        setReload(false);
      })().catch(console.error);
    }
  }, [openDrawer]);
  
  React.useEffect(() => {
    DispatchToast(toastMessage);
  }, [toastMessage])
  
  const handleFilterClick = async () => {
    let addressData = data;

    if (nameFilter) {
      addressData = addressData.filter(x => x.nome.toString().toLowerCase().includes(nameFilter.toLowerCase()));
    }

    setBuildRows(ParseToIRow(addressData));
  }

  const handleAddBuildClick = async() => {
    setNewlyOpened(false);
    
    if (!name) return false;

    if (!isEdit)
      buildRows.push({
        data: [ name ]
      })
    
    setIsEdit(false);
    handleCloseAddBuild();

    return true;
  }

  const handleAddRoomClick = async() => {
    setNewlyOpened(false);
    
    if (!name) return false;

    if (buildRows[0].subList?.rows)
      buildRows[0].subList.rows.push([name])
    
    setIsEdit(false);
    handleCloseAddBuild();

    return true;
  }

  const handleCloseAddBuild = () => {   
    setName("");
    setIsEdit(false);
    setNewlyOpened(true);
  }

  const handleDeleteBuildClick = (row: IRow) => {
    // rows = rows.filter(r => r.data[0] !== row.data[0])

    setReload(true);
  }

  const handleDeleteRoomClick = (row: IRow) => {
    if (buildRows[0].subList?.rows)
      buildRows[0].subList.rows = buildRows[0].subList.rows.filter(r => r[0] !== row.data[0])

    setReload(true);
  }

  const handleEditBuildAction = (row: IRow) => {
    setBuildId(Number.parseInt(row.data[0].toString()))
    setIsEdit(true);
    setOpenDrawer(true);
  }

  const handleAddButtonClick = () => {
    setOpenDrawer(true)    
  }

  const handleRoomsDialogClick = () => {
    const build = data.find(x => x.id === buildId);
    if (build?.rooms.length) {
      setRoomRows(build.rooms.map(x => { return {data: [x.id, x.nome]} }))
    }

    setOpenAddRoom(true);
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
              headers={['ID', 'Nome']}
              rows={buildRows}
              className="rooms-table"
              deleteAction={handleDeleteBuildClick}
              editAction={handleEditBuildAction}
              rowActions={rowActions(handleRoomsDialogClick)}
              rowClick={(row: IRow) => { setBuildId(Number.parseInt(row.data[0].toString())) }}
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
                  headers={['ID', 'Nome']}
                  rows={roomRows}
                  className="rooms-table"
                  deleteAction={handleDeleteRoomClick}
                  rowClick={(row: IRow) => { setRoomId(Number.parseInt(row.data[0].toString())) }}
                />
              </div>
            </div>
          </Dialog>
          <Toast />
        </div>
  )
}