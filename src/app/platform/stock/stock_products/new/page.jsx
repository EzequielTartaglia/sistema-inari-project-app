import AddProductForm from "@/components/forms/platform/products/AddProductForm";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function AddProduct() {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[1,2,3,4,6]}
      ComponentIfUser={<AddProductForm />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
