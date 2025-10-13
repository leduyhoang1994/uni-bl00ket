import useAuthStore from "@/stores/cms-store/auth.store";
import { ComponentType } from "react";
import { Navigate } from "react-router";

export function withAuthProtection<P>(
  WrappedComponent: ComponentType<P>
): React.FC<P> {
  return function ProtectedComponent(props: any) {
    const token = useAuthStore((s) => s.token);
    if (!token) return <Navigate to="/cms/auth/login" replace />;
    return <WrappedComponent {...props} />;
  };
}
