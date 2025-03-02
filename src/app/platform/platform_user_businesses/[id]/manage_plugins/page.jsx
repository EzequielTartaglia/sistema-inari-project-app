import ManagePlatformUserBusinessPluginsForm from "@/components/forms/platform/platform_user_businesses/ManagePlatformUserBusinessPluginsForm";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function ManagePlatformUserBusinessPlugins({params}) {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[6, 7]}
      ComponentIfUser={<ManagePlatformUserBusinessPluginsForm platformUserBusinessId={params.id} />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
