import type {BreadcrumbItem} from "@/components/PageHeader/pageHeader.types.ts"
import {useRiderContext} from "@/lib/userContext/riderContext.ts"
import {Anchor, Breadcrumbs} from "@mantine/core"
import type {ReactNode} from "react"

interface PageHeaderProps {
  breadCrumbs: BreadcrumbItem[]
  staffActions?: ReactNode
  adminActions?: ReactNode
}

export const PageHeader = ({breadCrumbs, staffActions, adminActions}: PageHeaderProps) => {
  const {currentRider} = useRiderContext()

  return (
    <div className={"page-header"}>
      <Breadcrumbs className={"page-breadcrumbs"}>
        {breadCrumbs.map((breadCrumb) =>
          breadCrumb.to ? <Anchor href={breadCrumb.to}>{breadCrumb.label}</Anchor> : <span>{breadCrumb.label}</span>
        )}
      </Breadcrumbs>
      <div className={"flex-auto"} />
      <div className={"flex gap-4"}>
        {currentRider?.isStaff && staffActions}
        {currentRider?.isSuperuser && adminActions}
      </div>
    </div>
  )
}
