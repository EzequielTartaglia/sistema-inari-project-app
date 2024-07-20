import EditProductCategoryForm from "@/components/forms/platform/product_categories/EditProductCategoryForm";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function ProductCategories({params}) {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[1,2,3,4,6]}
      ComponentIfUser={<EditProductCategoryForm productCategoryId={params.id} />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
