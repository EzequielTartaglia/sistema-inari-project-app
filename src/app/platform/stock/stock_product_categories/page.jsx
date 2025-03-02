import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";
import StockProductCategoriesPage from "@/src/views/Platform/Stock/ProductCategories/StockProductCategoriesPage";

export default function ProductCategories() {
  return (
    <ConditionalSessionRender
    AuthorizedUserRoles={[1, 2, 3, 4, 6, 7]}
    enablePluginsRequireds={[1]}
      ComponentIfUser={<StockProductCategoriesPage />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
