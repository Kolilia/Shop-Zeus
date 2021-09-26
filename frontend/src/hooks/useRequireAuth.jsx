import { autoEffect } from "@risingstack/react-easy-state";
import { useHistory } from "react-router-dom";
import auth from "../store/auth";

export const useRequireAuth = (roles, redirectUrl = "/login") => {
  const history = useHistory();

  autoEffect(() => {
    const shouldBeRoles = auth?.profile?.roles?.some((role) =>
      roles?.includes(role)
    );

    if (!shouldBeRoles) {
      history.replace(redirectUrl, { from: window.location.pathname });
    }
  });
};
