import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";
import ProductCategoriesPage from "@/src/views/Platform/ProductCategories/ProductCategoriesPage";

export default function ProductCategories() {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[1,2,3,4,6]}
      ComponentIfUser={<ProductCategoriesPage />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
