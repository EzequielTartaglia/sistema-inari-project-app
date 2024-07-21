import AddProductCategoryForm from "@/components/forms/platform/product_categories/AddProductCategoryForm";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function NewProductCategory() {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[1,2,3,4,6]}
      ComponentIfUser={<AddProductCategoryForm />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
