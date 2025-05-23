"use client"

import "./style.css"
import React from "react";
import DefaultSkeleton from "@/components/DefaultSkeleton";
import Table, { IRow } from "@/components/Table";
import DefaultActions from "@/components/DefaultActions";
import InputText from "@/components/InputText";
import { Drawer } from "@mui/material";
import Button from "@/components/Button";


const OGRows = [
  { data: ["Categoria 00"] },
  { data: ["Categoria 01"] },
  { data: ["Categoria 02"] },
  { data: ["Categoria 03"] },
  { data: ["Categoria 04"] },
  { data: ["Categoria 05"] },
  { data: ["Categoria 06"] },
  { data: ["Categoria 07"] },
  { data: ["Categoria 08"] },
  { data: ["Categoria 09"] },
  { data: ["Categoria 10"] },
] as IRow[];
let rows = OGRows;

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

  const handleAddUCategoryClick = async() => {
    setNewlyOpened(false);
    
    if (!name) return false;

    if (!isEdit)
      rows.push({
        data: [ name ]
      })
    
    setIsEdit(false);
    handleCloseAddUser();

    return true;
  }

  const handleCloseAddUser = () => {   
    setName("");
    setNewlyOpened(true);
  }

  const handleDeleteUserClick = (row: IRow) => {
    rows = rows.filter(r => r.data[0] !== row.data[0])

    setReload(true);
  }

  const handleEditCategoryAction = (row: IRow) => {
    setName(row.data[0].toString());
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
                refreshAction={handleFilterClick}
                filtersDialog={FilterDialog({nameFilter, setNameFilter})}
                filterAction={handleFilterClick}
                addAction={() => {handleAddButtonClick()}}
              />
            </div>
            <Table
              headers={['Nome']}
              rows={rows}
              className="categories-table"
              deleteAction={handleDeleteUserClick}
              editAction={handleEditCategoryAction}
            />
            <Drawer
              anchor='right'
              open={openDrawer}
              onClose={() => {
              handleCloseAddUser();
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