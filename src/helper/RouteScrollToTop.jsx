
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
const RouteScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Safety: if user navigates away from public pages,
    // ensure zoom-layout class doesn't linger.
    if (
      !(
        pathname === "/" ||
        pathname.startsWith("/tournament-view/") ||
        pathname.startsWith("/club-all-tournaments/")
      )
    ) {
      document.body.classList.remove("sp-home-zoom-layout");
      document.documentElement.classList.remove("sp-ios-touch", "sp-ios-chrome");
    }
  }, [pathname]);

  return null;
};

export default RouteScrollToTop;
