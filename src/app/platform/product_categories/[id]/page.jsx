import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";
import ProductCategoryDetailsPage from "@/src/views/Platform/ProductCategories/Category/ProductCategoryDetailsPage";

export default function ProductCategories({params}) {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[1,2,3,4,6]}
      ComponentIfUser={<ProductCategoryDetailsPage productCategoryId={params.id} />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
