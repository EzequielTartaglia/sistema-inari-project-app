import AddStockProductCategoryForm from "@/components/forms/platform/stock/stock_product_categories/AddStockProductCategoryForm";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function NewProductCategory() {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[1,2,3,4,6]}
      ComponentIfUser={<AddStockProductCategoryForm />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
