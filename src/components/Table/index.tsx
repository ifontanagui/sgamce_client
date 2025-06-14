'use client'

import './style.css'
import React from 'react';
import { KeyboardArrowUp, Check, Clear, Delete, Edit }  from '@mui/icons-material';
import { Collapse, IconButton, Table as MUITable, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';

export interface IRow {
  data: (string | number | boolean)[],
  subList?: {
    title: string,
    headers: string[],
    rows?: (string | number)[][];
  }
}

interface TableProps {
  headers: string[],
  rows: IRow[],
  editAction?(row: IRow): void,
  deleteAction?(row: IRow): void,
  className?: string
  rowActions?: React.ReactNode
  rowClick?(row: IRow, index: number): void
}

interface RowProps {
  row: IRow;
  withSubList: boolean
  editAction?(row: IRow): void
  deleteAction?(row: IRow): void
  emptyTable?: boolean
  rowActions?: React.ReactNode
  rowClick?(row: IRow, index: number): void
  index?: number
}

function Row({ row, withSubList, editAction, deleteAction, emptyTable, rowActions, rowClick, index }: RowProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow 
        className={`table-row ${withSubList ? 'clickable' : 'not-clickable'}`} 
        onClick={() => { 
            if (rowClick) 
              rowClick(row, index !== undefined ? index : -1); 
          }}
      >
          {withSubList &&
          <TableCell className='table-row-sublist-list-header-cell-icon' >
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              <KeyboardArrowUp className={`open-close-sublist-icon ${open ? 'open' : 'close'}`} />
            </IconButton>
          </TableCell>
        }
        {!emptyTable && 
        <>
          {deleteAction &&
          <TableCell className='table-row-sublist-list-header-cell-icon' >
            <IconButton onClick={() => deleteAction(row)}><Delete className='delete' /></IconButton>
          </TableCell>}
          {editAction &&
          <TableCell className='table-row-sublist-list-header-cell-icon' >
            <IconButton onClick={() => editAction(row)}><Edit className='edit' /></IconButton>
          </TableCell>}
          {!!rowActions && <TableCell className='table-row-sublist-list-header-cell-icon' >{rowActions}</TableCell>}
        </>
        }
        {row.data.map(r => (
            <TableCell key={Math.random()} align="left" onClick={() => setOpen(!open)}>
              {
                typeof r !== 'boolean'
                  ? <TableCell className='table-row-cell-content' key={Math.random()}>{r}</TableCell>
                  : <TableCell className='table-row-cell-content' key={Math.random()}>
                      {r 
                        ? <Check className='table-row-cell-content-icon' /> 
                        : <Clear className='table-row-cell-content-icon' />}
                    </TableCell>
              }
            </TableCell>
        ))}
      </TableRow>
      {withSubList &&
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit className='table-row-sublist' >
            <strong className='table-row-sublist-title'>
              {row.subList?.title}
            </strong>
            <TableContainer className='table-row-sublist-content' sx={{ maxHeight:250 }}>
              <MUITable stickyHeader size="small" aria-label="purchases sticky table" className='table-row-sublist-list'>
                <TableHead className='table-row-sublist-list-header'>
                  <TableRow>
                    {row.subList?.headers.map(x => (
                      <TableCell 
                        key={Math.random()} 
                        align="left"
                        className='table-row-sublist-list-header-cell'
                      >
                        {x}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody className='table-row-sublist-list-row' >
                  {row.subList?.rows?.length
                    ? row.subList?.rows.map((subRow) => (
                      <TableRow 
                        key={Math.random()}
                        className='table-row-sublist-list-row-cell'
                      >
                        {subRow.map(x =>
                          typeof x !== 'boolean'
                            ? <TableCell className='table-row-sublist-list-row-cell' key={Math.random()}>
                                <span className='table-row-sublist-list-row-cell-content' >{x}</span>
                              </TableCell>
                            : <TableCell className='table-row-sublist-list-row-cell' key={Math.random()}>
                            {
                              x ? <Check className='table-row-sublist-list-row-cell-content-icon' /> : <Clear className='table-row-sublist-list-row-cell-content-icon' />
                            }
                            </TableCell>
                        )}
                      </TableRow>
                    ))
                    : 
                      <TableRow className='table-row-sublist-list-row-cell' key={Math.random()}>
                        <TableCell className='table-row-sublist-list-row-cell-content' key={Math.random()}>Nenhum dado encontrado</TableCell>
                      </TableRow>
                  }
                </TableBody>
              </MUITable>
            </TableContainer>
          </Collapse>
        </TableCell>
      </TableRow>}
    </>
  );
}

export default function Table({ headers, rows, editAction, deleteAction, className, rowActions, rowClick }: TableProps ) {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const haveSubList = rows.some(x => !!x.subList);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <TableContainer className={className}>
        <MUITable className='table' stickyHeader sx={{ overflow: 'auto', height: 'auto', maxHeight: '100%', minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead >
            <TableRow >
              {haveSubList && <TableCell className='table-header' />}
              {rows.length > 0 &&
                <>
                  {deleteAction && <TableCell className='table-header' />}
                  {editAction && <TableCell className='table-header' />}
                  {rowActions && <TableCell className='table-header' />}
                </>
              }
              {headers.map(x => 
                <TableCell className='table-header' align="left" key={Math.random()}>
                  {<strong className='table-header-cell'>{x}</strong>}
                </TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length 
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <Row
                  key={index}
                  row={row}
                  withSubList={haveSubList}
                  deleteAction={deleteAction}
                  editAction={editAction}
                  rowActions={rowActions}
                  rowClick={rowClick}
                  index={index}
                />
              ))
                : 
              <Row
                key={"table-empty"}
                row={{ data: headers.map((x, index) => index === 0 ? "Nenhum dado encontrado" : "")}}
                withSubList={false}
                emptyTable
              />
            }
          </TableBody>
        </MUITable>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{ overflow: "hidden" }}
      />
    </>
  );
}