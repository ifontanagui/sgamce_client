"use client"

import "./style.css"
import React from "react";
import DefaultActions from "@/components/DefaultActions";
import DefaultSkeleton from "@/components/DefaultSkeleton";
import Table, { IRow } from "@/components/Table";
import InputText from "@/components/InputText";
import Combo from "@/components/Combo";
import { Drawer, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import Button from "@/components/Button";

const OGRows = [
  { data: ['Maquina 01', "Computador", "Dell", "0", "12"] },
  { data: ['Vidraria 01', "Vidraria", "Dell", "12", "0"] },
  { data: ['Maquina 02', "Computador", "Dell", "0", "12"] },
  { data: ['Vidraria 02', "Vidraria", "Dell", "12", "0"] },
  { data: ['Maquina 03', "Computador", "Dell", "0", "12"] },
  { data: ['Vidraria 03', "Vidraria", "Dell", "12", "0"] },
  { data: ['Maquina 04', "Computador", "Dell", "0", "12"] },
  { data: ['Vidraria 04', "Vidraria", "Dell", "12", "0"] },
  { data: ['Maquina 05', "Computador", "Dell", "0", "12"] },
  { data: ['Vidraria 05', "Vidraria", "Dell", "12", "0"] },
] as IRow[];
let rows = OGRows;

function FilterDialog(props: {
  nameFilter: string, 
  setNameFilter: React.Dispatch<React.SetStateAction<string>>
  manufacturerCompanyFilter: string, 
  setManufacturerCompanyFilter: React.Dispatch<React.SetStateAction<string>>
  categoryFilter: string, 
  setCategoryFilter: React.Dispatch<React.SetStateAction<string>>
}) {
  return (
    <div>
      <InputText
        type='text'
        placeholder='Nome'
        value={props.nameFilter}
        className='equipments-filter-input'
        onChange={(event) => { props.setNameFilter(event.target.value) }}
      />
      <InputText
        type='text'
        placeholder='Marca'
        value={props.manufacturerCompanyFilter}
        className='equipments-filter-input'
        onChange={(event) => { props.setManufacturerCompanyFilter(event.target.value) }}
      />
      <div className='equipments-filter-combo'>
        <Combo 
          title="Categoria" 
          value={props.categoryFilter}
          onChange={(value: string | number) => props.setCategoryFilter(value.toString())}
          valuesList={[{description: "Computador", value: "COMPUTADOR"}, {description: "Vidraria", value: "VIDRARIA"}, {description: "Balança", value: "BALANCA"}]}
          emptyValue 
        />
      </div>
    </div>
  )
}

export default function Equipments() {
  const [reload, setReload] = React.useState(true);
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [manufacturerCompany, setManufacturerCompany] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [extraInfos, setExtraInfos] = React.useState("");
  const [calibrationFrequency, setCalibrationFrequency] = React.useState(0);
  const [maintenanceFrequency, setMaintenanceFrequency] = React.useState(0);
  const [analogDigital, setAnalogDigital] = React.useState("D");
  const [nameFilter, setNameFilter] = React.useState("");
  const [manufacturerCompanyFilter, setManufacturerCompanyFilter] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("");
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [newlyOpened, setNewlyOpened] = React.useState(true);
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

    if (!nameFilter && !manufacturerCompanyFilter && !categoryFilter) return;

    if (nameFilter)
      rows = rows.filter(x => x.data[0].toString().toLowerCase().includes(nameFilter.toLowerCase()));

    if (manufacturerCompanyFilter)
      rows = rows.filter(x => x.data[2].toString().toLowerCase().includes(manufacturerCompanyFilter.toLowerCase()));

    if (categoryFilter)
      rows = rows.filter(x => x.data[1].toString().toLowerCase().includes(categoryFilter.toLowerCase()));
  }
  
  const handleAddButtonClick = () => {
    setOpenDrawer(true)    
  }
  
  const handleAddEquipmentClick = async() => {
    setNewlyOpened(false);
    
    if (!name || !category || !manufacturerCompany) return false;

    if (!isEdit)
      rows.push({
        data: [ name, category, manufacturerCompany, calibrationFrequency, maintenanceFrequency ]
      })
    
    setIsEdit(false);
    handleCloseAddEquipment();

    return true;
  } 
  
  const handleCloseAddEquipment = () => {   
    setName("");
    setCategory("");
    setManufacturerCompany("");
    setDescription("");
    setExtraInfos("");
    setCalibrationFrequency(0);
    setMaintenanceFrequency(0);
    setAnalogDigital("D");
    setNewlyOpened(true);
  }
    
  const handleDeleteEquipmentClick = (row: IRow) => {
    rows = rows.filter(r => r.data[0] !== row.data[0])

    setReload(true);
  }
    
  const handleEditEquipmentAction = (row: IRow) => {
    setName(row.data[0].toString());
    setCategory(row.data[1].toString());
    setManufacturerCompany(row.data[2].toString());
    setCalibrationFrequency(Number.parseInt(row.data[3].toString()));
    setMaintenanceFrequency(Number.parseInt(row.data[4].toString()));
    setOpenDrawer(true);
  }

  return (
    reload
      ? <DefaultSkeleton />
      : <div className="equipments">
          <div className="equipments-header">
            <strong className='equipments-header-title'>Maquinas e Equipamentos</strong>
            <DefaultActions
              refreshAction={handleFilterClick}
              filtersDialog={FilterDialog({nameFilter, setNameFilter, manufacturerCompanyFilter, setManufacturerCompanyFilter, categoryFilter, setCategoryFilter})}
              filterAction={handleFilterClick}
              addAction={() => {handleAddButtonClick()}}
            />
          </div>
          <div className="equipments-tab-table">
            <Table
              headers={["Nome", "Categoria", "Marca", "Per. Calibração", "Per. Manutenção"]}
              rows={rows}
              className="equipments-table"
              deleteAction={handleDeleteEquipmentClick}
              editAction={handleEditEquipmentAction}
            />
          </div>
          <Drawer
            anchor='right'
            open={openDrawer}
            onClose={() => {
              handleCloseAddEquipment();
              setOpenDrawer(false);
            }}
          >
            <div className='equipment-drawer'>
              <strong className='equipment-drawer-title'>Cadastrar Equipamento</strong>
              <InputText
                type='text'
                placeholder='Nome'
                required
                value={name}
                className='equipment-data-input'
                error={!newlyOpened && !name}
                helperText='É obrigatório informar o nome'
                onChange={(event) => { setName(event.target.value) }}
              />
              <InputText
                type='text'
                placeholder='Marca'
                required
                value={manufacturerCompany}
                className='equipment-data-input'
                error={!newlyOpened && !manufacturerCompany}
                helperText='É obrigatório informar a marca'
                onChange={(event) => { setManufacturerCompany(event.target.value) }}
              />
              <InputText
                type='text'
                placeholder='Descrição'
                value={description}
                className='equipment-data-input'
                onChange={(event) => { setDescription(event.target.value) }}
                multiline
                defaultRows={5}
              />
              <div className='equipments-combo'>
                <Combo 
                  title="Categoria" 
                  value={category}
                  onChange={(value: string | number) => setCategory(value.toString())}
                  valuesList={[{description: "Computador", value: "Computador"}, {description: "Vidraria", value: "Vidraria"}, {description: "Balança", value: "Balança"}]}
                  emptyValue 
                  required
                />
              </div>
              <InputText
                type='number'
                placeholder='Frequência de Calibração (meses)'
                required
                value={calibrationFrequency}
                className='equipment-data-input'
                helperText='É obrigatório informar a frequência de calibração'
                onChange={(event) => { setCalibrationFrequency(Number.parseInt(event.target.value)) }}
              />
              <InputText
                type='number'
                placeholder='Frequência de Manutenção (meses)'
                required
                value={maintenanceFrequency}
                className='equipment-data-input'
                helperText='É obrigatório informar a frequência de manutenção'
                onChange={(event) => { setMaintenanceFrequency(Number.parseInt(event.target.value)) }}
              />
              <InputText
                type='text'
                placeholder='Informações extras'
                value={extraInfos}
                className='equipment-data-input'
                onChange={(event) => { setExtraInfos(event.target.value) }}
                multiline
                defaultRows={5}
              />
              <RadioGroup 
                className="analog-digital-radios"
                onChange={(event) => setAnalogDigital(event.target.value)}
                value={analogDigital}
              >
                <FormControlLabel
                  control={<Radio className="radio"/>}
                  labelPlacement="start"
                  label="Analógico"
                  value='A'
                />
                <FormControlLabel
                  label="Digital"
                  control={<Radio className="radio" />}
                  value='D'
                />
              </RadioGroup>
              <Button 
                className="save-button"
                onClick={async () => {
                  const result = await handleAddEquipmentClick();
                  if (result)
                    setOpenDrawer(false);
                }} 
                textContent='Salvar'
              />
            </div>
          </Drawer>
        </div>
  );
}



