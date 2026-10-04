"use client";
import { useEffect } from "react";
import { useLocation } from "../../common/routerCompat.js";

const ScrollToTop = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    },[location.pathname]);

    return null;

}

export default ScrollToTop;