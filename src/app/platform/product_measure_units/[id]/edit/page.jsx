import EditProductMeasureUnitForm from "@/components/forms/platform/product_measure_units/EditProductMeasureUnitForm";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function EditProductMeasureUnit({params}) {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[1,2,3,4,6]}
      ComponentIfUser={<EditProductMeasureUnitForm productMeasureUnitId={params.id} />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
