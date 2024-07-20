import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";
import ProductsPage from "@/src/views/Platform/Products/ProductsPage";

export default function Products() {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[1,2,3,4,6]}
      ComponentIfUser={<ProductsPage />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
