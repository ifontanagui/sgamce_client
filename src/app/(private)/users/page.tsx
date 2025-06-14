"use client"

import './style.css'
import React from 'react';
import DefaultActions from '@/components/DefaultActions';
import Table, { IRow } from "@/components/Table";
import InputText from '@/components/InputText';
import { FormGroup, FormControlLabel, Checkbox, Drawer } from '@mui/material';
import DefaultSkeleton from '@/components/DefaultSkeleton';
import Button from "@/components/Button";
import Toast, { DispatchToast, DispatchToastProps } from '@/components/Toast';
import { CreateUser, EditUser, FindUsersRows, ParseToIRow, UserData } from '@/services/users-service';


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
  const [rows, setRows] = React.useState([] as IRow[]);
  const [data, setData] = React.useState([] as UserData[]);

  const [reload, setReload] = React.useState(true);
  const [id, setId] = React.useState(0);
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
  const [toastMessage, setToastMessage] = React.useState({type: "success", message: ""} as DispatchToastProps);
  
  React.useEffect(() => {
    if (reload) {
      (async () => {
        const usersRowsReply = await FindUsersRows();
        setData(usersRowsReply.data);
        setRows(ParseToIRow(usersRowsReply.data));

        if (!usersRowsReply.success) {
          setToastMessage({ type: "error", message: "Ocorreu um erro ao buscar os usuários, tente novamente" })
        }
        
        setReload(false);
      })().catch(console.error);
    }
  }, [reload]);

  React.useEffect(() => {
    if (isEdit) {
      (async () => {
        const user = data.find(x => x.id === id);
        
        if (user){
          setUsername(user.nome);
          setEmail(user.email);
          setPassword("");
          setConfPassword("");
          setIsAdmin(user.admin)
        }

        setReload(false);
      })().catch(console.error);
    }
  }, [data, id, isEdit, openDrawer]);
    
  React.useEffect(() => {
    DispatchToast(toastMessage);
  }, [toastMessage])
  
  const handleFilterClick = async () => {
    let userRows = data

    if (userFilter) {
      userRows = userRows.filter(x => x.nome.toLocaleLowerCase().includes(userFilter.toLowerCase()))
    };

    setRows(ParseToIRow(userRows))
  }

  const handleAddUserClick = async() => {
    setNewlyOpened(false);

    if (!username || !email) return false;

    if (!password && !isEdit) return false;

    if (!!password && password !== confPassword) {
      setDifferentPassword(true);
      return false;
    }

    if (isEdit){
      const response = await EditUser(id, username, email, isAdmin, password || null)
      if (response.success) {
        setReload(true);
        handleCloseAddUser();

        setToastMessage({type: "success", message:  "Usuário editado com sucesso!"})
      }
      else {
        setToastMessage({type: "error", message:  response.message || "Erro ao editar a usuário, tente novamente"});
      }

      return response.success;
    }
    else {
      const response = await CreateUser(username, email, password, isAdmin)
      if (response.success) {
        setReload(true);
        handleCloseAddUser();

        setToastMessage({type: "success", message:  "Usuário criado com sucesso"});
      }
      else {
        setToastMessage({type: "error", message:  response.message || "Erro ao cadastrar a usuário, tente novamente"});
      }

      return response.success;
    }
  }

  const handleCloseAddUser = () => {   
    setUsername("");
    setEmail("");
    setPassword("");
    setConfPassword("");
    setIsAdmin(false);
    setDifferentPassword(false);
    setNewlyOpened(true);
    setIsEdit(false);
  }

  const handleAddButtonClick = () => {
    setOpenDrawer(true)    
  }
  
  const handleDeleteUserClick = (row: IRow) => {
    // rows = rows.filter(r => r.data[0] !== row.data[0])
    console.log('row: ', row);
    setReload(true);
  }

  const handleEditCategoryAction = (row: IRow) => {
    setId(Number.parseInt(row.data[0].toString()))
    setIsEdit(true)
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
            headers={['ID', 'Nome', 'Email', 'Administrador']}
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
                required={!isEdit}
                value={password}
                hiddenDefaultIcon
                className='user-data-input'
                helperText={!password ? 'É obrigatório informar uma senha' : 'As senhas não conferem'}
                error={differentPassword || (!newlyOpened && !password && !isEdit)}
                onChange={(event) => { setPassword(event.target.value) }}
              />
              <InputText
                type='password'
                placeholder='Confirmar Senha'
                required={!isEdit}
                value={confPassword}
                hiddenDefaultIcon
                className='user-data-input'
                error={differentPassword || (!newlyOpened && !password && !isEdit)}
                helperText={!password && !confPassword ? 'É obrigatório confirmar a senha' : 'As senhas não conferem'}
                onChange={(event) => { setConfPassword(event.target.value) }}
              />
              <FormGroup className='is-admin-checkbox'>
                <FormControlLabel 
                  control={
                    <Checkbox 
                      value={isAdmin}
                      checked={isAdmin}
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
          <Toast />
        </div>
  )
}