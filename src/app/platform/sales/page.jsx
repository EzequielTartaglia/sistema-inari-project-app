import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";
import SalesPage from "@/src/views/Platform/Sales/SalesPage";

export default function Sales() {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[1,2,4,6]}
      ComponentIfUser={<SalesPage />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
