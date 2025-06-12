import React from "react";
import "./style.css"
import { Skeleton } from "@mui/material";

interface TabsSkeletonProps {
  tabsNumber: number
}

export default function TabsSkeleton(props: TabsSkeletonProps) {
  const tabs = [] as React.ReactNode[];
  const tabWidth = Math.trunc(100 / props.tabsNumber);
  for (let index = 0; index < props.tabsNumber; index++) {
    tabs.push(
      <Skeleton 
        className={index === 0 ? "first" : ""} 
        animation="wave" 
        variant="rounded" 
        width={`${tabWidth}%`} 
        height={index === 0 ? 80 : 65} 
      />
    )
  }

  return (
    <div className="skeleton">
        <div className="skeleton-tabs">
          {tabs}
        </div>
        <Skeleton className="skeleton-tab" animation="wave" variant="rounded" height={"65vh"} />
      </div>
  )
}