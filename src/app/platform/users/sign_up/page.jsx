import SignUpForm from "@/components/forms/login/SignUpForm";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function SignUp() {
  return (
    <ConditionalSessionRender
    AuthorizedUserRoles={[2, 3, 4, 6, 7]}
    ComponentIfUser={<SignUpForm />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
