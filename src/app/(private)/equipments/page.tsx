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
import { CreateEquipment, EditEquipment, EquipmentData, FindEquipmentsRows, ParseToIRow } from "@/services/equipments-service";
import { CategoryData, FindCategoriesRows } from "@/services/categories-service";
import Toast, { DispatchToast, DispatchToastProps } from "@/components/Toast";
import { getCookie } from "cookies-next";


function FilterDialog(props: {
  nameFilter: string,
  setNameFilter: React.Dispatch<React.SetStateAction<string>>
  manufacturerCompanyFilter: string,
  setManufacturerCompanyFilter: React.Dispatch<React.SetStateAction<string>>
  categories: CategoryData[];
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
          valuesList={props.categories.map(x => { return { value: x.id, description: x.nome } })}
          emptyValue
        />
      </div>
    </div>
  )
}

export default function Equipments() {
  const userIsAdmin = JSON.parse(getCookie('payload')?.toString() || "{}").admin || false;

  const [rows, setRows] = React.useState([] as IRow[]);
  const [data, setData] = React.useState([] as EquipmentData[]);
  const [categoriesData, setCategoriesData] = React.useState([] as CategoryData[]);

  const [reload, setReload] = React.useState(true);
  const [id, setId] = React.useState(0);
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
  const [toastMessage, setToastMessage] = React.useState({type: "success", message: ""} as DispatchToastProps);


  React.useEffect(() => {
    if (reload) {
      (async () => {

        const [equipmentsRowsReply, categoriesRowsReply] = await Promise.all([
          FindEquipmentsRows(),
          FindCategoriesRows()
        ]);

        setData(equipmentsRowsReply.data);
        setRows(ParseToIRow(equipmentsRowsReply.data));
        setCategoriesData(categoriesRowsReply.data);

        setReload(false);
      })().catch(console.error);
    }
  }, [reload]);

  React.useEffect(() => {
    if (isEdit) {
      (async () => {
        const equipment = data.find(x => x.id === id);
        
        if (equipment){
          setName(equipment.equipamento)
          setManufacturerCompany(equipment.marca);
          setDescription(equipment.identificacao)
          setCategory(equipment.id_categoria?.toString() || "");
          setCalibrationFrequency(equipment.periodicidade_calibracao);
          setMaintenanceFrequency(equipment.periodicidade_manutencao);
          setExtraInfos(equipment.criterio_aceitacao_calibracao)
          setAnalogDigital(equipment.tipo);
        }

        setReload(false);
      })().catch(console.error);
    }
  }, [openDrawer]);
  
  React.useEffect(() => {
    DispatchToast(toastMessage);
  }, [toastMessage])


  const handleFilterClick = async () => {
    let equipmentsRows = data;

    if (!!nameFilter)
      equipmentsRows = equipmentsRows.filter(x => x.equipamento.toString().toLowerCase().includes(nameFilter.toLowerCase()));

    if (!!manufacturerCompanyFilter)
      equipmentsRows = equipmentsRows.filter(x => x.marca.toString().toLowerCase().includes(manufacturerCompanyFilter.toLowerCase()));

    if (!!categoryFilter)
      equipmentsRows = equipmentsRows.filter(x => x.id_categoria?.toString().toLowerCase().includes(categoryFilter.toLowerCase()));
  
    setRows(ParseToIRow(equipmentsRows));
  }

  const handleRefreshEquipmentClick = async() => {
    setNameFilter("");
    setManufacturerCompanyFilter("");
    setCategoryFilter("");
    setReload(true);

    return true;
  }

  const handleAddButtonClick = () => {
    if (!userIsAdmin) {
      setToastMessage({type: "error", message: "Somente administradores podem adicionar novos equipamentos"})
      return;
    }

    setOpenDrawer(true)
  }

  const handleAddEquipmentClick = async() => {
    setNewlyOpened(false);

    if (!name || !category || !manufacturerCompany ) return false;

    if (isEdit){
      const numero_patrimonio = data.find(x => x.id === id)?.numero_patrimonio;

      const response = await EditEquipment(id, name, description, manufacturerCompany, Number(category), calibrationFrequency, maintenanceFrequency, extraInfos, analogDigital, numero_patrimonio);
      if (response.success) {
        setReload(true);
        setIsEdit(false);
        handleCloseAddEquipment();

        setToastMessage({type: "success", message:  "Categoria editada com sucesso!"})
      }
      else {
        setToastMessage({type: "error", message:  response.message || "Erro ao editar a categoria, tente novamente"});
      }

      return response.success;
    }
    else {
      const response = await CreateEquipment(name, description, manufacturerCompany, Number(category), calibrationFrequency, maintenanceFrequency, extraInfos, analogDigital);
      if (response.success) {
        setReload(true);
        setIsEdit(false);
        handleCloseAddEquipment();

        setToastMessage({type: "success", message:  "Categoria criada com sucesso"});
      }
      else {
        setToastMessage({type: "error", message:  response.message || "Erro ao cadastrar a categoria, tente novamente"});
      }

      return response.success;
    }
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
    setIsEdit(false);
  }

  const handleDeleteEquipmentClick = (row: IRow) => {
    if (!userIsAdmin) {
      setToastMessage({type: "error", message: "Somente administradores podem remover equipamentos"})
      return;
    }

    // rows = rows.filter(r => r.data[0] !== row.data[0])
    console.log(row);
    setReload(true);
  }

  const handleEditEquipmentAction = (row: IRow) => {
    if (!userIsAdmin) {
      setToastMessage({type: "error", message: "Somente administradores podem editar equipamentos"})
      return;
    }

    setId(Number.parseInt(row.data[0].toString()))
    setIsEdit(true)
    setOpenDrawer(true);
  }

  return (
    reload
      ? <DefaultSkeleton />
      : <div className="equipments">
          <div className="equipments-header">
            <strong className='equipments-header-title'>Maquinas e Equipamentos</strong>
            <DefaultActions
              refreshAction={handleRefreshEquipmentClick}
              filtersDialog={FilterDialog({
                nameFilter, 
                setNameFilter, 
                manufacturerCompanyFilter, 
                setManufacturerCompanyFilter, 
                categories: categoriesData, 
                categoryFilter,
                setCategoryFilter
              })}
              filterAction={handleFilterClick}
              addAction={() => {handleAddButtonClick()}}
            />
          </div>
          <div className="equipments-tab-table">
            <Table
              headers={["ID", "Nome", "Categoria", "Marca", "Per. Calibração (anos)", "Per. Manutenção (anos)"]}
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
                required
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
                  valuesList={categoriesData.map(x => { return { value: x.id, description: x.nome } })}
                  emptyValue
                  required
                />
              </div>
              <InputText
                type='number'
                placeholder='Frequência de Calibração (anos)'
                required
                value={calibrationFrequency}
                className='equipment-data-input'
                helperText='É obrigatório informar a frequência de calibração'
                onChange={(event) => { setCalibrationFrequency(Number.parseInt(event.target.value)) }}
              />
              <InputText
                type='number'
                placeholder='Frequência de Manutenção (anos)'
                required
                value={maintenanceFrequency}
                className='equipment-data-input'
                helperText='É obrigatório informar a frequência de manutenção'
                onChange={(event) => { setMaintenanceFrequency(Number.parseInt(event.target.value)) }}
              />
              <InputText
                type='text'
                placeholder='Critérios de Aceitação'
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
          <Toast />
        </div>
  );
}



