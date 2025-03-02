import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";
import PlatformUserBusinessesPage from "@/src/views/Platform/UserBussiness/PlatformUserBusinessesPage";

export default function Users() {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[6, 7]}
      ComponentIfUser={<PlatformUserBusinessesPage />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
