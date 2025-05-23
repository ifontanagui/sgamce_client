"use client"

import './style.css'
import React from 'react';
import DefaultActions from '@/components/DefaultActions';
import Table, { IRow } from "@/components/Table";
import InputText from '@/components/InputText';
import { FormGroup, FormControlLabel, Checkbox, Drawer } from '@mui/material';
import DefaultSkeleton from '@/components/DefaultSkeleton';
import Button from "@/components/Button";

const OGRows = [
  { data: ['Renato Heitor Nascimento', 'rhnascimento@ucs.br', true], subList: { headers: ["Bloco", "Sala"], title: "Salas", rows: [["Bloco A", 201],["Bloco A", 202],["Bloco A", 203],["Bloco A", 204],["Bloco A", 205],["Bloco A", 206],["Bloco A", 207],["Bloco A", 208],["Bloco A", 209],] } },
  { data: ['Nicole Isabel Chaves', 'nichaves@ucs.br', false] },
  { data: ['Letícia Analu Luzia Aragão', 'lalaragao@ucs.br', false] },
  { data: ['Emanuel Jorge Lopes', 'ejlopes@ucs.br', false] },
  { data: ['Yago Igor Ricardo Aragão', 'yiraragao@ucs.br', true] },
  { data: ['Nina Maya Maria Sales', 'nmmsales@ucs.br', false], subList: { headers: ["Bloco", "Sala"], title: "Salas" } },
  { data: ['Guilherme Mário Joaquim Sartori', 'gmjsartori@ucs.br', false], subList: { headers: ["Bloco", "Sala"], title: "Salas", rows: [["Bloco A", 201],["Bloco A", 202],["Bloco A", 203],["Bloco A", 204],["Bloco A", 205],["Bloco A", 206],["Bloco A", 207],] } },
  { data: ['Yago Igor Ricardo Aragão', 'yiraragao@ucs.br', false] },
  { data: ['Kauê Yuri Mendes', 'ykymendes@ucs.br', false] },
  { data: ['Mariana Oliva', 'moliva@ucs.br', false] },
  { data: ['Felipe Samuel Benedito Figueiredo', 'fsbfigueiredo@ucs.br', false] },
  { data: ['Kamilly Yasmin Marlene', 'kymarlene@ucs.br', true] },
  { data: ['Mariah Francisca Daniela Castro', 'mfdcastro@ucs.br', false] },
  { data: ['Antonella Aurora Esther', 'aaesther@ucs.br', false] },
] as IRow[];
let rows = OGRows;


function FilterDialog(props: {
  userFilter: string, 
  setUserFilter: React.Dispatch<React.SetStateAction<string>>
}) {
  return (
    <div>
      <InputText
        type='text'
        placeholder='Nome'
        value={props.userFilter}
        className='username-filter-input'
        onChange={(event) => { props.setUserFilter(event.target.value) }}
      />
    </div>
  )
}

export default function Users() {
  const [reload, setReload] = React.useState(true);
  const [userFilter, setUserFilter] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confPassword, setConfPassword] = React.useState("");
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [newlyOpened, setNewlyOpened] = React.useState(true);
  const [differentPassword, setDifferentPassword] = React.useState(false);
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

    if (!userFilter) return;

    rows = rows.filter(x => x.data[0].toString().toLowerCase().includes(userFilter.toLowerCase()));
  }

  const handleAddUserClick = async() => {
    setNewlyOpened(false);

    if (!username || !email || !password) return false;

    if (password !== confPassword) {
      setDifferentPassword(true);
      return false;
    }
    
    if (!isEdit)
      rows.push({
        data: [ username, email,isAdmin ]
      })
    
    setIsEdit(false);
    handleCloseAddUser();

    return true;
  }

  const handleCloseAddUser = () => {   
    setUsername("");
    setEmail("");
    setPassword("");
    setConfPassword("");
    setIsAdmin(false);
    setDifferentPassword(false);
    setNewlyOpened(true);
  }

  const handleAddButtonClick = () => {
    setOpenDrawer(true)    
  }
  
  const handleDeleteUserClick = (row: IRow) => {
    rows = rows.filter(r => r.data[0] !== row.data[0])

    setReload(true);
  }

  const handleEditCategoryAction = (row: IRow) => {
    setUsername(row.data[0].toString());
    setEmail(row.data[1].toString());
    setPassword("132123123113");
    setConfPassword("132123123113");
    setIsAdmin(!row.data[2]);

    setOpenDrawer(true);
  }


  return (
    reload
      ? <DefaultSkeleton />
      : <div className="users">
          <div className="users-header">
            <strong className='users-header-title'>Gerenciamento de Usuários</strong>
            <DefaultActions
              refreshAction={handleFilterClick}
              filtersDialog={FilterDialog({userFilter, setUserFilter})}
              filtersDialogClassName='user-filter-dialog'
              filterAction={handleFilterClick}
              addAction={() => {handleAddButtonClick()}}
            />
          </div>
          <Table
            headers={['Nome', 'Email', 'Administrador']}
            rows={rows}
            className="users-table"
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
            <div className='user-drawer'>
              <strong className='user-drawer-title'>Cadastrar Usuário</strong>
              <InputText
                type='text'
                placeholder='Nome'
                required
                value={username}
                className='user-data-input'
                error={!newlyOpened && !username}
                helperText='É obrigatório informar o nome do usuário'
                onChange={(event) => { setUsername(event.target.value) }}
              />
              <InputText
                type='email'
                placeholder='Email'
                required
                value={email}
                hiddenDefaultIcon
                className='user-data-input'
                error={!newlyOpened && !email}
                helperText='É obrigatório informar o email do usuário'
                onChange={(event) => { setEmail(event.target.value) }}
              />
              <InputText
                type='password'
                placeholder='Senha'
                required
                value={password}
                hiddenDefaultIcon
                className='user-data-input'
                helperText={!password ? 'É obrigatório informar uma senha' : 'As senhas não conferem'}
                error={differentPassword || (!newlyOpened && !password)}
                onChange={(event) => { setPassword(event.target.value) }}
              />
              <InputText
                type='password'
                placeholder='Confirmar Senha'
                required
                value={confPassword}
                hiddenDefaultIcon
                className='user-data-input'
                error={differentPassword || (!newlyOpened && !password)}
                helperText={!password && !confPassword ? 'É obrigatório confirmar a senha' : 'As senhas não conferem'}
                onChange={(event) => { setConfPassword(event.target.value) }}
              />
              <FormGroup className='is-admin-checkbox'>
                <FormControlLabel 
                  control={
                    <Checkbox 
                      value={isAdmin}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setIsAdmin(event.target.checked); }}
                    />
                  } 
                  label="Administrador" />
              </FormGroup>
              <Button 
                className="save-button"
                onClick={async () => {
                  const result = await handleAddUserClick();
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
