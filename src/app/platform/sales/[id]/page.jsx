import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";
import SaleOpenDetails from "@/src/views/Platform/Sales/Sale/SaleOpenDetails";

export default function SaleOpenDetail({ params }) {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[1, 2, 3, 4, 6, 7]}
      enablePluginsRequireds={[2]}
      ComponentIfUser={<SaleOpenDetails saleId={params.id} />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
