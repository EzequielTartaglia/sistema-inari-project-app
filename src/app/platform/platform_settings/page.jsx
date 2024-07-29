import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";
import PlatformSettingsPage from "@/src/views/Platform/PlatformSettings/PlatformSettingsPage";
import ProductCategoriesPage from "@/src/views/Platform/ProductCategories/ProductCategoriesPage";

export default function PlatformSettings() {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[3, 4, 6]}
      ComponentIfUser={<PlatformSettingsPage />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
