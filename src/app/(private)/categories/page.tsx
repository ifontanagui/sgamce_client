"use client"

import "./style.css"
import React from "react";
import DefaultSkeleton from "@/components/DefaultSkeleton";
import Table, { IRow } from "@/components/Table";
import DefaultActions from "@/components/DefaultActions";
import InputText from "@/components/InputText";
import Button from "@/components/Button";
import { Drawer } from "@mui/material";
import { CategoryData, CreateCategory, EditCategory, FindCategoriesRows } from "@/services/categories-service";
import Toast, { DispatchToast, DispatchToastProps } from "@/components/Toast";
import { getCookie } from "cookies-next";

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
        className='categories-filter-input'
        onChange={(event) => { props.setNameFilter(event.target.value) }}
      />
    </div>
  )
}

export default function Categories() {
  const userIsAdmin = JSON.parse(getCookie('payload')?.toString() || "{}").admin || false;
  
  const [rows, setRows] = React.useState([] as IRow[]);
  const [data, setData] = React.useState([] as CategoryData[]);

  const [reload, setReload] = React.useState(true);
  const [nameFilter, setNameFilter] = React.useState("");
  const [id, setId] = React.useState(0);
  const [name, setName] = React.useState("");
  const [newlyOpened, setNewlyOpened] = React.useState(true);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState({type: "success", message: ""} as DispatchToastProps);
  
  React.useEffect(() => {
    if (reload) {
      (async () => {
        const categoriesRowsReply = await FindCategoriesRows();
        setData(categoriesRowsReply.data);
        setRows(categoriesRowsReply.data.map(x =>{ return {data: [x.id, x.nome]} as IRow}));

        if (!categoriesRowsReply.success) {
          setToastMessage({ type: "error", message: "Ocorreu um erro ao buscar as categorias, tente novamente" })
        }

        setReload(false);
      })().catch(console.error);
    }
  }, [reload]);

  React.useEffect(() => {
    DispatchToast(toastMessage);
  }, [toastMessage])

  const handleFilterClick = async () => {
    const categoriesRows = !nameFilter
      ? data.map(x =>{ return {data: [x.id, x.nome]} as IRow})
      : data.filter(x => x.nome.toString().toLowerCase().includes(nameFilter.toLowerCase())).map(x =>{ return {data: [x.id, x.nome]} as IRow});

    setRows(categoriesRows);   
  }

  const handleAddUCategoryClick = async() => {
    setNewlyOpened(false);
    
    if (!name) return false;

    if (isEdit){
      const response = await EditCategory(id, name);
      if (response.success) {
        setReload(true);
        setIsEdit(false);
        handleCloseAddCategory();

        setToastMessage({type: "success", message:  "Categoria editada com sucesso!"})
      }
      else {
        setToastMessage({type: "error", message:  response.message || "Erro ao editar a categoria, tente novamente"});
      }

      return response.success;
    }
    else {
      const response = await CreateCategory(name);
      if (response.success) {
        setReload(true);
        setIsEdit(false);
        handleCloseAddCategory();

        setToastMessage({type: "success", message:  "Categoria criada com sucesso"});
      }
      else {
        setToastMessage({type: "error", message:  response.message || "Erro ao cadastrar a categoria, tente novamente"});
      }

      return response.success;
    }
  }

  const handleRefreshUCategoryClick = async() => {
    setNameFilter("");
    setReload(true);

    return true;
  }
  

  const handleCloseAddCategory = () => {   
    setName("");
    setNewlyOpened(true);
  }

  const handleDeleteCategoryClick = (row: IRow) => {
    if (!userIsAdmin) {
      setToastMessage({type: "error", message: "Somente administradores podem remover categorias"})
      return;
    }

    const categoriesRows = rows.filter(r => r.data[0] !== row.data[0])
    setRows(categoriesRows);

    setReload(true);
  }

  const handleEditCategoryAction = (row: IRow) => {
    if (!userIsAdmin) {
      setToastMessage({type: "error", message: "Somente administradores podem editar categorias"})
      return;
    }

    setId(Number.parseInt(row.data[0].toString()));
    setName(row.data[1].toString());
    setOpenDrawer(true);
    setIsEdit(true)
  }

  const handleAddButtonClick = () => {
    if (!userIsAdmin) {
      setToastMessage({type: "error", message: "Somente administradores podem adicionar novas categorias"})
      return;
    }

    setOpenDrawer(true)    
  }
  
  return (
      reload
        ? <DefaultSkeleton />
        : <div className="categories">
            <div className="categories-header">
              <strong className='categories-header-title'>Categorias</strong>
              <DefaultActions
                refreshAction={handleRefreshUCategoryClick}
                filtersDialog={FilterDialog({nameFilter, setNameFilter})}
                filterAction={handleFilterClick}
                addAction={() => {handleAddButtonClick()}}
              />
            </div>
            <Table
              headers={['ID', 'Nome']}
              rows={rows}
              className="categories-table"
              deleteAction={handleDeleteCategoryClick}
              editAction={handleEditCategoryAction}
            />
            <Drawer
              anchor='right'
              open={openDrawer}
              onClose={() => {
              handleCloseAddCategory();
              setOpenDrawer(false);
              }}
            >
              <div className='category-drawer'>
                <strong className='category-drawer-title'>Cadastrar Categoria</strong>
                <InputText
                  type='text'
                  placeholder='Nome'
                  required
                  value={name}
                  className='category-data-input'
                  error={!newlyOpened && !name}
                  helperText='É obrigatório informar o nome da categoria'
                  onChange={(event) => { setName(event.target.value) }}
                />
                <Button 
                  className="save-button"
                  onClick={async () => {
                    const result = await handleAddUCategoryClick();
                    if (result)
                      setOpenDrawer(false);
                  }} 
                  textContent='Salvar'
                />
              </div>
            </Drawer>
            <Toast />
          </div>
  )
}