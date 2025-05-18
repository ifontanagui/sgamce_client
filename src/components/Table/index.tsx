'use client'

import './style.css'
import React from 'react';
import { KeyboardArrowUp, Check, Clear}  from '@mui/icons-material';
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
  className?: string
}

interface RowProps {
  row: IRow;
  withSubList: boolean
}

function Row({ row, withSubList }: RowProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow 
        className={`table-row ${withSubList ? 'clickable' : 'not-clickable'}`} 
        onClick={() => setOpen(!open)}
      >
          {withSubList &&
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              <KeyboardArrowUp className={`open-close-sublist-icon ${open ? 'open' : 'close'}`} />
            </IconButton>
          </TableCell>
        }
        {row.data.map(r => (
            <TableCell key={Math.random()} align="left">
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
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
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
                  {row.subList?.rows 
                    ? row.subList?.rows.map((subRow) => (
                      <TableRow 
                        key={Math.random()}
                        className='table-row-sublist-list-row-cell'
                      >
                        {subRow.map(x =>
                          typeof x !== 'boolean'
                            ? <TableCell className='table-row-sublist-list-row-cell' key={Math.random()}>{x}</TableCell>
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
      </TableRow>
    </>
  );
}

export default function Table({ headers, rows, className }: TableProps ) {
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
    <div>
      <TableContainer className={className}>
        <MUITable className='table' stickyHeader sx={{ overflow: 'auto', height: 'auto', maxHeight: '100%', minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead >
            <TableRow >
              {haveSubList && <TableCell className='table-header' />}
              {headers.map(x => 
                <TableCell className='table-header' align="left" key={Math.random()}>
                  {<strong className='table-header-cell'>{x}</strong>}
                </TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <Row
                key={Math.random()}
                row={row}
                withSubList={haveSubList}
              />
            ))}
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
      />
    </div>
  );
}