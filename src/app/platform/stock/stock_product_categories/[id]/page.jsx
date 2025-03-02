import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";
import StockProductCategoryDetailsPage from "@/src/views/Platform/Stock/ProductCategories/Category/StockProductCategoryDetailsPage";

export default function ProductCategory({params}) {
  return (
    <ConditionalSessionRender
    AuthorizedUserRoles={[1, 2, 3, 4, 6, 7]}
    enablePluginsRequireds={[1]}
      ComponentIfUser={<StockProductCategoryDetailsPage stockProductCategoryId={params.id} />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
