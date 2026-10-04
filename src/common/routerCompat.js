"use client";

// react-router-dom v6 compatibility layer over next/navigation (MIGRATION_PLAN.md phase 5).

import { useCallback, useRef, useSyncExternalStore } from "react";
import NextLink from "next/link";
import { useParams as useNextParams, usePathname, useRouter } from "next/navigation";

const NAV_STATE_KEY = "routerCompat.navState";

function readStateMap() {
  if (typeof window === "undefined") return {};
  try {
    var raw = window.sessionStorage.getItem(NAV_STATE_KEY);
    var parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (err) {
    return {};
  }
}

function writeStateMap(map) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(NAV_STATE_KEY, JSON.stringify(map));
  } catch (err) {
    /* ignore quota / private mode errors */
  }
}

export function setNavState(path, state) {
  var map = readStateMap();
  map[path] = state;
  writeStateMap(map);
}

export function getNavState(path) {
  return readStateMap()[path];
}

export function clearNavState(path) {
  var map = readStateMap();
  if (Object.prototype.hasOwnProperty.call(map, path)) {
    delete map[path];
    writeStateMap(map);
  }
}

function splitPath(href) {
  var value = String(href);
  var q = value.indexOf("?");
  var h = value.indexOf("#");
  var end = value.length;
  if (q >= 0) end = Math.min(end, q);
  if (h >= 0) end = Math.min(end, h);
  return value.slice(0, end);
}

export function useParams() {
  return useNextParams();
}

function subscribeToSearch(onStoreChange) {
  window.addEventListener("popstate", onStoreChange);
  return function () {
    window.removeEventListener("popstate", onStoreChange);
  };
}

function getSearchSnapshot() {
  if (typeof window === "undefined") return "";
  return window.location.search || "";
}

function getServerSearchSnapshot() {
  return "";
}

export function useLocation() {
  var pathname = usePathname();
  var search = useSyncExternalStore(subscribeToSearch, getSearchSnapshot, getServerSearchSnapshot);

  // Stable object identity: consumers use [location] as an effect dependency
  // (Home, Donors, Navbar) so a fresh object on every render would loop.
  var cache = useRef({ key: null, value: null });
  var key = pathname + "|" + search;
  if (cache.current.key !== key) {
    cache.current = {
      key: key,
      value: {
        pathname: pathname,
        search: search,
        hash: "",
        state: readStateMap()[pathname],
        key: key,
      },
    };
  }
  return cache.current.value;
}

export function useNavigate() {
  var router = useRouter();
  return useCallback(
    function (to, options) {
      if (typeof to === "number") {
        router.back();
        return;
      }
      var href = to == null ? "" : String(to);
      var path = splitPath(href);
      var opts = options || {};
      if (opts.state !== undefined) {
        setNavState(path, opts.state);
      } else {
        clearNavState(path);
      }
      // scroll:false keeps ScrollToTop the single scroll authority (CRA parity).
      if (opts.replace) {
        router.replace(href, { scroll: false });
      } else {
        router.push(href, { scroll: false });
      }
    },
    [router]
  );
}

function toHref(to) {
  if (to == null || to === false) return "";
  if (typeof to === "string") return to;
  if (Array.isArray(to)) return to.join("");
  if (typeof to === "object" && typeof to.pathname === "string") {
    return to.pathname + (to.search || "") + (to.hash || "");
  }
  return String(to);
}

var ROUTER_ONLY_PROPS = [
  "to",
  "state",
  "replace",
  "reloadDocument",
  "relative",
  "preventScrollReset",
  "end",
  "caseSensitive",
];

function pickRest(props) {
  var rest = {};
  for (var key in props) {
    if (Object.prototype.hasOwnProperty.call(props, key) && ROUTER_ONLY_PROPS.indexOf(key) === -1) {
      rest[key] = props[key];
    }
  }
  return rest;
}

export function Link(props) {
  var href = toHref(props.to);
  var rest = pickRest(props);
  // `to` unset (react-router falls back to the current location) -> inert anchor
  if (!href) return <a {...rest} />;
  return <NextLink href={href} scroll={false} {...rest} />;
}
Link.displayName = "Link";

function isActivePath(pathname, href) {
  var target = splitPath(href);
  if (!target) return false;
  if (pathname === target) return true;
  var base = target.replace(/\/+$/, "");
  if (!base) return pathname.charAt(0) === "/";
  return pathname.indexOf(base + "/") === 0;
}

function isActivePathEnd(pathname, href) {
  var target = splitPath(href);
  if (!target) return false;
  var base = target.replace(/\/+$/, "");
  if (!base) return pathname === "/" || pathname === "";
  return pathname === base || pathname === base + "/";
}

export function NavLink(props) {
  var to = props.to;
  var end = props.end;
  var className = props.className;
  var style = props.style;
  var pathname = usePathname();
  var href = toHref(to);
  // react-router v6 defaults `end` to true when `to` is the root path, so
  // `<NavLink to="/">` is active only on "/" (verified against the CRA build's
  // rendered DOM: the navbar brand is NOT `active` on subpages).
  var rootTarget = splitPath(href).replace(/\/+$/, "");
  var useEnd = end == null ? rootTarget === "" : end;
  var active = useEnd ? isActivePathEnd(pathname, href) : isActivePath(pathname, href);

  var own =
    typeof className === "function"
      ? className({ isActive: active, isPending: false, isTransitioning: false })
      : className;
  var merged = [own, active ? "active" : ""].filter(Boolean).join(" ");

  var rest = pickRest(props);
  if (!href) {
    return (
      <a
        {...rest}
        className={merged || undefined}
        style={style}
        aria-current={active ? "page" : undefined}
      />
    );
  }
  return (
    <NextLink
      href={href}
      scroll={false}
      {...rest}
      className={merged || undefined}
      style={style}
      aria-current={active ? "page" : undefined}
    />
  );
}
NavLink.displayName = "NavLink";

export default Link;
