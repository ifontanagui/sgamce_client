"use client"

import './style.css'
import React from 'react';
import DefaultActions from '@/components/DefaultActions';
import Table, { IRow } from "@/components/Table";
import InputText from '@/components/InputText';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import DefaultSkeleton from '@/components/DefaultSkeleton';

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

function AddDrawer(props: {
  username: string, 
  setUsername: React.Dispatch<React.SetStateAction<string>>
  email: string, 
  setEmail: React.Dispatch<React.SetStateAction<string>>
  password: string, 
  setPassword: React.Dispatch<React.SetStateAction<string>>
  confPassword: string, 
  setConfPassword: React.Dispatch<React.SetStateAction<string>>
  isAdmin: boolean, 
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>
  differentPassword: boolean
  newlyOpened: boolean
}) {
  return (
    <div className='user-drawer'>
      <strong className='user-drawer-title'>Cadastrar Usuário</strong>
      <InputText
        type='text'
        placeholder='Nome'
        required
        value={props.username}
        className='user-data-input'
        error={!props.newlyOpened && !props.username}
        helperText='É obrigatório informar o nome do usuário'
        onChange={(event) => { props.setUsername(event.target.value) }}
      />
      <InputText
        type='email'
        placeholder='Email'
        required
        value={props.email}
        hiddenDefaultIcon
        className='user-data-input'
        error={!props.newlyOpened && !props.email}
        helperText='É obrigatório informar o email do usuário'
        onChange={(event) => { props.setEmail(event.target.value) }}
      />
      <InputText
        type='password'
        placeholder='Senha'
        required
        value={props.password}
        hiddenDefaultIcon
        className='user-data-input'
        helperText={!props.password ? 'É obrigatório informar uma senha' : 'As senhas não conferem'}
        error={props.differentPassword || (!props.newlyOpened && !props.password)}
        onChange={(event) => { props.setPassword(event.target.value) }}
      />
      <InputText
        type='password'
        placeholder='Confirmar Senha'
        required
        value={props.confPassword}
        hiddenDefaultIcon
        className='user-data-input'
        error={props.differentPassword || (!props.newlyOpened && !props.password)}
        helperText={!props.password && !props.confPassword ? 'É obrigatório confirmar a senha' : 'As senhas não conferem'}
        onChange={(event) => { props.setConfPassword(event.target.value) }}
      />
      <FormGroup className='is-admin-checkbox'>
        <FormControlLabel 
          control={
            <Checkbox 
              value={props.isAdmin}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => { props.setIsAdmin(event.target.checked); }}
            />
          } 
          label="Administrador" />
      </FormGroup>
    </div>
  );
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
  
  React.useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    if (reload) {
      fetchData()
        .catch(console.error);

      setReload(false);
    }
  }, [reload])
  
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

    rows.push({
      data: [ username, email,isAdmin ]
    })

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

  return (
    reload
      ? <DefaultSkeleton />
      : <div className="users">
          <div className="users-header">
            <strong className='users-header-title'>Gerenciamento de Usuários</strong>
            <DefaultActions
              refreshAction={handleFilterClick}
              addPage={AddDrawer({ username, setUsername, email, setEmail, password, setPassword, confPassword, setConfPassword, isAdmin, setIsAdmin, differentPassword, newlyOpened })}
              filtersDialog={FilterDialog({userFilter, setUserFilter})}
              filtersDialogClassName='user-filter-dialog'
              filterAction={handleFilterClick}
              addAction={handleAddUserClick}
              onCloseAddForm={handleCloseAddUser}
            />
          </div>
          <Table
            headers={['Nome', 'Email', 'Administrador']}
            rows={rows}
            className="users-table"
          />
        </div>
  )
}
