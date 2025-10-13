import { useEffect, useLayoutEffect, useState } from "react";
import HostController from "../controllers/host.controller";
import { useNavigate, useSearchParams } from "react-router";
import { UrlGenerator } from "@/utils/utils";

export default function tokenRequire<T extends React.ComponentType<any>>(
  Component: T
) {
  return function TokenRequire(props: React.ComponentProps<T>) {
    const [searchParams] = useSearchParams();
    const [hasAccessToken, setHasAccessToken] = useState<boolean | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
      (async () => {
        const accessToken = await HostController.getAccessToken();

        if (!accessToken) {
          setHasAccessToken(false);
          return;
        }

        setHasAccessToken(true);
      })();
    }, [searchParams]);

    if (hasAccessToken === null) {
      return (
        <div className="host-creator">
          <div className="host-creator__header"></div>
          <div className="host-creator__body">
          <div className="body-background-wrapper">
            <div className="body-background"></div>
          </div>
            <div
              className="host-creator__body-content"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div>Loading . . .</div>
            </div>
          </div>
        </div>
      );
    }

    if (!hasAccessToken) {
      navigate(UrlGenerator.AccessDeniedUrl());
      return <div>Access Denied</div>;
    }

    return <Component {...props} />;
  };
}
