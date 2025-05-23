'use client'

import React, { ReactElement } from 'react';
import './style.css'
import { FilterList, RefreshOutlined, AddCircleOutline } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import Button from '../Button';

interface DefaultActionsProps {
  refreshAction: React.MouseEventHandler<HTMLButtonElement>,
  filtersDialog: ReactElement;
  filtersDialogClassName?: string;
  filterAction: React.MouseEventHandler<HTMLButtonElement>
  addAction:  () => void
}

export default function DefaultActions(props: DefaultActionsProps) {
  const [openDialog, setOpenDialog] = React.useState(false);

  return (
    <div className='default-actions'>
      <IconButton onClick={props.refreshAction}>
        <RefreshOutlined className='default-actions-icon' />
      </IconButton>
      <IconButton onClick={() => setOpenDialog(true)}>
        <FilterList className='default-actions-icon' />
      </IconButton>
      <IconButton onClick={() => props.addAction()}>
        <AddCircleOutline className='default-actions-icon' />
      </IconButton>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        scroll='paper'
      >
        <div className={`filter-dialog ${props.filtersDialogClassName || ''}`}>
          <strong className='filter-dialog-title'>FILTROS</strong>
          <div className='filter-dialog-content'>
            {props.filtersDialog}
          </div>
          <div className='filter-dialog-execute-button'>
            <Button 
              onClick={(event) => {
                props.filterAction(event);
                setOpenDialog(false);
              }} 
              textContent='Filtrar'
            />
          </div>
        </div>
      </Dialog>
    </div>
    
  )
}
