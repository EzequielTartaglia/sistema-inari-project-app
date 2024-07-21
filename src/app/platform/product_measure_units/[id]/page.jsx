import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";
import ProductMeasureUnitDetailsPage from "@/src/views/Platform/ProductMeasureUnits/MeasureUnit/ProductMeasureUnitDetailsPage";

export default function ProductMeasureUnit({params}) {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[1,2,3,4,6]}
      ComponentIfUser={<ProductMeasureUnitDetailsPage productMeasureUnitId={params.id} />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
