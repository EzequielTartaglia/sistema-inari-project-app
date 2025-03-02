import EditStockProductForm from "@/components/forms/platform/stock/stock_products/EditStockProductForm";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function EditProductMeasureUnit({ params }) {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[1, 2, 3, 4, 6, 7]}
      enablePluginsRequireds={[1]}
      ComponentIfUser={<EditStockProductForm stockProductId={params.id} />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
