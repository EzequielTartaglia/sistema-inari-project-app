import AddStockProductForm from "@/components/forms/platform/stock/stock_products/AddStockProductForm";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function AddProduct() {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[1, 2, 3, 4, 6, 7]}
      enablePluginsRequireds={[1]}
      ComponentIfUser={<AddStockProductForm />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
