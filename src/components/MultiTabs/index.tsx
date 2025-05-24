"use client"

import "./style.css"
import React from "react";
import { AppBar, Tabs, Tab } from "@mui/material";


interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, } = props;

  return (
    <div
      hidden={value !== index}
      className="tab-panel"
      key={`full-width-tabpanel-${index}`}
    >
      {value === index && (
       children
      )}
    </div>
  );
}

interface MultiTabsProps {
  tabs: 
    {
      header: string,
      icon?: React.ReactElement
      content: React.ReactNode,
    }[]
  externalTabsController?: number,
  setExternalTabsController?: React.Dispatch<React.SetStateAction<number>>
}

export default function MultiTabs(props: MultiTabsProps) {
  const [value, setValue] = React.useState(props.externalTabsController || 0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (props.setExternalTabsController)
      props.setExternalTabsController(newValue);
  };

  const tabsHeader: React.ReactNode[] = [];
  const tabsContent: React.ReactNode[] = [];
  props.tabs.forEach((tab, index) => {
    tabsHeader.push(
    <Tab 
      key={`tab-${index}`}
      icon={tab.icon} 
      label={tab.header} 
      className={`tab ${index === value && "selected"}`}
    />)
    tabsContent.push(<TabPanel value={value} index={index}>{tab.content}</TabPanel>)
  })

  return (
    <div className="multi-tabs">
      <AppBar position="static">
        <Tabs
          className="tabs-header"
          value={value}
          onChange={handleChange}
          variant="fullWidth"
        >
          {tabsHeader}
        </Tabs>
      </AppBar>
      <div className="tabs-content">
        {props.tabs.map((tab, index) => 
          <TabPanel key={index} value={value} index={index}>{tab.content}</TabPanel>
        )}
      </div>
    </div>
  )
}