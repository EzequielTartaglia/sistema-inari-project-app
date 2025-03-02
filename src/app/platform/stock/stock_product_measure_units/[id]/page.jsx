import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";
import StockProductMeasureUnitDetailsPage from "@/src/views/Platform/Stock/ProductMeasureUnits/MeasureUnit/StockProductMeasureUnitDetailsPage";

export default function ProductMeasureUnit({params}) {
  return (
    <ConditionalSessionRender
    AuthorizedUserRoles={[1, 2, 3, 4, 6, 7]}
    enablePluginsRequireds={[1]}
      ComponentIfUser={<StockProductMeasureUnitDetailsPage stockProductMeasureUnitId={params.id} />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
