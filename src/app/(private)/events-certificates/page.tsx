"use client"

import "./style.css"
import React from "react";
import MultiTabs from "@/components/MultiTabs";
import Table, { IRow } from "@/components/Table";
import TabsSkeleton from "@/components/TabsSkeleton";
import DefaultActions from "@/components/DefaultActions";
import { Chip, Drawer, IconButton } from "@mui/material";
import InputText from "@/components/InputText";
import Toast, { DispatchToast, DispatchToastProps } from "@/components/Toast";
import Button from "@/components/Button";
import Combo from "@/components/Combo";
import InputDate from "@/components/InputDate";
import { WorkspacePremium } from "@mui/icons-material";
import { EquipmentEventData, EventData, FindEquipmentsRows, FindEventsRows, ParseToEventIRow } from "@/services/event-certificate";

function FilterDialog(props: {
  equipmentFilter: string, 
  setEquipmentFilter: React.Dispatch<React.SetStateAction<string>>
  assetNumberFilter: number | null, 
  setAssetNumberFilter: React.Dispatch<React.SetStateAction<number | null>>
  identifierNumberFilter: number | null, 
  setIdentifierNumberFilter: React.Dispatch<React.SetStateAction<number | null>>
}) {
  return (
    <div className="event-filter-dialog">
      <InputText
        type='text'
        placeholder='Nome'
        value={props.equipmentFilter}
        className='equipment-filter-input'
        onChange={(event) => { props.setEquipmentFilter(event.target.value) }}
      />
      <InputText
        type='number'
        placeholder='Nro. Identificação'
        value={props.assetNumberFilter || ''}
        className='equipment-filter-input'
        onChange={(event) => { props.setAssetNumberFilter(Number.parseInt(event.target.value)) }}
      />
      <InputText
        type='number'
        placeholder='Nro. Patrimonio'
        value={props.identifierNumberFilter || ''}
        className='equipment-filter-input'
        onChange={(event) => { props.setIdentifierNumberFilter(Number.parseInt(event.target.value)) }}
      />
    </div>
  )
}

function eventRowActions(
  onClickActionUser:  () => void
) {
  return (
    <div className="add-certificate-action">
      <IconButton onClick={() => onClickActionUser()}>
        <WorkspacePremium className="add-certificate-action-icon"/>
      </IconButton>
    </div>
  )
}

