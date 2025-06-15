"use client"

import "./style.css"
import React from "react";
import MultiTabs from "@/components/MultiTabs"
import Table, { IRow } from "@/components/Table";
import { Chip, Dialog, Drawer, IconButton } from "@mui/material";
import { AddCircleOutline, GroupAdd, AddToQueue } from "@mui/icons-material";
import InputText from "@/components/InputText";
import Button from "@/components/Button";
import Combo from "@/components/Combo";
import Toast, { DispatchToast, DispatchToastProps } from "@/components/Toast";
import { AddRoomMachine, AddRoomUser, FindRows, LinkAddressData, ParseToBuildIRow, ParseToEquipmentIRow, ParseToRoomIRow, RoomData } from "@/services/links-service";
import { FindUsersRows, UserData } from "@/services/users-service";
import { EquipmentData, FindEquipmentsRows } from "@/services/equipments-service";
import TabsSkeleton from "@/components/TabsSkeleton";
import InputDate from "@/components/InputDate";

function roomRowActions(
  onClickActionUser:  () => void
) {
  return (
    <div className="add-equipment-action">
      <IconButton onClick={() => onClickActionUser()}>
        <GroupAdd className="add-users-action-icon"/>
      </IconButton>
    </div>
  )
}

function equipmentRowActions(
  onClickActionUser:  () => void
) {
  return (
    <div className="add-equipment-action">
      <IconButton onClick={() => onClickActionUser()}>
        <AddToQueue className="add-users-action-icon"/>
      </IconButton>
    </div>
  )
}

