import EditProductForm from "@/components/forms/platform/products/EditProductForm";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function EditProductMeasureUnit({params}) {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[1,2,3,4,6]}
      ComponentIfUser={<EditProductForm productId={params.id} />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
