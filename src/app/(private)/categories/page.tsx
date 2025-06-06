"use client"

import "./style.css"
import React from "react";
import DefaultSkeleton from "@/components/DefaultSkeleton";
import Table, { IRow } from "@/components/Table";
import DefaultActions from "@/components/DefaultActions";
import InputText from "@/components/InputText";
import Button from "@/components/Button";
import { Drawer } from "@mui/material";
import { CreateCategory, EditCategory, FindCategoriesRows } from "@/services/categories-service";

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
  const [rows, setRows] = React.useState([] as IRow[]);
  const [OGrows, setOGRows] = React.useState([] as IRow[]);

  const [reload, setReload] = React.useState(true);
  const [nameFilter, setNameFilter] = React.useState("");
  const [id, setId] = React.useState(0);
  const [name, setName] = React.useState("");
  const [newlyOpened, setNewlyOpened] = React.useState(true);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  
  React.useEffect(() => {
    if (reload) {
      (async () => {
        const categoriesRows = await FindCategoriesRows();
        setOGRows(categoriesRows);
        setRows(categoriesRows);

        setReload(false);
      })().catch(console.error);
    }
  }, [reload]);

  const handleFilterClick = async () => {
    const categoriesRows = !nameFilter
      ? OGrows
      : OGrows.filter(x => x.data[1].toString().toLowerCase().includes(nameFilter.toLowerCase()));

    setRows(categoriesRows);   
  }

  const handleAddUCategoryClick = async() => {
    setNewlyOpened(false);
    
    if (!name) return false;

    if (isEdit){
      await EditCategory(id, name)
    }
    else {
      await CreateCategory(name);
    }
    
    setReload(true);
    setIsEdit(false);
    handleCloseAddCategory();

    return true;
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
    const categoriesRows = rows.filter(r => r.data[0] !== row.data[0])
    setRows(categoriesRows);

    setReload(true);
  }

  const handleEditCategoryAction = (row: IRow) => {
    setId(Number.parseInt(row.data[0].toString()));
    setName(row.data[1].toString());
    setOpenDrawer(true);
  }

  const handleAddButtonClick = () => {
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
          </div>
  )
}