import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";
import StockProductMeasureUnitsPage from "@/src/views/Platform/Stock/ProductMeasureUnits/StockProductMeasureUnitsPage";

export default function ProductCategories() {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[1,2,3,4,6]}
      ComponentIfUser={<StockProductMeasureUnitsPage />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
