import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";
import SaleOpenDetails from "@/src/views/Platform/Sales/Sale/SaleOpenDetails";

export default function SaleOpenDetail({params}) {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[1,2,4,6]}
      ComponentIfUser={<SaleOpenDetails saleId={params.id}/>}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
