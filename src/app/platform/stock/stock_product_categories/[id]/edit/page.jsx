import EditStockProductCategoryForm from "@/components/forms/platform/stock/stock_product_categories/EditStockProductCategoryForm";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function EditProductCategory({params}) {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[1,2,3,4,6]}
      ComponentIfUser={<EditStockProductCategoryForm stockProductCategoryId={params.id} />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
