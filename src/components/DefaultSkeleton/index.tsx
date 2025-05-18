import "./style.css"
import { Skeleton } from "@mui/material";

export default function DefaultSkeleton() {
  return (
    <div className="skeleton">
        <div className='skeleton-header' >
          <Skeleton animation="wave" variant="rounded" width={'100%'} height={50} />
          <div className='skeleton-header-actions' >
            <Skeleton animation="wave" variant="circular" height={50} width={50} />
            <Skeleton animation="wave" variant="circular" height={50} width={50} />
            <Skeleton animation="wave" variant="circular" height={50} width={50} />
          </div>
        </div>
        <Skeleton animation="wave" variant="rounded" height={"65vh"} />
      </div>
  )
}