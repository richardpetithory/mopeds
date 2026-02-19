import type {BreadcrumbItem} from "@/components/PageHeader/pageHeader.types.ts"
import {useUserContext} from "@/lib/userContext/userContext.ts"
import {Anchor, Breadcrumbs} from "@mantine/core"
import type {ReactNode} from "react"

interface PageHeaderProps {
  breadCrumbs: BreadcrumbItem[]
  staffActions?: ReactNode
}

export const PageHeader = ({breadCrumbs, staffActions}: PageHeaderProps) => {
  const {currentUser} = useUserContext()

  return (
    <div className={"page-header"}>
      <Breadcrumbs className={"page-breadcrumbs"}>
        {breadCrumbs.map((breadCrumb) =>
          breadCrumb.to ? <Anchor href={breadCrumb.to}>{breadCrumb.label}</Anchor> : <span>{breadCrumb.label}</span>
        )}
      </Breadcrumbs>
      <div className={"flex-auto"} />
      {currentUser?.isStaff && staffActions}
    </div>
  )
}
