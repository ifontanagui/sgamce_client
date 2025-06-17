"use client"

import "./style.css"
import React from "react";
import MultiTabs from "@/components/MultiTabs";
import Table, { IRow } from "@/components/Table";
import TabsSkeleton from "@/components/TabsSkeleton";
import DefaultActions from "@/components/DefaultActions";
import { Chip, Drawer, IconButton, Tooltip } from "@mui/material";
import InputText from "@/components/InputText";
import Toast, { DispatchToast, DispatchToastProps } from "@/components/Toast";
import Button from "@/components/Button";
import Combo from "@/components/Combo";
import InputDate from "@/components/InputDate";
import { WorkspacePremium } from "@mui/icons-material";
import { CreateCertificate, CreateEvent, EditCertificate, EditEvent, EquipmentEventData, EventData, FindEquipmentsRows, ParseToEquipmentIRow, ParseToEventIRow } from "@/services/event-certificate-service";
import { AmountValidate } from "@/utils/amount-validate";

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
      <Tooltip title="Adicionar/editar certificado"> 
        <IconButton onClick={() => onClickActionUser()}>
          <WorkspacePremium className="add-certificate-action-icon"/>
        </IconButton>
      </Tooltip>
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
  const [eventAmount, setEventAmount ] = React.useState("");
  const [eventAmendmentDate, setEventAmendmentDate ] = React.useState("");
  const [certificateNumber, setCertificateNumber ] = React.useState("");
  const [certificateIssuingAuthority, setCertificateIssuingAuthority ] = React.useState("");
  const [certificateDate, setCertificateDate ] = React.useState("");
  const [newlyOpened, setNewlyOpened] = React.useState(true);

  const [equipmentId, setEquipmentId] = React.useState(null as EquipmentEventData | null);
  const [eventId, setEventId] = React.useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [certificateId, setCertificateId] = React.useState(0);
  const [equipmentFilter, setEquipmentFilter ] = React.useState("");
  const [assetNumberFilter, setAssetNumberFilter ] = React.useState(null as number | null);
  const [identifierNumberFilter, setIdentifierNumberFilter ] = React.useState(null as number | null);
  const [openDrawerEvent, setOpenDrawerEvent] = React.useState(false);
  const [openDrawerCertificate, setOpenDrawerCertificate] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState({type: "success", message: ""} as DispatchToastProps);
  
  React.useEffect(() => {
      if (reload) {
        (async () => {
          const equipmentsRowsReply = await FindEquipmentsRows();
          setEquipmentData(equipmentsRowsReply.data);
          setEquipmentRows(ParseToEquipmentIRow(equipmentsRowsReply.data));
  
          if (!equipmentsRowsReply.success) {
            setToastMessage({ type: "error", message: "Ocorreu um erro ao buscar as categorias, tente novamente" })
          }

          if (curTab == 1) {
            const equipment = equipmentsRowsReply.data.find(x => x.id === equipmentId?.id)
            if (equipment) {
              setEventData(equipment.events)
              setEventRows(ParseToEventIRow(equipment.events))
            }       
          }
  
          setReload(false);
        })().catch(console.error);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload]);
    
  React.useEffect(() => {
    (async () => {
      if (curTab === 0) {
        setEventData([])
        setEventRows([])
      }
      if (curTab === 1) {
        const equipment = equipmentData.find(x => x.id === equipmentId?.id)
        if (equipment) {
          setEventData(equipment.events)
          setEventRows(ParseToEventIRow(equipment.events))
        }            
      }
    })().catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curTab]);

   React.useEffect(() => {
    (async () => {
      if (openDrawerEvent) {
        const event = eventData.find(x => x.id === eventId)

        if (event) {
          setEventType(event.tipo);
          setEventDescription(event.descricao);
          setEventAmount(event.custo.toString());
          setEventAmendmentDate(event.data_agendada);
          setIsEdit(true)
        }
      }
    })().catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDrawerEvent]);

   React.useEffect(() => {
    (async () => {
      if (openDrawerCertificate) {
        const certificate = eventData.find(x => x.id === eventId)?.certificado

        if (certificate) {
          setCertificateDate(certificate.data)
          setCertificateIssuingAuthority(certificate.orgao_expedidor);
          setCertificateNumber(certificate.numero.toString())
          setCertificateId(certificate.id)
          setIsEdit(true)
        }
      }
    })().catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDrawerCertificate]);
  
  React.useEffect(() => {
    DispatchToast(toastMessage);
  }, [toastMessage])

  const handleAddEventClick = async () => {    
    setNewlyOpened(false);

    if (!eventType || !eventDescription || !eventAmount || !eventAmendmentDate || !equipmentId) return false;

    if (isEdit) {
      const response = await EditEvent(eventId, eventType, eventAmendmentDate, eventDescription, Number.parseFloat(eventAmount), equipmentId.id);
      if (response.success) {
        setReload(true);
        handleCloseAddEvent();

        setToastMessage({type: "success", message:  "Evento editado com sucesso!"})
      }
      else {
        setToastMessage({type: "error", message:  response.message || "Erro ao editar o evento, tente novamente"});
      }

      return response.success;
    }
    else  {
      const response = await CreateEvent(eventType, eventAmendmentDate, eventDescription, Number.parseFloat(eventAmount), equipmentId.id);
      if (response.success) {
        setReload(true);
        handleCloseAddEvent();

        setToastMessage({type: "success", message:  "Evento criado com sucesso!"})
      }
      else {
        setToastMessage({type: "error", message:  response.message || "Erro ao cadastrar o evento, tente novamente"});
      }

      return response.success;
    }
  }

  const handleCloseAddEvent = () => {
    setEventType("");
    setEventDescription("");
    setEventAmount("");
    setEventAmendmentDate("");
    setOpenDrawerEvent(false);
    setNewlyOpened(true);
    setEventId(0)
    setIsEdit(false);
  }

  const handleAddCertificateClick = async () => {    
    setNewlyOpened(false);

    if (!certificateNumber || !certificateDate || !certificateIssuingAuthority) return false;

    if (isEdit) {
      const response = await EditCertificate(Number.parseInt(certificateNumber), certificateDate, certificateIssuingAuthority, eventId);
      if (response.success) {
        setReload(true);
        handleCloseAddCertificate();

        setToastMessage({type: "success", message:  "Certificado editado com sucesso!"})
      }
      else {
        setToastMessage({type: "error", message:  response.message || "Erro ao editar o certificado, tente novamente"});
      }

      return response.success;
    }
    else {
      const response = await CreateCertificate(Number.parseInt(certificateNumber), certificateDate, certificateIssuingAuthority, eventId);
      if (response.success) {
        setReload(true);
        handleCloseAddCertificate();

        setToastMessage({type: "success", message:  "Certificado criado com sucesso!"})
      }
      else {
        setToastMessage({type: "error", message:  response.message || "Erro ao cadastrar o certificado, tente novamente"});
      }

      return response.success;
    }
  }

  const handleCloseAddCertificate = () => {
    setNewlyOpened(true);
    setCertificateDate("")
    setCertificateIssuingAuthority("");
    setCertificateNumber("")
    setIsEdit(false);
    setOpenDrawerCertificate(false)
    setCertificateId(0)
  }

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
                    {!!equipmentId && <Chip className="event-tab-header-chip" label={`${equipmentId.equipamento} - ${equipmentId.tag}`} variant="outlined" />}
                  </div>
                  <DefaultActions 
                    refreshAction={() => { setReload(true) }}
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
                    headers={['ID', 'Equipamento', 'Nro. Identificação', 'Nro. Patrimonio', 'Eventos Totais']}
                    rows={equipmentRows}
                    className="event-table"
                    rowClick={(row: IRow) => {
                      const equipment = equipmentData.find(x => x.id === Number.parseInt(row.data[0].toString()))
                      setEquipmentId(equipment || null);
                    }}
                  />
                </div>
              </div>
            },
            { header: 'Eventos e Certificados', content:
              <div className="event-tab">
                <div className="event-tab-header">
                  <div className="event-tab-header-chip-container" >
                    {!!equipmentId && <Chip className="event-tab-header-chip" label={`${equipmentId.equipamento} - ${equipmentId.tag}`} variant="outlined" />}
                  </div>
                    <DefaultActions 
                      addAction={() => { setOpenDrawerEvent(true); setEventId(0) }}
                    />
                </div>
                <div className="event-tab-table">
                  <Table
                    headers={['ID', 'Tipo', 'Dt. Agendamento', 'Descrição', 'Custo']}
                    rows={eventRows}
                    className="event-table"
                    rowActions={eventRowActions(() => {setOpenDrawerCertificate(true)})}
                    rowClick={(row: IRow) => { setEventId(Number.parseInt(row.data[0].toString())); }}
                    editAction={() => { setOpenDrawerEvent(true) }}
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
            handleCloseAddEvent();
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
                valuesList={[{value: 'Calibracao', description: 'Calibração'},{value: 'Manutencao', description: 'Manutenção'},{value: 'Qualificao', description: 'Qualificação'},{value: 'Verificacao', description: 'Verificação'}]}
                required
                error={!newlyOpened && !eventType}
                helperText="É obrigatório informar o tipo do evento"
                emptyValue
              />
            </div>
            <InputText
              type='text'
              placeholder='Descrição'
              value={eventDescription}
              helperText="É obrigatório informar a descrição do evento"
              className='event-input'
              error={!newlyOpened && !eventDescription}
              onChange={(event) => { setEventDescription(event.target.value) }}
            />
            <InputText
              type='amount'
              placeholder='Custo'
              value={eventAmount}
              className='event-input'
              error={!newlyOpened && !eventAmount}
              helperText="É obrigatório informar o custo do evento"
              onChange={(event) => { 
                const value = event.target.value.replace(',', '.')

                if (AmountValidate(value)){                                    
                  setEventAmount(value) 
                }
              }}
            />
            <InputDate 
              label="Dt. Agendamento"
              onChange={(value: string) => setEventAmendmentDate(value)}
              className='event-date-input'
              value={eventAmendmentDate}
              error={!newlyOpened && !eventAmendmentDate}
              helperText="É obrigatório informar a data do agendamento"
            />
            <Button 
              className="save-button"
              onClick={async () => {
                const result = await handleAddEventClick();
                if (result)
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
            handleCloseAddCertificate();
            setOpenDrawerCertificate(false);
          }}
        >
          <div className='event-drawer'>
            <strong className='event-drawer-title'>Cadastrar/Editar Certificado</strong>

            <InputText
              type='number'
              placeholder='Número'
              value={certificateNumber}
              helperText="teste"
              className='event-input'
              error={!newlyOpened && !certificateNumber}
              onChange={(event) => { setCertificateNumber(event.target.value) }}
            />
            <InputText
              type='text'
              placeholder='Orgão Expedidor'
              value={certificateIssuingAuthority}
              helperText="teste"
              className='event-input'
              error={!newlyOpened && !certificateIssuingAuthority}
              onChange={(event) => { setCertificateIssuingAuthority(event.target.value) }}
            />
            <InputDate 
              label="Data"
              onChange={(value: string) => setCertificateDate(value)}
              className='event-date-input'
              value={certificateDate}
              error={!newlyOpened && !certificateDate}
              helperText="É obrigatório informar a data do agendamento"
            />
            <Button 
              className="save-button"
              onClick={async () => {
                const result = await handleAddCertificateClick();
                if (result)
                  setOpenDrawerEvent(false);
              }} 
              textContent='Salvar'
            />
          </div>
        </Drawer>
        </>       
      }
      <Toast />
    </div>
  )
}