export default function EventsCertificates() {
  const [reload, setReload] = React.useState(true);
  const [curTab, setCurTab ] = React.useState(0);

  const [equipmentData, setEquipmentData] = React.useState([] as EquipmentEventData[])
  const [equipmentRows, setEquipmentRows] = React.useState([] as IRow[]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [eventData, setEventData] = React.useState([] as EventData[])
  const [eventRows, setEventRows] = React.useState([] as IRow[]);

  const [eventType, setEventType ] = React.useState("");
  const [eventDescription, setEventDescription ] = React.useState("");
  const [eventAmount, setEventAmount ] = React.useState(0);
  const [eventAmendmentDate, setEventAmendmentDate ] = React.useState("");
  const [certificateNumber, setCertificateNumber ] = React.useState("");
  const [certificateIssuingAuthority, setCertificateIssuingAuthority ] = React.useState("");
  const [certificateDate, setCertificateDate ] = React.useState("");

  const [equipmentId, setEquipmentId] = React.useState(0);
  const [equipmentFilter, setEquipmentFilter ] = React.useState("");
  const [assetNumberFilter, setAssetNumberFilter ] = React.useState(null as number | null);
  const [identifierNumberFilter, setIdentifierNumberFilter ] = React.useState(null as number | null);
  const [openDrawerEvent, setOpenDrawerEvent] = React.useState(false);
  const [openDrawerCertificate, setOpenDrawerCertificate] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState({type: "success", message: ""} as DispatchToastProps);
  
  React.useEffect(() => {
      if (reload) {
        (async () => {
          const equipmentsRowsReply = await FindEquipmentsRows();
          setEquipmentData(equipmentsRowsReply.data);
          setEquipmentRows(equipmentsRowsReply.data.map(x =>{ return {data: [x.id, x.equipamento, x.identificacao, x.numero_patrimonio]} as IRow}));
  
          if (!equipmentsRowsReply.success) {
            setToastMessage({ type: "error", message: "Ocorreu um erro ao buscar as categorias, tente novamente" })
          }
  
          setReload(false);
        })().catch(console.error);
      }
    }, [reload]);
    
    React.useEffect(() => {
      (async () => {
        if (curTab === 0) {
          setEventData([])
          setEventRows([])
        }
        if (curTab === 1) {
          const events = await FindEventsRows(equipmentId);
          setEventData(events.data)
          setEventRows(ParseToEventIRow(events.data))
            
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      })().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [curTab]);
    
    React.useEffect(() => {
      DispatchToast(toastMessage);
    }, [toastMessage])

  return (
    <div className="events">
      {
        reload
        ? <TabsSkeleton tabsNumber={2} />
        : <><MultiTabs
          externalTabsController={curTab}
          setExternalTabsController={setCurTab}
          tabs={[
            {
              header: 'Equipamentos', content: 
              <div className="event-tab">
                <div className="event-tab-header">  
                  <div className="event-tab-header-chip-container">  
                    {!!equipmentId && <Chip className="event-tab-header-chip" label={equipmentData.find(x => x.id === equipmentId)?.equipamento} variant="outlined" />}
                  </div>
                  <DefaultActions 
                    refreshAction={() => {}}
                    filterAction={() => {}}
                    filtersDialog={
                      FilterDialog({
                        equipmentFilter,
                        setEquipmentFilter,
                        assetNumberFilter,
                        setAssetNumberFilter,
                        identifierNumberFilter,
                        setIdentifierNumberFilter,
                    })
                    }
                  />
                </div>
                <div className="event-tab-table">
                  <Table
                    headers={['ID', 'Equipamento', 'Nro. Identificação', 'Nro. Patrimonio']}
                    rows={equipmentRows}
                    className="event-table"
                    rowClick={(row: IRow) => {
                      setEquipmentId(Number.parseInt(row.data[0].toString()));
                    }}
                  />
                </div>
              </div>
            },
            { header: 'Eventos e Certificados', content:
              <div className="event-tab">
                <div className="event-tab-header">
                  <div className="event-tab-header-chip-container" >
                    {!!equipmentId && <Chip className="event-tab-header-chip" label={equipmentData.find(x => x.id === equipmentId)?.equipamento} variant="outlined" />}
                  </div>
                    <DefaultActions 
                      addAction={() => { setOpenDrawerEvent(true); }}
                    />
                </div>
                <div className="event-tab-table">
                  <Table
                    headers={['ID', 'Descrição', 'Tipo', 'Dt. Agendamento', 'Custo']}
                    rows={eventRows}
                    className="event-table"
                    // rowClick={(row: IRow) => {
                    //   const id = Number.parseInt(row.data[0].toString());
                    //   setRoomId(id);

                    //   const room = roomsData.find(x => x.buildId === buildId && x.id === id);
                    //   if (room?.equipments.length) {
                    //     setEquipmentRows( room.equipments.map(x => { return { data: [ x.equipamento, x.identificacao, x.numero_patrimonio ] } as IRow}))
                    //   }
                    //   else {
                    //     setEquipmentRows([]);
                    //   }
                    // }}
                    rowActions={eventRowActions(() => {setOpenDrawerCertificate(true)})}
                  />
                </div>
              </div>
            }
          ]}
        /> 
        <Drawer
          anchor='right'
          open={openDrawerEvent}
          onClose={() => {
          // handleCloseAddCategory();
            setOpenDrawerEvent(false);
          }}
        >
          <div className='event-drawer'>
            <strong className='event-drawer-title'>Cadastrar Evento</strong>

            <div className='event-combo'>
              <Combo
                title="Tipo"
                value={eventType}
                onChange={(value: string | number) => setEventType(value.toString())}
                valuesList={[{value: 'Calibracao', description: 'Calibração'},{value: 'Manutencao', description: 'Manutenção'},{value: 'Qualificao', description: 'Qualificação'},{value: 'Checagem', description: 'Checagem'}]}
                required
                emptyValue
              />
            </div>
            <InputText
              type='text'
              placeholder='Descrição'
              value={eventDescription}
              helperText="teste"
              className='event-input'
              // error={!newlyOpened && !name}
              onChange={(event) => { setEventDescription(event.target.value) }}
            />
            <InputText
              type='amount'
              placeholder='Custo'
              value={eventAmount}
              className='event-input'
              // error={!newlyOpened && !name}
              onChange={(event) => { setEventAmount(Number.parseInt(event.target.value)) }}
            />
            <InputDate 
              label="Dt. Agendamento"
              onChange={(value: string) => setEventAmendmentDate(value)}
              className='event-date-input'
              value={eventAmendmentDate}
              helperText="É obrigatório informar a data do agendamento"
            />
            <Button 
              className="save-button"
              onClick={async () => {
                // const result = await handleAddUCategoryClick();
                // if (result)

                  console.log(eventType);
                  console.log(eventDescription);
                  console.log(eventAmount);
                  console.log(eventAmendmentDate);

                  setOpenDrawerEvent(false);
              }} 
              textContent='Salvar'
            />
          </div>
        </Drawer>
        <Drawer
          anchor='right'
          open={openDrawerCertificate}
          onClose={() => {
          // handleCloseAddCategory();
            setOpenDrawerCertificate(false);
          }}
        >
          <div className='event-drawer'>
            <strong className='event-drawer-title'>Cadastrar Certificado</strong>

            <InputText
              type='number'
              placeholder='Número'
              value={certificateNumber}
              helperText="teste"
              className='event-input'
              // error={!newlyOpened && !name}
              onChange={(event) => { setCertificateNumber(event.target.value) }}
            />
            <InputText
              type='text'
              placeholder='Orgão Expedidor'
              value={certificateIssuingAuthority}
              helperText="teste"
              className='event-input'
              // error={!newlyOpened && !name}
              onChange={(event) => { setCertificateIssuingAuthority(event.target.value) }}
            />
            <InputDate 
              label="Dt. Agendamento"
              onChange={(value: string) => setCertificateDate(value)}
              className='event-date-input'
              value={certificateDate}
              helperText="É obrigatório informar a data do agendamento"
            />
            <Button 
              className="save-button"
              onClick={async () => {
                // const result = await handleAddUCategoryClick();
                // if (result)
                  setOpenDrawerEvent(false);
              }} 
              textContent='Salvar'
            />
          </div>
        </Drawer>
        <Toast />
        </>       
      }
    </div>
  )
}