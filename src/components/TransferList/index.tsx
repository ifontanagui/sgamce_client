import React from "react";
import InputText from "../InputText";
import "./style.css"
import { Button, Card, Checkbox, Grid, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"

interface TransferListProps {
  leftList: string[]
  rightList: string[]
}

const customList = (items: readonly string[]) => (
    <Card className="table-transfer-table-list">
      <List
        dense
        component="div"
        role="list"
      >
        {items.map((value: string) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItemButton
              key={value}
              role="listitem"
              className="table-transfer-table-list-item"
              // onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  // checked={checked.includes(value)}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`List item ${value + 1}`} />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

export default function TransferList(props: TransferListProps) {
  const [leftFilter, setLeftFilter] = React.useState("");
  const [rightFilter, setRightFilter] = React.useState("");

  return (
    <Grid
      container
      spacing={2}
      className="table-transfer"
    >
      <div className="table-transfer-side">
        <Grid className="table-transfer-table">{customList(props.leftList)}</Grid>
        <InputText className="table-transfer-filter" placeholder="Filtrar" type="text" value={leftFilter} onChange={(event) => setLeftFilter(event.target.value)} />
      </div>
      <Grid>
        <Grid container direction="column" sx={{ alignItems: 'center' }}>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            // onClick={handleCheckedRight}
            // disabled={leftChecked.length === 0}
            className="table-transfer-button"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            // onClick={handleCheckedLeft}
            // disabled={rightChecked.length === 0}
            className="table-transfer-button"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <div className="table-transfer-side">
        <Grid className="table-transfer-table">{customList(props.rightList)}</Grid>
        <InputText className="table-transfer-filter" placeholder="Filtrar" type="text" value={rightFilter} onChange={(event) => setRightFilter(event.target.value)} />
      </div>
    </Grid>
  )
}