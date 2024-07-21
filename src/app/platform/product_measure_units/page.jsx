import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";
import ProductMeasureUnitsPage from "@/src/views/Platform/ProductMeasureUnits/ProductMeasureUnitsPage";

export default function ProductCategories() {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[1,2,3,4,6]}
      ComponentIfUser={<ProductMeasureUnitsPage />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
