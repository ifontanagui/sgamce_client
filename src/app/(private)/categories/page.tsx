"use client"

import "./style.css"
import React from "react";
import DefaultSkeleton from "@/components/DefaultSkeleton";
import Table, { IRow } from "@/components/Table";
import DefaultActions from "@/components/DefaultActions";
import InputText from "@/components/InputText";

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

function AddDrawer(props: {
  name: string, 
  setName: React.Dispatch<React.SetStateAction<string>>
  newlyOpened: boolean
}) {
  return (
    <div className='category-drawer'>
      <strong className='category-drawer-title'>Cadastrar Categoria</strong>
      <InputText
        type='text'
        placeholder='Nome'
        required
        value={props.name}
        className='category-data-input'
        error={!props.newlyOpened && !props.name}
        helperText='É obrigatório informar o nome da categoria'
        onChange={(event) => { props.setName(event.target.value) }}
      />
    </div>
  );
}

export default function Categories() {
  const [reload, setReload] = React.useState(true);
  const [nameFilter, setNameFilter] = React.useState("");
  const [name, setName] = React.useState("");
  const [newlyOpened, setNewlyOpened] = React.useState(true);
  
  React.useEffect(() => {
  if (reload) {
    (async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
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

    rows.push({
      data: [ name ]
    })

    handleCloseAddUser();

    return true;
  }

  const handleCloseAddUser = () => {   
    setName("");
    setNewlyOpened(true);
  }
  
  return (
      reload
        ? <DefaultSkeleton />
        : <div className="categories">
            <div className="categories-header">
              <strong className='categories-header-title'>Categorias</strong>
              <DefaultActions
                refreshAction={handleFilterClick}
                addPage={AddDrawer({ name, setName, newlyOpened })}
                filtersDialog={FilterDialog({nameFilter, setNameFilter})}
                filterAction={handleFilterClick}
                addAction={handleAddUCategoryClick}
                onCloseAddForm={handleCloseAddUser}
              />
            </div>
            <Table
              headers={['Nome']}
              rows={rows}
              className="categories-table"
            />
          </div>
  )
}