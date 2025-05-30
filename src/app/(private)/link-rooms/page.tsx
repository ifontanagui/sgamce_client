"use client"

import "./style.css"
import React from "react";
import MultiTabs from "@/components/MultiTabs"
import Table, { IRow } from "@/components/Table";
import { Chip, Dialog, IconButton } from "@mui/material";
import { AddCircleOutline, AddToQueue } from "@mui/icons-material";
import InputText from "@/components/InputText";
import Button from "@/components/Button";
import Combo from "@/components/Combo";

const OGRows = [
  {
    row: [{ 
      data: ['201'], 
      subList: { 
        title: "Máquinas", 
        headers: [ "Equipamento", "Nro. Identificação", "Nro. Identificação" ], 
        rows: [
          ["Computador", 123, 123], ["Computador", 456, 456], ["Computador", 789, 789], ["Computador", 987, 987], ["Computador", 654, 654], ["Computador", 321, 321],
          ["Computador", 123, 123], ["Computador", 456, 456], ["Computador", 789, 789], ["Computador", 987, 987], ["Computador", 654, 654], ["Computador", 321, 321],
          ["Computador", 123, 123], ["Computador", 456, 456], ["Computador", 789, 789], ["Computador", 987, 987], ["Computador", 654, 654], ["Computador", 321, 321],
          ["Computador", 123, 123], ["Computador", 456, 456], ["Computador", 789, 789], ["Computador", 987, 987], ["Computador", 654, 654], ["Computador", 321, 321],
          ["Computador", 123, 123], ["Computador", 456, 456], ["Computador", 789, 789], ["Computador", 987, 987], ["Computador", 654, 654], ["Computador", 321, 321],
        ] 
      },
    },
    {data: ['202']},
    {data: ['203']},
    {data: ['204']},
    {data: ['205']},
    {data: ['206']},
    {data: ['207']},
    {data: ['208']},
    {data: ['209']}],
  },
  {
    row: []
  },
  {
    row: []
  },
  {
    row: []
  },
  {
    row: []
  },
  {
    row: []
  },
  {
    row: []
  },
  {
    row: []
  }
] as { row: IRow[] }[];
const rows = OGRows;

const Builds = [
  { data: ['Bloco 01Bloco 01Bloco 01Bloco 01Bloco 01']},
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
] as IRow[]

function rowActions(onClickAction:  React.Dispatch<React.SetStateAction<boolean>>) {
  return (
    <div className="add-equipment-action">
      <IconButton onClick={() => onClickAction(true)}>
        <AddToQueue className="add-equipment-action-icon"/>
      </IconButton>
    </div>
  )
}

export default function Rooms() {
  const [reload, setReload] = React.useState(true);
  const [curTab, setCurTab ] = React.useState(0);
  const [curBuildRow, setCurBuildRow ] = React.useState(-1);
  const [curRoomRow, setCurRoomRow ] = React.useState(-1);
  const [openAddMachine, setOpenAddMachine] = React.useState(false);
  const [openAddMachineForm, setOpenAddMachineForm] = React.useState(false);
  const [newlyOpened, setNewlyOpened] = React.useState(true);
  const [assetNumber, setAssetNumber] = React.useState(0);
  const [identifierNumber, setIdentifierNumber] = React.useState(0);
  const [equipment, setEquipment] = React.useState("")

    
  React.useEffect(() => {
    if (reload) {
      (async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setReload(false);
      })().catch(console.error);
    }
  }, [reload]);
  
  const handleAddMachineClick = async() => {
    setNewlyOpened(false);
    
    if (!assetNumber || !identifierNumber) return false;

    if ((rows[curBuildRow]?.row)[curRoomRow]?.subList?.rows)
      rows[curBuildRow].row[curRoomRow].subList.rows.push([equipment, assetNumber, identifierNumber])
    
    handleCloseAddEquipment();

    return true;
  }

  const handleCloseAddEquipment = () => {   
    setAssetNumber(0);
    setIdentifierNumber(0);
    setEquipment("");
    setNewlyOpened(true);
  }
    
  const handleDeleteMachineClick = (row: IRow) => {
    if ((rows[curBuildRow]?.row)[curRoomRow]?.subList?.rows)
      rows[curBuildRow].row[curRoomRow].subList.rows = rows[curBuildRow].row[curRoomRow].subList.rows.filter(r => r[1] !== row.data[1])

    setReload(true);
  }

  return (
    <div className="rooms">
      <MultiTabs
      externalTabsController={curTab}
      setExternalTabsController={setCurTab}
      tabs={[
        {
          header: 'Blocos', content: 
          <div className="room-tab">
            {curBuildRow !== -1 && <Chip className="room-chip" label={Builds[curBuildRow].data[0]} variant="outlined" />}
            <div className="room-tab-table">
              <Table
                headers={['Bloco']}
                rows={Builds}
                className="rooms-table"
                rowClick={(row: IRow, index: number) => {setCurBuildRow(index)}}
              />
            </div>
          </div>
        },
        { header: 'Salas', content:
          <div className="room-tab">
            {curBuildRow !== -1 && <Chip className="room-chip" label={Builds[curBuildRow].data[0]} variant="outlined" />}
            <div className="room-tab-table">
              <Table
                headers={['Sala']}
                rows={rows[curBuildRow]?.row || [] as IRow[]}
                className="rooms-table"
                rowClick={(row: IRow, index: number) => {setCurRoomRow(index)}}
                rowActions={rowActions(setOpenAddMachine)}
              />
            </div>
          </div>
        },
      ]}/>
      <Dialog
        open={openAddMachine}
        onClose={() => setOpenAddMachine(false)}
        scroll='paper'
        maxWidth={"xl"}
        fullWidth
      >
        <div className='add-machine-dialog'>
          <div className="add-machine-dialog-header">
            <strong className="add-machine-dialog-header-comp">Vincular Equipamentos</strong>
            <IconButton onClick={() => {setOpenAddMachineForm(!openAddMachineForm)}}>
              <AddCircleOutline className='add-machine-dialog-header-comp' />
            </IconButton>
          </div>
          <div className={`add-machine-dialog-header-form-${openAddMachineForm ? "open" : "close"}`}>
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
            <div className='equipments-combo'>
              <Combo 
                title="Equipamentos" 
                value={equipment}
                onChange={(value: string | number) => setEquipment(value.toString())}
                valuesList={[{description: "Computador", value: "Computador"}, {description: "Vidraria", value: "Vidraria"}, {description: "Balança", value: "Balança"}]}
                emptyValue 
                required
              />
            </div>             
            <Button 
              className="save-machine-button"
              onClick={async () => {
                await handleAddMachineClick();
              }} 
              textContent='Salvar'
            />
          </div>
          <div className={`add-machine-dialog-content ${!openAddMachineForm ? "filled" : ""}`} >
            <Table
              headers={['Equipamento', 'Nro. Identificação', 'Nro Patrimonio']}
              rows={(rows[curBuildRow]?.row)[curRoomRow]?.subList?.rows?.map(x => { return { data: x.map((v) => v ) } as IRow }) || []}
              className="machines-table"
              deleteAction={handleDeleteMachineClick}
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}