export default function Rooms() {
  const [data, setData] = React.useState([] as LinkAddressData[]);
  const [roomsData, setRoomsData] = React.useState([] as RoomData[]);
  const [usersData, setUsersData] = React.useState([] as UserData[])
  const [equipmentsData, setEquipmentsData] = React.useState([] as EquipmentData[])
  const [buildRows, setBuildRows] = React.useState([] as IRow[]);
  const [roomRows, setRoomRows] = React.useState([] as IRow[]);
  const [equipmentRows, setEquipmentRows] = React.useState([] as IRow[]);
  const [usersRows, setUsersRows] = React.useState([] as IRow[]);
  
  const [reload, setReload] = React.useState(true);
  const [buildId, setBuildId ] = React.useState(0);
  const [roomId, setRoomId ] = React.useState(0);
  const [curTab, setCurTab ] = React.useState(0);
  const [openAddMachineForm, setOpenAddMachineForm] = React.useState(false);
  const [newlyOpened, setNewlyOpened] = React.useState(true);
  const [assetNumber, setAssetNumber] = React.useState(0);
  const [identifierNumber, setIdentifierNumber] = React.useState(0);
  const [equipmentAmendmentDate, setEquipmentAmendmentDate ] = React.useState("");
  const [equipment, setEquipment] = React.useState("")
  const [openAddUser, setOpenAddUser] = React.useState(false);
  const [openAddUserForm, setOpenAddUserForm] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState({type: "success", message: ""} as DispatchToastProps);
    
  React.useEffect(() => {
    if (reload) {
      (async () => {
        Promise.all([
          FindRows(),
          FindUsersRows(),
          FindEquipmentsRows()
        ])
          .then(([addressRowsReply, users, equipments]) => {
            
            setData(addressRowsReply.data)
            setBuildRows(ParseToBuildIRow(addressRowsReply.data));
            setUsersData(users.data);
            setEquipmentsData(equipments.data);

            if (curTab === 1) {
              const build = addressRowsReply.data.find(x => x.id === buildId);
              if (build){
                setRoomsData(build.rooms)
                setRoomRows(ParseToRoomIRow(build.rooms))
                
                const room = build.rooms.find(x => x.id === roomId)
                if (room) {
                  setUsersRows(room.users.map(x => { return { data: [x.id, x.nome]}}));
                }
              }
            }
            else if (curTab === 2) {
              const build = addressRowsReply.data.find(x => x.id === buildId);
              if (build){
                setRoomsData(build.rooms)
                setRoomRows(ParseToRoomIRow(build.rooms))
                
                const room = build.rooms.find(x => x.id === roomId);        
                
                if (room) {
                  setEquipmentRows(ParseToEquipmentIRow(room.equipments));
                }
                else {
                  setEquipmentRows([])
                }
              }
            }
          })
          .catch(() => {
            setToastMessage({ type: "error", message: "Ocorreu um erro ao buscar os dados, tente novamente" })
          });

        await new Promise((resolve) => setTimeout(resolve, 2500));
        setReload(false);
      })().catch(console.error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  React.useEffect(() => {
    (async () => {
      if (curTab === 0) {
        setRoomRows([])
        setRoomsData([])
      }
      else if (curTab === 1) {
        const build = data.find(x => x.id === buildId);
        if (build){
          setRoomsData(build.rooms)
          setRoomRows(ParseToRoomIRow(build.rooms))
        }
      }
      else if (curTab === 2) {
        const room = roomsData.find(x => x.id === roomId);        
        if (room) {
          setEquipmentRows(ParseToEquipmentIRow(room.equipments));
        }
        else {
          setEquipmentRows([])
        }
      }
    })().catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curTab]);

  React.useEffect(() => {
    (async () => {
      if (openAddUser) {
        const room = roomsData.find(x => x.id === roomId)
        if (room?.users.length) {
          setUsersRows(room.users.map(x => { return { data: [x.id, x.nome]}}));
        }
        else {
          setUsersRows([])
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    })().catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAddUser]);
    
  React.useEffect(() => {
    DispatchToast(toastMessage);
  }, [toastMessage])
  
  const handleAddMachineClick = async() => {
    setNewlyOpened(false);
    
    if (!assetNumber || !identifierNumber || !equipment) return false;
    
    const response = await AddRoomMachine(assetNumber.toString(), identifierNumber.toString(), Number.parseInt(equipment), equipmentAmendmentDate, roomId);
    if (response.success) {
      handleCloseAddEquipment()
      setReload(true);

      setToastMessage({type: "success", message:  "Equipamento vinculado com sucesso"});
    }
    else {
      setToastMessage({type: "error", message:  response.message || "Erro ao vincular o equipamento, tente novamente"});
    }

    return response.success;

  }

  const handleCloseAddEquipment = () => {   
    setAssetNumber(0);
    setIdentifierNumber(0);
    setEquipment("");
    setEquipmentAmendmentDate("");
    setNewlyOpened(true);
    setOpenAddMachineForm(false)
  }
    
  const handleDeleteMachineClick = (row: IRow) => {
    console.log('row: ', row);
    // if ((rows[curBuildRow]?.row)[curRoomRow]?.subList?.rows)
    //   rows[curBuildRow].row[curRoomRow].subList.rows = rows[curBuildRow].row[curRoomRow].subList.rows.filter(r => r[1] !== row.data[1])

    setReload(true);
  }

  const handleAddUserClick = async() => {
    setNewlyOpened(false);
    
    if (!equipment) return false;

    const user = usersData.find(x => x.id === Number.parseInt(equipment))

    if (user) {
      const response = await AddRoomUser(user, roomId);
      if (response.success) {
        handleCloseAddEquipment();
        setReload(true);
        
        setToastMessage({type: "success", message:  "Usuário vinculado com sucesso"});
      }
      else {
        setToastMessage({type: "error", message:  response.message || "Erro ao vincular o usuário, tente novamente"});
      }
      
      return response.success;
    }

    setToastMessage({type: "error", message:  "Erro ao vincular o usuário, tente novamente"});
    return false;
  }

  const handleDeleteUserClick = (row: IRow) => {
    console.log('row: ', row);
    // users = users.filter(x => x.data[1] !== row.data[1]);
    setReload(true);
  }

  return (
    <div className="rooms">
      {
        reload
        ? <TabsSkeleton tabsNumber={3} />
        : <><MultiTabs
          externalTabsController={curTab}
          setExternalTabsController={setCurTab}
          tabs={[
            {
              header: 'Blocos', content: 
              <div className="room-tab">
                <div className="room-tab-table-header" >
                  {!!buildId && <Chip className="room-chip" label={buildRows.find(x => x.data[0] === buildId)?.data[1]} variant="outlined" />}
                </div>
                <div className="room-tab-table">
                  <Table
                    headers={['ID', 'Prédio']}
                    rows={[...buildRows, ...buildRows]}
                    className="rooms-table"
                    rowClick={(row: IRow) => {
                      setBuildId(Number.parseInt(row.data[0].toString()));
                      setRoomId(0);
                    }}
                  />
                </div>
              </div>
            },
            { header: 'Salas', content:
              <div className="room-tab">
                <div className="room-tab-table-header" >
                  {!!buildId && <Chip className="room-chip" label={buildRows.find(x => x.data[0] === buildId)?.data[1]} variant="outlined" />}
                  {!!roomId && <Chip className="room-chip" label={roomRows.find(x => x.data[0] === roomId)?.data[1]} variant="outlined" />}
                </div>
                <div className="room-tab-table">
                  <Table
                    headers={['ID', 'Sala/Laboratório']}
                    rows={roomRows}
                    className="rooms-table"
                    rowClick={(row: IRow) => {setRoomId(Number.parseInt(row.data[0].toString()));}}
                    rowActions={roomRowActions(() => {
                      setOpenAddUser(true);
                      setOpenAddUserForm(false);
                    })}
                  />
                </div>
              </div>
            },
            { header: 'Equipamentos', content:
              <div className="room-tab">
                <div className="equipments-tab-header">
                  <div className="room-tab-table-header" >
                    {!!buildId && <Chip className="room-chip" label={buildRows.find(x => x.data[0] === buildId)?.data[1]} variant="outlined" />}
                    {!!roomId && <Chip className="room-chip" label={roomRows.find(x => x.data[0] === roomId)?.data[1]} variant="outlined" />}
                  </div>
                  {equipmentRowActions(() => {setOpenAddMachineForm(true);})}
                </div>
                <div className="room-tab-table">
                  <Table
                    headers={['ID', 'Equipamento', 'Nro. Identificação', 'Nro. Patrimonio', 'Dt. Implantação']}
                    rows={equipmentRows}
                    className="rooms-table"
                    deleteAction={handleDeleteMachineClick}
                  />
                </div>
              </div>
            },
          ]}/>      
          <Dialog
            open={openAddUser}
            onClose={() => setOpenAddUser(false)}
            scroll='paper'
            maxWidth={"xl"}
            fullWidth
          >
            <div className='add-user-dialog'>
              <div className="add-user-dialog-header">
                <strong className="add-user-dialog-header-comp">Vincular Usuários</strong>
                <IconButton onClick={() => {setOpenAddUserForm(!openAddUserForm)}}>
                  <AddCircleOutline className='add-user-dialog-header-comp' />
                </IconButton>
              </div>
              <div className={`add-user-dialog-header-form-${openAddUserForm ? "open" : "close"}`}>
                <div className='equipments-combo'>
                  <Combo 
                    title="Usuários" 
                    value={equipment}
                    onChange={(value: string | number) => setEquipment(value.toString())}
                    valuesList={usersData.map(x => { return { value: x.id, description: x.nome }})}
                    emptyValue 
                    required
                    error={!newlyOpened && !equipment}
                    helperText="É obrigatório informar o usuário"
                  />
                </div>             
                <Button 
                  className="save-user-button"
                  onClick={async () => {
                    await handleAddUserClick();
                  }} 
                  textContent='Salvar'
                />
              </div>
              <div className={`add-user-dialog-content ${!openAddUserForm ? "filled" : ""}`} >
                <Table
                  headers={['ID', "Nome"]}
                  rows={usersRows}
                  className="user-table"
                  deleteAction={handleDeleteUserClick}
                />
              </div>
            </div>
          </Dialog> 
          <Drawer
            anchor='right'
            open={openAddMachineForm}
            onClose={() => setOpenAddMachineForm(false)}
          >
            <div className='add-machine-drawer'>
              <strong className='add-machine-drawer-title'>Cadastrar Equipamento</strong>
              <InputText
                type='text'
                placeholder='Nro. de Identificação'
                value={assetNumber}
                required
                error={!newlyOpened && !assetNumber}
                helperText="É obrigatório informar o nro. de identificação"
                onChange={(event) => { setAssetNumber(Number.parseInt(event.target.value)) }}
                className="input-equipment-input"
              />
              <InputText
                type='text'
                placeholder='Nro. de Patrimonio'
                value={identifierNumber}
                required
                error={!newlyOpened && !identifierNumber}
                helperText="É obrigatório informar o nro. de patrimonio"
                onChange={(event) => { setIdentifierNumber(Number.parseInt(event.target.value)) }}
                className="input-equipment-input"
              />   
              <InputDate 
                label="Dt. Implantação"
                onChange={(value: string) => setEquipmentAmendmentDate(value)}
                className='equipment-date-input'
                value={equipmentAmendmentDate}
                helperText="É obrigatório informar a data do agendamento"
              />
              <div className='equipments-combo'>
                <Combo 
                  title="Equipamentos" 
                  value={equipment}
                  onChange={(value: string | number) => setEquipment(value.toString())}
                  valuesList={equipmentsData.map(x => { return { value: x.id, description: x.equipamento }})}
                  emptyValue 
                  required
                />
              </div>             
              <Button 
                className="save-button"
                onClick={async () => {
                  await handleAddMachineClick();
                }} 
                textContent='Salvar'
              />
            </div>
          </Drawer>
          <Toast />
        </>
      }
    </div>
  )
}