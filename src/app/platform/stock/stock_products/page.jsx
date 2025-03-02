import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";
import StockProductsPage from "@/src/views/Platform/Stock/StockProducts/StockProductsPage";

export default function Products() {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[1, 2, 3, 4, 6, 7]}
      enablePluginsRequireds={[1]}
      ComponentIfUser={<StockProductsPage />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
