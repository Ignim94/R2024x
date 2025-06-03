import { resolveDirective as W, withDirectives as $, openBlock as l, createElementBlock as r, normalizeClass as y, createCommentVNode as p, renderSlot as S, createTextVNode as x, toDisplayString as g, mergeProps as z, toHandlers as fe, watch as X, unref as F, ref as L, getCurrentScope as ln, onScopeDispose as on, onMounted as Je, nextTick as pt, getCurrentInstance as ls, computed as R, watchEffect as Ke, createVNode as I, Transition as Me, withCtx as C, createElementVNode as m, resolveComponent as b, Fragment as B, withModifiers as Q, createBlock as _, Teleport as gt, normalizeStyle as M, vShow as me, renderList as V, pushScopeId as pe, popScopeId as ge, inject as se, defineComponent as je, resolveDynamicComponent as vt, shallowReactive as Se, markRaw as yt, reactive as Ne, isRef as an, h as ie, vModelSelect as Et, createStaticVNode as rn, vModelText as os, normalizeProps as rt, guardReactiveProps as ut, withKeys as Pe, vModelRadio as jt, toValue as it, onUnmounted as un, createSlots as dn, render as bt } from "vue";
const Te = {
  props: {
    color: {
      type: String,
      default: () => "default"
    }
  }
}, K = {
  props: {
    disabled: {
      type: Boolean,
      default: () => !1
    }
  }
}, O = (e, s) => {
  const t = e.__vccOpts || e;
  for (const [i, o] of s)
    t[i] = o;
  return t;
}, cn = {
  name: "vu-badge",
  mixins: [Te, K],
  emits: ["close", "selected", "update:modelValue"],
  props: {
    value: {
      type: Boolean,
      default: () => {
      }
    },
    text: {
      type: String,
      default: () => ""
    },
    icon: {
      type: String,
      default: () => ""
    },
    selectable: {
      type: Boolean,
      default: () => !1
    },
    togglable: {
      type: Boolean,
      default: () => !0
    },
    closable: {
      type: Boolean,
      default: () => !1
    }
  },
  data() {
    return {
      isSelected: !1
    };
  },
  computed: {
    classes() {
      return [
        "vu-badge",
        `badge-root badge badge-${this.color}`,
        {
          "badge-closable": this.closable,
          "badge-selectable": this.selectable,
          disabled: this.disabled,
          "badge-selected": this.isSelected || this.value
        }
      ];
    },
    iconClasses() {
      return `fonticon fonticon-${this.icon} badge-icon`;
    },
    showContent() {
      return typeof this.$slots.default == "function" || this.text;
    }
  },
  methods: {
    onClickOutside() {
      this.selectable && this.value === void 0 && this.togglable && (this.isSelected = !1);
    },
    selectBadge() {
      this.selectable && (this.value === void 0 && (this.isSelected = this.togglable ? !this.isSelected : !0), this.$emit("selected", this.isSelected), this.$emit("update:modelValue", this.isSelected));
    }
  }
}, hn = {
  key: 1,
  class: "badge-content"
};
function fn(e, s, t, i, o, n) {
  const a = W("click-outside");
  return $((l(), r("span", {
    class: y(n.classes),
    onClick: s[1] || (s[1] = (d) => n.selectBadge(d))
  }, [
    t.icon ? (l(), r("span", {
      key: 0,
      class: y(n.iconClasses)
    }, null, 2)) : p("", !0),
    n.showContent ? (l(), r("span", hn, [
      S(e.$slots, "default", {}, () => [
        x(g(t.text), 1)
      ], !0)
    ])) : p("", !0),
    t.closable ? (l(), r("span", {
      key: 2,
      class: "fonticon fonticon-cancel",
      onClick: s[0] || (s[0] = (d) => e.$emit("close"))
    })) : p("", !0)
  ], 2)), [
    [a, n.onClickOutside]
  ]);
}
const _t = /* @__PURE__ */ O(cn, [["render", fn], ["__scopeId", "data-v-548733c3"]]), mn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _t
}, Symbol.toStringTag, { value: "Module" })), pn = /^on[^a-z]/, gn = (e) => pn.test(e), ce = (e, s) => {
  const t = {};
  for (const i in e)
    gn(i) && (t[s ? i[2].toLowerCase() + i.slice(3) : i] = e[i]);
  return t;
}, vn = {
  name: "vu-icon",
  mixins: [Te],
  data: () => ({
    getListenersFromAttrs: ce
  }),
  props: {
    icon: {
      required: !0,
      type: String
    },
    withinText: {
      default: !0,
      type: Boolean
    }
  }
};
function yn(e, s, t, i, o, n) {
  return l(), r("span", z({
    class: ["vu-icon fonticon", [t.withinText ? "fonticon-within-text" : "", `fonticon-${t.icon}`, `${e.color}`]]
  }, fe(e.getListenersFromAttrs(e.$attrs), !0)), null, 16);
}
const H = /* @__PURE__ */ O(vn, [["render", yn], ["__scopeId", "data-v-5f019d76"]]), bn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: H
}, Symbol.toStringTag, { value: "Module" }));
var N = {}, le, oe;
function dt() {
  throw new Error("setTimeout has not been defined");
}
function ct() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    typeof setTimeout == "function" ? le = setTimeout : le = dt;
  } catch {
    le = dt;
  }
  try {
    typeof clearTimeout == "function" ? oe = clearTimeout : oe = ct;
  } catch {
    oe = ct;
  }
})();
function as(e) {
  if (le === setTimeout)
    return setTimeout(e, 0);
  if ((le === dt || !le) && setTimeout)
    return le = setTimeout, setTimeout(e, 0);
  try {
    return le(e, 0);
  } catch {
    try {
      return le.call(null, e, 0);
    } catch {
      return le.call(this, e, 0);
    }
  }
}
function _n(e) {
  if (oe === clearTimeout)
    return clearTimeout(e);
  if ((oe === ct || !oe) && clearTimeout)
    return oe = clearTimeout, clearTimeout(e);
  try {
    return oe(e);
  } catch {
    try {
      return oe.call(null, e);
    } catch {
      return oe.call(this, e);
    }
  }
}
var ue = [], xe = !1, we, Ge = -1;
function wn() {
  !xe || !we || (xe = !1, we.length ? ue = we.concat(ue) : Ge = -1, ue.length && rs());
}
function rs() {
  if (!xe) {
    var e = as(wn);
    xe = !0;
    for (var s = ue.length; s; ) {
      for (we = ue, ue = []; ++Ge < s; )
        we && we[Ge].run();
      Ge = -1, s = ue.length;
    }
    we = null, xe = !1, _n(e);
  }
}
N.nextTick = function(e) {
  var s = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var t = 1; t < arguments.length; t++)
      s[t - 1] = arguments[t];
  ue.push(new us(e, s)), ue.length === 1 && !xe && as(rs);
};
function us(e, s) {
  this.fun = e, this.array = s;
}
us.prototype.run = function() {
  this.fun.apply(null, this.array);
};
N.title = "browser";
N.browser = !0;
N.env = {};
N.argv = [];
N.version = "";
N.versions = {};
function he() {
}
N.on = he;
N.addListener = he;
N.once = he;
N.off = he;
N.removeListener = he;
N.removeAllListeners = he;
N.emit = he;
N.prependListener = he;
N.prependOnceListener = he;
N.listeners = function(e) {
  return [];
};
N.binding = function(e) {
  throw new Error("process.binding is not supported");
};
N.cwd = function() {
  return "/";
};
N.chdir = function(e) {
  throw new Error("process.chdir is not supported");
};
N.umask = function() {
  return 0;
};
function Qe(e) {
  return ln() ? (on(e), !0) : !1;
}
function J(e) {
  return typeof e == "function" ? e() : F(e);
}
const ds = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const kn = Object.prototype.toString, Sn = (e) => kn.call(e) === "[object Object]", Cn = () => +Date.now(), de = () => {
}, In = /* @__PURE__ */ Bn();
function Bn() {
  var e, s;
  return ds && ((e = window == null ? void 0 : window.navigator) == null ? void 0 : e.userAgent) && (/iP(ad|hone|od)/.test(window.navigator.userAgent) || ((s = window == null ? void 0 : window.navigator) == null ? void 0 : s.maxTouchPoints) > 2 && /iPad|Macintosh/.test(window == null ? void 0 : window.navigator.userAgent));
}
function On(e, s) {
  function t(...i) {
    return new Promise((o, n) => {
      Promise.resolve(e(() => s.apply(this, i), { fn: s, thisArg: this, args: i })).then(o).catch(n);
    });
  }
  return t;
}
function Vn(e, s = {}) {
  let t, i, o = de;
  const n = (d) => {
    clearTimeout(d), o(), o = de;
  };
  return (d) => {
    const u = J(e), f = J(s.maxWait);
    return t && n(t), u <= 0 || f !== void 0 && f <= 0 ? (i && (n(i), i = null), Promise.resolve(d())) : new Promise((c, h) => {
      o = s.rejectOnCancel ? h : c, f && !i && (i = setTimeout(() => {
        t && n(t), i = null, c(d());
      }, f)), t = setTimeout(() => {
        i && n(i), i = null, c(d());
      }, u);
    });
  };
}
function $n(e) {
  return e || ls();
}
function Rt(e, s = 200, t = {}) {
  return On(
    Vn(s, t),
    e
  );
}
function wt(e, s = !0, t) {
  $n() ? Je(e, t) : s ? e() : pt(e);
}
function xn(e, s = {}) {
  var t;
  const i = L((t = s.initialValue) != null ? t : null);
  return X(
    e,
    () => i.value = Cn(),
    s
  ), i;
}
function Mn(e, s, t) {
  return X(
    e,
    (i, o, n) => {
      i && s(i, o, n);
    },
    t
  );
}
function j(e) {
  var s;
  const t = J(e);
  return (s = t == null ? void 0 : t.$el) != null ? s : t;
}
const ve = ds ? window : void 0;
function q(...e) {
  let s, t, i, o;
  if (typeof e[0] == "string" || Array.isArray(e[0]) ? ([t, i, o] = e, s = ve) : [s, t, i, o] = e, !s)
    return de;
  Array.isArray(t) || (t = [t]), Array.isArray(i) || (i = [i]);
  const n = [], a = () => {
    n.forEach((c) => c()), n.length = 0;
  }, d = (c, h, v, k) => (c.addEventListener(h, v, k), () => c.removeEventListener(h, v, k)), u = X(
    () => [j(s), J(o)],
    ([c, h]) => {
      if (a(), !c)
        return;
      const v = Sn(h) ? { ...h } : h;
      n.push(
        ...t.flatMap((k) => i.map((w) => d(c, k, w, v)))
      );
    },
    { immediate: !0, flush: "post" }
  ), f = () => {
    u(), a();
  };
  return Qe(f), f;
}
let Ut = !1;
function Pn(e, s, t = {}) {
  const { window: i = ve, ignore: o = [], capture: n = !0, detectIframe: a = !1 } = t;
  if (!i)
    return de;
  In && !Ut && (Ut = !0, Array.from(i.document.body.children).forEach((v) => v.addEventListener("click", de)), i.document.documentElement.addEventListener("click", de));
  let d = !0;
  const u = (v) => o.some((k) => {
    if (typeof k == "string")
      return Array.from(i.document.querySelectorAll(k)).some((w) => w === v.target || v.composedPath().includes(w));
    {
      const w = j(k);
      return w && (v.target === w || v.composedPath().includes(w));
    }
  }), c = [
    q(i, "click", (v) => {
      const k = j(e);
      if (!(!k || k === v.target || v.composedPath().includes(k))) {
        if (v.detail === 0 && (d = !u(v)), !d) {
          d = !0;
          return;
        }
        s(v);
      }
    }, { passive: !0, capture: n }),
    q(i, "pointerdown", (v) => {
      const k = j(e);
      d = !u(v) && !!(k && !v.composedPath().includes(k));
    }, { passive: !0 }),
    a && q(i, "blur", (v) => {
      setTimeout(() => {
        var k;
        const w = j(e);
        ((k = i.document.activeElement) == null ? void 0 : k.tagName) === "IFRAME" && !(w != null && w.contains(i.document.activeElement)) && s(v);
      }, 0);
    })
  ].filter(Boolean);
  return () => c.forEach((v) => v());
}
function Ln(e) {
  return typeof e == "function" ? e : typeof e == "string" ? (s) => s.key === e : Array.isArray(e) ? (s) => e.includes(s.key) : () => !0;
}
function qe(...e) {
  let s, t, i = {};
  e.length === 3 ? (s = e[0], t = e[1], i = e[2]) : e.length === 2 ? typeof e[1] == "object" ? (s = !0, t = e[0], i = e[1]) : (s = e[0], t = e[1]) : (s = !0, t = e[0]);
  const {
    target: o = ve,
    eventName: n = "keydown",
    passive: a = !1,
    dedupe: d = !1
  } = i, u = Ln(s);
  return q(o, n, (c) => {
    c.repeat && J(d) || u(c) && t(c);
  }, a);
}
function Tn() {
  const e = L(!1);
  return ls() && Je(() => {
    e.value = !0;
  }), e;
}
function kt(e) {
  const s = Tn();
  return R(() => (s.value, !!e()));
}
function An(e, s = {}) {
  const { window: t = ve } = s, i = kt(() => t && "matchMedia" in t && typeof t.matchMedia == "function");
  let o;
  const n = L(!1), a = (f) => {
    n.value = f.matches;
  }, d = () => {
    o && ("removeEventListener" in o ? o.removeEventListener("change", a) : o.removeListener(a));
  }, u = Ke(() => {
    i.value && (d(), o = t.matchMedia(J(e)), "addEventListener" in o ? o.addEventListener("change", a) : o.addListener(a), n.value = o.matches);
  });
  return Qe(() => {
    u(), d(), o = void 0;
  }), n;
}
function Fn(e, s, t = {}) {
  const { window: i = ve, ...o } = t;
  let n;
  const a = kt(() => i && "MutationObserver" in i), d = () => {
    n && (n.disconnect(), n = void 0);
  }, u = X(
    () => j(e),
    (h) => {
      d(), a.value && i && h && (n = new MutationObserver(s), n.observe(h, o));
    },
    { immediate: !0 }
  ), f = () => n == null ? void 0 : n.takeRecords(), c = () => {
    d(), u();
  };
  return Qe(c), {
    isSupported: a,
    stop: c,
    takeRecords: f
  };
}
function cs(e, s, t = {}) {
  const { window: i = ve, ...o } = t;
  let n;
  const a = kt(() => i && "ResizeObserver" in i), d = () => {
    n && (n.disconnect(), n = void 0);
  }, u = R(() => Array.isArray(e) ? e.map((h) => j(h)) : [j(e)]), f = X(
    u,
    (h) => {
      if (d(), a.value && i) {
        n = new ResizeObserver(s);
        for (const v of h)
          v && n.observe(v, o);
      }
    },
    { immediate: !0, flush: "post", deep: !0 }
  ), c = () => {
    d(), f();
  };
  return Qe(c), {
    isSupported: a,
    stop: c
  };
}
function Dn(e, s = {}) {
  const {
    reset: t = !0,
    windowResize: i = !0,
    windowScroll: o = !0,
    immediate: n = !0
  } = s, a = L(0), d = L(0), u = L(0), f = L(0), c = L(0), h = L(0), v = L(0), k = L(0);
  function w() {
    const T = j(e);
    if (!T) {
      t && (a.value = 0, d.value = 0, u.value = 0, f.value = 0, c.value = 0, h.value = 0, v.value = 0, k.value = 0);
      return;
    }
    const D = T.getBoundingClientRect();
    a.value = D.height, d.value = D.bottom, u.value = D.left, f.value = D.right, c.value = D.top, h.value = D.width, v.value = D.x, k.value = D.y;
  }
  return cs(e, w), X(() => j(e), (T) => !T && w()), Fn(e, w, {
    attributeFilter: ["style", "class"]
  }), o && q("scroll", w, { capture: !0, passive: !0 }), i && q("resize", w, { passive: !0 }), wt(() => {
    n && w();
  }), {
    height: a,
    bottom: d,
    left: u,
    right: f,
    top: c,
    width: h,
    x: v,
    y: k,
    update: w
  };
}
function zn(e, s = { width: 0, height: 0 }, t = {}) {
  const { window: i = ve, box: o = "content-box" } = t, n = R(() => {
    var h, v;
    return (v = (h = j(e)) == null ? void 0 : h.namespaceURI) == null ? void 0 : v.includes("svg");
  }), a = L(s.width), d = L(s.height), { stop: u } = cs(
    e,
    ([h]) => {
      const v = o === "border-box" ? h.borderBoxSize : o === "content-box" ? h.contentBoxSize : h.devicePixelContentBoxSize;
      if (i && n.value) {
        const k = j(e);
        if (k) {
          const w = i.getComputedStyle(k);
          a.value = Number.parseFloat(w.width), d.value = Number.parseFloat(w.height);
        }
      } else if (v) {
        const k = Array.isArray(v) ? v : [v];
        a.value = k.reduce((w, { inlineSize: T }) => w + T, 0), d.value = k.reduce((w, { blockSize: T }) => w + T, 0);
      } else
        a.value = h.contentRect.width, d.value = h.contentRect.height;
    },
    t
  );
  wt(() => {
    const h = j(e);
    h && (a.value = "offsetWidth" in h ? h.offsetWidth : s.width, d.value = "offsetHeight" in h ? h.offsetHeight : s.height);
  });
  const f = X(
    () => j(e),
    (h) => {
      a.value = h ? s.width : 0, d.value = h ? s.height : 0;
    }
  );
  function c() {
    u(), f();
  }
  return {
    width: a,
    height: d,
    stop: c
  };
}
function Nn(e = {}) {
  const {
    window: s = ve,
    initialWidth: t = Number.POSITIVE_INFINITY,
    initialHeight: i = Number.POSITIVE_INFINITY,
    listenOrientation: o = !0,
    includeScrollbar: n = !0
  } = e, a = L(t), d = L(i), u = () => {
    s && (n ? (a.value = s.innerWidth, d.value = s.innerHeight) : (a.value = s.document.documentElement.clientWidth, d.value = s.document.documentElement.clientHeight));
  };
  if (u(), wt(u), q("resize", u, { passive: !0 }), o) {
    const f = An("(orientation: portrait)");
    X(f, () => u());
  }
  return { width: a, height: d };
}
const Ae = {
  props: {
    show: { type: [Boolean, Object], default: !1 }
  },
  emits: ["update:show"],
  data() {
    return {
      innerShow: !1
    };
  },
  watch: {
    show: {
      immediate: !0,
      handler(e) {
        this.innerShow = !!e;
      }
    },
    innerShow(e) {
      !!e !== this.show && this.$emit("update:show", e);
    }
  }
}, St = (e) => {
  const s = typeof e;
  return s === "boolean" || s === "string" ? !0 : e.nodeType === Node.ELEMENT_NODE;
}, Ct = {
  name: "detachable",
  props: {
    attach: {
      default: () => !1,
      validator: St
    },
    contentClass: {
      type: [String, Object],
      default: ""
    },
    contentStyle: {
      type: [String, Object],
      default: () => ""
    }
  },
  data: () => ({
    hasDetached: !1,
    // the final value of renderTo
    target: null
  }),
  inject: {
    vuDebug: {
      default: !0
    }
  },
  watch: {
    attach() {
      this.hasDetached = !1, this.initDetach();
    }
  },
  mounted() {
    this.initDetach();
  },
  methods: {
    initDetach() {
      if (this._isDestroyed || this.hasDetached || this.attach === "" || this.attach === !0 || this.attach === "attach")
        return;
      let e;
      if (this.attach ? typeof this.attach == "string" ? e = document.querySelector(this.attach) : e = this.attach : e = document.body, !e) {
        this.vuDebug && console.warn(`Unable to locate target ${this.attach}`, this);
        return;
      }
      this.vuDebug && e.tagName.toLowerCase() !== "body" && window.getComputedStyle(e).position !== "relative" && console.warn(`target (${e.tagName.toLowerCase()}${e.id && ` #${e.id}`}${e.className && ` .${e.className}`}) element should have a relative position`), this.target = e, this.hasDetached = !0;
    }
  }
}, En = function(s, t) {
  let i, o;
  return function(...a) {
    const d = this, u = +/* @__PURE__ */ new Date();
    i && u < i + t ? (clearTimeout(o), o = setTimeout(() => {
      i = u, s.apply(d, a);
    }, t)) : (i = u, s.apply(d, a));
  };
}, It = (e, s, t, i = { width: 0, x: 0, y: 0 }, { scrollTop: o = 0, scrollLeft: n = 0 } = {}, a = !1, d = { left: 2, right: 2, top: 0, bottom: 0 }, u = { x: 0, y: 0 }) => {
  let f = s.y - i.y + o + (u.y || 0), c = s.x - i.x + n + (u.x || 0);
  isNaN(s.width) && (s.width = 0), isNaN(s.height) && (s.height = 0), /-right/.test(e) ? c += s.width - t.width : /^(top|bottom)$/.test(e) && (c += s.width / 2 - t.width / 2), /^bottom/.test(e) ? f += s.height : /^(left|right)(-top|-bottom)?$/.test(e) ? (c -= t.width, /^(right|right-\w{3,6})$/.test(e) && (c += s.width + t.width), /(-top|-bottom)/.test(e) ? /-bottom/.test(e) && (f += s.height - t.height) : f += s.height / 2 - t.height / 2) : f -= t.height;
  let h = 0, v = 0;
  const k = s.width / 2;
  if (a) {
    const w = d.left, T = i.width - t.width - d.right, D = Math.max(w, Math.min(c, T));
    h = c - D, c = D;
  }
  return {
    left: c,
    top: f,
    shiftX: h,
    shiftY: v,
    offset: k
  };
}, jn = {
  name: "vu-tooltip",
  mixins: [Ae],
  data: () => ({
    setPosition: It
  }),
  props: {
    type: {
      type: String,
      default: () => "tooltip"
    },
    side: {
      type: String,
      default: () => "top"
    },
    arrow: {
      type: Boolean,
      default: !0
    },
    text: {
      type: String,
      default: () => ""
    },
    animated: {
      type: Boolean,
      default: !0
    },
    contentClass: {
      type: String,
      required: !1,
      default: ""
    },
    prerender: {
      type: Boolean,
      required: !1
    }
  }
}, Rn = ["innerHTML"];
function Un(e, s, t, i, o, n) {
  return l(), r("div", {
    ref: "content",
    class: y([`${t.side} ${t.type} ${t.type}-root`, { "without-arrow": !t.arrow }, { prerender: t.prerender }])
  }, [
    I(Me, {
      name: t.animated ? "fade" : ""
    }, {
      default: C(() => [
        e.show ? (l(), r("div", {
          key: 0,
          class: y([`${t.type}-wrapper`])
        }, [
          S(e.$slots, "arrow", { side: t.side }, () => [
            t.arrow ? (l(), r("div", {
              key: 0,
              class: y(`${t.type}-arrow`)
            }, null, 2)) : p("", !0)
          ], !0),
          S(e.$slots, "title", { side: t.side }, void 0, !0),
          m("div", {
            ref: "body",
            class: y(`${t.type}-body`)
          }, [
            t.text ? (l(), r("span", {
              key: 0,
              innerHTML: t.text
            }, null, 8, Rn)) : S(e.$slots, "default", {
              key: 1,
              side: t.side
            }, void 0, !0)
          ], 2)
        ], 2)) : p("", !0)
      ]),
      _: 3
    }, 8, ["name"])
  ], 2);
}
const Bt = /* @__PURE__ */ O(jn, [["render", Un], ["__scopeId", "data-v-27c2f9f1"]]), Hn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Bt
}, Symbol.toStringTag, { value: "Module" })), qn = ["top", "top-right", "right-bottom", "right", "right-top", "bottom-right", "bottom", "bottom-left", "left-top", "left", "left-bottom", "top-left"], Wn = (e, s, t, i) => {
  const o = t.indexOf(e), n = t[(o + 1) % t.length];
  return i.includes(n) ? s : n;
}, Kn = ({ intersectionRatio: e }) => e < 1, Gn = {
  name: "vu-popover",
  mixins: [Ae, Ct],
  expose: ["updatePosition", "toggle"],
  emits: ["unpositionable"],
  components: { VuTooltip: Bt },
  props: {
    type: {
      type: String,
      default: "popover"
    },
    side: {
      type: String,
      default: "bottom"
    },
    arrow: {
      type: Boolean,
      default: !1
    },
    shift: {
      type: Boolean,
      default: !1
    },
    offsets: {
      type: Object,
      default: void 0
    },
    animated: {
      type: Boolean,
      default: !0
    },
    overlay: {
      type: Boolean,
      default: !1
    },
    click: {
      type: Boolean,
      default: !0
    },
    hover: {
      type: Boolean,
      default: !1
    },
    hoverImmediate: {
      type: Boolean,
      default: !1
    },
    hoverDelay: {
      type: Number,
      default: 500
    },
    title: {
      type: String,
      default: () => ""
    },
    persistent: {
      type: Boolean,
      default: !1
    },
    positions: {
      type: Array,
      required: !1,
      default: () => qn
    },
    getNextPosition: {
      type: Function,
      required: !1,
      default: Wn
    },
    checkPosition: {
      type: Function,
      required: !1,
      default: Kn
    },
    syncWidth: {
      type: Boolean,
      default: !1
    },
    ignoreEscapeKey: {
      type: Boolean,
      default: !1
    },
    ignoreClickOutside: {
      type: Boolean,
      default: !1
    }
  },
  data: () => ({
    open: !1,
    width: 0,
    resizeObs: null,
    debounce() {
    },
    useDebounceFn: Rt,
    intersectionObs: null,
    setPositionBound: null,
    shifted: !1,
    positioned: !1,
    fadeTimeout: void 0,
    positionAttempts: [],
    scrollableAncestors: [],
    // put in positionable
    innerSide: "",
    keyboardListener() {
    }
  }),
  watch: {
    innerShow: {
      immediate: !0,
      async handler(e) {
        e ? (this.fadeTimeout && (this.fadeTimeout = void 0), await new Promise((s) => setTimeout(s, 10)), this.positioned = !1, this.open = !0, this.positionAttempts = [], await this.$nextTick(), this.setPositionBound(), this.intersectionObs.observe(this.$refs.tooltip.$el), this.resizeObs || (this.resizeObs = new ResizeObserver(async () => {
          this.setPositionBound(!0);
        })), this.listenScrolls()) : (this.$refs.tooltip && (this.intersectionObs.unobserve(this.$refs.tooltip.$el), this.resizeObs.disconnect()), this.stopScrollListening(), this.animated ? this.fadeTimeout = setTimeout(() => {
          this.open = !1;
        }, 500) : this.open = !1);
      }
    },
    innerSide: {
      handler() {
        this.updatePosition();
      }
    },
    attach() {
      this.innerShow && this.updatePosition();
    },
    open: {
      handler(e) {
        this.target && (e && !this.ignoreEscapeKey ? this.keyboardListener = q(this.target, "keydown", (s) => {
          s.code === "Escape" && (this.innerShow = !1);
        }) : this.keyboardListener());
      }
    },
    hover: {
      immediate: !0,
      handler() {
        this.attachHover();
      }
    },
    hoverImmediate() {
      this.attachHover();
    },
    hoverDelay() {
      this.attachHover();
    }
  },
  created() {
    this.setPositionBound = En(this.setPosition.bind(this), 1);
  },
  async mounted() {
    await this.$nextTick();
    let e = 0;
    const s = 5;
    for (; e < s && this.$refs.activator === void 0 && this.$refs.tooltip === void 0; )
      e++, await this.$nextTick();
    const { target: t, positionAttempts: i } = this;
    this.intersectionObs = new IntersectionObserver(([{ boundingClientRect: o, rootBounds: n, intersectionRatio: a, intersectionRect: d }]) => {
      if (this.$refs.tooltip && this.intersectionObs.unobserve(this.$refs.tooltip.$el), this.checkPosition({ intersectionRatio: a, elementRect: o, targetRect: n, intersectionRect: d, positionAttempts: i })) {
        const u = this.getNextPosition(this.innerSide || this.side, this.side, this.positions, this.positionAttempts);
        if (this.positionAttempts.length > this.positions.length) {
          this.$emit("unpositionable"), this.positioned = !0, this.positionAttempts = [];
          return;
        }
        this.innerSide = u, this.positionAttempts.push(this.innerSide);
      } else
        this.positioned = !0, this.positionAttempts = [], this.resizeObs.observe(this.$refs.tooltip.$el), this.resizeObs.observe(this.target);
    }, { root: t !== document.body ? t : void 0 });
  },
  beforeUnmount() {
    try {
      this.innerShow = !1, this.stopScrollListening(), this.intersectionObs.disconnect(), this.resizeObs.disconnect();
    } catch {
    }
  },
  methods: {
    listenScrolls() {
      const e = [];
      let s = this.$refs.activator.parentElement;
      for (; s && (this.target.contains(s) || s === this.target); ) {
        const { overflow: t } = window.getComputedStyle(s), i = t.split(" ");
        ["auto", "scroll"].some((o) => i.includes(o)) && e.push(s), s = s.parentElement;
      }
      this.scrollableAncestors = e, this.scrollableAncestors.forEach((t) => t.addEventListener("scroll", this.setPositionBound));
    },
    stopScrollListening() {
      this.scrollableAncestors.forEach((e) => e.removeEventListener("scroll", this.setPositionBound));
    },
    updatePosition() {
      var e;
      this.setPositionBound(), this.intersectionObs.observe((e = this.$refs.tooltip) == null ? void 0 : e.$el);
    },
    async setPosition(e) {
      var d;
      e && await this.$nextTick();
      let s = this.$refs.activator.getBoundingClientRect();
      const t = (d = this.$refs.tooltip) == null ? void 0 : d.$el;
      if (!t)
        return;
      let i = t.getBoundingClientRect();
      this.syncWidth && i.width !== s.width && (this.width = s.width, await this.$nextTick(), s = this.$refs.activator.getBoundingClientRect(), i = this.$refs.tooltip.$el.getBoundingClientRect());
      const o = this.target.getBoundingClientRect(), n = this.offsets && this.offsets[this.innerSide || this.side] || {};
      this.positionAttempts.push(this.innerSide || this.side);
      const a = It(
        this.innerSide || this.side,
        s,
        i,
        o,
        this.target,
        this.shift,
        { left: 0, right: 0 },
        n
      );
      this.shifted = a.shiftX, t.style.top = `${a.top}px`, t.style.left = `${a.left}px`, this.overlay && (this.$refs.overlay.style.top = `${this.target === document.body ? document.scrollingElement.scrollTop : this.target.scrollTop}px`);
    },
    onClickOutside(e, s = !1) {
      if (this.ignoreClickOutside || !this.innerShow)
        return;
      const { target: t } = e;
      s && e.preventDefault(), !(this.$refs.tooltip && (t === this.$refs.tooltip.$el || this.$refs.tooltip.$el.contains(t))) && (this.innerShow = !1);
    },
    onHover(e) {
      this.debounce(e).then((s) => {
        this.openedByClick || (s === "mouseenter" ? this.innerShow = !0 : (this.innerShow = !1, this.openedByClick = !1));
      }).catch(() => {
      });
    },
    attachHover() {
      this.hover && !this.hoverImmediate ? this.debounce = Rt(({ type: e }) => e, this.hoverDelay, { rejectOnCancel: !0 }) : this.debounce = function() {
      };
    },
    onClick() {
      this.toggle(), this.hover && this.innerShow ? this.openedByClick = !0 : this.openedByClick = !1;
    },
    toggle(e = void 0) {
      e !== void 0 ? this.innerShow = e : this.innerShow = !this.innerShow;
    }
  }
};
function Yn(e, s, t, i, o, n) {
  const a = b("VuTooltip"), d = W("click-outside");
  return l(), r(B, null, [
    $((l(), r("span", z({
      ref: "activator",
      class: "vu-popover__activator"
    }, e.$attrs, {
      onClick: s[0] || (s[0] = (u) => t.click && n.onClick(!0)),
      onContextmenu: s[1] || (s[1] = Q(() => {
      }, ["prevent", "stop"])),
      onMouseenter: s[2] || (s[2] = (u) => t.hover && n.onHover(u)),
      onMouseleave: s[3] || (s[3] = (u) => t.hover && n.onHover(u))
    }), [
      S(e.$slots, "default", {}, void 0, !0)
    ], 16)), [
      [d, { handler: n.onClickOutside, innerShow: e.innerShow }]
    ]),
    e.open || t.persistent ? $((l(), _(gt, {
      key: 0,
      to: e.target
    }, [
      I(Me, {
        name: t.animated ? "fade" : ""
      }, {
        default: C(() => [
          e.innerShow && t.overlay ? (l(), r("div", {
            key: 0,
            ref: "overlay",
            class: "mask popover-mask",
            onWheel: s[4] || (s[4] = Q((...u) => n.onClickOutside && n.onClickOutside(...u), ["prevent"])),
            onTouchstart: s[5] || (s[5] = (u) => n.onClickOutside(u, !0))
          }, null, 544)) : p("", !0)
        ]),
        _: 1
      }, 8, ["name"]),
      I(Me, {
        appear: "",
        name: t.animated ? "fade" : ""
      }, {
        default: C(() => [
          $(I(a, {
            ref: "tooltip",
            arrow: t.arrow,
            prerender: !e.positioned,
            type: t.type,
            show: !0,
            side: e.innerSide || t.side,
            class: y(e.contentClass),
            style: M([e.width ? `width: ${e.width}px` : {}, e.contentStyle]),
            "onUpdate:show": s[6] || (s[6] = (u) => e.open = !1),
            onMouseenter: s[7] || (s[7] = (u) => t.hover && n.onHover(u)),
            onMouseleave: s[8] || (s[8] = (u) => t.hover && n.onHover(u))
          }, {
            arrow: C(({ side: u }) => [
              S(e.$slots, "arrow", {
                side: e.innerSide || u,
                shift: e.shifted
              }, void 0, !0)
            ]),
            title: C(({ side: u }) => [
              S(e.$slots, "title", {
                side: e.innerSide || u
              }, () => [
                t.title ? (l(), r(B, { key: 0 }, [
                  x(g(t.title), 1)
                ], 64)) : p("", !0)
              ], !0)
            ]),
            default: C(() => [
              S(e.$slots, "body", {}, void 0, !0)
            ]),
            _: 3
          }, 8, ["arrow", "prerender", "type", "side", "class", "style"]), [
            [me, e.innerShow || e.show]
          ])
        ]),
        _: 3
      }, 8, ["name"])
    ], 8, ["to"])), [
      [me, e.open]
    ]) : p("", !0)
  ], 64);
}
const ae = /* @__PURE__ */ O(Gn, [["render", Yn], ["__scopeId", "data-v-1e9f8db5"]]), Xn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ae
}, Symbol.toStringTag, { value: "Module" })), Jn = {
  name: "vu-status-bar",
  props: {
    items: {
      type: Array,
      default: () => []
    },
    constrained: Boolean
  },
  data() {
    return {
      overflows: !1,
      ellipsis: !1,
      intObs: null,
      intObs2: null,
      visibleAmount: 0
    };
  },
  mounted() {
    this.watchSize();
  },
  computed: {
    visibleItems() {
      return this.items.slice(0, this.visibleAmount);
    },
    hiddenItems() {
      return this.overflows ? this.items.slice(this.visibleAmount) : [];
    }
  },
  watch: {
    items: {
      immediate: !0,
      // eslint-disable-next-line object-shorthand, func-names
      handler: function(e) {
        this.visibleAmount = e.length, this.ellipsis = !1, this.overflows = !1, this.$el && this.$nextTick(() => this.watchSize());
      }
    }
  },
  methods: {
    watchSize() {
      this.intObs = new IntersectionObserver(this.intersects, {
        root: this.$refs.container,
        threshold: 1
      }), this.intObs.observe(this.$refs.inner), this.intObs2 = new IntersectionObserver(this.intersects2, {
        root: this.$refs.inner,
        threshold: 1
      });
    },
    async intersects() {
      this.intObs.disconnect(), this.ellipsis = !0;
      const e = this.$refs.inner.querySelectorAll(".vu-badge");
      await this.$nextTick(), e.forEach((s) => {
        this.intObs2.observe(s);
      });
    },
    intersects2(e) {
      const s = e.filter((i) => i.intersectionRatio < 1);
      let { length: t } = s;
      if (t) {
        const i = this.$refs.inner.getBoundingClientRect(), { right: o } = i, n = s.shift();
        n && o - n.target.getBoundingClientRect().left - 22 < 0 && (t += 1), this.visibleAmount -= t, this.overflows = !0;
      }
      this.intObs2.disconnect();
    },
    units(e) {
      return this.ellipsis ? e > 99 ? "99+" : `${e}` : `${e}`;
    },
    destroyed() {
      this.intObs1 && delete this.intObs1, this.intObs2 && delete this.intObs2;
    }
  },
  components: { VuBadge: _t, VuPopover: ae, VuIcon: H }
}, Qn = {
  class: "status-bar__inner",
  ref: "inner"
};
function Zn(e, s, t, i, o, n) {
  const a = b("VuBadge"), d = b("VuIcon"), u = b("VuPopover"), f = W("tooltip");
  return l(), r("div", {
    class: y(["vu-status-bar", { "status-bar--constrained": t.constrained }]),
    ref: "container"
  }, [
    m("div", Qn, [
      (l(!0), r(B, null, V(n.visibleItems, (c) => $((l(), _(a, {
        key: c.id,
        icon: c.icon,
        text: c.text || c.amount && n.units(c.amount) || "",
        color: c.color || "copy-grey",
        value: c.value,
        togglable: !1,
        style: M([c.amount && c.icon ? "min-width: 45px" : ""])
      }, null, 8, ["icon", "text", "color", "value", "style"])), [
        [
          f,
          c.tooltip || c.text || c.amount || "",
          void 0,
          { hover: !0 }
        ]
      ])), 128)),
      o.overflows ? (l(), _(u, {
        key: 0,
        type: "tooltip",
        "content-class": "vu-status-bar",
        shift: "",
        arrow: ""
      }, {
        default: C(() => [
          I(d, {
            icon: "menu-dot",
            style: { transform: "rotate(90deg)" }
          })
        ]),
        body: C(() => [
          (l(!0), r(B, null, V(n.hiddenItems, (c) => (l(), _(a, {
            key: c.id,
            icon: c.icon,
            text: c.text || `${c.amount}` || "",
            color: c.color || "copy-grey",
            value: c.value,
            togglable: !1
          }, null, 8, ["icon", "text", "color", "value"]))), 128))
        ]),
        _: 1
      })) : p("", !0)
    ], 512)
  ], 2);
}
const Ot = /* @__PURE__ */ O(Jn, [["render", Zn], ["__scopeId", "data-v-5fdbcbd9"]]), ei = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ot
}, Symbol.toStringTag, { value: "Module" })), ti = {
  name: "vu-lazy",
  props: {
    height: {
      type: [Number, String],
      default: () => "10px"
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["intersect"],
  data: () => ({
    observer: null,
    intersected: !1
  }),
  mounted() {
    "IntersectionObserver" in window ? (this.observer = new IntersectionObserver((e) => {
      e[0].isIntersecting && (this.intersected = !0, this.observer.disconnect(), this.$emit("intersect"));
    }, this.options), this.observer.observe(this.$el)) : (this.intersected = !0, this.$emit("intersect"));
  },
  beforeUnmount() {
    "IntersectionObserver" in window && this.observer && this.observer.disconnect(), delete this.observer;
  }
};
function si(e, s, t, i, o, n) {
  return l(), r("div", {
    style: M(e.intersected ? "" : `min-height: ${t.height}${typeof t.height == "number" && "px" || ""}`)
  }, [
    e.intersected ? S(e.$slots, "default", { key: 0 }) : S(e.$slots, "placeholder", { key: 1 })
  ], 4);
}
const Vt = /* @__PURE__ */ O(ti, [["render", si]]), ni = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Vt
}, Symbol.toStringTag, { value: "Module" })), ii = {
  name: "vu-image",
  components: { VuLazy: Vt },
  props: {
    lazy: {
      type: Boolean,
      required: !1
    },
    src: {
      type: [URL, String],
      required: !0
    },
    height: [Number, String],
    maxHeight: [Number, String],
    maxWidth: [Number, String],
    minHeight: [Number, String],
    minWidth: [Number, String],
    width: [Number, String],
    contain: Boolean,
    aspectRatio: String
  },
  emits: ["load", "error"],
  data: () => ({
    image: void 0,
    calculatedAspectRatio: void 0,
    naturalWidth: void 0,
    isLoading: !0,
    hasError: !1
  }),
  inject: {
    vuDebug: {
      default: !1
    }
  },
  computed: {
    computedAspectRatio() {
      return Number(this.aspectRatio || this.calculatedAspectRatio);
    },
    imageSizerStyle() {
      return this.computedAspectRatio ? { paddingBottom: `${1 / this.computedAspectRatio * 100}%` } : void 0;
    },
    imageStyle() {
      return [
        Number.isNaN(this.width) ? "" : { width: `${this.width}px` },
        Number.isNaN(this.height) ? "" : { height: `${this.height}px` },
        Number.isNaN(this.minHeight) ? "" : { minHeight: `${this.minHeight}px` },
        Number.isNaN(this.maxHeight) ? "" : { maxHeight: `${this.maxHeight}px` },
        Number.isNaN(this.minWidth) ? "" : { minWidth: `${this.minWidth}px` },
        Number.isNaN(this.maxWidth) ? "" : { maxWidth: `${this.maxWidth}px` }
      ];
    },
    imageClasses() {
      return `vu-image__image--${this.contain ? "contain" : "cover"}`;
    }
  },
  watch: {
    src() {
      this.isLoading ? this.loadImage() : this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.lazy || this.loadImage();
    },
    loadImage() {
      const e = new Image();
      this.image = e, this.isLoading = !0, e.onload = () => {
        e.decode ? e.decode().catch((s) => {
          this.vuDebug && console.warn(
            `Failed to decode image, trying to render anyway

src: ${this.src}` + (s.message ? `
Original error: ${s.message}` : ""),
            this
          );
        }).then(this.onLoad) : this.onLoad();
      }, e.onerror = this.onError, e.src = this.src, this.aspectRatio || this.pollForSize(e);
    },
    pollForSize(e, s = 100) {
      const t = () => {
        const { naturalHeight: i, naturalWidth: o } = e;
        i || o ? (this.naturalWidth = o, this.calculatedAspectRatio = o / i, this.image = null) : !e.complete && this.isLoading && !this.hasError && s != null && setTimeout(t, s);
      };
      t();
    },
    onLoad() {
      this.isLoading = !1, this.$emit("load", this.src);
    },
    onError() {
      this.hasError = !0, this.$emit("error", this.src);
    }
  }
}, li = (e) => (pe("data-v-2025e901"), e = e(), ge(), e), oi = /* @__PURE__ */ li(() => /* @__PURE__ */ m("div", { class: "vu-image__fill" }, null, -1));
function ai(e, s, t, i, o, n) {
  const a = b("VuLazy");
  return l(), r("div", {
    class: "vu-image",
    style: M(n.imageStyle)
  }, [
    m("div", {
      class: "vu-image__sizer",
      style: M(n.imageSizerStyle)
    }, null, 4),
    t.lazy ? (l(), _(a, {
      key: 0,
      height: t.height || t.maxHeight || t.minHeight || 10,
      onIntersect: s[0] || (s[0] = (d) => n.loadImage())
    }, {
      default: C(() => [
        m("div", {
          class: y(["vu-image__image", n.imageClasses]),
          style: M([[e.isLoading ? "" : { backgroundImage: `url(${t.src})` }], { "background-position": "center center" }])
        }, null, 6)
      ]),
      _: 1
    }, 8, ["height"])) : (l(), r("div", {
      key: 1,
      class: y(["vu-image__image", n.imageClasses]),
      style: M([[e.isLoading ? "" : { backgroundImage: `url(${t.src})` }], { "background-position": "center center" }])
    }, null, 6)),
    oi,
    S(e.$slots, "default", {}, void 0, !0)
  ], 4);
}
const Fe = /* @__PURE__ */ O(ii, [["render", ai], ["__scopeId", "data-v-2025e901"]]), ri = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Fe
}, Symbol.toStringTag, { value: "Module" })), Re = Symbol("vuIsMobileOrTablet"), $t = Symbol("vuIsIOS"), hs = Symbol("vuAlertDialogConfirmButtonLabel"), fs = Symbol("vuAlertDialogCloseButtonLabel"), ms = Symbol("vuAlertDialogRiskyButtonLabel"), ps = Symbol("vuAlertDialogCloseButtonAltLabel"), gs = Symbol("vuDropdownMenuOverlay"), vs = Symbol("vuTimelineDividerAncestorDepth"), ys = Symbol("vuTimelineDividerStickyContainer"), gf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AlertDialogCloseButtonAltLabelKey: ps,
  AlertDialogCloseButtonLabelKey: fs,
  AlertDialogConfirmButtonLabelKey: hs,
  AlertDialogRiskyButtonLabelKey: ms,
  DropdownMenuOverlayKey: gs,
  IsIOSKey: $t,
  IsMobileOrTabletKey: Re,
  TimelineDividerAncestorKey: vs,
  TimelineDividerStickyContainerKey: ys
}, Symbol.toStringTag, { value: "Module" }));
function ye() {
  return window ? ("10000000-1000-4000-8000" + -1e11).replace(/[018]/g, (e) => (e ^ (window.crypto || window.msCrypto).getRandomValues(new Uint8Array(1))[0] & 15 >> e / 4).toString(16)) : (void 0)();
}
function bs(e, s = !0) {
  let t = s;
  return J(e).forEach((o) => {
    !o.text && !o.label && (!o.class || !o.class.includes("divider")) && (t = !1), o.items && (t = bs(o.items, t));
  }), t;
}
L();
const ui = {
  name: "vu-dropdownmenu-items",
  components: { VuIcon: H },
  emits: ["update:responsive", "update:position", "click-item", "update:selected"],
  props: {
    target: {
      type: HTMLElement,
      required: !1
    },
    items: {
      type: Array,
      required: !0,
      validator: bs
    },
    selected: {
      type: Array,
      required: !0
    },
    zIndex: {
      type: Number,
      default: 1e3
    },
    responsive: {
      type: Boolean,
      default: !1
    },
    dividedResponsiveItems: {
      type: Boolean,
      default: !1
    },
    disableResponsive: {
      type: Boolean,
      default: !1
    }
  },
  data: () => ({
    stack: [],
    left: !1,
    uuid: ye,
    root: !1,
    parent: {}
  }),
  computed: {
    classes() {
      return {
        "open-left": this.left,
        "responsive-menu": this.responsive
      };
    },
    _items() {
      return this.stack[this.stack.length - 1] || this.items;
    },
    _parent() {
      return (this.stack[this.stack.length - 2] || this.items).find((e) => JSON.stringify(e.items) === JSON.stringify(this._items));
    }
  },
  async mounted() {
    var i;
    if (this.disableResponsive)
      return;
    await this.$nextTick();
    const e = {
      root: this.target,
      threshold: 1
    }, s = ((i = this.target) == null ? void 0 : i.getBoundingClientRect()) || { right: window.right, left: 0 }, t = new IntersectionObserver(async ([o]) => {
      t.unobserve(this.$el);
      const n = o.target.getBoundingClientRect();
      s.right < n.right && !this.left ? (this.left = !0, await this.$nextTick(), t.observe(this.$el)) : s.left > n.left && this.left && (this.$emit("update:responsive", !0), this.$emit("update:position"));
    }, e);
    await this.$nextTick(), t.observe(this.$el);
  },
  methods: {
    toggleSelected(e) {
      const s = this.selected.slice(0);
      return e.selected || this.selected.includes(e) ? s.splice(this.selected.indexOf(e), 1) : s.push(e), s;
    },
    onItemClick(e) {
      !e.disabled && (e.selectable || e.selected || this.selected.includes(e)) && this.$emit("update:selected", this.toggleSelected(e)), this.$emit("click-item", e);
    },
    onNextItemClick(e) {
      this.responsive && this.stack.push(e.items);
    },
    onBackItemClick() {
      this.stack.pop();
    }
  }
}, di = (e) => (pe("data-v-329cd0e0"), e = e(), ge(), e), ci = { class: "dropdown-menu-wrap" }, hi = {
  key: 0,
  class: "item item-back"
}, fi = { class: "item-text" }, mi = ["onClick"], pi = { class: "item-text" }, gi = ["onClick"], vi = /* @__PURE__ */ di(() => /* @__PURE__ */ m("span", { class: "divider" }, null, -1)), yi = {
  key: 0,
  class: "item-text"
};
function bi(e, s, t, i, o, n) {
  const a = b("VuIcon"), d = b("vu-dropdownmenu-items", !0);
  return l(), r("div", {
    class: y(["dropdown-menu dropdown-menu-root dropdown-root", n.classes]),
    style: M([{ zIndex: t.zIndex }]),
    ref: "self"
  }, [
    m("ul", ci, [
      t.responsive && e.stack.length ? (l(), r("li", hi, [
        I(a, {
          icon: "left-open",
          class: "back-item",
          onClick: Q(n.onBackItemClick, ["stop"])
        }, null, 8, ["onClick"]),
        m("span", fi, g(n._parent.text), 1)
      ])) : p("", !0),
      (l(!0), r(B, null, V(n._items, (u) => (l(), r(B, null, [
        !u.class || !u.class.includes("header") && !u.class.includes("divider") ? (l(), r("li", {
          key: u.text || u.label,
          class: y(["item", [{
            "item-submenu": u.items,
            selectable: !u.disabled && u.selectable || u.selected || t.selected.includes(u),
            selected: u.selected || t.selected.includes(u),
            hidden: u.hidden,
            disabled: u.disabled,
            "hide-responsive-divider": !t.dividedResponsiveItems
          }, u.class]]),
          onClick: Q((f) => u.items && t.responsive && !t.dividedResponsiveItems ? n.onNextItemClick(u) : n.onItemClick(u), ["stop"])
        }, [
          S(e.$slots, "default", { item: u }, () => [
            u.fonticon ? (l(), _(a, {
              key: 0,
              icon: u.fonticon,
              withinText: !1
            }, null, 8, ["icon"])) : p("", !0),
            m("span", pi, g(u.text || u.label), 1)
          ], !0),
          u.items ? (l(), r("div", {
            key: 0,
            class: "next-icon",
            onClick: Q((f) => n.onNextItemClick(u), ["stop"])
          }, [
            vi,
            I(a, { icon: "right-open" })
          ], 8, gi)) : p("", !0),
          !t.responsive && u.items ? (l(), _(d, {
            key: 1,
            target: t.target,
            items: u.items,
            selected: t.selected,
            "z-index": t.zIndex + 1,
            onClickItem: n.onItemClick,
            "onUpdate:selected": s[0] || (s[0] = (f) => e.$emit("update:selected", f)),
            "onUpdate:responsive": s[1] || (s[1] = (f) => e.$emit("update:responsive", f)),
            "onUpdate:position": s[2] || (s[2] = () => {
              var h;
              const { left: f, top: c } = (h = e.$refs.self) == null ? void 0 : h.getBoundingClientRect();
              e.$emit("update:position", { x: f, y: c });
            })
          }, null, 8, ["target", "items", "selected", "z-index", "onClickItem"])) : p("", !0)
        ], 10, mi)) : (l(), r("li", {
          key: u.text || u.label || e.uuid(),
          class: y(u.class)
        }, [
          u.class !== "divider" ? (l(), r("span", yi, g(u.text || u.label), 1)) : p("", !0)
        ], 2))
      ], 64))), 256))
    ])
  ], 6);
}
const Ze = /* @__PURE__ */ O(ui, [["render", bi], ["__scopeId", "data-v-329cd0e0"]]), _i = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ze
}, Symbol.toStringTag, { value: "Module" })), _s = ["top", "top-right", "bottom-right", "bottom", "bottom-left", "top-left"], ws = ({ intersectionRatio: e, elementRect: s, targetRect: t }) => e < 1 && (s.top < t.top || s.bottom > t.bottom), ks = (e, s, t, i) => {
  if (i.length === 1) {
    const o = i[0];
    return o.includes("top") ? o.replace("top", "bottom") : o.replace("bottom", "top");
  } else
    i.length > 1 && i.push(..._s);
  return s;
};
function Ss(e, s = !0) {
  let t = s;
  return e.forEach((i) => {
    !i.text && !i.label && (!i.class || !i.class.includes("divider")) && (t = !1), i.items && (t = Ss(i.items, t));
  }), t;
}
const wi = {
  components: { VuDropdownmenuItems: Ze, VuPopover: ae },
  name: "vu-dropdownmenu",
  mixins: [Ae, Ct],
  emits: ["close", "click-item"],
  props: {
    value: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      required: !0,
      validator: Ss
    },
    dividedResponsiveItems: {
      type: Boolean,
      default: !1
    },
    position: {
      type: String,
      required: !1,
      default: "bottom-left"
    },
    arrow: {
      type: Boolean,
      default: !1
    },
    overlay: {
      type: Boolean,
      default: !1
    },
    zIndex: {
      type: Number,
      default: () => 1e3
    },
    responsive: {
      type: Boolean,
      default: !1
    },
    shift: {
      type: Boolean,
      default: !1
    },
    closeOnClick: {
      type: Boolean,
      default: !0
    },
    positions: {
      type: Array,
      required: !1,
      default: () => _s
    },
    getNextPosition: {
      type: Function,
      required: !1,
      default: ks
    },
    checkPosition: {
      type: Function,
      required: !1,
      default: ws
    },
    ignoreEscapeKey: {
      type: Boolean,
      default: !1
    },
    ignoreClickOutside: {
      type: Boolean,
      default: !1
    }
  },
  data: () => ({
    innerResponsive: !1
  }),
  computed: {
    isResponsive: {
      get() {
        return this.innerResponsive || this.responsive;
      },
      set(e) {
        this.innerResponsive = e;
      }
    }
  },
  watch: {
    async items() {
      this.innerShow && (await this.$nextTick(), this.$refs.popover.updatePosition());
    }
  },
  methods: {
    handleClick(e) {
      e.handler && e.handler(e), this.$emit("click-item", e), this.updateShow(!1);
    },
    updateShow(e) {
      e ? this.isResponsive = !1 : this.closeOnClick && (this.innerShow = !1, this.$emit("close"));
    }
  }
}, Ce = /* @__PURE__ */ Object.assign(wi, {
  setup(e) {
    const s = se(gs, !1);
    return (t, i) => (l(), _(ae, {
      ref: "popover",
      show: t.innerShow,
      "onUpdate:show": [
        i[1] || (i[1] = (o) => t.innerShow = o),
        t.updateShow
      ],
      shift: e.shift || e.responsive,
      type: "dropdownmenu popover",
      attach: t.target,
      side: e.position,
      overlay: e.overlay || F(s),
      animated: !1,
      "check-position": F(ws),
      "get-next-position": F(ks),
      "ignore-click-outside": e.ignoreClickOutside,
      arrow: !1,
      ignoreEscapeKey: e.ignoreEscapeKey
    }, {
      body: C(() => [
        I(Ze, {
          responsive: t.isResponsive,
          "onUpdate:responsive": i[0] || (i[0] = (o) => t.isResponsive = o),
          "divided-responsive-items": e.dividedResponsiveItems,
          target: t.target,
          items: e.items,
          selected: e.value,
          onClickItem: t.handleClick
        }, null, 8, ["responsive", "divided-responsive-items", "target", "items", "selected", "onClickItem"])
      ]),
      default: C(() => [
        S(t.$slots, "default", { active: t.innerShow })
      ]),
      _: 3
    }, 8, ["show", "shift", "attach", "side", "overlay", "check-position", "get-next-position", "ignore-click-outside", "ignoreEscapeKey", "onUpdate:show"]));
  }
}), ki = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ce
}, Symbol.toStringTag, { value: "Module" })), xt = {
  props: {
    active: {
      type: Boolean,
      default: () => !1
    }
  }
}, Si = {
  props: {
    size: {
      type: String,
      default: () => ""
    }
  }
}, Ci = {
  name: "vu-icon-btn",
  mixins: [xt, K, Te, Si],
  components: { VuIcon: H },
  props: {
    icon: {
      required: !0,
      type: String
    },
    disableChevronResize: {
      default: !1,
      type: Boolean
    },
    noActive: {
      default: !1,
      type: Boolean
    },
    noHover: {
      default: !1,
      type: Boolean
    }
  }
};
function Ii(e, s, t, i, o, n) {
  const a = b("VuIcon");
  return l(), r("div", {
    class: y(["vu-icon-btn", [e.color, e.size, { active: e.active && !t.noActive, "no-active": t.noActive, "no-hover": t.noHover, disabled: e.disabled }]]),
    onClickCapture: s[0] || (s[0] = (d) => {
      this.disabled && d.stopPropagation();
    })
  }, [
    I(a, {
      icon: t.icon,
      color: e.color,
      class: y({ "chevron-menu-icon": t.icon === "chevron-down" && t.disableChevronResize, disabled: e.disabled })
    }, null, 8, ["icon", "color", "class"])
  ], 34);
}
const U = /* @__PURE__ */ O(Ci, [["render", Ii], ["__scopeId", "data-v-626fc56a"]]), Bi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: U
}, Symbol.toStringTag, { value: "Module" })), Oi = {
  name: "vu-tile",
  inject: ["vuCollectionActions", "vuCollectionLazyImages", "lang", "vuTileEmphasizeText", "vuDateFormatWeekday", "vuDateFormatShort"],
  emits: ["click-action"],
  props: {
    /* eslint-disable vue/require-default-prop */
    id: {
      type: String
    },
    src: String,
    type: String,
    title: String,
    text: String,
    author: String,
    date: Date,
    customMetaData: String,
    status: Array,
    active: Boolean,
    actions: Array || String,
    selected: Boolean,
    selectable: Boolean,
    thumbnail: Boolean,
    hideStatusBar: Boolean
  },
  computed: {
    classes() {
      return {
        "tile--selectable": this.selectable || this.selected,
        "tile--selected": this.selected,
        "tile--active": this.active,
        "tile--thumbnail": this.thumbnail
      };
    },
    _actions() {
      return this.actions || this.vuCollectionActions;
    },
    contentClasses() {
      const e = "tile__content";
      return this.thumbnail ? this.meta ? `${e}__title--2rows` : `${e}__title--3rows` : this.meta && this.text ? this.vuTileEmphasizeText ? [
        `${e}__title--1row`,
        `${e}__text--2rows`
      ] : [
        `${e}__title--2row`,
        `${e}__text--1row`
      ] : (this.meta ? !this.text : this.text) ? [`${e}__title--3rows`, `${e}__text--1row`] : `${e}__title--4rows`;
    },
    meta() {
      return this.customMetaData || `${this.author || ""}${this.author && this.date ? " | " : ""}${this.dateFormat}`;
    },
    dateFormatOptions() {
      const e = {
        weekday: this.vuDateFormatShort ? "short" : "long",
        month: this.vuDateFormatShort ? "short" : "long",
        day: "numeric",
        year: "numeric"
      };
      return this.vuDateFormatWeekday || delete e.weekday, e;
    },
    dateFormat() {
      return this.date ? this.date.toLocaleDateString(this.lang, this.dateFormatOptions) : "";
    }
  },
  data() {
    return {
      started: !1
    };
  },
  mounted() {
  },
  watch: {},
  methods: {},
  components: { VuImage: Fe, VuIcon: H, VuIcon: H, VuDropdownmenu: Ce, VuStatusBar: Ot, VuIconBtn: U }
}, Vi = { class: "tile-wrap" }, $i = {
  key: 0,
  class: "tile__thumb"
}, xi = {
  key: 1,
  class: "tile__image"
}, Mi = { class: "tile__title" }, Pi = { class: "inner" }, Li = {
  key: 0,
  class: "tile__meta"
}, Ti = { class: "inner" }, Ai = {
  key: 1,
  class: "tile__text"
}, Fi = { class: "inner" }, Di = {
  key: 2,
  class: "tile__action-icon"
};
function zi(e, s, t, i, o, n) {
  const a = b("VuImage"), d = b("VuIcon"), u = b("vuIconBtn"), f = b("VuDropdownmenu"), c = b("VuIconBtn"), h = b("VuStatusBar");
  return l(), r("div", {
    class: y(["vu-tile", n.classes])
  }, [
    m("div", Vi, [
      t.active ? (l(), r("div", $i)) : p("", !0),
      t.src ? (l(), r("div", xi, [
        I(a, {
          src: t.src,
          width: "80",
          height: "60",
          contain: "",
          "aspect-ratio": "1",
          lazy: n.vuCollectionLazyImages
        }, null, 8, ["src", "lazy"]),
        t.src && (t.selectable || t.selected) ? (l(), _(d, {
          key: 0,
          icon: "check",
          class: "tile__check"
        })) : p("", !0)
      ])) : p("", !0),
      m("div", {
        class: y(["tile__content", n.contentClasses])
      }, [
        m("div", Mi, [
          t.type ? (l(), _(d, {
            key: 0,
            icon: t.type
          }, null, 8, ["icon"])) : p("", !0),
          m("span", Pi, g(t.title), 1)
        ]),
        n.meta ? (l(), r("div", Li, [
          m("span", Ti, g(n.meta), 1)
        ])) : p("", !0),
        t.text ? (l(), r("div", Ai, [
          m("span", Fi, g(t.text), 1)
        ])) : p("", !0)
      ], 2),
      n._actions ? (l(), r("div", Di, [
        n._actions.length > 1 ? (l(), _(f, {
          key: 0,
          items: n._actions,
          onClickItem: s[0] || (s[0] = (v) => e.$emit("click-action", { item: v, id: t.id }))
        }, {
          default: C((v) => [
            I(u, {
              icon: "chevron-down",
              class: y(v)
            }, null, 8, ["class"])
          ]),
          _: 1
        }, 8, ["items"])) : (l(), _(c, {
          key: 1,
          icon: n._actions[0].fonticon,
          onClick: s[1] || (s[1] = (v) => e.$emit("click-action", { item: v, id: t.id }))
        }, null, 8, ["icon"]))
      ])) : p("", !0)
    ]),
    t.hideStatusBar ? p("", !0) : (l(), _(h, {
      key: 0,
      status: t.status
    }, null, 8, ["status"]))
  ], 2);
}
const Cs = /* @__PURE__ */ O(Oi, [["render", zi], ["__scopeId", "data-v-f0868abb"]]), Ni = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Cs
}, Symbol.toStringTag, { value: "Module" })), Ei = {
  name: "vu-thumbnail",
  inject: ["vuCollectionLazyImages"],
  props: {
    /* eslint-disable vue/require-default-prop */
    id: {
      type: String,
      required: !0
    },
    src: String,
    type: String,
    active: Boolean,
    actions: Array,
    title: String,
    text: String,
    selected: Boolean,
    selectable: Boolean,
    author: String,
    date: Date,
    customMetaData: String,
    status: Array,
    hideStatusBar: Boolean
  },
  data: () => ({
    getListenersFromAttrs: ce
  }),
  computed: {
    classes() {
      return {
        "thumbnail--selectable": this.selectable || this.selected,
        "thumbnail--selected": this.selected,
        "thumbnail--active": this.active
      };
    }
  },
  components: { VuImage: Fe, VuIcon: H, VuTile: Cs, VuStatusBar: Ot }
}, ji = {
  class: "thumbnail-wrap",
  style: { position: "relative" }
}, Ri = {
  key: 0,
  class: "thumbnail__thumb"
}, Ui = { class: "thumbnail__content" };
function Hi(e, s, t, i, o, n) {
  const a = b("VuImage"), d = b("VuIcon"), u = b("VuTile"), f = b("VuStatusBar");
  return l(), r("div", {
    class: y(["vu-thumbnail item", n.classes])
  }, [
    m("div", ji, [
      I(a, {
        src: t.src,
        lazy: n.vuCollectionLazyImages,
        "aspect-ratio": "200/150",
        contain: ""
      }, null, 8, ["src", "lazy"]),
      t.active ? (l(), r("div", Ri)) : p("", !0),
      t.selectable || t.selected ? (l(), _(d, {
        key: 1,
        icon: "check",
        class: "thumbnail__check"
      })) : p("", !0),
      I(u, {
        thumbnail: "",
        title: t.title,
        type: t.type,
        author: t.author,
        date: t.date,
        actions: t.actions,
        "custom-meta-data": t.customMetaData,
        "hide-status-bar": "",
        onClickAction: e.getListenersFromAttrs(e.$attrs).onClickAction
      }, null, 8, ["title", "type", "author", "date", "actions", "custom-meta-data", "onClickAction"]),
      m("div", Ui, g(t.text), 1),
      t.hideStatusBar ? p("", !0) : (l(), _(f, {
        key: 2,
        status: t.status
      }, null, 8, ["status"]))
    ])
  ], 2);
}
const qi = /* @__PURE__ */ O(Ei, [["render", Hi], ["__scopeId", "data-v-a149de4c"]]), Wi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: qi
}, Symbol.toStringTag, { value: "Module" })), Ie = {
  props: {
    loading: {
      type: Boolean,
      default: () => !1
    }
  }
}, Ki = {
  name: "vu-accordion",
  mixins: [Ie],
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    items: {
      type: Number,
      default: () => 0
    },
    open: {
      type: Boolean,
      default: () => !1
    },
    filled: {
      type: Boolean,
      default: () => !1
    },
    divided: {
      type: Boolean,
      default: () => !1
    },
    outlined: {
      type: Boolean,
      default: () => !1
    },
    separated: {
      type: Boolean,
      default: () => !1
    },
    animated: {
      type: Boolean,
      default: () => !1
    },
    exclusive: {
      type: Boolean,
      default: () => !1
    },
    keepRendered: {
      type: Boolean,
      default: () => !1
    }
  },
  emits: ["update:modelValue"],
  data: () => ({
    guid: ye
  }),
  created() {
    if (this.open && !this.exclusive) {
      let e = this.items;
      const s = [];
      for (; e; )
        s.push(e--);
      this.$emit("update:modelValue", s);
    }
  },
  computed: {
    value() {
      return this.modelValue;
    }
  },
  methods: {
    toggle(e) {
      if (this.value.includes(e)) {
        const s = this.value.slice();
        s.splice(s.indexOf(e), 1), this.$emit("update:modelValue", s);
      } else
        this.exclusive ? this.$emit("update:modelValue", [e]) : this.$emit("update:modelValue", [e].concat(this.value || []));
    }
  }
}, Gi = { class: "accordion-container" }, Yi = ["onClick"], Xi = /* @__PURE__ */ m("i", { class: "caret-left" }, null, -1), Ji = {
  key: 0,
  class: "content-wrapper"
};
function Qi(e, s, t, i, o, n) {
  const a = W("mask");
  return $((l(), r("div", Gi, [
    m("div", {
      class: y(["accordion accordion-root", {
        filled: t.filled,
        "filled-separate": t.separated,
        divided: t.divided,
        styled: t.outlined,
        animated: t.animated
      }])
    }, [
      (l(!0), r(B, null, V(t.items, (d) => (l(), r("div", {
        key: `${e.guid}-accordion-${d}`,
        class: y(["accordion-item", { active: n.value.includes(d) }])
      }, [
        m("div", {
          onClick: (u) => n.toggle(d),
          class: "accordion-title"
        }, [
          Xi,
          S(e.$slots, "title-" + d)
        ], 8, Yi),
        t.keepRendered || n.value.includes(d) ? $((l(), r("div", Ji, [
          m("div", {
            class: y(["content", { "accordion-animated-content": t.animated }])
          }, [
            S(e.$slots, "item-" + d)
          ], 2)
        ], 512)), [
          [me, n.value.includes(d)]
        ]) : p("", !0)
      ], 2))), 128))
    ], 2)
  ])), [
    [a, e.loading]
  ]);
}
const Zi = /* @__PURE__ */ O(Ki, [["render", Qi]]), el = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Zi
}, Symbol.toStringTag, { value: "Module" })), Is = (e, ...s) => Object.fromEntries(
  s.filter((t) => t in e).map((t) => [t, e[t]])
), tl = (e, ...s) => Object.fromEntries(
  s.filter(({ key: t }) => t in e).map(({ key: t, newName: i = t }) => [i, e[t]])
), sl = (e) => (pe("data-v-dd588220"), e = e(), ge(), e), nl = { class: "vu-alert-dialog-content" }, il = /* @__PURE__ */ sl(() => /* @__PURE__ */ m("hr", null, null, -1)), ll = [
  il
], ol = { class: "vu-alert-dialog-body" }, al = ["src"], rl = {
  key: 3,
  class: "vu-alert-dialog-title"
}, ul = {
  key: 4,
  class: "vu-alert-dialog-text"
}, dl = { class: "vu-alert-dialog-buttons" }, cl = {
  name: "vu-alert-dialog"
}, hl = /* @__PURE__ */ je({
  ...cl,
  props: {
    title: {},
    text: {},
    icon: {},
    svg: {},
    svgUrl: {},
    img: {},
    iconCircle: { type: Boolean },
    iconColor: {},
    animate: { type: Boolean },
    animationDuration: {},
    noOverlay: { type: Boolean },
    emitCancelOnClickOutside: { type: Boolean },
    emitCancelOnCloseButtonClick: { type: Boolean },
    showRiskyButton: { type: Boolean },
    showConfirmButton: { type: Boolean },
    showCloseButton: { type: Boolean },
    riskyButtonLabel: {},
    confirmButtonLabel: {},
    closeButtonLabel: {},
    _show: { type: Boolean },
    lazy: { type: Boolean },
    src: {},
    height: {},
    maxHeight: {},
    maxWidth: {},
    minHeight: {},
    minWidth: {},
    width: {},
    contain: { type: Boolean },
    aspectRatio: {}
  },
  emits: ["close", "confirm", "cancel"],
  setup(e, { emit: s }) {
    const t = e, i = s, o = se(Re), n = R(() => Is(t, "height", "maxHeight", "maxWidth", "minHeight", "minWidth", "width", "contain", "aspectRatio")), a = se(hs, "Confirm"), d = se(fs, "Close"), u = se(ps, "Cancel"), f = se(ms, "Proceed");
    return (c, h) => {
      const v = b("vu-icon"), k = b("vu-btn");
      return l(), r("div", {
        class: y(["vu-alert-dialog vu-alert-dialog-root", {
          "vu-alert-dialog--desktop": !F(o)
        }])
      }, [
        I(Me, { name: "fade" }, {
          default: C(() => [
            !c.noOverlay && !(c.animate && !c._show) ? (l(), r("div", {
              key: 0,
              class: "vu-overlay",
              onClick: h[0] || (h[0] = (w) => c.emitCancelOnClickOutside ? i("cancel") : i("close"))
            })) : p("", !0)
          ]),
          _: 1
        }),
        m("div", {
          class: y(["vu-alert-dialog-wrap", { "vu-alert-dialog--disposed": c.animate && !c._show }])
        }, [
          m("div", nl, [
            m("div", {
              class: "vu-alert-dialog-drag-handle",
              onClick: h[1] || (h[1] = (w) => c.emitCancelOnClickOutside ? i("cancel") : i("close"))
            }, ll),
            m("div", ol, [
              S(c.$slots, "alert-content", {}, () => [
                c.img || c.src ? (l(), _(Fe, z({
                  key: 0,
                  class: "vu-alert-dialog-image"
                }, n.value, {
                  src: c.img || c.src
                }), null, 16, ["src"])) : c.svgUrl ? (l(), r("img", {
                  key: 1,
                  src: c.svgUrl,
                  style: { height: "120px !important" }
                }, null, 8, al)) : c.icon || c.svg ? (l(), r("div", {
                  key: 2,
                  class: y(["vu-alert-dialog-icon-wrap", [{ "vu-alert-dialog-icon-circle": c.iconCircle }, c.iconColor ? `vu-alert-dialog-icon-${c.iconColor}` : ""]])
                }, [
                  c.svg ? (l(), _(vt(c.svg), { key: 1 })) : (l(), _(v, {
                    key: 0,
                    icon: c.icon,
                    "within-text": !1
                  }, null, 8, ["icon"]))
                ], 2)) : p("", !0),
                c.title ? (l(), r("div", rl, g(c.title), 1)) : p("", !0),
                c.text ? (l(), r("div", ul, g(c.text), 1)) : p("", !0)
              ], !0),
              S(c.$slots, "alert-buttons", {}, () => [
                m("div", dl, [
                  c.showConfirmButton ? (l(), _(k, {
                    key: 0,
                    color: "primary",
                    onClick: h[2] || (h[2] = (w) => i("confirm"))
                  }, {
                    default: C(() => [
                      x(g(c.confirmButtonLabel || F(a)), 1)
                    ]),
                    _: 1
                  })) : p("", !0),
                  c.showRiskyButton ? (l(), _(k, {
                    key: 1,
                    color: "error",
                    onClick: h[3] || (h[3] = (w) => i("confirm"))
                  }, {
                    default: C(() => [
                      x(g(c.riskyButtonLabel || F(f)), 1)
                    ]),
                    _: 1
                  })) : p("", !0),
                  c.showCloseButton ? (l(), _(k, {
                    key: 2,
                    onClick: h[4] || (h[4] = (w) => c.emitCancelOnCloseButtonClick ? i("cancel") : i("close"))
                  }, {
                    default: C(() => [
                      x(g(c.closeButtonLabel || c.showRiskyButton && F(u) || F(d)), 1)
                    ]),
                    _: 1
                  })) : p("", !0)
                ])
              ], !0)
            ])
          ])
        ], 2)
      ], 2);
    };
  }
}), Mt = /* @__PURE__ */ O(hl, [["__scopeId", "data-v-dd588220"]]), fl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Mt
}, Symbol.toStringTag, { value: "Module" })), ml = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 128 128"
}, pl = /* @__PURE__ */ m("path", { d: "M125.26 34.87 93.13 2.74C91.42 1.03 89.15 0 86.73 0H41.28c-2.42 0-4.69 1.03-6.4 2.74L2.74 34.87C1.03 36.58 0 38.85 0 41.27v45.45c0 2.42 1.03 4.69 2.74 6.4l32.13 32.13c1.71 1.71 3.98 2.74 6.4 2.74h45.45c2.42 0 4.69-1.03 6.4-2.74l32.13-32.13c1.71-1.71 2.74-3.98 2.74-6.4V41.27c0-2.42-1.03-4.69-2.74-6.4Zm-24.3 49.37-16.72 16.72L64 80.58l-20.24 20.38-16.72-16.72L47.42 64 27.04 43.76l16.72-16.72L64 47.42l20.24-20.38 16.72 16.72L80.58 64z" }, null, -1), gl = [
  pl
];
function vl(e, s) {
  return l(), r("svg", ml, [...gl]);
}
const yl = { render: vl }, bl = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 128 128"
}, _l = /* @__PURE__ */ m("path", { d: "M64 0C28.65 0 0 28.65 0 64s28.65 64 64 64 64-28.65 64-64S99.35 0 64 0m9.14 109.71H54.85V47.02h18.29zM64 36.57c-5.05 0-9.14-4.09-9.14-9.14s4.09-9.14 9.14-9.14 9.14 4.09 9.14 9.14-4.09 9.14-9.14 9.14" }, null, -1), wl = [
  _l
];
function kl(e, s) {
  return l(), r("svg", bl, [...wl]);
}
const Sl = { render: kl }, Cl = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 128 128"
}, Il = /* @__PURE__ */ m("path", { d: "M64 0C28.65 0 0 28.65 0 64s28.65 64 64 64 64-28.65 64-64S99.35 0 64 0m9.14 111.02H54.85V92.73h18.29zm13.33-43.89c-5.83 4.34-12.1 7.15-13.32 15.15H54.86c.81-11.79 6.46-17.35 11.89-21.55 5.29-4.2 9.8-7.31 9.8-14.63 0-8.27-4.31-12.15-11.49-12.15-9.76 0-13.84 8.01-13.98 17.63H31.23c.41-19.38 13.12-33.57 32.91-33.57 25.62 0 33.7 15.82 33.7 26.25 0 13.15-5.53 18.38-11.36 22.86Z" }, null, -1), Bl = [
  Il
];
function Ol(e, s) {
  return l(), r("svg", Cl, [...Bl]);
}
const Vl = { render: Ol }, $l = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 128 112.85"
}, xl = /* @__PURE__ */ m("path", { d: "M128 105.8c0-1.18-.26-2.39-.91-3.53L70.14 3.53C68.78 1.18 66.38 0 64 0s-4.78 1.17-6.14 3.53L.91 102.27c-.66 1.14-.91 2.35-.91 3.53 0 3.69 2.93 7.05 7.05 7.05h113.89c4.12 0 7.05-3.36 7.05-7.05Zm-54.86-7.84c0 1.44-1.17 2.61-2.61 2.61H57.47c-1.44 0-2.61-1.17-2.61-2.61V84.9c0-1.44 1.17-2.61 2.61-2.61h13.06c1.44 0 2.61 1.17 2.61 2.61zm-1.3-26.12H56.17l-1.31-37.88c0-3.61 2.92-6.53 6.53-6.53h5.22c3.61 0 6.53 2.92 6.53 6.53l-1.31 37.88Z" }, null, -1), Ml = [
  xl
];
function Pl(e, s) {
  return l(), r("svg", $l, [...Ml]);
}
const Ht = { render: Pl };
let Bs = {
  show: () => new Promise((e) => e),
  hide: () => {
  },
  information: () => new Promise((e) => e),
  confirm: () => new Promise((e) => e),
  warning: () => new Promise((e) => e),
  confirmWithRisk: () => new Promise((e) => e),
  error: () => new Promise((e) => e),
  _alerts: Se([])
};
function Ll(e) {
  const s = Se([]), t = yt({
    _alerts: s,
    show(i) {
      return this.hide(), new Promise((o, n) => {
        const a = {
          id: ye(),
          component: Mt,
          bind: Ne({
            height: 120,
            ...i,
            contain: !0,
            _show: !0
          }),
          on: {
            close: () => {
              this.hide(a), o();
            },
            confirm: () => {
              this.hide(a), o();
            },
            cancel: () => {
              this.hide(a), n();
            }
          }
        };
        this._alerts.push(Se(a));
      });
    },
    hide(i) {
      if (i) {
        const o = this._alerts.find((n) => n.id === i.id);
        if (!o)
          return;
        o.bind._show = !1, setTimeout(() => {
          const n = this._alerts.findIndex((a) => a.id === i.id);
          n > -1 && this._alerts.splice(n, 1);
        }, o.bind.animationDuration);
      } else
        this._alerts.forEach((o) => {
          o._show = !1;
        }), this._alerts.splice(0, this._alerts.length);
    },
    information(i) {
      return this.show({
        showCloseButton: !0,
        iconColor: "cyan",
        iconCircle: !0,
        icon: "info",
        svg: Sl,
        animate: !0,
        animationDuration: 300,
        ...i
      });
    },
    confirm(i) {
      return this.show({
        showCloseButton: !0,
        showConfirmButton: !0,
        iconColor: "cyan",
        iconCircle: !0,
        icon: "help",
        svg: Vl,
        animate: !0,
        animationDuration: 300,
        ...i,
        emitCancelOnClickOutside: !0,
        emitCancelOnCloseButtonClick: !0
      });
    },
    warning(i) {
      return this.show({
        iconColor: "orange",
        icon: "attention",
        svg: Ht,
        iconCircle: !0,
        showCloseButton: !0,
        animate: !0,
        animationDuration: 300,
        ...i
      });
    },
    confirmWithRisk(i) {
      return this.show({
        iconColor: "orange",
        icon: "attention",
        svg: Ht,
        iconCircle: !0,
        showRiskyButton: !0,
        showCloseButton: !0,
        animate: !0,
        animationDuration: 300,
        ...i,
        emitCancelOnClickOutside: !0,
        emitCancelOnCloseButtonClick: !0
      });
    },
    error(i) {
      return this.show({
        iconColor: "red",
        iconCircle: !0,
        icon: "error",
        svg: yl,
        showCloseButton: !0,
        animate: !0,
        animationDuration: 300,
        ...i
      });
    }
  });
  return Bs = t, e.provide("vuAlertDialogAPI", t), e.config.globalProperties.$vuAlertDialog = t, t;
}
const Tl = {
  name: "vu-alert-dialog-container",
  components: {
    VuAlertDialog: Mt
  },
  data: () => ({
    _alerts: {
      type: Object
    }
  }),
  created() {
    this._alerts = Bs._alerts;
  }
};
function Al(e, s, t, i, o, n) {
  return l(!0), r(B, null, V(e._alerts, (a) => (l(), _(vt(a.component), z({
    key: a.id
  }, a.bind, {
    modelValue: a.value,
    "onUpdate:modelValue": (d) => a.value = d
  }, fe(a.on)), null, 16, ["modelValue", "onUpdate:modelValue"]))), 128);
}
const Fl = /* @__PURE__ */ O(Tl, [["render", Al]]), Dl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Fl
}, Symbol.toStringTag, { value: "Module" })), Z = {
  props: {
    modelValue: {
      type: [Object, String, Number, Array, Boolean, Date],
      default: () => ""
    },
    label: {
      type: String,
      default: () => ""
    },
    type: {
      type: String,
      default: () => "text"
    },
    helper: {
      type: String,
      default: () => ""
    },
    placeholder: {
      type: String,
      default: () => ""
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  emits: ["update:modelValue"],
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(e) {
        this.$emit("update:modelValue", e);
      }
    }
  }
}, zl = {
  name: "vu-btn",
  mixins: [Ie, xt, Te, Z, K],
  props: {
    large: {
      type: Boolean,
      default: () => !1
    },
    small: {
      type: Boolean,
      default: () => !1
    },
    block: {
      type: Boolean,
      default: () => !1
    },
    icon: {
      type: String,
      required: !1
    }
  },
  data: () => ({
    getListenersFromAttrs: ce
    // tooltip: {},
  }),
  components: { VuIcon: H },
  computed: {
    classes() {
      return [
        `btn btn-${this.color}`,
        {
          "btn-sm": this.small,
          "btn-lg": this.large,
          "btn-block": this.block,
          active: this.active
        }
      ];
    }
  }
}, Nl = ["disabled"];
function El(e, s, t, i, o, n) {
  const a = b("VuIcon"), d = W("mask");
  return $((l(), r("button", z({
    type: "button",
    disabled: e.disabled
  }, fe(e.getListenersFromAttrs(e.$attrs), !0), { class: n.classes }), [
    t.icon ? (l(), _(a, {
      key: 0,
      icon: t.icon,
      color: "inherit"
    }, null, 8, ["icon"])) : p("", !0),
    S(e.$slots, "default", {}, void 0, !0)
  ], 16, Nl)), [
    [d, e.loading]
  ]);
}
const re = /* @__PURE__ */ O(zl, [["render", El], ["__scopeId", "data-v-e776bbe0"]]), jl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: re
}, Symbol.toStringTag, { value: "Module" })), Rl = { class: "vu-btn-dropdown flex flex-nowrap" }, Ul = {
  key: 1,
  class: "caret text-grey-7"
}, Hl = {
  name: "vu-btn-dropdown",
  components: { VuDropdownMenu: Ce, VuBtn: re, VuIcon: H, VuIconBtn: U }
}, ql = /* @__PURE__ */ je({
  ...Hl,
  props: {
    value: {},
    attach: {},
    position: {},
    shift: { type: Boolean },
    dividedResponsiveItems: { type: Boolean },
    color: {},
    icon: {},
    label: {},
    options: {},
    chevronDown: { type: Boolean }
  },
  emits: ["click", "click-item"],
  setup(e, { emit: s }) {
    const t = e, i = s;
    return (o, n) => (l(), r("div", Rl, [
      I(re, {
        icon: t.icon,
        color: t.color,
        class: "flex-basis-auto",
        style: M(t.options && "border-top-right-radius:0;border-bottom-right-radius:0"),
        onClick: n[0] || (n[0] = (a) => i("click", a))
      }, {
        default: C(() => [
          S(o.$slots, "default", {}, () => [
            x(g(o.label), 1)
          ], !0)
        ]),
        _: 3
      }, 8, ["icon", "color", "style"]),
      t.options ? (l(), _(Ce, z({ key: 0 }, { ...t, items: o.options }, {
        class: "flex-basis-[38px] ml-[2px]",
        style: { display: "flex" },
        onClickItem: n[1] || (n[1] = (a) => i("click-item", a))
      }), {
        default: C(({ active: a }) => [
          I(re, {
            color: o.color,
            class: "dropdown_btn",
            active: a
          }, {
            default: C(() => [
              o.chevronDown ? (l(), _(H, {
                key: 0,
                icon: "chevron-down"
              })) : (l(), r("span", Ul))
            ]),
            _: 2
          }, 1032, ["color", "active"])
        ]),
        _: 1
      }, 16)) : p("", !0)
    ]));
  }
}), Wl = /* @__PURE__ */ O(ql, [["__scopeId", "data-v-ba275fde"]]), Kl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Wl
}, Symbol.toStringTag, { value: "Module" })), Gl = {
  name: "vu-btn-grp",
  mixins: [Ie],
  props: {
    color: {
      type: String,
      default: () => "default"
    }
  }
}, Yl = { class: "btn-grp" };
function Xl(e, s, t, i, o, n) {
  const a = W("mask");
  return $((l(), r("div", Yl, [
    S(e.$slots, "default")
  ])), [
    [a, e.loading]
  ]);
}
const Jl = /* @__PURE__ */ O(Gl, [["render", Xl]]), Ql = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Jl
}, Symbol.toStringTag, { value: "Module" })), Zl = {
  name: "vu-carousel-slide",
  props: { title: { type: String, default: "" } },
  emits: ["slideclick", "slide-click"],
  data() {
    return {
      width: null,
      id: "",
      carousel: void 0,
      guid: ye
    };
  },
  created() {
    this.id = this.guid(), this.carousel = this.$parent;
  },
  mounted() {
    this.$isServer || this.$el.addEventListener("dragstart", (e) => e.preventDefault()), this.$el.addEventListener(
      this.carousel.isTouch ? "touchend" : "mouseup",
      this.onTouchEnd
    );
  },
  computed: {
    activeSlides() {
      const { currentPage: e = 0, breakpointSlidesPerPage: s, children: t } = this.carousel, i = [], o = t.filter(
        (a) => a.$el && a.$el.className.indexOf("vu-slide") >= 0
      ).map((a) => a._uid || a.id);
      let n = 0;
      for (; n < s; ) {
        const a = o[e * s + n];
        i.push(a), n++;
      }
      return i;
    },
    /**
     * `isActive` describes whether a slide is visible
     * @return {Boolean}
     */
    isActive() {
      return this.activeSlides.indexOf(this._uid) >= 0;
    },
    /**
     * `isCenter` describes whether a slide is in the center of all visible slides
     * if perPage is an even number, we quit
     * @return {Boolean}
     */
    isCenter() {
      const { breakpointSlidesPerPage: e } = this.carousel;
      return e % 2 === 0 || !this.isActive ? !1 : this.activeSlides.indexOf(this._uid) === Math.floor(e / 2);
    },
    /**
     * `isAdjustableHeight` describes if the carousel adjusts its height to the active slide(s)
     * @return {Boolean}
     */
    isAdjustableHeight() {
      const { adjustableHeight: e } = this.carousel;
      return e;
    }
  },
  methods: {
    onTouchEnd(e) {
      const s = this.carousel.isTouch && e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches[0].clientX : e.clientX, t = this.carousel.dragStartX - s;
      (this.carousel.minSwipeDistance === 0 || Math.abs(t) < this.carousel.minSwipeDistance) && (this.$emit("slideclick", { ...e.currentTarget.dataset }), this.$emit("slide-click", { ...e.currentTarget.dataset }));
    }
  }
}, eo = ["aria-hidden"];
function to(e, s, t, i, o, n) {
  return l(), r("div", {
    class: y(["vu-slide", {
      "vu-slide-active": n.isActive,
      "vu-slide-center": n.isCenter,
      "vu-slide-adjustableHeight": n.isAdjustableHeight
    }]),
    tabindex: "-1",
    "aria-hidden": !n.isActive,
    role: "tabpanel"
  }, [
    S(e.$slots, "default")
  ], 10, eo);
}
const so = /* @__PURE__ */ O(Zl, [["render", to]]), no = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: so
}, Symbol.toStringTag, { value: "Module" })), io = {
  props: {
    /**
     * Flag to enable autoplay
     */
    autoplay: {
      type: Boolean,
      default: !1
    },
    /**
     * Time elapsed before advancing slide
     */
    autoplayTimeout: {
      type: Number,
      default: 3e3
    },
    /**
     * Flag to pause autoplay on hover
     */
    autoplayHoverPause: {
      type: Boolean,
      default: !0
    },
    /**
     * Autoplay direction. User can insert backward to make autoplay move from right to left
     */
    autoplayDirection: {
      type: String,
      default: "forward"
    }
  },
  data() {
    return {
      autoplayInterval: null
    };
  },
  destroyed() {
    this.$isServer || (this.$el.removeEventListener("mouseenter", this.pauseAutoplay), this.$el.removeEventListener("mouseleave", this.startAutoplay));
  },
  methods: {
    pauseAutoplay() {
      this.autoplayInterval && (this.autoplayInterval = clearInterval(this.autoplayInterval));
    },
    startAutoplay() {
      this.autoplay && (this.autoplayInterval = setInterval(
        this.autoplayAdvancePage,
        this.autoplayTimeout
      ));
    },
    restartAutoplay() {
      this.pauseAutoplay(), this.startAutoplay();
    },
    autoplayAdvancePage() {
      this.advancePage(this.autoplayDirection);
    }
  },
  mounted() {
    !this.$isServer && this.autoplayHoverPause && (this.$el.addEventListener("mouseenter", this.pauseAutoplay), this.$el.addEventListener("mouseleave", this.startAutoplay)), this.startAutoplay();
  }
}, lo = (e, s, t) => {
  let i;
  return () => {
    const n = () => {
      i = null, t || e.apply(void 0);
    }, a = t && !i;
    clearTimeout(i), i = setTimeout(n, s), a && e.apply(void 0);
  };
}, lt = {
  onwebkittransitionend: "webkitTransitionEnd",
  onmoztransitionend: "transitionend",
  onotransitionend: "oTransitionEnd otransitionend",
  ontransitionend: "transitionend"
}, qt = () => {
  const e = Object.keys(lt).find((s) => s in window);
  return e ? lt[e] : lt.ontransitionend;
}, oo = {
  name: "vu-carousel",
  emits: ["pageChange", "page-change", "update:modelValue", "navigation-click", "pagination-click", "transitionStart", "transition-start", "transitionEnd", "transition-end", "mounted"],
  beforeUpdate() {
    this.computeCarouselWidth();
  },
  data() {
    return {
      browserWidth: null,
      carouselWidth: 0,
      currentPage: 0,
      dragging: !1,
      dragMomentum: 0,
      dragOffset: 0,
      dragStartY: 0,
      dragStartX: 0,
      isTouch: typeof window < "u" && "ontouchstart" in window,
      offset: 0,
      refreshRate: 16,
      slideCount: 0,
      transitionstart: "transitionstart",
      transitionend: "transitionend",
      currentHeight: "auto"
    };
  },
  mixins: [io],
  // use `provide` to avoid `Slide` being nested with other components
  provide() {
    return {
      carousel: this
    };
  },
  props: {
    /**
       *  Adjust the height of the carousel for the current slide
       */
    adjustableHeight: {
      type: Boolean,
      default: !1
    },
    /**
       * Slide transition easing for adjustableHeight
       * Any valid CSS transition easing accepted
       */
    adjustableHeightEasing: {
      type: String,
      default: ""
    },
    /**
       *  Center images when the size is less than the container width
       */
    centerMode: {
      type: Boolean,
      default: !1
    },
    /**
       * Slide transition easing
       * Any valid CSS transition easing accepted
       */
    easing: {
      type: String,
      validator(e) {
        return ["ease", "linear", "ease-in", "ease-out", "ease-in-out"].indexOf(e) !== -1 || e.includes("cubic-bezier");
      },
      default: "ease"
    },
    /**
       * Flag to make the carousel loop around when it reaches the end
       */
    loop: {
      type: Boolean,
      default: !1
    },
    /**
       * Minimum distance for the swipe to trigger
       * a slide advance
       */
    minSwipeDistance: {
      type: Number,
      default: 8
    },
    /**
       * Flag to toggle mouse dragging
       */
    mouseDrag: {
      type: Boolean,
      default: !0
    },
    /**
       * Flag to toggle touch dragging
       */
    touchDrag: {
      type: Boolean,
      default: !0
    },
    /**
       * Flag to render pagination component
       */
    pagination: {
      type: Boolean,
      default: !0
    },
    /**
       * Maximum number of slides displayed on each page
       */
    perPage: {
      type: Number,
      default: 1
    },
    /**
       * Configure the number of visible slides with a particular browser width.
       * This will be an array of arrays, ex. [[320, 2], [1199, 4]]
       * Formatted as [x, y] where x=browser width, and y=number of slides displayed.
       * ex. [1199, 4] means if (window <= 1199) then show 4 slides per page
       */
    // eslint-disable-next-line vue/require-default-prop
    perPageCustom: {
      type: Array
    },
    /**
       * Resistance coefficient to dragging on the edge of the carousel
       * This dictates the effect of the pull as you move towards the boundaries
       */
    resistanceCoef: {
      type: Number,
      default: 20
    },
    /**
       * Scroll per page, not per item
       */
    scrollPerPage: {
      type: Boolean,
      default: !1
    },
    /**
       *  Space padding option adds left and right padding style (in pixels) onto vu-carousel-inner.
       */
    spacePadding: {
      type: Number,
      default: 0
    },
    /**
       *  Specify by how much should the space padding value be multiplied of, to re-arange the final slide padding.
       */
    spacePaddingMaxOffsetFactor: {
      type: Number,
      default: 0
    },
    /**
       * Slide transition speed
       * Number of milliseconds accepted
       */
    speed: {
      type: Number,
      default: 500
    },
    /**
       * Name (tag) of slide component
       * Overwrite when extending slide component
       */
    tagName: {
      type: String,
      default: "slide"
    },
    /**
       * Support for v-model functionality
       */
    modelValue: {
      type: Number,
      default: 0
    },
    /**
       * Support Max pagination dot amount
       */
    maxPaginationDotCount: {
      type: Number,
      default: -1
    }
  },
  watch: {
    value(e) {
      e !== this.currentPage && (this.goToPage(e), this.render());
    },
    currentPage(e) {
      this.$emit("pageChange", e), this.$emit("page-change", e), this.$emit("update:modelValue", e);
    },
    autoplay(e) {
      e === !1 ? this.pauseAutoplay() : this.restartAutoplay();
    }
  },
  computed: {
    children() {
      return this.$slots && this.$slots.default() && this.$slots.default().filter((e) => e.tag && e.tag.match(
        `^vue-component-\\d+-${this.tagName}$`
      ) !== null) || [];
    },
    /**
       * Given a viewport width, find the number of slides to display
       * @param  {Number} width Current viewport width in pixels
       * @return {Number} Number of slides to display
       */
    breakpointSlidesPerPage() {
      if (!this.perPageCustom)
        return this.perPage;
      const e = this.perPageCustom, s = this.browserWidth, i = e.sort(
        (n, a) => n[0] > a[0] ? -1 : 1
      ).filter((n) => s >= n[0]);
      return i[0] && i[0][1] || this.perPage;
    },
    /**
       * @return {Boolean} Can the slider move forward?
       */
    canAdvanceForward() {
      return this.loop || this.offset < this.maxOffset;
    },
    /**
       * @return {Boolean} Can the slider move backward?
       */
    canAdvanceBackward() {
      return this.loop || this.currentPage > 0;
    },
    /**
       * Number of slides to display per page in the current context.
       * This is constant unless responsive perPage option is set.
       * @return {Number} The number of slides per page to display
       */
    currentPerPage() {
      return !this.perPageCustom || this.$isServer ? this.perPage : this.breakpointSlidesPerPage;
    },
    /**
       * The horizontal distance the inner wrapper is offset while navigating.
       * @return {Number} Pixel value of offset to apply
       */
    currentOffset() {
      return this.isCenterModeEnabled ? 0 : (this.offset + this.dragOffset) * -1;
    },
    isHidden() {
      return this.carouselWidth <= 0;
    },
    /**
       * Maximum offset the carousel can slide
       * Considering the spacePadding
       * @return {Number}
       */
    maxOffset() {
      return Math.max(
        this.slideWidth * (this.slideCount - this.currentPerPage) - this.spacePadding * this.spacePaddingMaxOffsetFactor,
        0
      );
    },
    /**
       * Calculate the number of pages of slides
       * @return {Number} Number of pages
       */
    pageCount() {
      return this.scrollPerPage ? Math.ceil(this.slideCount / this.currentPerPage) : this.slideCount - this.currentPerPage + 1;
    },
    /**
       * Calculate the width of each slide
       * @return {Number} Slide width
       */
    slideWidth() {
      const e = this.carouselWidth - this.spacePadding * 2, s = this.currentPerPage;
      return e / s;
    },
    /**
       * @return {Boolean} Is navigation required?
       */
    isNavigationRequired() {
      return this.slideCount > this.currentPerPage;
    },
    /**
       * @return {Boolean} Center images when have less than min currentPerPage value
       */
    isCenterModeEnabled() {
      return this.centerMode && !this.isNavigationRequired;
    },
    transitionStyle() {
      const e = `${this.speed / 1e3}s`, s = `${e} ${this.easing} transform`;
      return this.adjustableHeight ? `${s}, height ${e} ${this.adjustableHeightEasing || this.easing}` : s;
    },
    padding() {
      const e = this.spacePadding;
      return e > 0 ? e : !1;
    }
  },
  methods: {
    /**
       * @return {Number} The index of the next page
       * */
    getNextPage() {
      return this.currentPage < this.pageCount - 1 ? this.currentPage + 1 : this.loop ? 0 : this.currentPage;
    },
    /**
       * @return {Number} The index of the previous page
       * */
    getPreviousPage() {
      return this.currentPage > 0 ? this.currentPage - 1 : this.loop ? this.pageCount - 1 : this.currentPage;
    },
    /**
       * Increase/decrease the current page value
       * @param  {String} direction (Optional) The direction to advance
       */
    advancePage(e) {
      e === "backward" && this.canAdvanceBackward ? this.goToPage(this.getPreviousPage(), "navigation") : (!e || e !== "backward") && this.canAdvanceForward && this.goToPage(this.getNextPage(), "navigation");
    },
    goToLastSlide() {
      this.dragging = !0, setTimeout(() => {
        this.dragging = !1;
      }, this.refreshRate), this.$nextTick(() => {
        this.goToPage(this.pageCount);
      });
    },
    /**
       * A mutation observer is used to detect changes to the containing node
       * in order to keep the magnet container in sync with the height its reference node.
       */
    attachMutationObserver() {
      const e = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
      if (e) {
        let s = {
          attributes: !0,
          data: !0
        };
        if (this.adjustableHeight && (s = {
          ...s,
          childList: !0,
          subtree: !0,
          characterData: !0
        }), this.mutationObserver = new e(() => {
          this.$nextTick(() => {
            this.computeCarouselWidth(), this.computeCarouselHeight();
          });
        }), this.$parent.$el) {
          const t = this.$el.getElementsByClassName(
            "vu-carousel-inner"
          );
          for (let i = 0; i < t.length; i++)
            this.mutationObserver.observe(t[i], s);
        }
      }
    },
    handleNavigation(e) {
      this.advancePage(e), this.pauseAutoplay(), this.$emit("navigation-click", e);
    },
    /**
       * Stop listening to mutation changes
       */
    detachMutationObserver() {
      this.mutationObserver && this.mutationObserver.disconnect();
    },
    /**
       * Get the current browser viewport width
       * @return {Number} Browser"s width in pixels
       */
    getBrowserWidth() {
      return this.browserWidth = window.innerWidth, this.browserWidth;
    },
    /**
       * Get the width of the carousel DOM element
       * @return {Number} Width of the carousel in pixels
       */
    getCarouselWidth() {
      const e = this.$el.getElementsByClassName(
        "vu-carousel-inner"
      );
      for (let s = 0; s < e.length; s++)
        e[s].clientWidth > 0 && (this.carouselWidth = e[s].clientWidth || 0);
      return this.carouselWidth;
    },
    /**
       * Get the maximum height of the carousel active slides
       * @return {String} The carousel height
       */
    getCarouselHeight() {
      if (!this.adjustableHeight)
        return "auto";
      const e = this.currentPerPage * (this.currentPage + 1) - 1, s = [...Array(this.currentPerPage)].map((t, i) => this.getSlide(e + i)).reduce(
        (t, i) => Math.max(t, i && i.$el.clientHeight || 0),
        0
      );
      return this.currentHeight = s === 0 ? "auto" : `${s}px`, this.currentHeight;
    },
    /**
       * Filter slot contents to slide instances and return length
       * @return {Number} The number of slides
       */
    getSlideCount() {
      return this.children.length;
    },
    /**
       * Gets the slide at the specified index
       * @return {Object} The slide at the specified index
       */
    getSlide(e) {
      return this.children[e];
    },
    /**
       * Set the current page to a specific value
       * This function will only apply the change if the value is within the carousel bounds
       * for carousel scrolling per page.
       * @param  {Number} page The value of the new page number
       * @param  {string|undefined} advanceType An optional value describing the type of page advance
       */
    goToPage(e, s) {
      e >= 0 && e <= this.pageCount && (this.offset = this.scrollPerPage ? Math.min(this.slideWidth * this.currentPerPage * e, this.maxOffset) : this.slideWidth * e, this.autoplay && !this.autoplayHoverPause && this.restartAutoplay(), this.currentPage = e, s === "pagination" && (this.pauseAutoplay(), this.$emit("pagination-click", e)));
    },
    /**
       * Trigger actions when mouse is pressed
       * @param  {Object} e The event object
       */
    /* istanbul ignore next */
    onStart(e) {
      e.button !== 2 && (document.addEventListener(this.isTouch ? "touchend" : "mouseup", this.onEnd, !0), document.addEventListener(this.isTouch ? "touchmove" : "mousemove", this.onDrag, !0), this.startTime = e.timeStamp, this.dragging = !0, this.dragStartX = this.isTouch ? e.touches[0].clientX : e.clientX, this.dragStartY = this.isTouch ? e.touches[0].clientY : e.clientY);
    },
    /**
       * Trigger actions when mouse is released
       * @param  {Object} e The event object
       */
    onEnd(e) {
      this.autoplay && !this.autoplayHoverPause && this.restartAutoplay(), this.pauseAutoplay();
      const s = this.isTouch ? e.changedTouches[0].clientX : e.clientX, t = this.dragStartX - s;
      if (this.dragMomentum = t / (e.timeStamp - this.startTime), this.minSwipeDistance !== 0 && Math.abs(t) >= this.minSwipeDistance) {
        const i = this.scrollPerPage ? this.slideWidth * this.currentPerPage : this.slideWidth;
        this.dragOffset += Math.sign(t) * (i / 2);
      }
      this.offset += this.dragOffset, this.dragOffset = 0, this.dragging = !1, this.render(), document.removeEventListener(this.isTouch ? "touchend" : "mouseup", this.onEnd, !0), document.removeEventListener(this.isTouch ? "touchmove" : "mousemove", this.onDrag, !0);
    },
    /**
       * Trigger actions when mouse is pressed and then moved (mouse drag)
       * @param  {Object} e The event object
       */
    onDrag(e) {
      const s = this.isTouch ? e.touches[0].clientX : e.clientX, t = this.isTouch ? e.touches[0].clientY : e.clientY, i = this.dragStartX - s, o = this.dragStartY - t;
      if (this.isTouch && Math.abs(i) < Math.abs(o))
        return;
      e.stopImmediatePropagation(), this.dragOffset = i;
      const n = this.offset + this.dragOffset;
      n < 0 ? this.dragOffset = -Math.sqrt(-this.resistanceCoef * this.dragOffset) : n > this.maxOffset && (this.dragOffset = Math.sqrt(this.resistanceCoef * this.dragOffset));
    },
    onResize() {
      this.computeCarouselWidth(), this.computeCarouselHeight(), this.dragging = !0, this.render(), setTimeout(() => {
        this.dragging = !1;
      }, this.refreshRate);
    },
    render() {
      this.offset += Math.max(-this.currentPerPage + 1, Math.min(
        Math.round(this.dragMomentum),
        this.currentPerPage - 1
      )) * this.slideWidth;
      const e = this.scrollPerPage ? this.slideWidth * this.currentPerPage : this.slideWidth, s = e * Math.floor(this.slideCount / (this.currentPerPage - 1)), t = s + this.slideWidth * (this.slideCount % this.currentPerPage);
      this.offset > (s + t) / 2 ? this.offset = t : this.offset = e * Math.round(this.offset / e), this.offset = Math.max(0, Math.min(this.offset, this.maxOffset)), this.currentPage = this.scrollPerPage ? Math.round(this.offset / this.slideWidth / this.currentPerPage) : Math.round(this.offset / this.slideWidth);
    },
    /**
       * Re-compute the width of the carousel and its slides
       */
    computeCarouselWidth() {
      this.getSlideCount(), this.getBrowserWidth(), this.getCarouselWidth(), this.setCurrentPageInBounds();
    },
    /**
       * Re-compute the height of the carousel and its slides
       */
    computeCarouselHeight() {
      this.getCarouselHeight();
    },
    /**
       * When the current page exceeds the carousel bounds, reset it to the maximum allowed
       */
    setCurrentPageInBounds() {
      if (!this.canAdvanceForward && this.scrollPerPage) {
        const e = this.pageCount - 1;
        this.currentPage = e >= 0 ? e : 0, this.offset = Math.max(0, Math.min(this.offset, this.maxOffset));
      }
    },
    handleTransitionStart() {
      this.$emit("transitionStart"), this.$emit("transition-start");
    },
    handleTransitionEnd() {
      this.$emit("transitionEnd"), this.$emit("transition-end");
    }
  },
  mounted() {
    window.addEventListener(
      "resize",
      lo(this.onResize, this.refreshRate)
    ), (this.isTouch && this.touchDrag || this.mouseDrag) && this.$refs["vu-carousel-wrapper"].addEventListener(
      this.isTouch ? "touchstart" : "mousedown",
      this.onStart
    ), this.attachMutationObserver(), this.computeCarouselWidth(), this.computeCarouselHeight(), this.transitionstart = qt(), this.$refs["vu-carousel-inner"].addEventListener(this.transitionstart, this.handleTransitionStart), this.transitionend = qt(), this.$refs["vu-carousel-inner"].addEventListener(this.transitionend, this.handleTransitionEnd), this.$emit("mounted"), this.autoplayDirection === "backward" && this.goToLastSlide();
  },
  beforeUnmount() {
    this.detachMutationObserver(), window.removeEventListener("resize", this.getBrowserWidth), this.$refs["vu-carousel-inner"].removeEventListener(
      this.transitionstart,
      this.handleTransitionStart
    ), this.$refs["vu-carousel-inner"].removeEventListener(
      this.transitionend,
      this.handleTransitionEnd
    ), this.$refs["vu-carousel-wrapper"].removeEventListener(
      this.isTouch ? "touchstart" : "mousedown",
      this.onStart
    );
  }
}, ao = { class: "vu-carousel" }, ro = {
  class: "vu-carousel-wrapper",
  ref: "vu-carousel-wrapper"
}, uo = {
  key: 0,
  class: "carousel-indicators"
}, co = ["onClick"];
function ho(e, s, t, i, o, n) {
  return l(), r("div", ao, [
    m("div", ro, [
      m("div", {
        ref: "vu-carousel-inner",
        class: y([
          "vu-carousel-inner",
          { "vu-carousel-inner--center": n.isCenterModeEnabled }
        ]),
        style: M({
          transform: `translate(${n.currentOffset}px, 0)`,
          transition: o.dragging ? "none" : n.transitionStyle,
          "ms-flex-preferred-size": `${n.slideWidth}px`,
          "webkit-flex-basis": `${n.slideWidth}px`,
          "flex-basis": `${n.slideWidth}px`,
          visibility: n.slideWidth ? "visible" : "hidden",
          height: `${o.currentHeight}`,
          "padding-left": `${n.padding}px`,
          "padding-right": `${n.padding}px`
        })
      }, [
        S(e.$slots, "default")
      ], 6)
    ], 512),
    t.pagination && n.pageCount > 1 ? (l(), r("ol", uo, [
      (l(!0), r(B, null, V(n.pageCount, (a, d) => (l(), r("li", {
        key: `carousel-pagination_${d}`,
        class: y(["indicator", { active: d === o.currentPage }]),
        onClick: (u) => n.goToPage(d, "pagination")
      }, null, 10, co))), 128))
    ])) : p("", !0)
  ]);
}
const fo = /* @__PURE__ */ O(oo, [["render", ho]]), mo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: fo
}, Symbol.toStringTag, { value: "Module" })), ee = {
  exposes: ["validate"],
  props: {
    rules: {
      type: [Array],
      default: () => [() => !0]
    },
    required: {
      type: Boolean,
      default: () => !1
    },
    success: {
      type: Boolean,
      default: () => !1
    },
    lazyValidation: {
      type: Boolean,
      default: () => !1
    }
  },
  data: () => ({
    errorBucket: [],
    valid: !0,
    localRules: []
  }),
  inject: {
    vuDebug: {
      default: !1
    }
  },
  watch: {
    value(e) {
      this.lazyValidation || (this.valid = this.validate(e));
    }
  },
  computed: {
    classes() {
      return {
        "has-error": !this.valid,
        "has-success": this.success && this.valid
      };
    },
    hasError() {
      return this.errorBucket.length > 0;
    },
    hasSuccess() {
      return this.errorBucket.length === 0;
    },
    isValid() {
      if (!this.required)
        return !0;
      switch (typeof this.value) {
        case "string":
        case "array":
        case "number":
        case "date":
          return this.value.length !== 0;
        default:
          return !0;
      }
    }
  },
  methods: {
    validate(e, s) {
      const t = [];
      let i = 0;
      const o = e || this.value, n = [...this.localRules, ...this.rules];
      for (let a = 0; a < n.length; a++) {
        const d = n[a], u = typeof d == "function" ? d(o) : d;
        typeof u == "string" ? (t.push(u), i += 1) : typeof u == "boolean" && !u ? i += 1 : typeof u != "boolean" && this.vuDebug && console.error(`Rules should return a string or boolean, received '${typeof u}' instead`, this);
      }
      return s || (this.errorBucket = t), this.valid = i === 0 && this.isValid, this.valid;
    }
  }
}, po = {
  data: () => ({
    inputs: []
  }),
  exposes: ["validate"],
  provide() {
    return {
      inputs: this.inputs
    };
  },
  methods: {
    validate(e) {
      return this.inputs.map((s) => s.validate(void 0, e)).reduce((s, t) => s && t, !0);
    }
  }
}, te = {
  inject: {
    inputs: {
      default: () => ""
    }
  },
  created() {
    typeof this.inputs == "object" && this.inputs.push(this);
  },
  beforeUnmount() {
    typeof this.inputs == "object" && this.inputs.splice(this.inputs.indexOf(this), 1);
  }
}, Wt = [...Array(256).keys()].map((e) => e.toString(16).padStart(2, "0")), be = () => {
  const e = crypto.getRandomValues(new Uint8Array(16));
  return e[6] = e[6] & 15 | 64, e[8] = e[8] & 63 | 128, [...e.entries()].map(([s, t]) => [4, 6, 8, 10].includes(s) ? `-${Wt[t]}` : Wt[t]).join("");
}, go = {
  name: "vu-checkbox",
  mixins: [Z, ee, te, K],
  emits: ["update:modelValue"],
  inheritAttrs: !1,
  props: {
    dense: {
      type: Boolean,
      default: () => !1
    },
    switch: {
      type: Boolean,
      required: !1
    },
    type: {
      type: String,
      default: () => "checkbox"
    }
  },
  data: () => ({ uid: be() }),
  computed: {
    internalClasses() {
      return {
        "toggle-switch": this.type === "switch",
        "toggle-primary": ["checkbox", "radio", "dense"].includes(this.type)
      };
    }
  },
  methods: {
    input(e) {
      if (this.options.length > 1 && this.type !== "radio") {
        if (e.target.checked)
          return this.$emit("update:modelValue", [e.target.value].concat(this.value));
        const s = JSON.parse(JSON.stringify(this.value));
        return s.splice(this.value.indexOf(e.target.value), 1), this.$emit("update:modelValue", s);
      }
      return this.$emit("update:modelValue", e.target.checked ? e.target.value : null);
    },
    isChecked(e) {
      return Array.isArray(this.value) ? this.value.includes(e) : this.type === "radio" ? this.value === e : !!this.value;
    }
  }
}, vo = {
  key: 0,
  class: "control-label"
}, yo = {
  key: 0,
  class: "label-field-required"
}, bo = ["type", "id", "value", "disabled", "checked"], _o = ["innerHTML", "for"], wo = {
  key: 1,
  class: "form-control-helper-text"
};
function ko(e, s, t, i, o, n) {
  return l(), r("div", {
    class: y(["form-group", { dense: t.dense }])
  }, [
    e.label.length ? (l(), r("label", vo, [
      x(g(e.label), 1),
      e.required ? (l(), r("span", yo, " *")) : p("", !0)
    ])) : p("", !0),
    (l(!0), r(B, null, V(e.options, (a, d) => (l(), r("div", {
      key: `${e.uid}-${a.value}-${d}`,
      class: y(["toggle", n.internalClasses])
    }, [
      (l(), r("input", {
        type: t.type === "radio" ? "radio" : "checkbox",
        id: `${e.uid}-${a.value}-${d}`,
        value: a.value,
        disabled: e.disabled || a.disabled,
        checked: n.isChecked(a.value),
        key: n.isChecked(a.value),
        onClick: s[0] || (s[0] = Q((...u) => n.input && n.input(...u), ["prevent"]))
      }, null, 8, bo)),
      m("label", {
        class: "control-label",
        innerHTML: a.label,
        for: `${e.uid}-${a.value}-${d}`
      }, null, 8, _o),
      S(e.$slots, "prepend-icon", { item: a }, void 0, !0)
    ], 2))), 128)),
    (l(!0), r(B, null, V(e.errorBucket, (a, d) => (l(), r("span", {
      key: `${d}-error-${a}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, g(a), 1))), 128)),
    e.helper.length ? (l(), r("span", wo, g(e.helper), 1)) : p("", !0)
  ], 2);
}
const Os = /* @__PURE__ */ O(go, [["render", ko], ["__scopeId", "data-v-d2a89048"]]), So = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Os
}, Symbol.toStringTag, { value: "Module" }));
function Co(e, s = {}) {
  const {
    onVisibleChange: t = de,
    onShow: i = de,
    onHide: o = de,
    attach: n,
    target: a
  } = s, d = R(() => j(e)), u = R(() => j(n)), f = R(() => j(a)), c = L(!0), h = L(!1), v = L({ x: 0, y: 0 }), k = () => setTimeout(() => h.value = !0, 10), w = () => {
    const A = !h.value;
    h.value = !1, A && o();
  }, T = zn(d, { width: 0, height: 0 }, { box: "border-box" }), D = Dn(u), Be = R(() => n !== document.body), G = Nn({
    includeScrollbar: !1
  }), ne = R(() => Math.max(D.top.value, 0)), E = R(() => Math.min(D.right.value, G.width.value)), P = R(() => {
    let [A, Y, Ve, $e] = [
      `${v.value.x}px`,
      `${v.value.y}px`,
      null,
      null
    ];
    const st = v.value.x + T.width.value > E.value, nt = v.value.y + T.height.value > G.height.value;
    if (st && (A = `${D.right.value - (Be.value ? 0 : v.value.x) - T.width.value}px`), nt)
      if (D.height.value - v.value.y > 0) {
        const nn = G.height.value - v.value.y;
        v.value.y - ne.value < nn ? [Y, $e] = [`${ne.value}px`, null] : [Y, $e] = [null, `${G.height.value - G.height.value}px`];
      } else
        [Y, $e] = [null, `${G.height.value - v.value.y}px`];
    return {
      left: A,
      top: Y,
      right: Ve,
      bottom: $e
    };
  });
  function De() {
    var Ve;
    const A = [];
    let Y = (Ve = J(f)) == null ? void 0 : Ve.parentElement;
    for (; Y; ) {
      const { overflow: $e } = window.getComputedStyle(Y), st = $e.split(" ");
      ["auto", "scroll"].some((nt) => st.includes(nt)) && A.push(Y), Y = Y.parentElement;
    }
    return A;
  }
  X(c, w), X(h, t);
  const He = [Ke(
    () => {
      const A = d.value;
      if (A) {
        A.style.position = "fixed", A.style.visibility = h.value ? "visible" : "hidden";
        for (const [Y, Ve] of Object.entries(P.value))
          A.style.setProperty(Y, Ve);
      }
    },
    { flush: "post" }
  )], _e = [], Oe = [], en = () => {
    c.value = !1, pt(() => {
      He.concat(_e, Oe).forEach((A) => A());
    });
  }, Nt = (A) => {
    i(), !(!c.value || A != null && A._prevent) && (A.preventDefault(), v.value = {
      x: A.clientX,
      y: A.clientY
    }, k(), A._prevent = !0);
  }, tn = Ke(() => {
    if (_e.forEach((A) => A()), _e.splice(0, _e.length), h.value && (_e.push(
      q("scroll", w),
      q("click", w),
      q("contextmenu", w, { capture: !0 })
    ), J(u) && _e.push(q(J(u), "scroll", w)), J(f))) {
      const A = De();
      _e.push(...A.map((Y) => q(Y, "scroll", w)));
    }
  }), sn = Ke(() => {
    Oe.forEach((A) => A()), Oe.splice(0, Oe.length), f ? Oe.push(q(J(f) || document.body, "contextmenu", Nt)) : Oe.push(q("contextmenu", Nt));
  });
  return He.push(tn, sn), {
    visible: h,
    position: v,
    enabled: c,
    hide: w,
    show: k,
    stop: en
  };
}
const Io = {
  name: "vu-contextual-dropdown"
}, Bo = /* @__PURE__ */ je({
  ...Io,
  props: {
    /**
     * The area where the right-click will be listened to.
     * @default document.body
     */
    target: {
      type: Object,
      // [Boolean, String, Element],
      default: void 0
    },
    /**
     * Selected items.
     */
    value: {
      type: Array,
      default: () => []
    },
    /**
     * List of items to render.
     */
    items: {
      type: Array,
      required: !0
    },
    /**
     * In responsive-mode, separates sub-menu open icon with item text.
     * Useful when an item with a sub-menu is selectable.
     */
    dividedResponsiveItems: {
      type: Boolean,
      default: !1
    },
    /**
     * Allows to tweak z-Index value.
     */
    zIndex: {
      type: Number,
      default: () => 1e3
    },
    /**
     * Should the menu close on item click.
     */
    closeOnClick: {
      type: Boolean,
      default: !0
    },
    /**
     * Prevents menu to position itself horizontally outside these boundaries.
     * @default document.body
     */
    attach: {
      type: [Boolean, String, Element, Object],
      default: void 0
    }
  },
  emits: ["close", "click-item"],
  setup(e, { expose: s, emit: t }) {
    const i = e, o = t, n = L(!1), a = L(), d = R(() => j(i.target)), u = R(() => j(i.attach)), f = R(() => (u == null ? void 0 : u.value) || document.body);
    function c() {
      n.value = !1;
    }
    function h() {
      o("close", void 0);
    }
    const { position: v, visible: k, show: w, hide: T, stop: D } = Co(a, {
      attach: f,
      target: d,
      onShow: c,
      onHide: h
    });
    function Be(G) {
      G.handler && G.handler(G), o("click-item", G), i.closeOnClick && (T(), n.value = !1);
    }
    return s({
      show: w,
      hide: T,
      stop: D
    }), (G, ne) => (l(), _(gt, {
      to: f.value,
      disabled: !f.value
    }, [
      F(k) ? (l(), _(Ze, z({
        key: 0,
        ref_key: "menu",
        ref: a,
        responsive: n.value,
        "onUpdate:responsive": ne[0] || (ne[0] = (E) => n.value = E),
        position: F(v),
        "onUpdate:position": ne[1] || (ne[1] = (E) => an(v) ? v.value = E : null),
        "divided-responsive-items": e.dividedResponsiveItems
      }, {
        items: e.items,
        zIndex: e.zIndex
      }, {
        target: f.value,
        selected: e.value,
        onClickItem: Be
      }), null, 16, ["responsive", "position", "divided-responsive-items", "target", "selected"])) : p("", !0)
    ], 8, ["to", "disabled"]));
  }
}), Oo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Bo
}, Symbol.toStringTag, { value: "Module" })), Pt = (e) => e instanceof Date && !Number.isNaN(e.getTime()), Vo = (e) => e % 4 === 0 && e % 100 !== 0 || e % 400 === 0, $o = (e, s) => [31, Vo(e) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][s], Kt = (e, s) => e.getTime() === s.getTime(), xo = (e) => {
  let s;
  if (Pt(e))
    s = e;
  else if (e && typeof e == "string")
    try {
      s = new Date(Date.parse(e));
    } catch {
    }
  return s;
}, et = {
  emits: ["update:modelValue", "boundary-change"],
  props: {
    modelValue: {
      type: [null, Date, Array],
      default: null
    },
    min: {
      type: [Number, Date],
      default: () => -22089888e5
      // 1900-01-01Z00:00:00.000Z
    },
    max: {
      type: [Number, Date],
      default: () => 4102444799999
      // 2099-12-31T23:59:59.999Z
    }
  },
  data: () => ({
    getListenersFromAttrs: ce
  }),
  watch: {
    min: {
      handler(e) {
        this.checkBoundary(e, "min");
      },
      immediate: !0
    },
    max: {
      handler(e) {
        this.checkBoundary(e, "max");
      },
      immediate: !0
    }
  },
  methods: {
    setBoundary(e, s) {
      return [
        s === "min" ? this.value[0] < e : this.value[0] > e,
        s === "min" ? this.value[1] < e : this.value[1] > e
      ].map((i, o) => i ? e : this.value[o]);
    },
    anyOutOfRange(e, s) {
      return this.value.some((t) => s === "min" ? t < e : t > e);
    },
    checkBoundary(e, s) {
      if (!this.value)
        return;
      const t = this.getListenersFromAttrs(this.$attrs)["boundary-change"] ? "boundary-change" : "update:modelValue";
      (Array.isArray(this.value) && this.anyOutOfRange(e, s) || ["min"].includes(s) && this.value < e || ["max"].includes(s) && this.value > e) && (Pt(e) ? this.$emit(t, t === "update:modelValue" ? new Date(e) : { boundary: s, value: new Date(e) }) : this.$emit(t, t === "update:modelValue" ? this.setBoundary(e, s) : { boundary: s, value: e }));
    }
  }
}, Mo = {
  name: "vu-datepicker-table-date",
  mixins: [et],
  emits: ["select"],
  props: {
    date: {
      type: Date
    },
    year: {
      type: Number,
      required: !0
    },
    month: {
      type: Number,
      required: !0
    },
    unselectableDaysOfWeek: {
      type: Array[Number],
      default: () => []
    },
    firstDay: {
      type: Number,
      default: () => 0
    },
    showWeekNumber: {
      type: Boolean,
      required: !1
    },
    isRTL: {
      type: Boolean,
      required: !1
    },
    // i18n
    weekdaysLabels: {
      type: Array,
      required: !0
    },
    weekdaysShortLabels: {
      type: Array,
      required: !0
    }
  },
  methods: {
    renderTable(e) {
      return ie("table", {
        class: "datepicker-table",
        attrs: { cellspacing: "0", cellpadding: "0" }
      }, [
        this.renderHead(),
        this.renderBody(e)
      ]);
    },
    renderHead() {
      const e = [];
      for (let s = 0; s < 7; s++) {
        const t = ie("th", {
          attrs: { scope: "col", cellspacing: "0", cellpadding: "0" }
        }, [
          ie("abbr", {
            attrs: {
              title: this.renderDayName(s)
            }
          }, this.renderDayName(s, !0))
        ]);
        e.push(t);
      }
      return ie("thead", {}, e);
    },
    renderBody(e) {
      return ie("tbody", {}, e);
    },
    renderWeek(e, s, t) {
      const i = new Date(t, 0, 1), o = Math.ceil(((new Date(t, s, e) - i) / 864e5 + i.getDay() + 1) / 7), n = `datepicker${this.week}`;
      return ie("td", { class: n }, o);
    },
    renderDayName(e, s) {
      let t = e + this.firstDay;
      for (; t >= 7; )
        t -= 7;
      return s ? this.weekdaysShortLabels[t] : this.weekdaysLabels[t];
    },
    renderDay(e, s, t, i, o, n, a) {
      const d = [];
      return a ? ie("td", { class: "is-empty" }) : (n && d.push("is-disabled"), o && d.push("is-today"), i && d.push("is-selected"), ie("td", {
        class: d.join(" "),
        attrs: {
          "data-day": e
        }
      }, [
        ie("button", {
          class: "datepicker-button datepicker-name",
          type: "button",
          "data-year": t,
          "data-month": s,
          "data-day": e,
          onClick: this.onSelect
        }, e)
      ]));
    },
    renderRow(e) {
      return ie("tr", {}, e);
    },
    onSelect(e) {
      const s = e.target.getAttribute("data-year"), t = e.target.getAttribute("data-month"), i = e.target.getAttribute("data-day");
      this.$emit("select", new Date(s, t, i));
    }
  },
  render() {
    const e = /* @__PURE__ */ new Date();
    e.setHours(0, 0, 0, 0);
    const s = $o(this.year, this.month);
    let t = new Date(this.year, this.month, 1).getDay();
    const i = [];
    let o = [], n, a;
    for (this.firstDay > 0 && (t -= this.firstDay, t < 0 && (t += 7)), n = s + t, a = n; a > 7; )
      a -= 7;
    n += 7 - a;
    for (let d = 0, u = 0; d < n; d++) {
      const f = new Date(this.year, this.month, 1 + (d - t)), c = Date.parse(this.min), h = Date.parse(this.max), v = c && f < c || h && f > h || this.unselectableDaysOfWeek && this.unselectableDaysOfWeek.indexOf(f.getDay()) > -1, k = Pt(this.date) ? Kt(f, this.date) : !1, w = Kt(f, e), T = d < t || d >= s + t;
      o.push(this.renderDay(1 + (d - t), this.month, this.year, k, w, v, T)), ++u === 7 && (this.showWeekNumber && o.unshift(this.renderWeek(d - t, this.month, this.year)), i.push(this.renderRow(o, this.isRTL)), o = [], u = 0);
    }
    return this.renderTable(i);
  }
}, Po = {
  name: "vu-datepicker",
  mixins: [Ae, et],
  components: {
    "vu-datepicker-table-date": Mo
  },
  props: {
    className: { type: String, default: "" },
    modelValue: {
      type: [String, Date],
      default: () => ""
    },
    unselectableDaysOfWeek: {
      type: Array[Number],
      default: () => []
    },
    yearRange: {
      type: Number,
      default: () => 10
    },
    firstDay: {
      type: Number,
      default: () => 1
    },
    // i18n
    previousMonthLabel: {
      type: String,
      default: () => "Next Month"
    },
    nextMonthLabel: {
      type: String,
      default: () => "Previous Month"
    },
    monthsLabels: {
      type: Array,
      default: () => ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    },
    weekdaysLabels: {
      type: Array,
      default: () => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    },
    weekdaysShortLabels: {
      type: Array,
      default: () => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    },
    showWeekNumber: {
      type: Boolean,
      required: !1
    },
    isRTL: {
      type: Boolean,
      required: !1
    }
  },
  emits: ["update:modelValue"],
  data: () => ({
    left: 0,
    top: 38,
    month: 0,
    year: 0
  }),
  computed: {
    date: {
      get() {
        return this.modelValue;
      },
      set(e) {
        return this.$emit("update:modelValue", e);
      }
    },
    isEmpty() {
      return this.value === null || this.value === "" || this.value === void 0;
    },
    currentMonth() {
      return this.monthsLabels[this.month];
    },
    minYear() {
      return new Date(this.min).getFullYear();
    },
    minMonth() {
      return new Date(this.min).getMonth();
    },
    maxYear() {
      return new Date(this.max).getFullYear();
    },
    maxMonth() {
      return new Date(this.max).getMonth();
    },
    hasPrevMonth() {
      return !(this.year === this.minYear && (this.month === 0 || this.minMonth >= this.month));
    },
    hasNextMonth() {
      return !(this.year === this.maxYear && (this.month === 11 || this.maxMonth <= this.month));
    },
    selectableMonths() {
      return this.monthsLabels.map((e, s) => {
        const t = this.year === this.minYear && s < this.minMonth || this.year === this.maxYear && s > this.maxMonth;
        return {
          value: s,
          label: e,
          disabled: t
        };
      });
    },
    selectableYears() {
      const e = Math.max(this.year - this.yearRange, this.minYear), s = Math.min(this.year + 1 + this.yearRange, this.maxYear + 1);
      return Array(s - e).fill({}).map((i, o) => ({ value: e + o }));
    }
  },
  watch: {
    innerShow(e) {
      e && this.setCurrent();
    },
    value() {
      this.innerShow && this.setCurrent();
    },
    month(e) {
      e > 11 ? (this.year++, this.month = 0) : e < 0 && (this.month = 11, this.year--);
    }
  },
  methods: {
    setCurrent() {
      const e = xo(this.date) || /* @__PURE__ */ new Date();
      this.month = e.getMonth(), this.year = e.getFullYear();
    },
    onSelect(e) {
      this.month = e.getMonth(), this.year = e.getFullYear(), this.date = e;
    }
  }
}, Lo = { class: "datepicker-calendar" }, To = { class: "datepicker-title" }, Ao = { class: "datepicker-label" }, Fo = ["disabled", "value"], Do = { class: "datepicker-label" }, zo = ["disabled", "value"];
function No(e, s, t, i, o, n) {
  const a = b("vu-datepicker-table-date");
  return e.innerShow ? (l(), r("div", {
    key: 0,
    class: y(["datepicker datepicker-root", t.className])
  }, [
    m("div", Lo, [
      m("div", To, [
        m("div", Ao, [
          x(g(n.currentMonth) + " ", 1),
          $(m("select", {
            class: "datepicker-select datepicker-select-month",
            "onUpdate:modelValue": s[0] || (s[0] = (d) => e.month = d)
          }, [
            (l(!0), r(B, null, V(n.selectableMonths, (d) => (l(), r("option", {
              key: d.value,
              disabled: d.disabled,
              value: d.value
            }, g(d.label), 9, Fo))), 128))
          ], 512), [
            [Et, e.month]
          ])
        ]),
        m("div", Do, [
          x(g(e.year) + " ", 1),
          $(m("select", {
            class: "datepicker-select datepicker-select-year",
            "onUpdate:modelValue": s[1] || (s[1] = (d) => e.year = d)
          }, [
            (l(!0), r(B, null, V(n.selectableYears, (d) => (l(), r("option", {
              key: d.value,
              disabled: d.disabled,
              value: d.value
            }, g(d.value), 9, zo))), 128))
          ], 512), [
            [Et, e.year]
          ])
        ]),
        m("button", {
          class: y(["datepicker-prev", { "is-disabled": !n.hasPrevMonth }]),
          type: "button",
          onClick: s[2] || (s[2] = (d) => n.hasPrevMonth && e.month--)
        }, g(t.previousMonthLabel), 3),
        m("button", {
          class: y(["datepicker-next", { "is-disabled": !n.hasNextMonth }]),
          type: "button",
          onClick: s[3] || (s[3] = (d) => n.hasNextMonth && e.month++)
        }, g(t.nextMonthLabel), 3)
      ]),
      I(a, {
        date: n.date,
        year: e.year,
        month: e.month,
        min: e.min,
        max: e.max,
        "first-day": t.firstDay,
        "unselectable-days-of-week": t.unselectableDaysOfWeek,
        "months-labels": t.monthsLabels,
        "show-week-number": t.showWeekNumber,
        "is-r-t-l": t.isRTL,
        "weekdays-labels": t.weekdaysLabels,
        "weekdays-short-labels": t.weekdaysShortLabels,
        onSelect: s[4] || (s[4] = (d) => n.onSelect(d))
      }, null, 8, ["date", "year", "month", "min", "max", "first-day", "unselectable-days-of-week", "months-labels", "show-week-number", "is-r-t-l", "weekdays-labels", "weekdays-short-labels"])
    ])
  ], 2)) : p("", !0);
}
const Vs = /* @__PURE__ */ O(Po, [["render", No]]), Eo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Vs
}, Symbol.toStringTag, { value: "Module" })), jo = {
  name: "vu-facets-bar",
  emits: ["update:modelValue"],
  components: { VuDropdownMenu: Ce, VuIconBtn: U, VuPopover: ae, VuBtn: re, VuIcon: H },
  props: {
    modelValue: {
      type: Object,
      default: () => {
      }
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    uuidv4: be,
    labelsTruncated: !1,
    activeLabelTruncated: !1,
    startIndex: 0,
    hiddenFacets: 0,
    visibleFacets: 0,
    intxObs: void 0,
    intxObs2: void 0,
    intxObs3: void 0,
    resizeObs: void 0,
    activeFacetVsLongestFacet: 0
  }),
  mounted() {
    this.intxObs = new IntersectionObserver(this.intersects, {
      root: this.$refs.container,
      threshold: 1
    }), this.intxObs2 = new IntersectionObserver(this.intersectsStep2, {
      root: this.$refs.container,
      threshold: 1
    }), this.intxObs3 = new IntersectionObserver(this.intersectsStep3, {
      root: this.$refs.container,
      threshold: 1
    }), this.resizeObs = new ResizeObserver(() => {
      this.hiddenFacets = 0, this.labelsTruncated = !1, this.activeLabelTruncated = !1, this.intxObs.observe();
    }), this.intxObs.observe(this.$refs.inner);
  },
  beforeUnmount() {
    this.intxObs && this.intxObs.disconnect(), this.intxObs2 && this.intxObs.disconnect(), this.intxObs3 && this.intxObs.disconnect(), this.resizeObs && this.resizeObs.disconnect(), delete this.intxObs, delete this.intxObs2, delete this.intxObs3, delete this.resizeObs;
  },
  computed: {
    activeIndex() {
      return this.items.indexOf(this.modelValue);
    },
    visibleItems() {
      return this.hiddenFacets ? this.items.slice(this.startIndex, this.startIndex + this.visibleFacets) : this.items;
    },
    showPrepend() {
      return !1;
    }
  },
  watch: {
    modelValue(e) {
      if (this.hiddenFacets) {
        const s = this.items.indexOf(e);
        let t = 0;
        s > this.visibleFacets - 1 && (t = s - this.visibleFacets + 2), this.startIndex = Math.min(t, this.items.length - this.visibleFacets);
      }
    },
    items(e, s) {
      (e.length !== s.length || e.any((t, i) => t.text !== s[i].text)) && (this.labelsTruncated = !1, this.activeLabelTruncated = !1, this.intxObs.observe());
    }
  },
  methods: {
    async intersects(e) {
      if (this.intxObs.unobserve(this.$refs.inner), e && e[0] && e[0].intersectionRatio < 1) {
        const s = this.$refs.inner.querySelectorAll(".facet"), t = this.$refs.inner.querySelector(".facet.facet--selected"), { width: i = 0 } = t || {}, o = Array.from(s).reduce((n, a) => Math.max(n.width, a));
        this.activeFacetVsLongestFacet = o - i, this.labelsTruncated = !0, await this.$nextTick(), this.intxObs2.observe(this.$refs.inner);
      }
    },
    async intersectsStep2(e) {
      this.intxObs2.unobserve(this.$refs.inner), e && e[0] && e[0].intersectionRatio < 1 && (this.activeLabelTruncated = !0, this.activeFacetVsLongestFacet = 0, await this.$nextTick(), this.$refs.inner.querySelectorAll(".facet").forEach((t) => {
        this.intxObs3.observe(t);
      }));
    },
    // eslint-disable-next-line no-unused-vars
    async intersectsStep3(e) {
      e.forEach((s) => this.intxObs3.unobserve(s.target)), this.hiddenFacets = e.filter((s) => s.intersectionRatio < 1).length, this.hiddenFacets > 0 && (this.visibleFacets = this.items.length - this.hiddenFacets);
    }
  }
}, Ro = {
  class: "vu-facets-bar",
  ref: "container"
}, Uo = {
  class: "facets-bar__inner",
  ref: "inner"
};
function Ho(e, s, t, i, o, n) {
  const a = b("VuIcon"), d = b("VuPopover"), u = b("VuBtn"), f = b("VuIconBtn"), c = b("VuDropdownMenu");
  return l(), r("div", Ro, [
    m("div", Uo, [
      (l(!0), r(B, null, V(n.visibleItems, (h) => (l(), _(u, {
        key: `${e.uuidv4()}`,
        class: y([
          "facet",
          {
            default: h !== t.modelValue,
            "facet--selected": h === t.modelValue,
            "facet--unselected": h !== t.modelValue,
            "facet--icon-only": e.labelsTruncated && !(!e.activeLabelTruncated && h === t.modelValue)
          }
        ]),
        onClick: (v) => e.$emit("update:modelValue", h)
      }, {
        default: C(() => [
          !e.labelsTruncated || !e.activeLabelTruncated && h === t.modelValue ? (l(), r(B, { key: 0 }, [
            h.icon ? (l(), _(a, {
              key: 0,
              icon: h.icon,
              active: h === t.modelValue
            }, null, 8, ["icon", "active"])) : p("", !0),
            m("span", null, g(h.text), 1)
          ], 64)) : (l(), _(d, {
            key: 1,
            type: "tooltip",
            arrow: ""
          }, {
            default: C(() => [
              h.icon ? (l(), _(a, {
                key: 0,
                icon: h.icon
              }, null, 8, ["icon"])) : p("", !0)
            ]),
            body: C(() => [
              x(g(h.text), 1)
            ]),
            _: 2
          }, 1024))
        ]),
        _: 2
      }, 1032, ["class", "onClick"]))), 128)),
      e.labelsTruncated && !e.activeLabelTruncated ? (l(), r("div", {
        key: 0,
        style: M([{ visibility: "hidden" }, { width: `${e.activeFacetVsLongestFacet}+px` }])
      }, null, 4)) : p("", !0),
      e.visibleFacets ? (l(), _(c, {
        key: 1,
        shift: !0,
        class: "vu-facets-bar__dropdownmenu",
        items: t.items,
        model: t.modelValue,
        "onUpdate:modelValue": s[0] || (s[0] = (h) => e.$emit("update:modelValue", h)),
        onClickItem: s[1] || (s[1] = (h) => e.$emit("update:modelValue", h))
      }, {
        default: C(() => [
          I(f, { icon: "menu-dot" })
        ]),
        _: 1
      }, 8, ["items", "model"])) : p("", !0)
    ], 512)
  ], 512);
}
const qo = /* @__PURE__ */ O(jo, [["render", Ho], ["__scopeId", "data-v-775f5d77"]]), Wo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: qo
}, Symbol.toStringTag, { value: "Module" })), Ko = {
  name: "vu-form",
  mixins: [po]
};
function Go(e, s, t, i, o, n) {
  return l(), r("form", {
    novalidate: "novalidate",
    class: "form form-root",
    onSubmit: Q(() => {
    }, ["prevent"])
  }, [
    S(e.$slots, "default")
  ], 32);
}
const $s = /* @__PURE__ */ O(Ko, [["render", Go]]), Yo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $s
}, Symbol.toStringTag, { value: "Module" })), Xo = {
  props: {
    elevated: {
      type: Boolean,
      default: !1
    }
  }
}, xs = {
  props: {
    clearable: {
      type: Boolean,
      default: () => !1
    }
  }
}, ot = {
  offline: "status-empty",
  online: "status-ok",
  busy: "status-noway",
  away: "status-clock"
}, Jo = {
  name: "vu-user-picture",
  inject: [
    "vuUserPictureSrcUrl"
  ],
  props: {
    size: {
      type: String,
      default: "medium",
      validator: (e) => ["tiny", "small", "medium", "medium-1", "big", "bigger", "large", "extra-large"].includes(e)
    },
    circle: {
      type: Boolean,
      default: !0
    },
    clickable: {
      type: Boolean,
      default: !1
    },
    gutter: {
      type: Boolean,
      default: !1
    },
    hoverable: {
      type: Boolean,
      default: !1
    },
    inheritBackground: {
      type: Boolean,
      default: !0
    },
    // eslint-disable-next-line vue/require-default-prop
    presence: {
      type: String,
      required: !1,
      validator: (e) => e ? ot[e] !== void 0 : !0
    },
    src: {
      type: String,
      required: !1,
      default: void 0
    },
    id: {
      type: String,
      required: !1,
      default: void 0
    }
  },
  data: () => ({
    presenceStates: ot,
    hovered: !1
  }),
  watch: {
    hoverable: {
      // eslint-disable-next-line object-shorthand, func-names
      handler: function(e) {
        !e && this.hovered && (this.hovered = !1);
      }
    }
  },
  computed: {
    fonticon() {
      return this.presence && ot[this.presence];
    },
    _src() {
      return this.vuUserPictureSrcUrl && this.id && !this.src ? `${this.vuUserPictureSrcUrl}/${this.id}` : this.src;
    }
  }
}, Qo = {
  key: 0,
  class: "vu-user-picture__hover-mask"
}, Zo = {
  key: 1,
  class: "vu-presence"
};
function ea(e, s, t, i, o, n) {
  return l(), r("div", {
    class: y(["vu-user-picture", [t.size ? `vu-user-picture--${t.size}` : "", {
      "vu-user-picture--gutter": t.gutter,
      "vu-user-picture--circle": t.circle,
      "vu-user-picture--clickable": t.clickable,
      "vu-user-picture--bg-inherit": t.inheritBackground
    }]]),
    onMouseover: s[0] || (s[0] = () => {
      t.hoverable && (e.hovered = !0);
    }),
    onMouseleave: s[1] || (s[1] = () => {
      t.hoverable && (e.hovered = !1);
    })
  }, [
    m("div", {
      class: "vu-user-picture-wrap",
      style: M([t.presence ? { background: "inherit" } : ""])
    }, [
      m("div", {
        class: "vu-user-picture__image",
        style: M({ "background-image": `url(${n._src})` })
      }, null, 4),
      e.hovered ? (l(), r("div", Qo)) : p("", !0),
      t.size !== "tiny" ? (l(), r("div", Zo, [
        m("div", {
          class: y(`vu-presence__indicator vu-presence__indicator--${t.presence}`)
        }, null, 2)
      ])) : p("", !0)
    ], 4)
  ], 34);
}
const Le = /* @__PURE__ */ O(Jo, [["render", ea], ["__scopeId", "data-v-24c158c9"]]), ta = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Le
}, Symbol.toStringTag, { value: "Module" })), sa = {
  name: "vu-select-options",
  props: {
    options: {
      type: Array,
      required: !0
    },
    multiple: {
      type: Boolean,
      required: !1
    },
    user: {
      type: Boolean,
      required: !1
    },
    selected: {
      type: Array,
      required: !0
    },
    placeholder: {
      type: String,
      default: () => ""
    },
    keyIndex: {
      type: Number,
      default: () => -1
    }
  },
  expose: ["focus"],
  emits: ["click-item", "select-keydown", "change"],
  data: () => ({
    uid: be
  }),
  methods: {
    focus() {
      var e;
      (e = this.$refs.nativeSelect) == null || e.focus();
    }
  },
  components: { VuIcon: H, VuUserPicture: Le }
}, na = ["label", "selected"], ia = ["value", "selected", "disabled"], la = { class: "option__text" }, oa = ["disabled", "onClick"], aa = {
  key: 0,
  class: "flex items-center"
}, ra = { class: "option__text" }, ua = { class: "option__text" };
function da(e, s, t, i, o, n) {
  const a = b("VuUserPicture"), d = b("VuIcon");
  return l(), r("ul", {
    class: y(["vu-select-options", { "select-options--multiple": t.multiple, "select-options--single": !t.multiple, "select-options--user": t.user }])
  }, [
    m("select", {
      ref: "nativeSelect",
      class: "select-hidden",
      onKeydown: s[0] || (s[0] = (u) => e.$emit("select-keydown", u)),
      onChange: s[1] || (s[1] = () => {
        const u = e.$refs.nativeSelect.value;
        u === "__placeholder__" ? e.$emit("change", void 0) : e.$emit("change", u);
      })
    }, [
      m("option", {
        value: "__placeholder__",
        label: t.placeholder,
        selected: t.selected[0] === void 0 || t.selected === ""
      }, null, 8, na),
      (l(!0), r(B, null, V(t.options, (u) => (l(), r("option", {
        key: `${e.uid}-${u.value || u.label}`,
        value: u.value || u.label,
        selected: u.selected || t.selected.includes(u),
        disabled: u.disabled
      }, g(u.label), 9, ia))), 128))
    ], 544),
    !t.multiple && t.placeholder ? (l(), r("li", {
      key: 0,
      class: y([{ "option--selected": t.selected[0].value === void 0 }, "option__placeholder"]),
      onClick: s[2] || (s[2] = (u) => e.$emit("click-item", { value: "" }))
    }, [
      m("span", la, g(t.placeholder), 1)
    ], 2)) : p("", !0),
    (l(!0), r(B, null, V(t.options, (u, f) => (l(), r("li", {
      key: `${u.id || e.uid()}`,
      class: y({
        "option--selected": u.selected || t.selected.includes(u),
        "option--keyboard": f === t.keyIndex
      }),
      disabled: u.disabled,
      onClick: (c) => !u.disabled && e.$emit("click-item", u)
    }, [
      t.user ? (l(), r("div", aa, [
        I(a, {
          size: "small",
          id: u.value,
          src: u.src
        }, null, 8, ["id", "src"]),
        m("span", ra, g(u.text || u.label), 1)
      ])) : S(e.$slots, "default", {
        key: 1,
        item: u
      }, () => [
        u.fonticon ? (l(), _(d, {
          key: 0,
          icon: u.fonticon
        }, null, 8, ["icon"])) : p("", !0),
        m("span", ua, g(u.text || u.label), 1)
      ], !0)
    ], 10, oa))), 128))
  ], 2);
}
const Lt = /* @__PURE__ */ O(sa, [["render", da], ["__scopeId", "data-v-488e8513"]]), ca = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Lt
}, Symbol.toStringTag, { value: "Module" })), ha = {
  name: "vu-spinner",
  props: {
    mask: {
      type: Boolean,
      default: () => !1
    },
    text: {
      type: String,
      default: () => ""
    }
  }
}, fa = { class: "mask-wrapper" }, ma = { class: "mask-content" }, pa = /* @__PURE__ */ rn('<div class="spinner spinning fade in"><span class="spinner-bar"></span><span class="spinner-bar spinner-bar1"></span><span class="spinner-bar spinner-bar2"></span><span class="spinner-bar spinner-bar3"></span></div>', 1), ga = {
  key: 0,
  class: "text"
};
function va(e, s, t, i, o, n) {
  return l(), r("div", {
    class: y({ mask: t.mask })
  }, [
    m("div", fa, [
      m("div", ma, [
        pa,
        t.text.length ? (l(), r("span", ga, g(t.text), 1)) : p("", !0)
      ])
    ])
  ], 2);
}
const Tt = /* @__PURE__ */ O(ha, [["render", va]]), ya = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Tt
}, Symbol.toStringTag, { value: "Module" }));
function ba() {
  return window ? navigator.userAgent.toLowerCase().indexOf("firefox") >= 0 : !1;
}
const _a = {
  name: "vu-scroller",
  exposes: ["stopLoading", "stopLoadingBefore"],
  props: {
    reverse: {
      type: Boolean,
      default: !1
    },
    infinite: {
      type: Boolean,
      default: !1
    },
    showLoading: {
      type: Boolean,
      default: !1
    },
    // alias for infinite
    dataAfter: {
      type: Boolean,
      default: !1
    },
    dataBefore: {
      type: Boolean,
      default: !1
    },
    infiniteMargin: {
      type: Number,
      default: 200
    },
    infiniteHeight: {
      type: String,
      default: "50px"
    },
    infiniteBeforeHeight: {
      type: String,
      default: "50px"
    },
    loadingText: {
      type: String,
      default: ""
    },
    horizontal: {
      type: Boolean,
      default: !1
    },
    alwaysShow: {
      type: Boolean,
      default: !1
    },
    // Allows to configure timeout for innerScroll to happen.
    // The new content needs to be rerender to not endlessly loop on the intersection.
    updateSleep: {
      type: Number,
      default: 15
    },
    noIntersectionRoot: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["loading-before", "loading", "mounted"],
  data() {
    return {
      lazyKeyIndex: 0,
      lazyKeyIndex2: 0,
      wait: !1,
      waitBefore: !1,
      firefox: !1
    };
  },
  computed: {
    rootMargin() {
      return Array(4).fill(`${this.infiniteMargin}px`).join(" ");
    },
    options() {
      const e = {}, { rootMargin: s } = this;
      return this.noIntersectionRoot || (e.root = this.$refs["scroll-container"]), {
        ...e,
        rootMargin: s
      };
    }
  },
  mounted() {
    this.firefox = ba(), this.$emit("mounted");
  },
  methods: {
    stopLoading(e) {
      e ? (this.lazyKeyIndex2 += 1, this.sleep()) : (this.lazyKeyIndex += 1, this.sleep());
    },
    async sleep() {
      this.wait = !0, this.waitBefore = !0, await setTimeout(() => {
      }, this.updateSleep), this.wait = !1, this.waitBefore = !1;
    }
  },
  components: { VuSpinner: Tt, VuLazy: Vt }
}, wa = { class: "vu-scroll-container__inner" };
function ka(e, s, t, i, o, n) {
  const a = b("VuSpinner"), d = b("VuLazy"), u = b("vu-spinner");
  return l(), r("div", {
    ref: "scroll-container",
    class: y([{
      "vu-scroll-container--reverse": t.reverse,
      "vu-scroll-container--horizontal": t.horizontal,
      "vu-scroll-container--always-show": t.alwaysShow,
      firefox: o.firefox
    }, "vu-scroll-container"])
  }, [
    m("div", wa, [
      t.dataBefore && !o.waitBefore ? (l(), _(d, {
        key: `lazy-key-${o.lazyKeyIndex2}`,
        onIntersect: s[0] || (s[0] = (f) => {
          e.$emit("loading-before"), e.$emit("loading", !0);
        }),
        options: n.options,
        height: t.infiniteBeforeHeight || t.infiniteHeight,
        class: "vu-scroll__lazy vu-scroll__lazy-top"
      }, {
        default: C(() => [
          S(e.$slots, "loadingBefore", {}, () => [
            I(a, { text: t.loadingText }, null, 8, ["text"])
          ], !0)
        ]),
        _: 3
      }, 8, ["options", "height"])) : p("", !0),
      S(e.$slots, "default", {}, void 0, !0),
      (t.infinite || t.dataAfter) && !o.wait ? (l(), _(d, {
        key: `lazy-key-${o.lazyKeyIndex}`,
        onIntersect: s[1] || (s[1] = (f) => e.$emit("loading")),
        options: n.options,
        height: t.infiniteHeight,
        style: { "min-width": "30px" },
        class: "vu-scroll__lazy vu-scroll__lazy-bottom"
      }, {
        default: C(() => [
          S(e.$slots, "loading", {}, () => [
            I(a, { text: t.loadingText }, null, 8, ["text"])
          ], !0)
        ]),
        _: 3
      }, 8, ["options", "height"])) : t.showLoading ? S(e.$slots, "loading", { key: 2 }, () => [
        I(u, { text: t.loadingText }, null, 8, ["text"])
      ], !0) : p("", !0)
    ])
  ], 2);
}
const Ue = /* @__PURE__ */ O(_a, [["render", ka], ["__scopeId", "data-v-2592e00d"]]), Sa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ue
}, Symbol.toStringTag, { value: "Module" })), Ca = {
  name: "vu-select",
  inheritAttrs: !1,
  mixins: [Z, xs, K, ee, te],
  props: {
    autocomplete: {
      type: Boolean,
      default: () => !1
    },
    hidePlaceholderOption: {
      type: Boolean,
      default: () => !1
    },
    grouped: {
      type: Boolean,
      default: () => !1
    },
    maxVisible: {
      type: Number,
      default: () => 5
    },
    dropdownZIndex: {
      type: Number,
      default: 1020
    },
    // detachable props
    attach: {
      default: () => !0,
      validator: St
    },
    contentClass: {
      type: [String, Object],
      default: ""
    },
    contentStyle: {
      type: [String, Object],
      default: () => ""
    }
    // end detachable
  },
  emits: ["update:modelValue"],
  inject: {
    isIos: {
      from: Re
    }
  },
  data: () => ({
    open: !1,
    focused: !1,
    search: "",
    uid: be()
  }),
  watch: {
    value() {
      this.search = this.selected.label;
    },
    open(e) {
      e && this.focus();
    }
  },
  created() {
    this.search = this.value && this.selected.label || this.value;
  },
  computed: {
    hasSomeEnabledOptions() {
      return this.enabledOptions.length > 0;
    },
    firstEnabledOption() {
      return this.enabledOptions.slice(0)[0];
    },
    lastEnabledOption() {
      return this.enabledOptions.slice(-1)[0];
    },
    enabledOptions() {
      return (this.autocomplete && this.search ? this.options : this.innerOptions).filter((s) => !s.disabled);
    },
    innerOptions() {
      return this.autocomplete ? this.options.filter((e) => e.label.toLowerCase().includes(this.search.toLowerCase()) || e.value.toLowerCase().includes(this.search.toLowerCase())) : this.options;
    },
    selected() {
      return this.options.find((e) => e.value === this.value) || {
        label: this.placeholder
      };
    },
    willDetach() {
      return this.attach === !1 || this.attach !== "" && typeof this.attach === String;
    },
    groupedOptions() {
      return this.grouped ? this.options.reduce((e, s) => (e[s.group] || (e[s.group] = []), e[s.group].push(s), e), {}) : null;
    },
    internMaxVisible() {
      return this.maxVisible > this.options.length ? this.options.length : this.maxVisible;
    }
  },
  methods: {
    stop(e) {
      e.preventDefault(), e.stopPropagation();
    },
    innerSelectKeydown(e) {
      switch (e.code) {
        case "Space":
        case "Enter":
        case "NumpadEnter":
          this.open = !this.open, this.stop(e);
          break;
        case "Escape":
          this.open = !1, this.stop(e);
          break;
        case "ArrowUp":
          this.browse(void 0, e);
          break;
        case "ArrowDown":
          this.open ? this.browse(!0, e) : (this.open = !0, this.stop(e));
          break;
      }
    },
    focus() {
      var e, s;
      this.focused = !0, !(this.autocomplete || this.isIos) && (this.willDetach ? setTimeout(() => {
        var t, i;
        (i = (t = this.$refs) == null ? void 0 : t.selectOptions) == null || i.focus();
      }, 50) : (s = (e = this.$refs) == null ? void 0 : e.nativeSelect) == null || s.focus());
    },
    blur() {
      this.focused = !1;
    },
    async browse(e, s) {
      this.grouped || (!e && this.selected === this.firstEnabledOption ? (this.value = this.hidePlaceholderOption ? this.lastEnabledOption.value : void 0, this.stop(s), this.scrollIntoView()) : e && this.selected === this.lastEnabledOption ? (this.value = this.hidePlaceholderOption ? this.firstEnabledOption.value : void 0, this.stop(s), this.scrollIntoView()) : this.modelValue || (this.value = e ? this.firstEnabledOption.value : this.lastEnabledOption.value, this.stop(s), this.scrollIntoView()));
    },
    scrollIntoView() {
      this.$nextTick(() => {
        var t;
        const e = this.$refs && this.$refs.dropdown;
        let s;
        if (e && (s = (t = this.$refs) == null ? void 0 : t.dropdown.querySelector("ul li.result-option-selected")), s) {
          const i = s.offsetTop + s.clientHeight;
          (i > e.scrollTop + e.clientHeight || i < e.scrollTop) && this.$refs.dropdown.scrollTo({ top: s.offsetTop });
        }
      });
    }
  },
  components: { VuIconBtn: U, VuPopover: ae, VuSelectOptions: Lt, VuScroller: Ue }
}, Ia = {
  key: 0,
  class: "control-label"
}, Ba = {
  key: 0,
  class: "label-field-required"
}, Oa = ["disabled", "placeholder"], Va = {
  key: 2,
  class: "select-handle"
}, $a = ["disabled"], xa = ["label"], Ma = ["value", "selected", "disabled"], Pa = {
  key: 4,
  class: "select-handle"
}, La = {
  key: 5,
  class: "select-choices form-control"
}, Ta = { class: "select-choice" }, Aa = { class: "select-results" }, Fa = ["onClick"], Da = { class: "result-group-label" }, za = { class: "result-group-sub" }, Na = ["onClick"], Ea = {
  key: 1,
  class: "form-control-helper-text"
};
function ja(e, s, t, i, o, n) {
  const a = b("VuIconBtn"), d = b("VuSelectOptions"), u = b("VuScroller"), f = b("VuPopover"), c = W("click-outside");
  return l(), r("div", {
    class: y(["form-group", e.classes])
  }, [
    e.label.length ? (l(), r("label", Ia, [
      x(g(e.label), 1),
      e.required ? (l(), r("span", Ba, " *")) : p("", !0)
    ])) : p("", !0),
    $((l(), r("div", {
      onClick: s[10] || (s[10] = (h) => {
        e.open = !e.open && !e.disabled, e.search = e.value && n.selected.label || e.value;
      }),
      class: y([
        "vu-select",
        "select",
        {
          "select-placeholder": !t.autocomplete,
          "select-no-placeholder-option": t.hidePlaceholderOption,
          "select-not-chosen": !t.autocomplete && !e.value,
          "dropdown-visible": e.open,
          "select-disabled": e.disabled,
          "select-autocomplete": t.autocomplete,
          "select-clearable": e.clearable,
          "select-focus": e.focused && !e.disabled
        }
      ])
    }, [
      t.autocomplete ? $((l(), r("input", {
        key: 0,
        ref: "innerInput",
        disabled: e.disabled,
        placeholder: n.selected.label,
        class: "form-control",
        "onUpdate:modelValue": s[0] || (s[0] = (h) => e.search = h)
      }, null, 8, Oa)), [
        [os, e.search]
      ]) : p("", !0),
      e.value && (t.autocomplete || e.clearable) ? (l(), _(a, {
        key: 1,
        icon: "clear",
        class: y(["select__clear-icon", { "select--has-handle": t.autocomplete }]),
        onClick: s[1] || (s[1] = (h) => {
          var v, k;
          e.$emit("update:modelValue", ""), (k = (v = e.$refs) == null ? void 0 : v.innerInput) == null || k.focus(), e.search = "";
        })
      }, null, 8, ["class"])) : p("", !0),
      t.autocomplete ? p("", !0) : (l(), r("div", Va)),
      !t.autocomplete && !n.willDetach ? (l(), r("select", {
        key: 3,
        class: "form-control select-hidden",
        disabled: e.disabled,
        ref: "nativeSelect",
        onFocus: s[2] || (s[2] = (h) => e.focused = !0),
        onBlur: s[3] || (s[3] = (h) => n.blur()),
        onChange: s[4] || (s[4] = () => {
          const h = e.$refs.nativeSelect.value;
          h === "__placeholder__" ? e.value = void 0 : e.value = h, n.scrollIntoView();
        }),
        onKeydown: s[5] || (s[5] = (h) => n.innerSelectKeydown(h))
      }, [
        m("option", {
          value: "__placeholder__",
          label: e.placeholder
        }, null, 8, xa),
        (l(!0), r(B, null, V(n.innerOptions, (h) => (l(), r("option", {
          key: `${e.uid}-${h.value || h.label}`,
          value: h.value || h.label,
          selected: h.value === e.value,
          disabled: h.disabled
        }, g(h.label), 9, Ma))), 128))
      ], 40, $a)) : p("", !0),
      t.autocomplete ? p("", !0) : (l(), r("div", Pa)),
      t.autocomplete ? p("", !0) : (l(), r("ul", La, [
        m("li", Ta, g(n.selected.label), 1)
      ])),
      t.attach && e.open ? (l(), r("div", {
        key: 6,
        class: "select-dropdown",
        ref: "dropdown",
        style: M(`height: ${38 * (n.innerOptions.length + (!t.autocomplete && !t.hidePlaceholderOption ? 1 : 0))}px; max-height: ${38 * (n.internMaxVisible + 1)}px;`)
      }, [
        m("ul", Aa, [
          !t.autocomplete && !t.hidePlaceholderOption ? (l(), r("li", {
            key: 0,
            class: y(["result-option result-option-placeholder", { "result-option-selected": !e.modelValue }]),
            onClick: s[6] || (s[6] = (h) => {
              e.$emit("update:modelValue", ""), e.search = "";
            })
          }, g(e.placeholder), 3)) : p("", !0),
          t.grouped ? (l(!0), r(B, { key: 2 }, V(n.groupedOptions, (h, v) => (l(), r("li", {
            key: `${e.uid}-${h.group}`,
            class: "result-group"
          }, [
            m("span", Da, g(v), 1),
            m("ul", za, [
              (l(!0), r(B, null, V(h, (k) => (l(), r("li", {
                key: `${e.uid}-${k.value}`,
                class: y([{
                  "result-option-disabled": k.disabled,
                  "result-option-selected": k.value === e.value
                }, "result-option"]),
                onClick: (w) => k.disabled ? null : e.$emit("update:modelValue", k.value)
              }, g(k.label), 11, Na))), 128))
            ])
          ]))), 128)) : (l(!0), r(B, { key: 1 }, V(n.innerOptions, (h) => (l(), r("li", {
            key: `${e.uid}-${h.value || h.label}`,
            class: y([{
              "result-option-disabled": h.disabled,
              "result-option-selected": h.value === e.value
            }, "result-option"]),
            onClick: (v) => {
              h.disabled || e.$emit("update:modelValue", h.value), e.search = h.label;
            }
          }, g(h.label), 11, Fa))), 128))
        ])
      ], 4)) : n.willDetach && e.open ? (l(), _(f, {
        key: 7,
        attach: t.attach,
        type: "vu-select-dropdown",
        show: e.open,
        positions: ["bottom-left", "top-left"],
        side: "bottom-left",
        "sync-width": !0,
        animated: !1,
        "content-class": t.contentClass,
        offsets: { "bottom-left": { y: 3 }, "top-left": { y: -43 } },
        "content-style": [{ zIndex: t.dropdownZIndex }, "position: absolute;", t.contentStyle],
        "onUpdate:show": s[9] || (s[9] = (h) => {
          e.open = h;
        })
      }, {
        body: C(() => [
          I(u, { "always-show": "" }, {
            default: C(() => [
              I(d, z({ ref: "selectOptions" }, { options: n.innerOptions, selected: [n.selected], placeholder: e.placeholder }, {
                onChange: s[7] || (s[7] = (h) => e.value = h),
                onSelectKeydown: n.innerSelectKeydown,
                onClickItem: s[8] || (s[8] = (h) => {
                  this.focus(), e.$emit("update:modelValue", h.value);
                })
              }), null, 16, ["onSelectKeydown"])
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["attach", "show", "content-class", "content-style"])) : p("", !0)
    ], 2)), [
      [c, {
        events: ["click", "contextmenu"],
        handler: function() {
          e.open = !1, e.search = e.value && n.selected.label || e.value;
        }
      }]
    ]),
    (l(!0), r(B, null, V(e.errorBucket, (h, v) => (l(), r("span", {
      key: `${v}-error-${h}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, g(h), 1))), 128)),
    e.helper.length ? (l(), r("span", Ea, g(e.helper), 1)) : p("", !0)
  ], 2);
}
const Ms = /* @__PURE__ */ O(Ca, [["render", ja], ["__scopeId", "data-v-f883e9f7"]]), Ra = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ms
}, Symbol.toStringTag, { value: "Module" })), Ua = {
  name: "vu-grid-view",
  mixins: [Ie, Xo],
  props: {
    value: {
      type: [Object, Array],
      default: () => []
    },
    items: {
      type: Array,
      required: !0
    },
    headers: {
      type: Array,
      required: !0
    },
    dense: {
      type: Boolean,
      default: !1
    },
    rich: {
      type: Boolean,
      default: !0
    },
    selectable: {
      type: Boolean,
      default: !1
    },
    allSelectable: {
      type: Boolean,
      default: !0
    },
    serverItemsLength: {
      type: Number,
      default: 0
    },
    rowsPerPage: {
      type: Number,
      default: 5
    },
    topPagination: {
      type: Boolean,
      default: !1
    },
    whiteBackground: {
      type: Boolean,
      default: !1
    },
    sort: {
      type: Function,
      default(e, s) {
        return this.isAscending ? e[this.sortKey] < s[this.sortKey] ? -1 : e[this.sortKey] > s[this.sortKey] ? 1 : 0 : e[this.sortKey] > s[this.sortKey] ? -1 : e[this.sortKey] < s[this.sortKey] ? 1 : 0;
      }
    },
    itemPerPageOptions: {
      type: Array,
      default: () => [10, 20, 50]
    },
    labels: {
      type: Object,
      default: () => ({
        previousLabel: "Previous",
        nextLabel: "Next"
      })
    }
  },
  emits: ["cellClick", "update:modelValue", "update:rowsPerPage", "pageUp", "pageDown"],
  data() {
    return {
      sortKey: "",
      isAscending: void 0,
      startRow: 0,
      selectedCellItem: "",
      selectedCellProperty: ""
    };
  },
  computed: {
    hasSelected() {
      return this.value.length > 0;
    },
    sortedItems() {
      const e = this.startRow + this.rowsPerPage;
      return this.sortKey ? [...this.items].sort(this.sort.bind(this)).slice(this.startRow, e) : this.items.slice(this.startRow, e);
    },
    itemMax() {
      const e = this.startRow + this.rowsPerPage;
      return e > this.items.length ? this.items.length : e;
    }
  },
  methods: {
    isEqual(e, s) {
      return e === s;
    },
    selectAll() {
      this.value.length === this.items.length ? this.$emit("update:modelValue", []) : this.$emit("update:modelValue", this.items);
    },
    selectItem(e) {
      const s = this.value.includes(e), t = [...this.value];
      if (s) {
        const i = t.indexOf(e);
        t.splice(i, 1);
      } else
        t.push(e);
      this.$emit("update:modelValue", t);
    },
    updateRows(e) {
      this.$emit("update:rowsPerPage", e);
    },
    scrollHorizontal(e) {
      const s = e.currentTarget;
      s.offsetWidth !== s.scrollWidth && (e.preventDefault(), e.deltaX && (s.scrollLeft -= Math.round(e.deltaX / 4)), e.deltaY && (s.scrollLeft += Math.round(e.deltaY / 4)));
    },
    sortBy(e) {
      this.sortKey === e ? this.isAscending = !this.isAscending : (this.sortKey = e, this.isAscending = !0);
    },
    pageUp() {
      this.startRow += this.rowsPerPage, this.$emit("pageUp");
    },
    pageDown() {
      this.startRow -= this.rowsPerPage, this.$emit("pageDown");
    }
  },
  components: { VuCheckbox: Os, VuIconBtn: U, VuSelect: Ms, VuBtn: re }
}, Ha = {
  key: 0,
  class: "grid-view__table__header-intersection"
}, qa = { class: "grid-view__table__body" }, Wa = ["onClick"], Ka = {
  key: 0,
  class: "grid-view__table__row__header"
}, Ga = ["onClick"], Ya = { style: { "margin-right": "5px" } };
function Xa(e, s, t, i, o, n) {
  const a = b("VuCheckbox"), d = b("VuIconBtn"), u = b("VuSelect"), f = b("VuBtn"), c = W("mask");
  return $((l(), r("div", {
    class: y(["vu-grid-view", { elevated: e.elevated, "vu-grid-view--rich": t.rich }, e.classes]),
    onWheel: s[0] || (s[0] = (...h) => n.scrollHorizontal && n.scrollHorizontal(...h))
  }, [
    m("div", {
      class: "grid-view__container",
      style: M(`height: ${(t.dense ? 24 : 38) + (t.dense ? 24 : 38) * (n.sortedItems.length < t.rowsPerPage ? n.sortedItems.length : t.rowsPerPage)}px;`)
    }, [
      m("table", {
        class: y([
          "grid-view__table",
          { dense: t.dense, "grid-view__table--has-selection": n.hasSelected }
        ])
      }, [
        m("thead", null, [
          m("tr", null, [
            t.selectable ? (l(), r("th", Ha, [
              t.allSelectable ? (l(), _(a, {
                key: 0,
                dense: "",
                class: "grid-view__table__checkbox",
                value: t.value.length === t.items.length && t.items.length,
                options: [{}],
                onInput: n.selectAll
              }, null, 8, ["value", "onInput"])) : p("", !0)
            ])) : p("", !0),
            (l(!0), r(B, null, V(t.headers, (h, v) => (l(), r("th", {
              key: `header_${h.property}_${v}`
            }, [
              x(g(h.label) + " ", 1),
              h.sortable !== !1 ? (l(), _(d, {
                key: 0,
                class: "icon-smaller",
                icon: h.property === o.sortKey && o.isAscending ? "expand-up" : "expand-down",
                active: h.property === o.sortKey,
                onClick: (k) => n.sortBy(h.property)
              }, null, 8, ["icon", "active", "onClick"])) : p("", !0)
            ]))), 128))
          ])
        ]),
        m("tbody", qa, [
          (l(!0), r(B, null, V(n.sortedItems, (h, v) => (l(), r("tr", {
            class: y({ dense: t.dense, selected: t.value.includes(h) }),
            key: `line_${v}`,
            onClick: (k) => n.selectItem(h)
          }, [
            t.selectable ? (l(), r("td", Ka, [
              I(a, {
                dense: "",
                class: "grid-view__table__body__checkbox",
                onInput: (k) => n.selectItem(h),
                value: t.value.includes(h),
                options: [{}]
              }, null, 8, ["onInput", "value"])
            ])) : p("", !0),
            (l(!0), r(B, null, V(t.headers, (k) => (l(), r("td", {
              key: `${k.property}_${h[k.property]}`,
              class: y([
                n.isEqual(h, o.selectedCellItem) && n.isEqual(k.property, o.selectedCellProperty) ? "selected" : ""
              ]),
              onClick: () => {
                o.selectedCellItem = h, o.selectedCellProperty = k.property, e.$emit("cellClick", { item: h, header: k, property: e.property });
              }
            }, [
              S(e.$slots, k.property, rt(ut(h)), () => [
                x(g(h[k.property]), 1)
              ], !0)
            ], 10, Ga))), 128))
          ], 10, Wa))), 128))
        ])
      ], 2)
    ], 4),
    m("div", {
      class: y(["grid-view__pagination", { "grid-view__pagination--top": t.topPagination }])
    }, [
      S(e.$slots, "pagination", {}, () => [
        I(u, {
          options: t.itemPerPageOptions.map((h) => ({ value: h, label: h })),
          rules: [(h) => h.length > 0],
          "hide-placeholder-option": !0,
          value: t.rowsPerPage,
          onInput: n.updateRows
        }, null, 8, ["options", "rules", "value", "onInput"]),
        m("div", Ya, g(o.startRow + 1) + "-" + g(n.itemMax) + " / " + g(t.serverItemsLength || t.items.length), 1),
        I(f, {
          disabled: o.startRow === 0,
          onClick: n.pageDown
        }, {
          default: C(() => [
            x(g(t.labels.previousLabel), 1)
          ]),
          _: 1
        }, 8, ["disabled", "onClick"]),
        I(f, {
          disabled: o.startRow + t.rowsPerPage >= (t.serverItemsLength || t.items.length),
          onClick: n.pageUp
        }, {
          default: C(() => [
            x(g(t.labels.nextLabel), 1)
          ]),
          _: 1
        }, 8, ["disabled", "onClick"])
      ], !0)
    ], 2)
  ], 34)), [
    [c, e.loading]
  ]);
}
const Ja = /* @__PURE__ */ O(Ua, [["render", Xa], ["__scopeId", "data-v-598f3552"]]), Qa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ja
}, Symbol.toStringTag, { value: "Module" })), Za = {
  name: "vu-icon-link",
  components: { VuIcon: H },
  mixins: [xt],
  props: {
    label: {
      type: String,
      default: () => ""
    },
    icon: {
      type: String,
      default: () => ""
    }
  },
  data: () => ({
    pressed: !1
  })
}, er = { class: "icon-link__link" };
function tr(e, s, t, i, o, n) {
  const a = b("VuIcon");
  return l(), r("a", {
    class: y(["vu-icon-link", { active: e.active }])
  }, [
    t.icon ? (l(), _(a, {
      key: 0,
      icon: t.icon,
      active: e.active
    }, null, 8, ["icon", "active"])) : (l(), r(B, { key: 1 }, [
      x(" ")
    ], 64)),
    m("span", er, [
      S(e.$slots, "default", {}, () => [
        x(g(t.label), 1)
      ], !0)
    ])
  ], 2);
}
const At = /* @__PURE__ */ O(Za, [["render", tr], ["__scopeId", "data-v-0b39185d"]]), sr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: At
}, Symbol.toStringTag, { value: "Module" })), nr = {
  name: "vu-input-date",
  mixins: [Z, et, xs, ee, te, K],
  emits: ["update:modelValue"],
  components: { VuDatepicker: Vs },
  props: {
    modelValue: {
      type: Date,
      default: () => null
    },
    contentClass: {
      type: String,
      default: () => ""
    },
    contentStyle: {
      type: [String, Object],
      default: () => ""
    },
    unselectableDaysOfWeek: {
      type: Array[Number],
      default: () => []
    },
    yearRange: {
      type: Number,
      default: () => 10
    },
    firstDay: {
      type: Number,
      default: () => 1
    },
    // input
    placeholder: {
      type: String,
      default: () => "Select a value"
    },
    // i18n
    dateFormatLocale: {
      type: String,
      default: () => "en"
    },
    dateFormatOptions: {
      type: Object,
      default: () => ({
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit"
      })
    },
    hideOnSelect: {
      type: Boolean,
      default: () => !0
    },
    previousMonthLabel: {
      type: String,
      required: !1,
      default: void 0
    },
    nextMonthLabel: {
      type: String,
      required: !1,
      default: void 0
    },
    monthsLabels: {
      type: Array,
      required: !1,
      default: () => {
      }
    },
    weekdaysLabels: {
      type: Array,
      required: !1,
      default: () => {
      }
    },
    weekdaysShortLabels: {
      type: Array,
      required: !1,
      default: () => {
      }
    },
    showWeekNumber: {
      type: Boolean,
      required: !1
    },
    isRTL: {
      type: Boolean,
      required: !1
    }
  },
  data: () => ({
    open: !1,
    stringifedValue: ""
  }),
  computed: {
    date: {
      get() {
        return this.modelValue;
      },
      set(e) {
        this.$emit("update:modelValue", e);
      }
    },
    isEmpty() {
      return this.value === null || this.value === "" || this.value === void 0;
    }
  },
  watch: {
    modelValue: {
      immediate: !0,
      handler() {
        this.date ? this.stringifedValue = new Intl.DateTimeFormat(this.dateFormatLocale, this.dateFormatOptions).format(this.date) : this.stringifedValue = "";
      }
    }
  },
  methods: {
    click() {
      this.date = "";
    },
    handleSelect(e) {
      this.date = e, this.hideOnSelect && (this.open = !1);
    }
  }
}, ir = {
  key: 0,
  class: "control-label"
}, lr = {
  key: 0,
  class: "label-field-required"
}, or = {
  ref: "activator",
  class: "input-date"
}, ar = ["value", "placeholder", "disabled"], rr = {
  key: 1,
  class: "form-control-helper-text"
};
function ur(e, s, t, i, o, n) {
  const a = b("VuDatepicker"), d = W("click-outside");
  return l(), r("div", {
    class: y(["form-group", e.classes])
  }, [
    e.label.length ? (l(), r("label", ir, [
      x(g(e.label), 1),
      e.required ? (l(), r("span", lr, " * ")) : p("", !0)
    ])) : p("", !0),
    $((l(), r("div", or, [
      m("input", {
        ref: "input",
        value: e.stringifedValue,
        placeholder: t.placeholder,
        disabled: e.disabled,
        readonly: "",
        type: "text",
        class: y(["form-control input-date", { filled: !n.isEmpty }]),
        onClick: s[0] || (s[0] = (u) => {
          e.open = !0;
        })
      }, null, 10, ar),
      e.clearable ? (l(), r("span", {
        key: 0,
        class: "input-date-reset fonticon fonticon-clear",
        onClick: s[1] || (s[1] = (u) => n.click())
      })) : p("", !0),
      I(a, {
        style: M([{ position: "absolute", top: "38px" }, t.contentStyle]),
        class: y(t.contentClass),
        modelValue: e.value,
        "onUpdate:modelValue": [
          s[2] || (s[2] = (u) => e.value = u),
          n.handleSelect
        ],
        show: e.open,
        min: e.min,
        max: e.max,
        "unselectable-days-of-week": t.unselectableDaysOfWeek,
        "year-range": t.yearRange,
        "first-day": t.firstDay,
        "show-week-number": t.showWeekNumber,
        "is-r-t-l": t.isRTL,
        "previous-month-label": t.previousMonthLabel,
        "next-month-label": t.nextMonthLabel,
        "months-labels": t.monthsLabels,
        "weekdays-labels": t.weekdaysLabels,
        "weekdays-short-labels": t.weekdaysShortLabels,
        onBoundaryChange: s[3] || (s[3] = (u) => n.date = u.value)
      }, null, 8, ["style", "class", "modelValue", "show", "min", "max", "unselectable-days-of-week", "year-range", "first-day", "show-week-number", "is-r-t-l", "previous-month-label", "next-month-label", "months-labels", "weekdays-labels", "weekdays-short-labels", "onUpdate:modelValue"])
    ])), [
      [d, function() {
        e.open = !1;
      }]
    ]),
    (l(!0), r(B, null, V(e.errorBucket, (u, f) => (l(), r("span", {
      key: `${f}-error-${u}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, g(u), 1))), 128)),
    e.helper.length ? (l(), r("span", rr, g(e.helper), 1)) : p("", !0)
  ], 2);
}
const dr = /* @__PURE__ */ O(nr, [["render", ur], ["__scopeId", "data-v-dd785764"]]), cr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: dr
}, Symbol.toStringTag, { value: "Module" })), hr = {
  name: "vu-input-number",
  inheritAttrs: !1,
  mixins: [Z, ee, te, K],
  props: {
    step: {
      type: Number,
      default: () => 0.1
    },
    decimal: {
      type: Number,
      default: () => 2
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: Number.MAX_SAFE_INTEGER
    },
    showButtons: {
      type: Boolean,
      default: !0
    }
  },
  emits: ["update:modelValue"],
  methods: {
    input(e, s) {
      if (s && e === "" && this.value !== "") {
        this.$refs.input.value = this.value;
        return;
      }
      if (e === "" && s === "-" || s === "." || s === ",")
        return;
      let t = e !== "" ? this.parseValue(this.fixed(e)) : void 0;
      this.$emit("update:modelValue", t), this.$refs.input.value = this.value;
    },
    decrement() {
      let e = parseFloat(this.value);
      e = Number.isNaN(e) ? this.max : e, this.input(e - this.step);
    },
    increment() {
      let e = parseFloat(this.value);
      e = Number.isNaN(e) ? this.min : e, this.input(e + this.step);
    },
    parseValue(e) {
      const s = parseFloat(e);
      return s > this.max ? this.max : s < this.min ? this.min : s;
    },
    fixed(e) {
      return Math.round(e * 10 ** this.decimal) / 10 ** this.decimal;
    }
  }
}, fr = {
  key: 0,
  class: "control-label"
}, mr = {
  key: 0,
  class: "label-field-required"
}, pr = { class: "input-number" }, gr = ["disabled"], vr = ["value", "placeholder", "disabled", "min", "max", "step"], yr = ["disabled"], br = {
  key: 1,
  class: "form-control-helper-text"
};
function _r(e, s, t, i, o, n) {
  return l(), r("div", {
    class: y(["vu-number form-group", { ...e.classes, "vu-number--no-buttons": !t.showButtons }])
  }, [
    e.label.length ? (l(), r("label", fr, [
      x(g(e.label), 1),
      e.required ? (l(), r("span", mr, " *")) : p("", !0)
    ])) : p("", !0),
    m("div", pr, [
      t.showButtons ? (l(), r("button", {
        key: 0,
        type: "button",
        disabled: e.disabled,
        class: "input-number-button input-number-button-left btn btn-default",
        onClick: s[0] || (s[0] = (...a) => n.decrement && n.decrement(...a))
      }, null, 8, gr)) : p("", !0),
      m("input", z(e.$attrs, {
        ref: "input",
        value: e.value,
        placeholder: e.placeholder,
        disabled: e.disabled,
        min: t.min,
        max: t.max,
        step: t.step,
        type: "number",
        class: "form-control",
        onKeypress: [
          s[1] || (s[1] = Pe((...a) => n.increment && n.increment(...a), ["up"])),
          s[2] || (s[2] = Pe((...a) => n.decrement && n.decrement(...a), ["down"]))
        ],
        onInput: s[3] || (s[3] = (a) => n.input(a.target.value, a.data))
      }), null, 16, vr),
      t.showButtons ? (l(), r("button", {
        key: 1,
        type: "button",
        disabled: e.disabled,
        class: "input-number-button input-number-button-right btn btn-default",
        onClick: s[4] || (s[4] = (...a) => n.increment && n.increment(...a))
      }, null, 8, yr)) : p("", !0)
    ]),
    (l(!0), r(B, null, V(e.errorBucket, (a, d) => (l(), r("span", {
      key: `${d}-error-${a}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, g(a), 1))), 128)),
    e.helper.length ? (l(), r("span", br, g(e.helper), 1)) : p("", !0)
  ], 2);
}
const wr = /* @__PURE__ */ O(hr, [["render", _r], ["__scopeId", "data-v-0671176e"]]), kr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: wr
}, Symbol.toStringTag, { value: "Module" })), Sr = {
  name: "vu-input",
  inheritAttrs: !1,
  inject: {
    vuInputComposition: {
      default: !1
    }
  },
  mixins: [Z, ee, K, te],
  emits: ["update:modelValue"]
}, Cr = {
  key: 0,
  class: "control-label"
}, Ir = {
  key: 0,
  class: "label-field-required"
}, Br = ["value", "placeholder", "disabled", "type"], Or = {
  key: 1,
  class: "form-control-helper-text"
};
function Vr(e, s, t, i, o, n) {
  return l(), r("div", {
    class: y(["form-group", e.classes])
  }, [
    e.label.length ? (l(), r("label", Cr, [
      x(g(e.label), 1),
      e.required ? (l(), r("span", Ir, " *")) : p("", !0)
    ])) : p("", !0),
    m("input", z(e.$attrs, {
      value: e.value,
      placeholder: e.placeholder,
      disabled: e.disabled,
      type: e.type,
      class: "form-control",
      onInput: s[0] || (s[0] = ({ target: a }) => {
        n.vuInputComposition || (a.composing = !1), e.$emit("update:modelValue", a.value);
      })
    }), null, 16, Br),
    (l(!0), r(B, null, V(e.errorBucket, (a, d) => (l(), r("span", {
      key: `${d}-error-${a}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, g(a), 1))), 128)),
    e.helper.length ? (l(), r("span", Or, g(e.helper), 1)) : p("", !0)
  ], 2);
}
const Ps = /* @__PURE__ */ O(Sr, [["render", Vr], ["__scopeId", "data-v-2bbbe8aa"]]), $r = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ps
}, Symbol.toStringTag, { value: "Module" })), Ls = (e) => typeof e != "string" ? "" : e.charAt(0).toUpperCase() + e.slice(1), xr = {
  name: "vu-lightbox-bar",
  emits: ["close", "click-comment", "click-download", "click-information", "click-share", "media-type-drag-start", "media-type-drag", "media-type-drag-end", "click-compass"],
  props: {
    // eslint-disable-next-line vue/require-prop-types
    showCloseIcon: { default: () => !0 },
    // eslint-disable-next-line vue/require-prop-types
    showCompass: { default: () => !0 },
    label: {
      type: String,
      default: () => ""
    },
    type: {
      type: Object,
      default: () => {
      }
    },
    items: {
      type: Array,
      default: () => []
    },
    customItems: {
      type: Array,
      default: () => []
    },
    subItems: {
      type: Array,
      default: () => []
    },
    rightItems: {
      type: Array,
      default: () => []
    },
    responsive: {
      type: Boolean,
      default: () => !1
    },
    widget: {
      type: Boolean,
      default: () => !1
    },
    moreActionsLabel: {
      type: String,
      default: () => "More"
    },
    disableCompass: {
      type: Boolean,
      required: !0
    },
    closeLabel: {
      type: String,
      default: () => "Close"
    },
    dropdownOverlay: Boolean,
    /* eslint-disable vue/require-default-prop */
    onMediaTypeDragStart: Function,
    onMediaTypeDrag: Function,
    onMediaTypeDragEnd: Function
  },
  data: () => ({
    getListenersFromAttrs: ce,
    capitalize: Ls,
    uid: be()
  }),
  computed: {
    menuIcon() {
      return this.responsive ? "menu-dot" : "chevron-down";
    },
    hasLeftToDividerContent() {
      return this.items.length > 0 && this.items.some((e) => !e.hidden) || this._dropdownMenuItems.length > 0 || this.$slots["lightbox-bar__special-actions"];
    },
    hasRightToDividerContent() {
      return this.showCloseIcon || this.rightItems && this.rightItems.length > 0 && this.rightItems.some((e) => !e.hidden);
    },
    hasDragEvent() {
      return this.onMediaTypeDragStart || this.onMediaTypeDrag || this.onMediaTypeDragEnd;
    },
    _items() {
      return this.actionsMergeSubs(this.items, this.customItems);
    },
    dropdownMenuListeners() {
      const e = this.getListenersFromAttrs(this.$attrs);
      if (e.close) {
        const s = { ...e };
        return delete s.close, s;
      }
      return e;
    },
    _dropdownMenuItems() {
      if (this.responsive) {
        const e = this._items.filter(({ nonResponsive: s, hidden: t }) => !s && !t);
        return this.subItems && this.subItems.length > 0 && e.push({
          name: "more-actions",
          label: this.moreActionsLabel,
          items: this.subItems
        }), e;
      }
      return this.subItems;
    }
  },
  methods: {
    icon(e) {
      return e.icon ? `${e.icon}` : `${e.fonticon}`;
    },
    actionClick(e, s = "primary-action") {
      e.disabled || (e.handler && e.handler(e), this.$emit(`click-${e.name.toLowerCase()}`, e, { type: s }));
    },
    actionsMergeSubs(e, s) {
      const t = s.filter(({ name: n }) => e.find(({ name: a }) => n === a)), i = s.filter(({ name: n }) => !t.find(({ name: a }) => n === a));
      e.forEach(({ name: n, items: a }) => {
        const d = t.find(({ name: u }) => u === n);
        if (d) {
          const { items: u } = d;
          u && (Array.isArray(a) || (a = []), a.push(...u));
        }
      });
      let o = [...e, ...i];
      return o = o.map((n) => {
        if (n.text === void 0) {
          const a = this.capitalize(n.name);
          n.text = a;
        }
        return n;
      }), o;
    },
    selectedItemsArray(e) {
      return this.customItems ? this.getSelectedItems(e) : [];
    },
    getSelectedItems(e) {
      let s = [];
      return Array.isArray(e) && e.forEach((t) => {
        if (t.items) {
          const i = this.getSelectedItems(t);
          s = [s, ...i];
        }
      }), s.filter((t) => t.selected);
    }
  },
  components: { VuIconBtn: U, VuDropdownMenu: Ce }
}, Ts = (e) => (pe("data-v-14413ab3"), e = e(), ge(), e), Mr = { class: "lightbox-bar__left" }, Pr = /* @__PURE__ */ Ts(() => /* @__PURE__ */ m("div", { class: "lightbox-bar__compass-active" }, null, -1)), Lr = [
  Pr
], Tr = { class: "lightbox-bar-menu-item lightbox-bar-menu-item--no-cursor" }, Ar = ["draggable"], Fr = { class: "lightbox-bar__title" }, Dr = { class: "lightbox-bar__right" }, zr = { class: "lightbox-bar__menu" }, Nr = {
  key: 2,
  class: "lightbox-bar__divider"
}, Er = /* @__PURE__ */ Ts(() => /* @__PURE__ */ m("hr", { class: "divider divider--vertical" }, null, -1)), jr = [
  Er
];
function Rr(e, s, t, i, o, n) {
  const a = b("VuIconBtn"), d = b("VuDropdownMenu"), u = W("tooltip");
  return l(), r("div", {
    class: y(["vu-lightbox-bar", {
      "lightbox-bar--responsive": t.responsive,
      "lightbox-bar--widget-header": t.widget
    }])
  }, [
    m("div", Mr, [
      t.showCompass && !t.widget ? (l(), r("div", {
        key: 0,
        class: y(["lightbox-bar__compass", { "lightbox-bar__compass--disabled": t.disableCompass }]),
        onClick: s[0] || (s[0] = (f) => e.$emit("click-compass"))
      }, Lr, 2)) : p("", !0),
      S(e.$slots, "lightbox-bar__object-type", {}, () => [
        m("div", Tr, [
          m("div", {
            class: "lightbox-bar__media-type",
            style: M({ "background-color": t.type.backgroundColor }),
            onDragstart: s[1] || (s[1] = (f) => e.$emit("media-type-drag-start", f)),
            onDrag: s[2] || (s[2] = (f) => e.$emit("media-type-drag", f)),
            onDragend: s[3] || (s[3] = (f) => e.$emit("media-type-drag-end", f)),
            draggable: n.hasDragEvent ? "true" : "false"
          }, [
            m("span", {
              class: y(`fonticon fonticon-${t.type.icon}`)
            }, null, 2)
          ], 44, Ar)
        ])
      ], !0),
      m("div", Fr, [
        S(e.$slots, "lightbox-bar__title", {}, () => [
          m("span", null, g(t.label), 1)
        ], !0)
      ])
    ]),
    m("div", Dr, [
      m("div", zr, [
        t.responsive ? p("", !0) : (l(!0), r(B, { key: 0 }, V(n._items, (f, c) => (l(), r(B, {
          key: `${e.uid}-${c}-rm`
        }, [
          f.items && !f.hidden ? (l(), _(d, z({
            "v-model": n.selectedItemsArray(n._items),
            key: `lightbox-dropdownmenu_${e.uid}-${c}`,
            items: f.items,
            shift: !0,
            disabled: f.disabled
          }, { overlay: t.dropdownOverlay }, { class: "lightbox-bar-dropdown-wrap" }, fe(n.dropdownMenuListeners)), {
            default: C(({ active: h }) => [
              $(I(a, {
                icon: n.icon(f),
                active: f.selected || h,
                disabled: f.disabled,
                color: t.widget ? "default" : "secondary",
                class: "lightbox-bar-menu-item",
                onClick: () => n.actionClick(f)
              }, null, 8, ["icon", "active", "disabled", "color", "onClick"]), [
                [
                  u,
                  `${f.label || e.capitalize(f.name)}`,
                  void 0,
                  {
                    body: !0,
                    bottom: !0
                  }
                ]
              ])
            ]),
            _: 2
          }, 1040, ["v-model", "items", "disabled"])) : f.hidden ? p("", !0) : $((l(), _(a, {
            key: 1,
            icon: n.icon(f),
            active: f.selected,
            disabled: f.disabled,
            color: t.widget ? "default" : "secondary",
            class: "lightbox-bar-menu-item",
            onClick: () => n.actionClick(f)
          }, null, 8, ["icon", "active", "disabled", "color", "onClick"])), [
            [
              u,
              `${f.label || e.capitalize(f.name)}`,
              void 0,
              {
                body: !0,
                bottom: !0
              }
            ]
          ])
        ], 64))), 128)),
        n._dropdownMenuItems.length > 0 ? (l(), _(d, z({
          key: 1,
          "v-model": n.selectedItemsArray(n._dropdownMenuItems),
          class: "lightbox-bar-dropdown-wrap",
          "prevent-dropup": !0,
          items: n._dropdownMenuItems,
          position: "bottom-left",
          shift: !0
        }, { overlay: t.dropdownOverlay }, fe(n.dropdownMenuListeners)), {
          default: C(({ active: f }) => [
            $(I(a, {
              icon: n.menuIcon,
              active: f,
              color: t.widget ? "default" : "secondary",
              class: y(["lightbox-bar-menu-item", t.responsive ? "" : "chevron-menu-icon"])
            }, null, 8, ["icon", "active", "color", "class"]), [
              [
                u,
                `${t.moreActionsLabel}`,
                void 0,
                {
                  body: !0,
                  bottom: !0
                }
              ]
            ])
          ]),
          _: 1
        }, 16, ["v-model", "items"])) : p("", !0),
        S(e.$slots, "lightbox-bar__special-actions", {}, void 0, !0),
        n.hasLeftToDividerContent && n.hasRightToDividerContent ? (l(), r("div", Nr, jr)) : p("", !0),
        (l(!0), r(B, null, V(t.rightItems, (f, c) => (l(), r(B, null, [
          f.hidden ? p("", !0) : $((l(), _(a, {
            key: `${e.uid}-sa-${c}`,
            class: "lightbox-bar-menu-item",
            color: t.widget ? "default" : "secondary",
            icon: n.icon(f),
            active: f.selected,
            disabled: f.disabled,
            onClick: (h) => n.actionClick(f, "side-action")
          }, null, 8, ["color", "icon", "active", "disabled", "onClick"])), [
            [
              u,
              `${f.label || e.capitalize(f.name)}`,
              void 0,
              {
                body: !0,
                bottom: !0
              }
            ]
          ])
        ], 64))), 256)),
        t.showCloseIcon ? $((l(), _(a, {
          key: 3,
          class: "lightbox-bar-menu-item",
          color: t.widget ? "default" : "secondary",
          icon: "close",
          onClick: s[4] || (s[4] = (f) => e.$emit("close", !1))
        }, null, 8, ["color"])), [
          [
            u,
            t.closeLabel,
            void 0,
            {
              body: !0,
              bottom: !0
            }
          ]
        ]) : p("", !0)
      ])
    ])
  ], 2);
}
const As = /* @__PURE__ */ O(xr, [["render", Rr], ["__scopeId", "data-v-14413ab3"]]), Ur = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: As
}, Symbol.toStringTag, { value: "Module" })), Gt = {
  picture: {
    id: 1,
    icon: "picture",
    backgroundColor: "#70036b"
    // $violet-dv-1
  },
  audio: {
    id: 2,
    icon: "sound",
    backgroundColor: "#70036b"
    // $violet-dv-1
  },
  video: {
    id: 3,
    icon: "video",
    backgroundColor: "#70036b"
    // $violet-dv-1
  },
  "3dmodel": {
    id: 4,
    icon: "3d-object",
    backgroundColor: "#70036b"
    // $violet-dv-1
  },
  document: {
    id: 5,
    icon: "doc",
    backgroundColor: "#70036b"
    // $violet-dv-1
  }
}, Yt = [
  {
    name: "comment",
    fonticon: "topbar-comment",
    disabled: !1,
    hidden: !1
  },
  {
    name: "share",
    fonticon: "share-alt",
    disabled: !1,
    hidden: !1
  },
  {
    name: "download",
    fonticon: "download",
    disabled: !1,
    hidden: !1
  },
  {
    name: "information",
    fonticon: "topbar-info",
    disabled: !1,
    hidden: !1
  }
], Xt = [
  {
    name: "previous",
    fonticon: "chevron-left",
    selected: !1,
    disabled: !1,
    hidden: !1
  },
  {
    name: "next",
    fonticon: "chevron-right",
    selected: !1,
    disabled: !1,
    hidden: !1
  }
], Hr = {
  name: "vu-lightbox",
  components: { VuLightboxBar: As, VuIconBtn: U, VuIconBtn: U },
  data() {
    return {
      panelStates: [],
      openCompass: !1,
      compassAlreadyOpened: !1,
      compassPath: "webapps/i3DXCompassStandalone/i3DXCompassStandalone.html",
      resizeObserver: {},
      transforms: {
        responsive: !1,
        left: {},
        center: {},
        right: {}
      },
      capitalize: Ls,
      customItems: [],
      getListenersFromAttrs: ce,
      uid: be()
    };
  },
  emits: ["close", "click-comment", "click-information", "click-share", "click-download", "media-type-drag-start", "media-type-drag", "media-type-drag-end", "click-compass"],
  props: {
    title: {
      type: String,
      default: () => ""
    },
    // eslint-disable-next-line vue/require-default-prop
    userId: {
      type: String,
      required: !1
    },
    panels: {
      type: Array,
      required: !1,
      default: () => [{}]
    },
    widget: {
      type: Boolean,
      default: () => !1
    },
    objectType: {
      type: [String, Object],
      default: () => "picture",
      validator: (e) => !!Gt[e] || e && e.icon && e.backgroundColor
    },
    primaryActions: {
      type: [Array, String],
      default: () => Yt
    },
    customActions: {
      type: Boolean,
      default: () => !1
    },
    menuActions: {
      type: Array,
      required: !1,
      default: () => []
    },
    sideActions: {
      type: Array,
      default: () => Xt
    },
    customSideActions: {
      type: Boolean,
      default: () => !1
    },
    noObjectType: {
      type: Boolean,
      default: () => !1
    },
    disableCompass: {
      type: Boolean,
      default: () => !1
    },
    zIndex: {
      type: Number,
      default: () => 100
    },
    moreActionsLabel: {
      type: String,
      default: () => "More"
    },
    closeLabel: {
      type: String,
      default: () => "Close"
    },
    noAnimation: {
      type: Boolean,
      default: () => !1
    },
    fasterAnimation: {
      type: Boolean,
      default: () => !1
    },
    hideCloseIcon: {
      type: Boolean,
      default: () => !1
    },
    dropdownOverlay: Boolean,
    /* eslint-disable vue/prop-name-casing, vue/require-default-prop */
    onClose: Function,
    "onClick-comment": Function,
    "onClick-download": Function,
    "onClick-information": Function,
    "onClick-share": Function,
    "onMedia-type-drag-start": Function,
    "onMedia-type-drag": Function,
    "onMedia-type-drag-end": Function
  },
  created() {
    this.panels.find(({ show: e }) => e !== void 0) || (this.panelStates = this.panels.map((e) => ({ ...e, show: !1 })));
  },
  computed: {
    typeInfo() {
      return typeof this.objectType == "object" ? this.objectType : Gt[this.objectType];
    },
    compassIframeUrl() {
      return `${this.serviceUrl || ""}/${this.compassPath}${this.userId ? `#userId:${this.userId}` : ""}`;
    },
    listeners() {
      return ce(this.$attrs, !0);
    },
    listenersFromProps() {
      return this.getListenersFromAttrs(this.$props, !0);
    },
    _panels() {
      return this.panelStates.length > 0 ? this.panelStates : this.panels;
    },
    showRightPanel() {
      return this._panels.find(({ show: e }) => e);
    },
    noCompass() {
      return this.widget;
    },
    _primaryActions() {
      const e = this.primaryActions, s = Yt;
      if (this.widget) {
        const t = e.find(({ name: o }) => o === "information"), i = e.find(({ name: o }) => o === "comment");
        t && !t.fonticon && (s.find(({ name: o }) => o === "information").fonticon = "info"), i && !i.fonticon && (s.find(({ name: o }) => o === "comment").fonticon = "comment");
      }
      return this.actionsMerge(e, s, this.customActions);
    },
    _sideActions() {
      return this.actionsMerge(this.sideActions, Xt, this.customSideActions);
    }
  },
  mounted() {
    this.onResize();
    const e = new ResizeObserver(() => {
      this.onResize();
    });
    e.observe(this.$refs.lightbox), this.resizeObserver = e;
    const s = this;
    !this.noCompass && window && window.require && window.require(["DS/UWPClientCode/Data/Utils", "DS/UWPClientCode/PublicAPI"], (t, i) => {
      this.getCompassUrl = () => {
        t.getServiceUrl({
          serviceName: "3DCompass",
          onComplete: (o) => {
            s.serviceUrl = o;
          },
          onFailure: () => {
            UWA && UWA.debug && console.error("Lightbox Compass failed to retrieve 3DCompass service url");
          },
          scope: s
        });
      }, this.userId ? this.getCompassUrl() : i.getCurrentUser().then(
        ({ login: o }) => {
          s.userId = o, this.getCompassUrl();
        },
        // eslint-disable-next-line comma-dangle
        () => this.getCompassUrl()
      );
    });
  },
  watch: {
    openCompass() {
      this.onResize();
    },
    showRightPanel() {
      this.onResize();
    }
  },
  methods: {
    addCustomAction(e) {
      const s = this.customItems.find(({ name: t }) => t === e.name);
      s ? this.customItems[this.customItems.indexOf(s)] = e : this.customItems.push(e);
    },
    clearCustomActions() {
      this.customItems = [];
    },
    showPanel(e, s = !0) {
      if (!this.panelStates.length)
        return;
      s && this.hideAllPanels(e);
      const t = this.panelStates.find(({ name: i }) => e === i);
      t.show = !0;
    },
    hidePanel(e) {
      if (!this.panelStates.length)
        return;
      const s = this.panelStates.find(({ name: t }) => e === t);
      s.show = !1;
    },
    // eslint-disable-next-line no-unused-vars
    hideAllPanels(e = "") {
      this.panelStates.length && this.panelStates.filter(({ name: s }) => s !== e).forEach((s) => {
        s.show = !1;
      });
    },
    actionsMerge(e, s, t) {
      let i = e;
      return t || (i = e.slice(0, s.length).filter(({ name: o }) => s.find(({ name: n }) => o === n)), i = i.map((o) => ({
        // If component user messes up order \o/
        ...s.find(({ name: n }) => o.name === n),
        ...o
      }))), i = i.map((o) => {
        if (o.text === void 0) {
          const n = this.capitalize(o.name);
          o.text = n;
        }
        return o;
      }), i;
    },
    onResize() {
      const { clientWidth: e } = this.$refs.lightbox;
      let s;
      if (e > 639) {
        const t = Math.min(e * 0.125 + 240, 480);
        s = {
          responsive: !1,
          left: {
            width: `${t}px`
          },
          center: {
            "margin-left": this.openCompass ? `${t}px` : 0,
            "margin-right": this.showRightPanel ? `${t}px` : 0
          },
          right: {
            width: `${t}px`
          }
        };
      } else
        s = { responsive: !0, center: {}, right: {} };
      this.transforms = s;
    }
  },
  beforeUnmount() {
    this.resizeObserver && this.resizeObserver.disconnect(), delete this.resizeObserver;
  }
}, qr = (e) => (pe("data-v-7f266739"), e = e(), ge(), e), Wr = ["data-id"], Kr = /* @__PURE__ */ qr(() => /* @__PURE__ */ m("div", { class: "lightbox__overlay" }, null, -1)), Gr = ["src"], Yr = {
  key: 0,
  class: "panel__header"
}, Xr = { class: "panel__title" }, Jr = { class: "panel__title__text" };
function Qr(e, s, t, i, o, n) {
  const a = b("VuLightboxBar"), d = b("VuIconBtn");
  return l(), r("div", null, [
    S(e.$slots, "lightbox-activator", {}, void 0, !0),
    m("div", {
      ref: "lightbox",
      class: y(["vu-lightbox", {
        "lightbox--responsive": o.transforms.responsive,
        "lightbox--widget-header": t.widget,
        "vu-lightbox--appear-faster": !t.widget && !t.noAnimation && t.fasterAnimation,
        "vu-lightbox--appear-fast": !t.widget && !t.noAnimation && !t.fasterAnimation
      }]),
      style: M({
        zIndex: t.zIndex
      }),
      "data-id": o.uid
    }, [
      I(a, z({
        label: t.title,
        "show-compass": !n.noCompass,
        class: { "lightbox-bar--compass-open": o.openCompass },
        type: n.typeInfo,
        items: n._primaryActions,
        "sub-items": t.menuActions,
        "right-items": n._sideActions,
        responsive: o.transforms.responsive
      }, fe({ ...n.listeners, ...n.listenersFromProps }), { disableCompass: t.disableCompass, customItems: o.customItems, dropdownOverlay: t.dropdownOverlay, widget: t.widget, moreActionsLabel: t.moreActionsLabel, closeLabel: t.closeLabel }, {
        onClickCompass: s[0] || (s[0] = () => {
          t.disableCompass || (o.openCompass = !o.openCompass, o.compassAlreadyOpened = !0), e.$emit("click-compass", o.openCompass);
        })
      }), {
        "lightbox-bar__object-type": C((u) => [
          S(e.$slots, "lightbox-bar__object-type", rt(ut(u)), void 0, !0)
        ]),
        "lightbox-bar__title": C((u) => [
          S(e.$slots, "lightbox-bar__title", rt(ut(u)), void 0, !0)
        ]),
        "lightbox-bar__special-actions": C(() => [
          S(e.$slots, "lightbox-bar__special-actions", {}, void 0, !0)
        ]),
        _: 3
      }, 16, ["label", "show-compass", "class", "type", "items", "sub-items", "right-items", "responsive"]),
      Kr,
      m("div", {
        class: "lightbox__content",
        ref: "content",
        style: M(o.transforms.center || {})
      }, [
        S(e.$slots, "lightbox-content", {}, void 0, !0)
      ], 4),
      !n.noCompass && o.compassAlreadyOpened ? $((l(), r("div", {
        key: 0,
        class: "vu-panel lightbox__panel lightbox__panel--left column",
        style: M(o.transforms.left || {})
      }, [
        m("iframe", {
          class: "compass",
          src: n.compassIframeUrl
        }, null, 8, Gr),
        o.transforms.responsive ? (l(), _(d, {
          key: 0,
          icon: "close",
          style: { position: "absolute", right: "0", top: "0", zindex: "21" },
          onClick: s[1] || (s[1] = (u) => o.openCompass = !1)
        })) : p("", !0)
      ], 4)), [
        [me, o.openCompass]
      ]) : p("", !0),
      (l(!0), r(B, null, V(n._panels, ({ name: u, show: f, showClose: c = !1, showEdit: h, classes: v = [], title: k }, w) => $((l(), r("div", {
        key: `${o.uid}-${w}`,
        class: y(["vu-panel lightbox__panel column", [...v, "lightbox__panel--right", { "panel--responsive": o.transforms.responsive }]]),
        style: M(o.transforms.right)
      }, [
        k ? (l(), r("div", Yr, [
          m("span", Xr, [
            m("span", Jr, g(k), 1),
            h ? (l(), _(d, {
              key: 0,
              class: "panel__edit__icon",
              icon: "pencil",
              onClick: (T) => e.$emit(`panel-edit-${u}`)
            }, null, 8, ["onClick"])) : p("", !0)
          ]),
          c ? (l(), _(d, {
            key: 0,
            class: "panel__close_icon",
            icon: "close",
            onClick: (T) => e.$emit(`close-panel-${u}`)
          }, null, 8, ["onClick"])) : p("", !0)
        ])) : o.transforms.responsive || c ? (l(), _(d, {
          key: 1,
          class: "panel__close_icon",
          icon: "close",
          onClick: (T) => e.$emit(`close-panel-${u}`)
        }, null, 8, ["onClick"])) : p("", !0),
        m("div", {
          class: y([`vu-dynamic-panel-wrap-${u}`, "panel__content"])
        }, [
          S(e.$slots, `lightbox-panel-${u}`, {}, void 0, !0)
        ], 2)
      ], 6)), [
        [me, f]
      ])), 128))
    ], 14, Wr)
  ]);
}
const Zr = /* @__PURE__ */ O(Hr, [["render", Qr], ["__scopeId", "data-v-7f266739"]]), eu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Zr
}, Symbol.toStringTag, { value: "Module" })), tu = {
  name: "vu-media-upload-droppable",
  props: {
    isOver: {
      type: Boolean
    },
    validDrop: {
      type: Boolean
    }
  },
  emits: ["drop"],
  inject: {
    vuMediaUploadDropText: {
      default: "Drop your files to upload"
    }
  },
  computed: {
    classes() {
      return {
        "vu-media-upload-droppable--valid": this.validDrop
      };
    }
  },
  mounted() {
  },
  beforeUnmount() {
  },
  methods: {},
  components: { VuIcon: H }
}, su = { class: "vu-media-upload-droppable__icon" }, nu = { class: "vu-media-upload-droppable__label" };
function iu(e, s, t, i, o, n) {
  const a = b("VuIcon");
  return l(), r("div", {
    class: y(["vu-media-upload-droppable", n.classes]),
    onDrop: s[0] || (s[0] = Q((d) => e.$emit("drop", d), ["prevent", "stop"]))
  }, [
    S(e.$slots, "drop-main", {}, () => [
      m("div", su, [
        I(a, {
          icon: "up",
          color: "none"
        })
      ])
    ]),
    S(e.$slots, "drop-alt", {}, () => [
      m("span", nu, g(n.vuMediaUploadDropText), 1)
    ])
  ], 34);
}
const Fs = /* @__PURE__ */ O(tu, [["render", iu]]), lu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Fs
}, Symbol.toStringTag, { value: "Module" })), ou = {
  name: "vu-media-upload-empty",
  components: { VuIcon: H, VuBtn: re, VuIconLink: At },
  props: {
    rich: {
      // default: true,
      type: Boolean
    }
  },
  emits: ["browse"],
  inject: {
    vuMediaUploadPlaceholderLong: {
      default: "Drag & Drop files here"
    },
    vuMediaUploadPlaceholder: {
      default: "Drag & Drop or"
    },
    vuMediaUploadOR: {
      default: "or"
    },
    vuMediaUploadBrowse: {
      default: "Browse Files"
    }
  }
}, au = { class: "vu-media-upload-empty" }, ru = { class: "vu-media-upload-empty__OR" }, uu = { key: 1 };
function du(e, s, t, i, o, n) {
  const a = b("VuIcon"), d = b("VuBtn"), u = b("VuIconLink");
  return l(), r("div", au, [
    I(a, { icon: "drag-drop" }),
    t.rich ? (l(), r(B, { key: 0 }, [
      m("span", null, g(n.vuMediaUploadPlaceholderLong), 1),
      m("span", ru, g(n.vuMediaUploadOR), 1),
      I(d, {
        onClick: s[0] || (s[0] = (f) => e.$emit("browse")),
        color: "primary"
      }, {
        default: C(() => [
          x(g(n.vuMediaUploadBrowse), 1)
        ]),
        _: 1
      })
    ], 64)) : (l(), r("div", uu, [
      x(g(n.vuMediaUploadPlaceholder), 1),
      I(u, {
        onClick: s[1] || (s[1] = (f) => e.$emit("browse"))
      }, {
        default: C(() => [
          x(g(n.vuMediaUploadBrowse), 1)
        ]),
        _: 1
      })
    ]))
  ]);
}
const Ds = /* @__PURE__ */ O(ou, [["render", du], ["__scopeId", "data-v-e72d88bf"]]), cu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ds
}, Symbol.toStringTag, { value: "Module" })), hu = {
  name: "vu-media-upload-error",
  inject: {
    vuMediaUploadRetry: {
      default: "Retry"
    }
  },
  emits: ["retry"],
  props: {
    icon: {
      type: String,
      default: "attention"
    },
    // eslint-disable-next-line vue/require-prop-types
    errorBucket: {
      default: () => []
    }
  },
  components: { VuIconBtn: U, VuBtn: re }
}, fu = { class: "vu-media-upload-error" };
function mu(e, s, t, i, o, n) {
  const a = b("VuIconBtn"), d = b("VuBtn");
  return l(), r("div", fu, [
    I(a, {
      icon: t.icon,
      class: "vu-media-upload-error__icon"
    }, null, 8, ["icon"]),
    (l(!0), r(B, null, V(t.errorBucket, (u, f) => (l(), r("span", {
      class: "vu-media-upload-error__error_label",
      key: f
    }, g(u), 1))), 128)),
    I(d, {
      onClick: s[0] || (s[0] = (u) => e.$emit("retry")),
      class: "vu-media-upload-error__retry",
      small: ""
    }, {
      default: C(() => [
        x(g(n.vuMediaUploadRetry), 1)
      ]),
      _: 1
    })
  ]);
}
const zs = /* @__PURE__ */ O(hu, [["render", mu], ["__scopeId", "data-v-1ea45111"]]), pu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: zs
}, Symbol.toStringTag, { value: "Module" })), gu = {
  name: "vu-progress-circular",
  mixins: [Te],
  data() {
    return {
      progressAngle: this.value / this.total * 100 * 3.6,
      intervalId: null,
      completedView: this.value >= this.total
    };
  },
  props: {
    value: {
      default: 0,
      type: Number
    },
    total: {
      default: 100,
      type: Number
    },
    radius: {
      default: 60,
      type: Number
    },
    noHatch: {
      default: !1,
      type: Boolean
    },
    unfilledColor: {
      type: String,
      default: "#d1d4d4"
      // $grey-4
    },
    color: {
      type: String,
      default: () => "default",
      validator(e) {
        return ["default", "success", "warning", "error"].includes(e);
      }
    },
    hexColor: {
      type: String,
      required: !1,
      default: ""
    },
    speedModifier: {
      type: Number,
      default: 1
    }
  },
  watch: {
    total() {
      this.animateProgress();
    },
    value() {
      this.animateProgress();
    }
  },
  computed: {
    radiusPx() {
      return `${this.radius}px`;
    },
    formattedCompletedCount() {
      return this.value < this.total ? this.value : this.total;
    },
    progressPercentage() {
      return this.value / this.total * 100;
    },
    renderHatch() {
      return !this.noHatch && this.value < this.total;
    }
  },
  methods: {
    updateAngle(e) {
      this.completedView = !1;
      const s = Math.abs(this.progressAngle - e);
      Math.round(this.progressAngle) < Math.round(e) ? s <= this.speedModifier ? this.progressAngle = e : this.progressAngle += this.speedModifier : Math.round(this.progressAngle) > Math.round(e) ? s <= this.speedModifier ? this.progressAngle = e : this.progressAngle -= this.speedModifier : (clearInterval(this.intervalId), this.value >= this.total && (this.completedView = !0));
    },
    animateProgress() {
      this.intervalId && clearInterval(this.intervalId);
      const e = this.progressPercentage * 3.6;
      this.intervalId = setInterval(this.updateAngle.bind(this, e), 5);
    }
  },
  beforeUnmount() {
    this.intervalId && clearInterval(this.intervalId);
  }
}, vu = { class: "vu-progress-circular" }, yu = { class: "vu-progress-circular__content" };
function bu(e, s, t, i, o, n) {
  return l(), r("div", vu, [
    m("div", {
      class: y(["vu-progress-circular__circle", t.hexColor ? "" : `vu-progress-circular--${t.color}`]),
      style: M({
        background: `conic-gradient( currentcolor ${o.progressAngle}deg, ${t.unfilledColor} ${o.progressAngle}deg)`,
        width: n.radiusPx,
        height: n.radiusPx,
        color: t.hexColor !== void 0 && t.hexColor,
        "-webkit-mask": `radial-gradient(${t.radius * (2 / 5)}px, #0000 98%, #000)`
      })
    }, [
      n.renderHatch ? (l(), r("div", {
        key: 0,
        class: y(["vu-progress-circular__hatch-container", { "vu-progress-circular__hatch-clip": o.progressAngle < 180 }])
      }, [
        m("div", {
          class: "vu-progress-circular__hatch",
          style: M(`transform: rotate(${o.progressAngle}deg)`)
        }, null, 4)
      ], 2)) : p("", !0)
    ], 6),
    m("div", yu, [
      o.completedView && this.$slots.complete ? S(e.$slots, "complete", { key: 0 }, void 0, !0) : S(e.$slots, "default", { key: 1 }, () => [
        I(Me, {
          name: "fade",
          mode: "out-in"
        }, {
          default: C(() => [
            m("div", {
              key: "uncomplete-view",
              style: M({ fontSize: `${t.radius / 5}px` })
            }, g(Math.round(o.progressAngle / 360 * 100)) + "% ", 5)
          ]),
          _: 1
        })
      ], !0)
    ])
  ]);
}
const Ns = /* @__PURE__ */ O(gu, [["render", bu], ["__scopeId", "data-v-2cca5b59"]]), _u = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ns
}, Symbol.toStringTag, { value: "Module" })), wu = {
  name: "vu-media-upload-loading",
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  inject: {
    vuMediaUploadAbortButton: {
      default: "Abort"
    }
  },
  emits: ["upload-abort"],
  components: { VuProgressCircular: Ns, VuBtn: re }
}, ku = { class: "vu-media-upload-loading" };
function Su(e, s, t, i, o, n) {
  const a = b("VuProgressCircular"), d = b("VuBtn");
  return l(), r("div", ku, [
    I(a, { value: t.progress }, null, 8, ["value"]),
    I(d, {
      color: "default",
      onClick: s[0] || (s[0] = (u) => e.$emit("upload-abort")),
      small: "",
      class: "vu-media-upload-loading__abort"
    }, {
      default: C(() => [
        x(g(n.vuMediaUploadAbortButton), 1)
      ]),
      _: 1
    })
  ]);
}
const Es = /* @__PURE__ */ O(wu, [["render", Su], ["__scopeId", "data-v-65c4aae6"]]), Cu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Es
}, Symbol.toStringTag, { value: "Module" })), Iu = {
  name: "vu-media-upload-preview",
  computed: {
    videoSizer() {
      var i;
      const [e, s] = (i = this.displayRatio) == null ? void 0 : i.replace(",", "").split("/"), t = Number(e) / Number(s);
      return t ? { paddingBottom: `${1 / t * 100}%` } : void 0;
    }
  },
  props: {
    deleteIcon: {
      type: String,
      default: () => "trash"
    },
    src: {
      type: String,
      required: !0
    },
    isVideo: {
      type: Boolean
    },
    videoControls: {
      type: Boolean,
      required: !1
    },
    displayRatio: {
      type: String,
      default: () => "16 / 9"
    }
  },
  emits: ["delete"],
  components: { VuImage: Fe, VuIconBtn: U }
}, Bu = ["src", "controls"];
function Ou(e, s, t, i, o, n) {
  const a = b("VuIconBtn"), d = b("VuImage"), u = b("vu-spinner");
  return l(), r(B, null, [
    t.isVideo ? (l(), r("div", {
      key: 0,
      class: "vu-media-upload-preview__video-container",
      style: M(n.videoSizer)
    }, [
      m("video", {
        class: "vu-media-upload-preview",
        src: t.src,
        controls: t.videoControls
      }, null, 8, Bu)
    ], 4)) : t.isVideo ? e.loading ? (l(), _(u, { key: 2 })) : p("", !0) : (l(), _(d, {
      key: 1,
      class: "vu-media-upload-preview",
      "aspect-ratio": t.displayRatio,
      src: t.src,
      contain: "",
      style: { height: "100%" }
    }, {
      default: C(() => [
        m("div", {
          class: "vu-media-upload-preview__delete-icon",
          onClick: s[0] || (s[0] = (f) => e.$emit("delete"))
        }, [
          I(a, { icon: t.deleteIcon }, null, 8, ["icon"])
        ])
      ]),
      _: 1
    }, 8, ["aspect-ratio", "src"])),
    t.isVideo ? (l(), r("div", {
      key: 3,
      class: "vu-media-upload-preview__delete-icon",
      onClick: s[1] || (s[1] = (f) => e.$emit("delete"))
    }, [
      I(a, { icon: t.deleteIcon }, null, 8, ["icon"])
    ])) : p("", !0)
  ], 64);
}
const js = /* @__PURE__ */ O(Iu, [["render", Ou], ["__scopeId", "data-v-d9cd5744"]]), Vu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: js
}, Symbol.toStringTag, { value: "Module" })), $u = {
  empty: "empty",
  loading: "loading",
  error: "error",
  complete: "complete"
}, xu = {
  name: "vu-media-upload",
  mixins: [Z, K, Ie, ee, te],
  props: {
    icon: {
      type: String,
      default: () => ""
    },
    mediaUrl: {
      type: String,
      default: () => ""
    },
    video: {
      type: Boolean,
      default: !1
    },
    videoControls: {
      type: Boolean,
      default: !0
    },
    uploadProgress: {
      type: Number,
      required: !1,
      default: void 0
    },
    fileMaxSize: {
      type: Number,
      default: () => 1 / 0
    },
    displayRatio: {
      type: String,
      default: () => "16 / 9"
    },
    showLabel: {
      type: Boolean
    },
    multiple: {
      type: Boolean
    },
    allowLoadingDrop: {
      type: Boolean
    },
    allowErrorDrop: {
      type: Boolean
    },
    skipTypeCheck: {
      type: Boolean,
      required: !1
    },
    noDragNDrop: {
      type: Boolean,
      required: !1
    },
    acceptVideo: Boolean,
    acceptImage: {
      type: Boolean,
      default: !0
    },
    state: {
      type: String,
      default: ""
    }
  },
  inject: {
    vuMediaUploadSizeExcess: {
      default: "File exceeds maximum size."
    },
    vuMediaUploadShouldBeImage: {
      default: "Please select an image."
    },
    vuMediaUploadShouldBeVideo: {
      default: "Please select a video."
    }
  },
  data() {
    return {
      states: $u,
      innerState: "empty",
      innerVideo: !1,
      allowDrop: !1,
      dragged: !1,
      error: ""
    };
  },
  created() {
    this.localRules = [this.checkVideoType, this.checkImgType, this.checkFileSize];
  },
  emits: ["update:state", "upload-abort", "select", "delete", "retry"],
  computed: {
    preview() {
      return {
        src: this.mediaUrl,
        isVideo: this.video || this.innerVideo,
        displayRatio: this.displayRatio,
        videoControls: this.videoControls
      };
    },
    hasLabel() {
      return this.showLabel && !this.multiple;
    },
    wrapStyle() {
      return {
        "aspect-ratio": this.displayRatio
      };
    },
    status: {
      get() {
        return this.state || this.innerState;
      },
      set(e) {
        this.$emit("update:state", e), this.innerState = e;
      }
    }
  },
  watch: {
    hasError(e) {
      e && (this.status = this.states.error);
    }
  },
  methods: {
    selectFiles(e) {
      this.multiple && e.length > 1 ? (this.status = this.states.loading, this.$emit("select", e)) : this.skipTypeCheck ? (this.status = this.states.loading, this.$emit("select", e)) : this.validate(e[0]) && (this.status = this.states.loading, this.$emit("select", e));
    },
    dragOver() {
      this.noDragNDrop || this.state !== this.states.complete && (this.state === this.states.loading && !this.allowLoadingDrop || this.state === this.states.error && !this.allowErrorDrop || (this.allowDrop = !0, this.dragged = !0));
    },
    dragLeave(e) {
      e.currentTarget.contains(e.relatedTarget) || (this.dragged = !1, this.allowDrop = !1);
    },
    onFileDrop(e) {
      this.dragged = !1, this.allowDrop = !1, this.status = this.states.loading, this.selectFiles(e.dataTransfer.files);
    },
    checkFileSize({ size: e }) {
      return this.fileMaxSize && e / 1024 / 1024 >= this.fileMaxSize ? this.vuMediaUploadSizeExcess : !0;
    },
    /* 3 checks disablable with skipTypeCheck */
    checkImgType({ type: e }) {
      if (this.acceptImage) {
        const s = /image\/(jpg|jpeg|png|webp)$/i.test(e);
        if (s && (this.innerVideo = !1), !this.acceptVideo)
          return s || this.vuMediaUploadShouldBeImage;
      }
      return !0;
    },
    checkVideoType({ type: e }) {
      if (this.acceptVideo) {
        const s = /video\/(mp4|avi)$/i.test(e);
        if (this.innerVideo = s, !this.acceptImage)
          return s || this.vuMediaUploadShouldBeVideo;
      }
      return !0;
    },
    checkVideoAndImgType({ type: e }) {
      return this.acceptVideo && this.acceptImage ? /video\/(mp4|avi)$/i.test(e) && /image\/(jpg|jpeg|png|webp)$/i.test(e) || this.vuMediaUploadTypeUnexpected : !0;
    },
    onRetry() {
      this.errorBucket = [], this.status = this.states.empty, this.$emit("retry", this.$refs["upload-input"].value);
    }
  },
  components: { VuIcon: H, VuMediaUploadDroppable: Fs, VuMediaUploadLoading: Es, VuMediaUploadError: zs, VuMediaUploadEmpty: Ds, VuMediaUploadPreview: js }
}, Mu = {
  key: 0,
  class: "control-label"
}, Pu = {
  key: 0,
  class: "label-field-required"
}, Lu = ["multiple"];
function Tu(e, s, t, i, o, n) {
  const a = b("VuIcon"), d = b("VuMediaUploadDroppable"), u = b("VuMediaUploadEmpty"), f = b("VuMediaUploadLoading"), c = b("VuMediaUploadError"), h = b("vuMediaUploadPreview");
  return l(), r("div", {
    class: y(["vu-media-upload", [{ "has-error": o.error, "vu-media-upload--border": !n.hasLabel, "vu-media-upload--inner-flex": n.hasLabel }]]),
    style: M(n.hasLabel ? {} : n.wrapStyle)
  }, [
    n.hasLabel ? (l(), r("label", Mu, [
      t.icon ? (l(), _(a, {
        key: 0,
        icon: t.icon
      }, null, 8, ["icon"])) : p("", !0),
      S(e.$slots, "label", {}, () => [
        x(g(e.label), 1),
        e.required ? (l(), r("span", Pu, " *")) : p("", !0)
      ], !0)
    ])) : p("", !0),
    m("input", {
      ref: "upload-input",
      type: "file",
      name: "upload",
      style: { display: "none" },
      onChange: s[0] || (s[0] = (v) => n.selectFiles(e.$refs["upload-input"].files)),
      multiple: t.multiple
    }, null, 40, Lu),
    m("div", {
      class: y(["vu-media-upload__inner", { "vu-media-upload--border": n.hasLabel, "full-height": !n.hasLabel }]),
      ref: "inner",
      style: M(n.hasLabel ? n.wrapStyle : ""),
      onDragover: s[4] || (s[4] = Q((v) => n.dragOver(), ["prevent"])),
      onDragenter: s[5] || (s[5] = Q((v) => n.dragOver(), ["prevent"])),
      onDragleave: s[6] || (s[6] = (...v) => n.dragLeave && n.dragLeave(...v)),
      onDragend: s[7] || (s[7] = (...v) => n.dragLeave && n.dragLeave(...v))
    }, [
      o.dragged ? (l(), _(d, {
        key: 0,
        "valid-drop": o.allowDrop,
        onDrop: n.onFileDrop
      }, {
        "drop-icon": C(() => [
          S(e.$slots, "drop-icon", {}, void 0, !0)
        ]),
        "drop-label": C(() => [
          S(e.$slots, "drop-label", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["valid-drop", "onDrop"])) : p("", !0),
      n.status === o.states.empty ? S(e.$slots, "empty", {
        key: 1,
        input: e.$refs["upload-input"]
      }, () => [
        I(u, {
          onBrowse: s[1] || (s[1] = (v) => {
            e.$refs["upload-input"].value = "", e.$refs["upload-input"].click();
          })
        })
      ], !0) : n.status === o.states.loading ? S(e.$slots, "loading", { key: 2 }, () => [
        I(f, {
          progress: t.uploadProgress,
          onUploadAbort: s[2] || (s[2] = (v) => e.$emit("upload-abort"))
        }, null, 8, ["progress"])
      ], !0) : n.status === o.states.error ? S(e.$slots, "error", { key: 3 }, () => [
        I(c, z({ onRetry: n.onRetry }, { errorBucket: e.errorBucket }), null, 16, ["onRetry"])
      ], !0) : n.status === o.states.complete ? S(e.$slots, "preview", { key: 4 }, () => [
        I(h, z(n.preview, {
          onDelete: s[3] || (s[3] = (v) => {
            e.$emit("delete"), n.status = o.states.empty;
          })
        }), null, 16)
      ], !0) : p("", !0)
    ], 38)
  ], 6);
}
const Au = /* @__PURE__ */ O(xu, [["render", Tu], ["__scopeId", "data-v-b2db812d"]]), Fu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Au
}, Symbol.toStringTag, { value: "Module" })), Du = {
  name: "vu-message",
  mixins: [Ae, Te],
  components: { VuIconLink: At },
  props: {
    text: {
      type: String,
      default: () => ""
    },
    closable: {
      type: Boolean,
      default: () => !0
    },
    color: {
      type: String,
      default: () => "primary"
    },
    animate: {
      type: Boolean,
      default: () => !0
    },
    link: {
      type: String,
      required: !1
    },
    linkHandler: {
      type: Function,
      required: !1,
      default: () => () => {
      }
    },
    timeout: {
      type: Number,
      default: () => 0
    },
    animationDuration: {
      type: Number,
      default: 500
    },
    // eslint-disable-next-line vue/require-default-prop
    target: String
  },
  emits: ["update:show", "click-link"],
  data: () => ({
    activeTimeout: 0,
    in: !0,
    _disposed: !1
  }),
  computed: {
    colored() {
      return !!this.color;
    },
    classes() {
      return [`alert-${this.color}`, {
        "alert-closable": this.closable
      }];
    }
  },
  watch: {
    show: {
      immediate: !0,
      handler() {
        this.setTimeout();
      }
    },
    _dispose(e) {
      e && this.dispose();
    }
  },
  methods: {
    dispose() {
      if (this._disposed = !0, !this.animate) {
        this.$emit("update:show", !1);
        return;
      }
      window.setTimeout(() => {
        this.$emit("update:show", !1);
      }, this.animationDuration);
    },
    setTimeout() {
      this.show && this.timeout && (window.clearTimeout(this.activeTimeout), this.activeTimeout = window.setTimeout(() => {
        this.dispose();
      }, this.timeout));
    }
  }
}, zu = {
  key: 0,
  class: "icon fonticon"
}, Nu = { class: "alert-message-wrap" }, Eu = ["innerHTML"];
function ju(e, s, t, i, o, n) {
  const a = b("VuIconLink");
  return l(), _(Me, { name: "alert-fade" }, {
    default: C(() => [
      e.show && !e._disposed ? (l(), r("div", {
        key: 0,
        class: y(["vu-message alert-has-icon", n.classes])
      }, [
        n.colored ? (l(), r("span", zu)) : p("", !0),
        m("span", Nu, [
          S(e.$slots, "default", {}, () => [
            m("div", { innerHTML: t.text }, null, 8, Eu)
          ], !0)
        ]),
        t.link ? (l(), _(a, {
          key: 1,
          label: t.link,
          class: "vu-message_link",
          onClick: s[0] || (s[0] = () => {
            e.$emit("click-link", e.linkData), t.linkHandler();
          })
        }, null, 8, ["label"])) : p("", !0),
        t.closable ? (l(), r("span", {
          key: 2,
          class: "close fonticon fonticon-cancel",
          onClick: s[1] || (s[1] = (...d) => n.dispose && n.dispose(...d))
        })) : p("", !0)
      ], 2)) : p("", !0)
    ]),
    _: 3
  });
}
const Rs = /* @__PURE__ */ O(Du, [["render", ju], ["__scopeId", "data-v-2a41349c"]]), Ru = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Rs
}, Symbol.toStringTag, { value: "Module" }));
let Ye = {
  create: () => {
  },
  hide: () => {
  },
  _exists: () => !1,
  _register: () => {
  }
};
function Uu(e) {
  const s = Ne([]), t = Ne({});
  Ye = yt({
    _messages: t,
    namespaces: s,
    create(o) {
      const { target: n = "main" } = o;
      if (!this._exists(n))
        throw new Error("Target namespace is unknown");
      const a = {
        id: ye(),
        bind: {
          target: n,
          _dispose: !1,
          show: !0,
          ...o
        },
        dispose() {
          this.bind._dispose = !0;
        }
      };
      return this._messages[n].push(Ne(a)), a;
    },
    hide(o) {
      const { target: n = "main" } = o.bind;
      this._messages[n].splice(this._messages[n].indexOf(o), 1);
    },
    _exists(o) {
      return s.includes(o);
    },
    _register(o) {
      s.push(o), this._messages[o] = Se([]);
    }
  }), e.provide("vuMessageAPI", Ye), e.config.globalProperties.$vuMessage = Ye;
}
const Hu = {
  name: "vu-message-container",
  props: {
    namespace: {
      type: String,
      default: "main"
    }
  },
  created() {
    this.api = Ye, this.api._exists(this.namespace) ? this.disabled = !0 : this.api._register(this.namespace);
  },
  data: () => ({
    api: {},
    disabled: !1
  }),
  components: { VuMessage: Rs }
}, qu = {
  key: 0,
  class: "alert alert-root",
  style: { visibility: "visible" }
};
function Wu(e, s, t, i, o, n) {
  const a = b("VuMessage");
  return e.disabled ? p("", !0) : (l(), r("div", qu, [
    (l(!0), r(B, null, V(e.api._messages[t.namespace], (d) => (l(), _(a, z(d.bind, {
      key: `${d.id}`,
      "onUpdate:show": (u) => e.api.hide(d)
    }), null, 16, ["onUpdate:show"]))), 128))
  ]));
}
const Ku = /* @__PURE__ */ O(Hu, [["render", Wu], ["__scopeId", "data-v-b369376b"]]), Gu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ku
}, Symbol.toStringTag, { value: "Module" })), Yu = {
  name: "vu-mobile-dialog",
  emits: ["close", "confirm"],
  components: { VuScroller: Ue, VuIconBtn: U },
  props: {
    title: {
      type: String,
      default: ""
    },
    backIcon: {
      type: String,
      default: "close"
    },
    backIconTooltip: {
      type: String,
      default: "Close"
    },
    nextIcon: {
      type: String,
      default: "check"
    },
    nextIconTooltip: {
      type: String,
      default: "OK"
    },
    scrollable: {
      type: Boolean,
      default: !0
    },
    customNextIcon: {
      type: Boolean
    },
    customBackIcon: {
      type: Boolean
    },
    nextIconDisabled: {
      type: Boolean
    }
  },
  computed: {
    _backIcon() {
      return this.customBackIcon ? this.backIcon : ["chevron-left", "close"].includes(this.backIcon) ? this.backIcon : "-";
    },
    _icon() {
      return this.customNextIcon ? this.nextIcon : ["chevron-right", "send", "check"].includes(this.nextIcon) ? this.nextIcon : "-";
    },
    backClasses() {
      return [this._backIcon === "chevron-left" ? "chevron" : ""];
    },
    nextClasses() {
      return [this._icon === "chevron-right" ? "chevron" : ""];
    }
  }
}, Xu = { class: "vu-mobile-dialog" }, Ju = { class: "vu-mobile-dialog__header" }, Qu = { class: "vu-mobile-dialog__header__default" }, Zu = {
  class: "vu-label-wrap",
  style: { overflow: "hidden" }
};
function ed(e, s, t, i, o, n) {
  const a = b("VuIconBtn"), d = b("VuScroller"), u = W("tooltip");
  return l(), r("div", Xu, [
    m("div", Ju, [
      S(e.$slots, "mobile-dialog-header", {}, () => [
        m("div", Qu, [
          $(I(a, {
            icon: n._backIcon,
            class: y([n.backClasses, "vu-mobile-dialog__header_back topbar"]),
            onClick: s[0] || (s[0] = (f) => e.$emit("close"))
          }, null, 8, ["icon", "class"]), [
            [
              u,
              t.backIconTooltip,
              void 0,
              { bottom: !0 }
            ]
          ]),
          m("div", Zu, [
            $((l(), r("label", null, [
              x(g(t.title), 1)
            ])), [
              [
                u,
                t.title,
                void 0,
                { bottom: !0 }
              ]
            ])
          ]),
          $(I(a, {
            icon: n._icon,
            class: y([n.nextClasses, "vu-mobile-dialog__header_next topbar"]),
            disabled: t.nextIconDisabled,
            onClick: s[1] || (s[1] = (f) => e.$emit("confirm"))
          }, null, 8, ["icon", "class", "disabled"]), [
            [
              u,
              t.nextIconTooltip,
              void 0,
              { bottom: !0 }
            ]
          ])
        ])
      ], !0)
    ]),
    m("div", {
      class: y(["vu-mobile-dialog__content", `vu-mobile-dialog__content--${t.scrollable ? "" : "non-"}scrollable`])
    }, [
      t.scrollable ? (l(), _(d, { key: 0 }, {
        default: C(() => [
          S(e.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      })) : S(e.$slots, "default", { key: 1 }, void 0, !0)
    ], 2)
  ]);
}
const Us = /* @__PURE__ */ O(Yu, [["render", ed], ["__scopeId", "data-v-37f003ee"]]), td = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Us
}, Symbol.toStringTag, { value: "Module" })), sd = {
  name: "vu-modal",
  data: () => ({
    model: "",
    mobileWidth: !1,
    resizeObs: {},
    pick: Is,
    pickNRename: tl
  }),
  emits: ["close", "cancel", "confirm"],
  mixins: [Ae],
  props: {
    show: {
      type: Boolean,
      required: !1,
      default: () => !1
    },
    keepRendered: {
      type: Boolean,
      default: () => !1
    },
    title: {
      type: String,
      default: () => ""
    },
    message: {
      type: String,
      default: () => ""
    },
    rawContent: {
      type: String,
      default: ""
    },
    keyboard: {
      type: Boolean,
      default: () => !0
    },
    showCancelIcon: {
      type: Boolean,
      default: () => !0
    },
    showCancelButton: {
      type: Boolean,
      default: () => !1
    },
    showFooter: {
      type: Boolean,
      default: () => !0
    },
    showInput: {
      type: Boolean,
      default: () => !1
    },
    /* input props */
    label: {
      type: String,
      default: () => ""
    },
    helper: {
      type: String,
      default: () => ""
    },
    placeholder: {
      type: String,
      default: () => ""
    },
    rules: {
      type: Array,
      default: () => []
    },
    required: {
      type: Boolean,
      default: () => !0
    },
    success: {
      type: Boolean,
      default: () => !1
    },
    disableKeyboardConfirm: {
      type: Boolean,
      default: !1
    },
    /* input props */
    cancelLabel: {
      type: String,
      default: () => "Cancel"
    },
    okLabel: {
      type: String,
      default: () => "OK"
    },
    /* mobile specific props */
    noMobile: {
      type: Boolean
    },
    mobileNextIcon: {
      type: String
    },
    mobileNextIconTooltip: {
      type: String
    },
    mobileCustomNextIcon: {
      type: Boolean
    },
    mobileNextIconDisabled: {
      type: Boolean
    },
    mobileBackIcon: {
      type: String
    },
    mobileBackIconTooltip: {
      type: String
    },
    mobileCustomBackIcon: {
      type: Boolean
    },
    mobileScrollable: {
      type: Boolean
    },
    /* cancel */
    // eslint-disable-next-line vue/prop-name-casing
    _cancel: Boolean
  },
  inject: {
    vuMobileBreakpoint: {
      default: () => "640"
    }
  },
  watch: {
    _cancel(e) {
      e && this.cancel();
    }
  },
  beforeMount() {
    this.noMobile || (this.checkWidth(), window.addEventListener("resize", this.checkWidth));
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkWidth);
  },
  methods: {
    cancel(e = !1) {
      this.innerShow = !1, this.$emit(e ? "close" : "cancel"), this.showInput && this.clear();
    },
    confirm() {
      this.showInput ? this.$refs.form.validate() && (this.$emit("confirm", this.model), this.innerShow = !1, this.clear()) : (this.$emit("confirm", !0), this.innerShow = !1);
    },
    validate(e) {
      this.$refs.form.validate(e);
    },
    clear() {
      this.model = "";
    },
    checkWidth() {
      window.document.documentElement.clientWidth < this.vuMobileBreakpoint ? this.mobileWidth = !0 : this.mobileWidth = !1;
    }
  },
  components: { VuMobileDialog: Us, VuInput: Ps, VuForm: $s, VuBtn: re }
}, nd = { key: 0 }, id = ["innerHTML"], ld = { key: 1 }, od = {
  class: "vu-modal modal modal-root",
  style: { display: "block" }
}, ad = { class: "modal-wrap" }, rd = { class: "modal-header" }, ud = { class: "modal-body" }, dd = ["innerHTML"], cd = { key: 1 }, hd = {
  key: 0,
  class: "modal-footer"
}, fd = /* @__PURE__ */ m("div", { class: "modal-overlay in" }, null, -1);
function md(e, s, t, i, o, n) {
  const a = b("VuInput"), d = b("VuForm"), u = b("VuMobileDialog"), f = b("VuBtn");
  return t.keepRendered || e.innerShow ? $((l(), r("div", nd, [
    !t.noMobile && e.mobileWidth ? (l(), _(u, z({ key: 0 }, {
      ...e.pick(e.$props, "title"),
      ...e.pickNRename(
        e.$props,
        { key: "mobileBackIcon", newName: "backIcon" },
        { key: "mobileBackIconTooltip", newName: "backIconTooltip" },
        { key: "mobileCustomBackIcon", newName: "customBackIcon" },
        { key: "mobileNextIcon", newName: "nextIcon" },
        { key: "mobileNextIconTooltip", newName: "nextIconTooltip" },
        { key: "mobileNextIconDisabled", newName: "nextIconDisabled" },
        { key: "mobileCustomNextIcon", newName: "customNextIcon" },
        { key: "mobileScrollable", newName: "scrollable" }
      ),
      disabled: e.valid
    }, {
      onClose: s[1] || (s[1] = (c) => n.cancel()),
      onConfirm: s[2] || (s[2] = (c) => n.confirm())
    }), {
      "mobile-dialog-header": C(() => [
        S(e.$slots, "mobile-header")
      ]),
      default: C(() => [
        S(e.$slots, "modal-body", {}, () => [
          t.rawContent ? (l(), r("div", {
            key: 0,
            innerHTML: t.rawContent
          }, null, 8, id)) : t.message ? (l(), r("p", ld, g(t.message), 1)) : p("", !0),
          t.showInput ? (l(), _(d, {
            key: 2,
            ref: "form"
          }, {
            default: C(() => [
              I(a, {
                modelValue: e.model,
                "onUpdate:modelValue": s[0] || (s[0] = (c) => e.model = c),
                label: t.label,
                required: t.required,
                helper: t.helper,
                success: t.success,
                placeholder: t.placeholder,
                rules: t.rules
              }, null, 8, ["modelValue", "label", "required", "helper", "success", "placeholder", "rules"])
            ]),
            _: 1
          }, 512)) : p("", !0)
        ])
      ]),
      _: 3
    }, 16)) : (l(), r(B, { key: 1 }, [
      m("div", od, [
        m("div", ad, [
          m("div", {
            class: "modal-content",
            onKeyup: [
              s[6] || (s[6] = Pe(() => {
                t.keyboard && (!t.showInput || e.$refs.form.validate()) && !t.disableKeyboardConfirm && n.confirm();
              }, ["enter"])),
              s[7] || (s[7] = Pe(() => {
                t.keyboard && (t.showCancelButton ? n.cancel() : e.close());
              }, ["escape"]))
            ]
          }, [
            m("div", rd, [
              S(e.$slots, "modal-header", {}, () => [
                t.showCancelIcon ? (l(), r("span", {
                  key: 0,
                  class: "close fonticon fonticon-cancel",
                  title: "",
                  onClick: s[3] || (s[3] = (c) => n.cancel(!0))
                })) : p("", !0),
                m("h4", null, g(t.title), 1)
              ])
            ]),
            m("div", ud, [
              S(e.$slots, "modal-body", {}, () => [
                t.rawContent ? (l(), r("div", {
                  key: 0,
                  innerHTML: t.rawContent
                }, null, 8, dd)) : t.message ? (l(), r("p", cd, g(t.message), 1)) : p("", !0),
                t.showInput ? (l(), _(d, {
                  key: 2,
                  ref: "form"
                }, {
                  default: C(() => [
                    I(a, {
                      modelValue: e.model,
                      "onUpdate:modelValue": s[4] || (s[4] = (c) => e.model = c),
                      label: t.label,
                      required: t.required,
                      helper: t.helper,
                      success: t.success,
                      placeholder: t.placeholder,
                      rules: t.rules
                    }, null, 8, ["modelValue", "label", "required", "helper", "success", "placeholder", "rules"])
                  ]),
                  _: 1
                }, 512)) : p("", !0)
              ])
            ]),
            t.showFooter ? (l(), r("div", hd, [
              S(e.$slots, "modal-footer", {}, () => [
                I(f, {
                  color: "primary",
                  onClick: n.confirm
                }, {
                  default: C(() => [
                    x(g(t.okLabel), 1)
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                t.showCancelButton ? (l(), _(f, {
                  key: 0,
                  color: "default",
                  onClick: s[5] || (s[5] = (c) => n.cancel())
                }, {
                  default: C(() => [
                    x(g(t.cancelLabel), 1)
                  ]),
                  _: 1
                })) : p("", !0)
              ])
            ])) : p("", !0)
          ], 32)
        ])
      ]),
      fd
    ], 64))
  ], 512)), [
    [me, e.innerShow]
  ]) : p("", !0);
}
const Ft = /* @__PURE__ */ O(sd, [["render", md]]), pd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ft
}, Symbol.toStringTag, { value: "Module" }));
let ze = {
  show: () => {
  },
  hide: () => {
  },
  alert: () => {
  },
  confirm: () => {
  },
  prompt: () => {
  },
  _modals: Se([])
};
function gd(e) {
  const s = Se([]);
  return ze = yt({
    _modals: s,
    show(i) {
      return this.hide(), new Promise((o, n) => {
        const a = {
          id: ye(),
          component: Ft,
          bind: Ne({ ...i, show: !0 }),
          on: {
            close: () => {
              this.hide(a), n();
            },
            confirm: (d) => {
              this.hide(a), o(d);
            },
            cancel: () => {
              this.hide(a), n();
            }
          }
        };
        this._modals.push(Se(a));
      });
    },
    hide(i) {
      if (i) {
        const o = this._modals.find((n) => n.id === i.id);
        if (!o)
          return;
        o.bind.show = !1, setTimeout(() => {
          const n = this._modals.findIndex((a) => a.id === i.id);
          n > -1 && this._modals.splice(n, 1);
        }, 1e3);
      } else
        this._modals.forEach((o) => {
          o._cancel = !0;
        }), this._modals.splice(0, this._modals.length);
    },
    alert(i) {
      return this.show(i);
    },
    confirm(i) {
      return this.show({
        showCancelIcon: !0,
        showCancelButton: !0,
        ...i
      });
    },
    prompt(i) {
      return this.show({
        showCancelIcon: !0,
        showCancelButton: !0,
        showInput: !0,
        ...i
      });
    }
  }), e.provide("vuModalAPI", ze), e.config.globalProperties.$vuModal = ze, ze;
}
const vd = {
  name: "vu-modal-container",
  components: {
    VuModal: Ft
  },
  data: () => ({
    // eslint-disable-next-line vue/no-reserved-keys
    _modals: {
      type: Object
    }
  }),
  created() {
    this._modals = ze._modals;
  }
};
function yd(e, s, t, i, o, n) {
  return l(!0), r(B, null, V(e._modals, (a) => (l(), _(vt(a.component), z({
    key: a.id
  }, a.bind, {
    modelValue: a.value,
    "onUpdate:modelValue": (d) => a.value = d
  }, fe(a.on)), null, 16, ["modelValue", "onUpdate:modelValue"]))), 128);
}
const bd = /* @__PURE__ */ O(vd, [["render", yd]]), _d = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: bd
}, Symbol.toStringTag, { value: "Module" }));
function Jt(e, s) {
  var t;
  e.value > -1 ? e.value -= 1 : e.value = (((t = s.value) == null ? void 0 : t.length) || 0) - 1;
}
function Qt(e, s) {
  var t;
  e.value > (((t = s.value) == null ? void 0 : t.length) || 0) - 2 ? e.value = -1 : e.value += 1;
}
function We(e, s) {
  const { target: t = !1 } = s;
  return t instanceof HTMLInputElement ? e && t.value : !1;
}
function Zt(e, s) {
  const {
    target: t,
    items: i,
    debug: o = !1,
    disabled: n = !1
  } = e || {}, {
    direction: a = "vertical",
    discardWhenValue: d = !1,
    preserveIndexOnRemoval: u = !1
  } = s || {};
  if (!t) {
    o && console.warn("VUEKIT - Warning Keyboard Navigation cannot be applied. Please use onMount hook and check target element is mounted.");
    return;
  }
  const f = a === "vertical", c = L(-1);
  X(i, (v, k) => {
    u && v.length < k.length ? c.value === k.length - 1 && (c.value = v.length - 1) : c.value = -1;
  });
  const h = xn(c, { initialValue: -1 });
  return !f && qe("ArrowLeft", (v) => {
    n || We(d, v) || Jt(c, i);
  }, { target: t }), !f && qe("ArrowRight", (v) => {
    n || We(d, v) || Qt(c, i);
  }, { target: t }), f && qe("ArrowUp", (v) => {
    n || We(d, v) || Jt(c, i);
  }, { target: t }), f && qe("ArrowDown", (v) => {
    n || We(d, v) || Qt(c, i);
  }, { target: t }), { currentIndex: c, last: h };
}
const wd = {
  name: "vu-multiple-select",
  inject: {
    vuMultipleSelectLabels: {
      default: () => ({
        noResults: "No results."
      })
    },
    vuDebug: {
      default: !1
    },
    vuInputComposition: {
      default: !1
    }
  },
  mixins: [Z, K, Ie, ee, Ct, te],
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    itemHeight: {
      type: Number,
      default: () => 38
    },
    minSearchLength: {
      type: Number,
      default: () => 0
    },
    shortPlaceholder: {
      type: String,
      required: !1,
      default: () => ""
    },
    user: {
      type: Boolean,
      required: !1
    },
    userBigBadges: {
      type: Boolean,
      required: !1
    },
    maxVisible: {
      type: Number,
      default: () => 5
    },
    maxSelectable: {
      type: Number,
      default: () => 1 / 0
    },
    caseSensitive: {
      type: Boolean,
      default: !1
    },
    preserveSearchOnBlur: {
      type: Boolean,
      default: !1
    },
    preserveSearchOnItemClick: {
      type: Boolean,
      default: !1
    },
    preserveSearchOnItemKeyboard: {
      type: [Boolean, void 0],
      default: void 0
    },
    noLocalFiltering: {
      type: Boolean,
      default: !1
    },
    disableUnselectionWithinOptions: {
      type: Boolean,
      default: !1
    },
    keepFocusOnInputOnItemClick: {
      type: Boolean,
      default: !1
    },
    keepFocusOnInputOnItemKeyboard: {
      type: [Boolean, void 0],
      default: void 0
    }
  },
  expose: ["toggle"],
  emits: ["search", "update:modelValue", "notify:already-selected"],
  data: () => ({
    open: !1,
    inputInFocus: !1,
    positioned: !0,
    intxObs: null,
    search: "",
    keyIndexItems: -1,
    lastItemChange: -1,
    keyIndexBadges: -1,
    lastBadgeChange: -1,
    bottom: 40,
    top: !1,
    resizeObs: null,
    uid: be()
  }),
  created() {
    this.resizeObs = new ResizeObserver((e) => {
      this.bottom = e[0].contentRect.height + 4;
    });
  },
  mounted() {
    this.$refs.searchfield && this.resizeObs.observe(this.$refs.searchfield), this.target && (this.intxObs = new IntersectionObserver((t) => {
      this.intxObs.unobserve(this.$refs.dropdown);
      const i = this.target.getBoundingClientRect(), o = this.$refs.dropdown.getBoundingClientRect();
      i.bottom < o.bottom && (this.top = !0), this.positioned = !0;
    }, {
      root: this.target,
      threshold: 1
    }));
    const e = Zt({
      disabled: this.disabled,
      items: R(() => this.innerOptions),
      target: this.$refs.input,
      debug: this.vuDebug
    });
    this.lastItemChange = e == null ? void 0 : e.last, this.keyIndexItems = e == null ? void 0 : e.currentIndex;
    const s = Zt({
      disabled: this.disabled,
      items: R(() => this.modelValue),
      target: this.$refs.input,
      debug: this.vuDebug
    }, {
      direction: "horizontal",
      discardWhenValue: !0,
      preserveIndexOnRemoval: !0
    });
    this.keyIndexBadges = s == null ? void 0 : s.currentIndex, this.lastBadgeChange = s == null ? void 0 : s.last;
  },
  watch: {
    search(e) {
      this.executeSearch(e);
    }
  },
  computed: {
    searchLengthMet() {
      return this.search.length >= this.minSearchLength;
    },
    innerOptions() {
      return this.searchLengthMet ? this.noLocalFiltering ? this.options : this.caseSensitive ? this.options.filter((e) => e.label.includes(this.search) || e.value.includes(this.search)) : this.options.filter((e) => e.label.toLowerCase().includes(this.search.toLowerCase()) || e.value.toLowerCase().includes(this.search.toLowerCase())) : [];
    },
    innerOptionsLength() {
      return this.innerOptions.length;
    },
    noResults() {
      return this.options && this.innerOptions.length === 0 && this.searchLengthMet;
    },
    values() {
      return (this.value || []).map((e) => e.value);
    },
    dropdownHeight() {
      return this.noResults ? this.$slots.noResults ? "auto" : this.itemHeight : this.innerOptionsLength > this.maxVisible ? this.itemHeight * ((this.innerOptionsLength === this.maxVisible ? 0 : 0.5) + this.maxVisible) : this.itemHeight * this.innerOptionsLength + 1;
    },
    keepFocusKeyboard() {
      return this.keepFocusOnInputOnItemKeyboard !== void 0 ? this.keepFocusOnInputOnItemKeyboard : this.keepFocusOnInputOnItemClick;
    },
    preserveSearchKeyboard() {
      return this.preserveSearchOnItemKeyboard !== void 0 ? this.preserveSearchOnItemKeyboard : this.preserveSearchOnItemClick;
    }
  },
  methods: {
    executeSearch(e) {
      this.$emit("search", e), e && !this.open && this.openAndIntersect();
    },
    toggle(e, { fromOptionsClick: s = !1, fromOptionsKeyboard: t = !1 } = { fromOptionsClick: !1, fromOptionsKeyboard: !1 }) {
      if (e.disabled)
        return;
      const i = this.value || [], o = i.findIndex((n) => n.value === e.value);
      if (this.values.includes(e.value))
        if (this.maxSelectable === 1)
          this.$emit("update:modelValue", []);
        else if ((s || t) && this.disableUnselectionWithinOptions)
          this.$emit("notify:already-selected", e);
        else {
          const n = i.slice();
          n.splice(o, 1), this.$emit("update:modelValue", n);
        }
      else
        this.maxSelectable === 1 ? (this.$emit("update:modelValue", [e]), this.search = "", this.close()) : this.$emit("update:modelValue", i.concat([e]));
      (s || t) && ((s && this.keepFocusOnInputOnItemClick || t && this.keepFocusKeyboard) && this.$refs.input.focus(), (s && !this.preserveSearchOnItemClick || t && !this.preserveSearchKeyboard) && (this.search = ""));
    },
    getOption(e) {
      return this.options.find((s) => s.value === e) || {};
    },
    close() {
      this.open = !1, this.top = !1, this.preserveSearchOnBlur || (this.search = "");
    },
    async openAndIntersect() {
      if (this.searchLengthMet && !this.open)
        if (this.target && ["scroll", "auto", "visible"].includes(window.getComputedStyle(this.target).overflowY)) {
          const e = this.target.getBoundingClientRect(), s = this.$refs.searchfield.getBoundingClientRect();
          !this.top && (this.maxVisible + 0.5) * this.itemHeight > e.bottom - s.bottom && (this.top = !0), this.open = !0;
        } else
          this.open = !0, this.positioned = !1, await new Promise((e) => setTimeout(e, 10)), await this.$nextTick(), this.intxObs.observe(this.$refs.dropdown);
    },
    beforeUnmount() {
      this.intxObs.disconnect(), delete this.intxObs;
    },
    onDelete(e) {
      var s;
      if (this.open && this.lastItemChange > this.lastBadgeChange) {
        if (this.keyIndexItems > -1) {
          const t = this.innerOptions[this.keyIndexItems];
          !(t != null && t.disabled) && this.values.includes(t.value) && (this.toggle(t, { fromOptionsKeyboard: !0 }), e.preventDefault());
        }
      } else
        this.keyIndexBadges > -1 && !((s = this.value[this.keyIndexBadges]) != null && s.disabled) && this.toggle(this.value[this.keyIndexBadges]);
    },
    onEnter() {
      var e;
      this.open && this.lastItemChange > this.lastBadgeChange && this.keyIndexItems > -1 && !((e = this.value[this.keyIndexBadges]) != null && e.disabled) && this.toggle(this.innerOptions[this.keyIndexItems], { fromOptionsKeyboard: !0 });
    },
    onInput({ target: e }) {
      this.keyIndexBadges > -1 && (this.keyIndexBadges = -1), this.vuInputComposition || (e.composing = !1);
    }
  },
  components: { VuUserPicture: Le, VuBadge: _t, VuIconBtn: U, VuScroller: Ue, VuSelectOptions: Lt }
}, kd = {
  key: 0,
  class: "control-label"
}, Sd = {
  key: 0,
  class: "label-field-required"
}, Cd = {
  key: 1,
  style: { "line-height": "30px" }
}, Id = ["placeholder"], Bd = { style: { "padding-top": "15px" } }, Od = { class: "message" }, Vd = { class: "multiple-select__no-results" }, $d = {
  key: 1,
  class: "form-control-helper-text"
};
function xd(e, s, t, i, o, n) {
  const a = b("VuUserPicture"), d = b("vu-icon-btn"), u = b("VuBadge"), f = b("VuIconBtn"), c = b("VuSelectOptions"), h = b("vu-spinner"), v = b("VuScroller"), k = W("click-outside");
  return l(), r("div", {
    class: y(["vu-multiple-select form-group", e.classes])
  }, [
    e.label.length ? (l(), r("label", kd, [
      x(g(e.label), 1),
      e.required ? (l(), r("span", Sd, " *")) : p("", !0)
    ])) : p("", !0),
    $((l(), r("div", {
      ref: "searchfield",
      class: y([
        "select",
        "select-autocomplete",
        {
          "dropdown-visible": e.open,
          "select-disabled": e.disabled,
          "single-select": t.maxSelectable === 1
        }
      ])
    }, [
      m("div", {
        class: y(["autocomplete-searchbox", {
          "autocomplete-searchbox-active": e.inputInFocus || e.open,
          disabled: e.disabled,
          "autocomplete-searchbox--user": t.user,
          "autocomplete-searchbox--user-big-badges": t.user && t.userBigBadges
        }]),
        onClick: s[8] || (s[8] = (w) => {
          t.maxSelectable === 1 && n.values.length || (e.$refs.input.focus(), n.openAndIntersect());
        })
      }, [
        t.user ? (l(!0), r(B, { key: 0 }, V(e.value, (w, T) => (l(), r("div", {
          key: `${e.uid}-tag-${w}`,
          class: y(["vu-user-badge", {
            "vu-user-badge--hovered": T === e.keyIndexBadges
          }])
        }, [
          I(a, {
            id: w.value,
            src: w.src,
            size: "tiny"
          }, null, 8, ["id", "src"]),
          m("span", null, g(w.label), 1),
          I(d, {
            class: "vu-user-badge__close",
            icon: "close",
            size: "icon-smaller",
            onClick: (D) => n.toggle(w)
          }, null, 8, ["onClick"])
        ], 2))), 128)) : (l(!0), r(B, { key: 1 }, V(e.value, (w, T) => (l(), r("span", {
          key: `${e.uid}-tag-${w}`
        }, [
          S(e.$slots, "badge", { value: w }, () => [
            t.maxSelectable !== 1 ? (l(), _(u, {
              key: 0,
              value: T === e.keyIndexBadges,
              closable: "",
              onClick: s[0] || (s[0] = Q(() => {
              }, ["stop"])),
              onClose: (D) => n.toggle(w)
            }, {
              default: C(() => [
                x(g(w.label), 1)
              ]),
              _: 2
            }, 1032, ["value", "onClose"])) : (l(), r("span", Cd, g(w.label), 1))
          ], !0)
        ]))), 128)),
        n.values.length < t.maxSelectable ? $((l(), r("input", {
          key: 2,
          "onUpdate:modelValue": s[1] || (s[1] = (w) => e.search = w),
          ref: "input",
          type: "text",
          class: "autocomplete-input",
          placeholder: n.values.length && t.shortPlaceholder ? t.shortPlaceholder : e.placeholder,
          onInput: s[2] || (s[2] = (...w) => n.onInput && n.onInput(...w)),
          onBlur: s[3] || (s[3] = (w) => e.inputInFocus = !1),
          onFocus: s[4] || (s[4] = (w) => e.inputInFocus = !0),
          onKeydown: s[5] || (s[5] = Pe((...w) => n.onDelete && n.onDelete(...w), ["delete", "backspace"])),
          onKeyup: s[6] || (s[6] = Pe((...w) => n.onEnter && n.onEnter(...w), ["enter"])),
          onClick: s[7] || (s[7] = (w) => {
            n.openAndIntersect();
          })
        }, null, 40, Id)), [
          [os, e.search]
        ]) : p("", !0)
      ], 2),
      t.maxSelectable === 1 && !t.user && e.value && e.value.length ? (l(), _(f, {
        key: 0,
        icon: "clear",
        class: "select__clear-icon",
        onClick: s[9] || (s[9] = Q((w) => {
          n.toggle(e.value[0]), this.search = "";
        }, ["stop"]))
      })) : p("", !0),
      e.open && n.searchLengthMet ? (l(), r("div", {
        key: 1,
        ref: "dropdown",
        class: y(["select-dropdown", [{ "select-dropdown--no-results": n.noResults, "select-dropdown--dropup": e.top }, e.contentClass]]),
        style: M([
          `height: ${n.dropdownHeight}${n.dropdownHeight !== "auto" ? "px" : ""}`,
          e.top ? `bottom: ${e.bottom}px` : "",
          e.positioned ? "" : "opacity: 0",
          e.contentStyle
        ])
      }, [
        I(v, { "always-show": "" }, {
          default: C(() => [
            $(I(c, {
              multiple: "",
              user: t.user,
              selected: e.value,
              options: n.innerOptions,
              "key-index": e.keyIndexItems,
              onClickItem: s[10] || (s[10] = (w) => n.toggle(w, { fromOptionsClick: !0 }))
            }, {
              default: C(({ item: w }) => [
                S(e.$slots, "default", { item: w }, void 0, !0)
              ]),
              _: 3
            }, 8, ["user", "selected", "options", "key-index"]), [
              [me, n.searchLengthMet && !e.loading]
            ]),
            e.loading ? S(e.$slots, "loading", { key: 0 }, () => [
              m("ul", Bd, [
                m("li", Od, [
                  I(h, { show: "" })
                ])
              ])
            ], !0) : p("", !0),
            !e.loading && n.noResults ? S(e.$slots, "noResults", { key: 1 }, () => [
              m("ul", Vd, [
                m("li", null, g(n.vuMultipleSelectLabels.noResults), 1)
              ])
            ], !0) : p("", !0)
          ]),
          _: 3
        })
      ], 6)) : p("", !0)
    ], 2)), [
      [k, function() {
        n.close();
      }]
    ]),
    (l(!0), r(B, null, V(e.errorBucket, (w, T) => (l(), r("span", {
      key: `${T}-error-${w}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, g(w), 1))), 128)),
    e.helper.length ? (l(), r("span", $d, g(e.helper), 1)) : p("", !0)
  ], 2);
}
const Md = /* @__PURE__ */ O(wd, [["render", xd], ["__scopeId", "data-v-bfecc1d2"]]), Pd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Md
}, Symbol.toStringTag, { value: "Module" })), Ld = {
  name: "vu-range",
  mixins: [Z, et, K, ee, te],
  props: {
    step: {
      type: Number,
      default: 1
    },
    showLabels: {
      type: Boolean,
      default: !0
    },
    customLabels: {
      type: Array,
      required: !1,
      default: void 0
    }
  },
  emits: ["update:modelValue", "mouseup"],
  data() {
    return {
      lowervalue: 0,
      uppervalue: 1
    };
  },
  watch: {
    value: {
      immediate: !0,
      handler() {
        this.lowervalue = Math.min(...this.value), this.uppervalue = Math.max(...this.value);
      }
    }
  },
  computed: {
    value() {
      return this.modelValue || [];
    },
    minLabel() {
      return this.customLabels && this.customLabels.length ? this.customLabels[0] : this.min;
    },
    maxLabel() {
      return this.customLabels && this.customLabels.length ? this.customLabels[(this.max + this.max % this.step) / this.step - this.min] : this.max;
    },
    lowerLabel() {
      return this.customLabels && this.customLabels.length ? this.customLabels[(this.lowervalue - this.min) / this.step] : this.lowervalue;
    },
    upperLabel() {
      return this.customLabels && this.customLabels.length ? this.customLabels[(this.uppervalue - this.min) / this.step] : this.uppervalue;
    },
    computedStyles() {
      const e = (this.lowervalue - this.min) / (this.max - this.min) * 100;
      return {
        width: `${(this.uppervalue - this.min - (this.lowervalue - this.min)) / (this.max - this.min || 1) * 100}%`,
        left: `${e}%`
      };
    }
  },
  methods: {
    commit() {
      this.disabled || this.$emit("mouseup", [this.lowervalue, this.uppervalue]);
    },
    update(e, s) {
      if (this.disabled)
        return;
      let t, i;
      e === "lower" ? (i = Math.min(s, this.uppervalue), t = Math.max(s, this.uppervalue), i > t && (t = Math.min(t + this.step, this.max))) : (i = Math.min(s, this.lowervalue), t = Math.max(s, this.lowervalue), i > t && (i = Math.max(i - this.step, this.min))), this.lowervalue = i, this.uppervalue = t, this.$emit("update:modelValue", [this.lowervalue, this.uppervalue]);
    }
  }
}, Td = {
  key: 0,
  class: "control-label"
}, Ad = {
  key: 0,
  class: "label-field-required"
}, Fd = ["disabled", "value", "min", "max", "step"], Dd = ["disabled", "value", "min", "max", "step"], zd = { class: "vu-range__grey-bar" }, Nd = {
  key: 0,
  class: "vu-range__labels-container"
}, Ed = { class: "vu-range__left vu-range__left-label" }, jd = { class: "vu-range__right vu-range__right-label" }, Rd = {
  key: 1,
  class: "form-control-helper-text"
};
function Ud(e, s, t, i, o, n) {
  return l(), r("div", {
    class: y(["form-group", e.classes])
  }, [
    e.label.length ? (l(), r("label", Td, [
      x(g(e.label), 1),
      e.required ? (l(), r("span", Ad, " *")) : p("", !0)
    ])) : p("", !0),
    m("div", {
      class: y(["vu-range", { disabled: e.disabled }])
    }, [
      m("div", {
        onMouseup: s[2] || (s[2] = (...a) => n.commit && n.commit(...a)),
        class: "vu-range__inputs-container"
      }, [
        m("input", {
          disabled: e.disabled,
          onInput: s[0] || (s[0] = (a) => n.update("lower", parseFloat(a.target.value))),
          value: o.lowervalue,
          min: e.min,
          max: e.max,
          step: t.step,
          class: "slider vu-range__left",
          type: "range"
        }, null, 40, Fd),
        m("input", {
          disabled: e.disabled,
          onInput: s[1] || (s[1] = (a) => n.update("upper", parseFloat(a.target.value))),
          value: o.uppervalue,
          min: e.min,
          max: e.max,
          step: t.step,
          class: "slider vu-range__right",
          type: "range"
        }, null, 40, Dd),
        m("div", zd, [
          m("div", {
            class: "vu-range__blue-bar",
            style: M(n.computedStyles)
          }, null, 4)
        ])
      ], 32),
      t.showLabels ? (l(), r("div", Nd, [
        m("div", Ed, g(n.minLabel), 1),
        m("div", jd, g(n.maxLabel), 1),
        o.lowervalue !== e.min && o.uppervalue !== o.lowervalue ? (l(), r("div", {
          key: 0,
          class: "vu-range__lower-label",
          style: M("left: " + (o.lowervalue - e.min) / (e.max - e.min) * 100 + "%")
        }, g(n.lowerLabel), 5)) : p("", !0),
        o.uppervalue !== e.max ? (l(), r("div", {
          key: 1,
          class: "vu-range__upper-label",
          style: M("left: " + (o.uppervalue - e.min) / (e.max - e.min) * 100 + "%")
        }, g(n.upperLabel), 5)) : p("", !0)
      ])) : p("", !0)
    ], 2),
    (l(!0), r(B, null, V(e.errorBucket, (a, d) => (l(), r("span", {
      key: `${d}-error-${a}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, g(a), 1))), 128)),
    e.helper.length ? (l(), r("span", Rd, g(e.helper), 1)) : p("", !0)
  ], 2);
}
const Hd = /* @__PURE__ */ O(Ld, [["render", Ud], ["__scopeId", "data-v-b2d8ce26"]]), qd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Hd
}, Symbol.toStringTag, { value: "Module" })), Wd = {
  name: "vu-single-checkbox",
  mixins: [ee, te, K],
  inheritAttrs: !1,
  props: {
    // String for Radio, Boolean for Switch/Default
    modelValue: {
      type: [String, Boolean],
      default: () => ""
    },
    label: {
      type: String,
      default: ""
    },
    // Removes slot and label
    standalone: {
      type: Boolean,
      default: !1
    },
    // Optional
    // eslint-disable-next-line vue/require-default-prop
    icon: {
      type: String,
      required: !1
    },
    // Exclusive with Switch
    radio: {
      type: Boolean,
      required: !1
    },
    // Required by radio.
    // eslint-disable-next-line vue/require-default-prop
    group: {
      type: String,
      required: !1
    },
    // Required by radio
    // eslint-disable-next-line vue/require-default-prop
    value: {
      type: String,
      required: !1
    },
    // Excludes radio
    switch: {
      type: Boolean,
      required: !1
    },
    // eslint-disable-next-line vue/require-default-prop
    id: {
      type: [String, Number],
      required: !1
    }
  },
  emits: ["update:modelValue"],
  data: () => ({ uid: be() }),
  computed: {
    topClasses() {
      return {
        "vu-single-checkbox--switch": this.switch,
        "vu-single-checkbox--standalone": this.standalone,
        "vu-single-checkbox--checkbox": !this.switch && !this.radio,
        "vu-single-checkbox--radio": this.radio,
        "vu-single-checkbox--extra-content": this.hasExtraContent
      };
    },
    internalClasses() {
      return {
        "toggle-icon": this.icon,
        "toggle-switch": this.switch,
        "toggle-primary": !this.switch
      };
    },
    hasExtraContent() {
      return this.$slots.default && !this.standalone;
    }
  },
  methods: {
    input(e) {
      return this.radio ? this.$emit("update:modelValue", e.target.value) : this.$emit("update:modelValue", e.target.checked);
    }
  },
  components: { VuIcon: H }
}, Kd = ["type", "checked", "name", "value", "id", "disabled"], Gd = ["for"], Yd = { class: "vu-single-checkbox__inner-span" }, Xd = {
  key: 0,
  class: "vu-single-checkbox__extra-content"
};
function Jd(e, s, t, i, o, n) {
  const a = b("VuIcon");
  return l(), r("div", {
    class: y(["vu-single-checkbox", n.topClasses])
  }, [
    m("div", {
      class: y(["toggle", n.internalClasses])
    }, [
      m("input", z({
        class: "vu-single-checkbox__input",
        type: t.radio ? "radio" : "checkbox",
        checked: t.radio ? t.group === t.modelValue : t.modelValue
      }, e.$attrs, {
        name: t.radio ? t.group : void 0,
        value: t.radio ? t.value : void 0,
        id: e.$attrs[t.id] || `${e.uid}`,
        disabled: e.disabled,
        onClick: s[0] || (s[0] = (...d) => n.input && n.input(...d))
      }), null, 16, Kd),
      t.standalone ? p("", !0) : (l(), r(B, { key: 0 }, [
        m("label", {
          class: "control-label vu-single-checkbox__label",
          for: e.$attrs[t.id] || `${e.uid}`
        }, [
          t.icon ? (l(), _(a, {
            key: 0,
            icon: t.icon
          }, null, 8, ["icon"])) : p("", !0),
          m("span", Yd, g(t.label), 1)
        ], 8, Gd),
        S(e.$slots, "label-prepend", {}, void 0, !0)
      ], 64))
    ], 2),
    n.hasExtraContent ? (l(), r("div", Xd, [
      S(e.$slots, "default", {}, void 0, !0)
    ])) : p("", !0)
  ], 2);
}
const Qd = /* @__PURE__ */ O(Wd, [["render", Jd], ["__scopeId", "data-v-b4e9d368"]]), Zd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Qd
}, Symbol.toStringTag, { value: "Module" })), ec = {
  name: "vu-slider",
  mixins: [Z, K, ee, te],
  props: {
    labels: {
      required: !1,
      type: Object,
      default: () => ({
        min: "Min",
        max: "Max"
      })
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 10
    },
    step: {
      type: Number,
      default: 1
    },
    stepped: {
      type: Boolean,
      default: !1
    },
    showLabels: {
      type: Boolean,
      default: !1
    },
    labelsBeneath: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["mouseUp", "input"],
  data: () => ({
    labelsWidth: 0,
    innerValue: 0
  }),
  created() {
    this.innerValue = this.value;
  },
  mounted() {
    const { leftLabel: { offsetWidth: e = 0 } = {}, rightLabel: { offsetWidth: s = 0 } = {} } = this.$refs;
    this.labelsWidth = Math.max(e, s);
  },
  computed: {
    steps() {
      return [];
    },
    labelsMargin() {
      return this.labelsBeneath ? "" : `${this.labelsWidth}px`;
    },
    computedStyle() {
      return {
        left: this.labelsMargin,
        right: this.labelsMargin,
        width: `calc(100% - ${2 * this.labelsWidth}px + 14px)`
      };
    },
    innerBlueBarStyle() {
      return {
        // right: `calc(${percent}%${ left ? (` + ${ left }`) : ''})`,
        width: `${(this.innerValue - this.min) / (this.max - this.min) * 100}%`
      };
    }
  },
  methods: {
    commit() {
      this.disabled || this.$emit("mouseUp", this.value);
    },
    update(e) {
      this.disabled || (this.innerValue = e, this.$emit("input", this.innerValue));
    }
  }
}, tc = {
  key: 0,
  class: "control-label"
}, sc = {
  key: 0,
  class: "label-field-required"
}, nc = ["disabled", "value", "min", "max", "step"], ic = {
  key: 0,
  class: "vu-slider__steps"
}, lc = {
  key: 1,
  class: "form-control-helper-text"
};
function oc(e, s, t, i, o, n) {
  return l(), r("div", {
    class: y(["form-group", e.classes])
  }, [
    e.label.length ? (l(), r("label", tc, [
      x(g(e.label), 1),
      e.required ? (l(), r("span", sc, " *")) : p("", !0)
    ])) : p("", !0),
    m("div", {
      class: y(["vu-slider", { disabled: e.disabled }])
    }, [
      m("div", {
        onMouseup: s[1] || (s[1] = (...a) => n.commit && n.commit(...a)),
        class: "vu-slider__container"
      }, [
        m("div", {
          ref: "leftLabel",
          class: "vu-slider__left vu-slider__label"
        }, g(t.showLabels ? t.labels.min : t.min), 513),
        m("div", {
          ref: "rightLabel",
          class: "vu-slider__right vu-slider__label"
        }, g(t.showLabels ? t.labels.max : t.max), 513),
        m("input", {
          class: "slider vu-slider__left",
          type: "range",
          disabled: e.disabled,
          value: e.innerValue,
          min: t.min,
          max: t.max,
          step: t.step,
          style: M(t.labelsBeneath ? {} : n.computedStyle),
          onInput: s[0] || (s[0] = (a) => n.update(parseFloat(a.target.value)))
        }, null, 44, nc),
        m("div", {
          class: "vu-slider__grey-bar",
          style: M({ left: n.labelsMargin, right: n.labelsMargin })
        }, [
          m("div", {
            class: "vu-slider__blue-bar vu-slider__blue-bar--left",
            style: M(n.innerBlueBarStyle)
          }, null, 4)
        ], 4)
      ], 32),
      t.stepped ? (l(), r("div", ic, [
        (l(!0), r(B, null, V(n.steps, (a, d) => (l(), r("div", {
          key: d,
          class: "vu-slider__step",
          style: M(a.style)
        }, null, 4))), 128))
      ])) : p("", !0)
    ], 2),
    (l(!0), r(B, null, V(e.errorBucket, (a, d) => (l(), r("span", {
      key: `${d}-error-${a}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, g(a), 1))), 128)),
    e.helper.length ? (l(), r("span", lc, g(e.helper), 1)) : p("", !0)
  ], 2);
}
const ac = /* @__PURE__ */ O(ec, [["render", oc], ["__scopeId", "data-v-c2dadf12"]]), rc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ac
}, Symbol.toStringTag, { value: "Module" })), uc = {
  name: "vu-textarea",
  mixins: [Z, K, ee, te],
  props: {
    rows: {
      type: [Number, String],
      default: () => 2
    },
    name: {
      type: [String],
      required: !1
    },
    minlength: {
      type: Number,
      required: !1
    },
    maxlength: {
      type: Number,
      required: !1
    },
    readonly: {
      type: [Boolean, String, void 0],
      required: !1,
      default: void 0
    },
    spellcheck: {
      type: [Boolean, String, void 0],
      required: !1,
      default: void 0
    },
    wrap: {
      type: String,
      required: !1
    },
    autocomplete: {
      type: [Boolean, String, void 0],
      required: !1,
      default: void 0
    },
    autocorrect: {
      type: [Boolean, String, void 0],
      required: !1,
      default: void 0
    },
    autofocus: {
      type: [Boolean, String, void 0],
      required: !1,
      default: void 0
    }
  },
  emits: ["update:modelValue"],
  inject: {
    isIos: {
      from: $t
    }
  }
}, dc = {
  key: 0,
  class: "control-label"
}, cc = {
  key: 0,
  class: "label-field-required"
}, hc = ["value", "placeholder", "disabled", "name", "minlength", "maxlength", "readonly", "spellcheck", "rows", "wrap", "autocomplete", "autocorrect", "autofocus", "required"], fc = {
  key: 1,
  class: "form-control-helper-text"
};
function mc(e, s, t, i, o, n) {
  return l(), r("div", {
    class: y(["form-group", [e.classes, { ios: n.isIos }]])
  }, [
    e.label.length ? (l(), r("label", dc, [
      x(g(e.label), 1),
      e.required ? (l(), r("span", cc, " *")) : p("", !0)
    ])) : p("", !0),
    m("textarea", {
      value: e.value,
      placeholder: e.placeholder,
      disabled: e.disabled,
      name: t.name,
      minlength: t.minlength,
      maxlength: t.maxlength,
      readonly: t.readonly,
      spellcheck: t.spellcheck,
      rows: t.rows,
      wrap: t.wrap,
      autocomplete: t.autocomplete,
      autocorrect: t.autocorrect,
      autofocus: t.autofocus,
      required: e.required,
      class: "form-control",
      onInput: s[0] || (s[0] = (a) => e.$emit("update:modelValue", a.target.value))
    }, null, 40, hc),
    (l(!0), r(B, null, V(e.errorBucket, (a, d) => (l(), r("p", {
      key: `${d}-error-${a}`,
      style: { display: "block" },
      class: "form-control-error-text"
    }, g(a), 1))), 128)),
    e.helper.length ? (l(), r("span", fc, g(e.helper), 1)) : p("", !0)
  ], 2);
}
const pc = /* @__PURE__ */ O(uc, [["render", mc], ["__scopeId", "data-v-cb8c82c8"]]), gc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: pc
}, Symbol.toStringTag, { value: "Module" })), vc = { class: "list-item__thumbnail" }, yc = { class: "list-item__body" }, bc = { key: 0 }, _c = ["innerHTML"], wc = {
  key: 0,
  class: "body__description"
}, kc = {
  key: 0,
  class: "list-item__action-menu"
}, Sc = {
  name: "vu-thumbnail-list-item"
}, Cc = /* @__PURE__ */ je({
  ...Sc,
  props: {
    icon: { default: "" },
    iconColor: { default: "default" },
    iconSelectedColor: { default: "secondary" },
    title: { default: "" },
    rawTitle: {},
    imgUrl: {},
    unread: { type: Boolean, default: !1 },
    selected: { type: Boolean, default: !1 },
    description: {},
    actions: { default: () => [] },
    iconFill: { type: Boolean },
    value: { default: void 0 },
    lazyImage: { type: Boolean, default: !0 }
  },
  emits: ["click", "click-action"],
  setup(e, { emit: s }) {
    const t = e, i = s, o = L(null), n = L(null), a = L(!1);
    function d() {
      var u;
      (u = o.value) != null && u.scrollIntoViewIfNeeded && o.value.scrollIntoViewIfNeeded({ behavior: "smooth" });
    }
    return Mn(() => t.selected, d), Je(() => {
      t.selected && d();
    }), (u, f) => {
      const c = W("tooltip");
      return l(), r("div", {
        ref_key: "container",
        ref: o,
        class: y(["vu-thumbnail-list-item", [{
          "menu-is-open": a.value,
          selected: u.selected,
          "with-unread-content": u.unread
        }]]),
        onClick: f[3] || (f[3] = ({ target: h }) => {
          var v, k;
          return !((k = (v = n.value) == null ? void 0 : v.$el) != null && k.contains(h)) && i("click", t.value);
        })
      }, [
        m("div", vc, [
          S(u.$slots, "thumbnail", {}, () => [
            u.icon ? (l(), r("div", {
              key: 0,
              class: y(["thumbnail__container", [{ "bg-grey-4": u.iconFill }]])
            }, [
              I(H, {
                class: "thumbnail__icon",
                color: u.selected ? t.iconSelectedColor : t.iconColor,
                icon: u.icon
              }, null, 8, ["color", "icon"])
            ], 2)) : u.imgUrl ? (l(), _(Fe, {
              key: 1,
              src: u.imgUrl || "",
              lazy: u.lazyImage
            }, null, 8, ["src", "lazy"])) : p("", !0)
          ], !0)
        ]),
        m("div", yc, [
          S(u.$slots, "title", {
            isMenuOpen: a.value,
            listItemRef: o.value
          }, () => [
            u.title ? (l(), r("div", {
              key: 0,
              class: y(["body__title", [{
                "font-bold": u.unread,
                "!line-clamp-1": !!u.$slots.description || u.description
              }]])
            }, [
              u.rawTitle ? (l(), r("span", {
                key: 1,
                innerHTML: u.rawTitle
              }, null, 8, _c)) : (l(), r("span", bc, g(u.title), 1))
            ], 2)) : p("", !0)
          ], !0),
          S(u.$slots, "description", {}, () => [
            u.description ? (l(), r("div", wc, g(u.description), 1)) : p("", !0)
          ], !0)
        ]),
        u.unread || u.actions.length ? (l(), r("div", kc, [
          u.unread ? (l(), _(U, {
            key: 0,
            class: "action-menu__unread-icon",
            "no-active": !0,
            "no-hover": "",
            icon: "record"
          })) : p("", !0),
          u.actions.length > 1 ? (l(), _(Ce, {
            key: 1,
            ref_key: "actionMenu",
            ref: n,
            show: a.value,
            "onUpdate:show": f[0] || (f[0] = (h) => a.value = h),
            items: u.actions,
            side: "bottom-right",
            onClickItem: f[1] || (f[1] = (h) => i("click-action", h))
          }, {
            default: C(() => [
              I(U, {
                clickable: "",
                color: u.selected && "secondary" || void 0,
                class: "action-menu__action",
                icon: "chevron-down",
                active: a.value,
                "within-text": !1
              }, null, 8, ["color", "active"])
            ]),
            _: 1
          }, 8, ["show", "items"])) : u.actions.length === 1 ? $((l(), _(U, {
            key: 2,
            ref_key: "actionMenu",
            ref: n,
            clickable: "",
            color: u.selected && "secondary" || void 0,
            class: "action-menu__action",
            icon: u.actions[0].fonticon,
            active: a.value,
            "within-text": !1,
            onClick: f[2] || (f[2] = (h) => i("click-action", u.actions[0]))
          }, null, 8, ["color", "icon", "active"])), [
            [c, u.actions[0].text || u.actions[0].label]
          ]) : p("", !0)
        ])) : p("", !0)
      ], 2);
    };
  }
}), Ic = /* @__PURE__ */ O(Cc, [["__scopeId", "data-v-6158ff83"]]), Bc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ic
}, Symbol.toStringTag, { value: "Module" })), Oc = {
  key: 0,
  class: "control-label"
}, Vc = {
  key: 0,
  class: "label-field-required"
}, $c = { key: 1 }, xc = ["value", "placeholder", "disabled"], Mc = { class: "vu-time-picker__display form-control" }, Pc = { class: "vu-time-picker__body" }, Lc = { class: "vu-time-picker__hours" }, Tc = ["value"], Ac = { class: "vu-time-picker__minutes" }, Fc = ["value"], Dc = {
  key: 3,
  class: "form-control vu-time-picker__display",
  disabled: ""
}, zc = {
  key: 4,
  class: "form-control-helper-text"
}, Nc = {
  name: "vu-time-picker",
  inheritAttrs: !1,
  mixins: [Z, ee, K, te],
  props: {
    useNativeInput: {
      type: Boolean,
      required: !1,
      default: !1
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      minutes: "00",
      hours: "00",
      isPopoverOpen: !1
    };
  },
  watch: {
    modelValue(e) {
      const [s, t] = this.splitTime(e);
      this.hours = s, this.minutes = t;
    },
    minutes(e) {
      this.$emit("update:modelValue", `${this.hours}:${e}`);
    },
    hours(e) {
      this.$emit("update:modelValue", `${e}:${this.minutes}`);
    }
  },
  beforeMount() {
    const [e, s] = this.splitTime(this.modelValue);
    this.hours = e, this.minutes = s;
  },
  methods: {
    splitTime(e) {
      return e.split(":");
    },
    formatNumberForTime(e) {
      return e < 10 ? `0${e}` : `${e}`;
    }
  },
  components: { VuPopover: ae, VuPopover: ae }
}, Ec = /* @__PURE__ */ Object.assign(Nc, {
  setup(e) {
    const s = se("vuInputComposition", !1), t = se(Re, !1);
    return (i, o) => (l(), r("div", {
      class: y(["vu-time-picker form-group", i.classes])
    }, [
      i.label.length ? (l(), r("label", Oc, [
        x(g(i.label) + " ", 1),
        i.required ? (l(), r("span", Vc, " *")) : p("", !0)
      ])) : p("", !0),
      e.useNativeInput || F(t) ? (l(), r("div", $c, [
        m("input", z(i.$attrs, {
          value: i.value,
          placeholder: i.placeholder,
          disabled: i.disabled,
          type: "time",
          class: "vu-time-picker__display-native form-control",
          style: { width: "fit-content" },
          onInput: o[0] || (o[0] = ({ target: n }) => {
            F(s) || (n.composing = !1), i.$emit("update:modelValue", n.value);
          })
        }), null, 16, xc)
      ])) : i.disabled ? (l(), r("div", Dc, [
        m("span", null, g(i.hours), 1),
        x(":"),
        m("span", null, g(i.minutes), 1)
      ])) : (l(), _(ae, {
        key: 2,
        class: "vu-time-picker__popover",
        style: { width: "fit-content" },
        show: i.isPopoverOpen
      }, {
        body: C(() => [
          m("div", Pc, [
            m("div", Lc, [
              (l(!0), r(B, null, V([...Array(24).keys()], (n) => (l(), r("label", {
                key: n,
                class: y({ "vu-time-picker__hours--selected": i.hours === i.formatNumberForTime(n) })
              }, [
                m("span", null, g(i.formatNumberForTime(n)), 1),
                $(m("input", {
                  "onUpdate:modelValue": o[1] || (o[1] = (a) => i.hours = a),
                  type: "radio",
                  name: "hours",
                  value: i.formatNumberForTime(n)
                }, null, 8, Tc), [
                  [jt, i.hours]
                ])
              ], 2))), 128))
            ]),
            m("div", Ac, [
              (l(!0), r(B, null, V([...Array(60).keys()], (n) => (l(), r("label", {
                key: n,
                class: y({ "vu-time-picker__minutes--selected": i.minutes === i.formatNumberForTime(n) })
              }, [
                m("span", null, g(i.formatNumberForTime(n)), 1),
                $(m("input", {
                  "onUpdate:modelValue": o[2] || (o[2] = (a) => i.minutes = a),
                  type: "radio",
                  name: "minutes",
                  value: i.formatNumberForTime(n)
                }, null, 8, Fc), [
                  [jt, i.minutes]
                ])
              ], 2))), 128))
            ])
          ])
        ]),
        default: C(() => [
          m("div", Mc, [
            m("span", null, g(i.hours), 1),
            x(":"),
            m("span", null, g(i.minutes), 1)
          ])
        ]),
        _: 1
      }, 8, ["show"])),
      (l(!0), r(B, null, V(i.errorBucket, (n, a) => (l(), r("span", {
        key: `${a}-error-${n}`,
        style: { display: "block" },
        class: "form-control-error-text"
      }, g(n), 1))), 128)),
      i.helper.length ? (l(), r("span", zc, g(i.helper), 1)) : p("", !0)
    ], 2));
  }
}), jc = /* @__PURE__ */ O(Ec, [["__scopeId", "data-v-cf359eaf"]]), Rc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: jc
}, Symbol.toStringTag, { value: "Module" }));
function Uc(e, s) {
  let t;
  for (let i = 0; i < s; i++)
    t = (e == null ? void 0 : e.parentElement) || t;
  return t ?? document.documentElement;
}
function Hc(e) {
  const {
    enabled: s = !0,
    el: t,
    placeholder: i,
    class: o = "",
    ancestor: n = 0
  } = e || {}, a = L(!1), d = L(), u = L();
  let f = L([]), c = L(/* @__PURE__ */ new WeakMap());
  const h = L(0), v = R(() => f.value.map((P) => c.value.get(P)).reduce((P, De) => P || De, !1)), k = R(
    () => a.value === !1 && v.value
  );
  X(k, (E, P) => {
    n && w();
  }, { flush: "sync" }), X(k, (E, P) => {
    T(!!n);
  }, { flush: "post" });
  const w = () => {
    if (d.value) {
      const E = it(i);
      E && d.value.unobserve(E);
    }
  }, T = async (E) => {
    if (d.value) {
      E && await pt();
      const P = it(i);
      P && d.value.observe(P);
    }
  }, D = (E) => {
    let P = E[0].intersectionRatio;
    n ? k.value ? (a.value = P > h.value, h.value = P) : a.value = P === 1 : a.value = k.value ? P > 0 : P === 1;
  }, Be = () => {
    if (s) {
      const E = it(t);
      if (f.value = [], !E)
        return;
      u.value = new IntersectionObserver(
        (De) => {
          De.forEach(({ intersectionRatio: zt, target: He }) => {
            c.value.set(He, zt > 0);
          });
        }
      );
      let { nextElementSibling: P } = n ? Uc(E, n) : E;
      if (n === 0)
        for (; P && (P == null ? void 0 : P.className.indexOf(o)) === -1; )
          f.value.push(P), u.value.observe(P), P = P == null ? void 0 : P.nextElementSibling;
      else if (P)
        for (; P && P.querySelectorAll(`.${o}`).length === 0; )
          f.value.push(P), u.value.observe(P), P = P == null ? void 0 : P.nextElementSibling;
      d.value = new IntersectionObserver(
        D,
        {
          threshold: 1
        }
      ), T(k.value);
    }
  }, G = async () => {
    ne(), Be();
  }, ne = () => {
    u.value && u.value.disconnect(), d.value && d.value.disconnect(), delete u.value, delete d.value;
  };
  return Je(() => {
    Be();
  }), un(() => {
    ne();
  }), { stick: k, refresh: G };
}
const Hs = (e) => (pe("data-v-885f595d"), e = e(), ge(), e), qc = /* @__PURE__ */ Hs(() => /* @__PURE__ */ m("hr", null, null, -1)), Wc = { class: "vu-timeline-divider-date__date" }, Kc = /* @__PURE__ */ Hs(() => /* @__PURE__ */ m("hr", null, null, -1)), Gc = {
  name: "vu-timeline-divider"
}, Yc = /* @__PURE__ */ je({
  ...Gc,
  props: {
    date: {},
    label: {},
    sticky: { type: Boolean },
    forceStick: { type: Boolean }
  },
  setup(e) {
    const s = se("lang"), t = se(vs, 0), i = se(ys, void 0), o = L(null), n = L(null), a = e, { stick: d, refresh: u } = Hc({ enabled: a.sticky, el: o, placeholder: n, class: "vu-timeline-divider-date", ancestor: t }), f = (c) => {
      const h = new Date(c), v = h.getFullYear(), k = (/* @__PURE__ */ new Date()).getFullYear(), w = v === k ? { weekday: "long", month: "long", day: "numeric" } : {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      };
      return h.toLocaleDateString(s, w);
    };
    return (c, h) => (l(), r(B, null, [
      m("div", {
        class: y(["vu-timeline-divider__placeholder", { "vu-timeline-divider__detached": F(d) && F(t), "vu-timeline-divider--hidden": F(d) && F(t) }]),
        ref_key: "placeholder",
        ref: n
      }, null, 2),
      (l(), _(gt, {
        to: F(i),
        disabled: !F(i) || !F(d)
      }, [
        m("div", {
          class: y(["vu-timeline-divider-date", [
            { "vu-timeline-divider-date--top": F(d) || a.forceStick },
            F(t) && (F(d) || a.forceStick) && F(i) && "absolute" || (F(d) || a.forceStick) && "sticky"
          ]]),
          ref_key: "el",
          ref: o
        }, [
          qc,
          m("div", Wc, g(c.label || f(c.date)), 1),
          Kc
        ], 2)
      ], 8, ["to", "disabled"]))
    ], 64));
  }
}), Xc = /* @__PURE__ */ O(Yc, [["__scopeId", "data-v-885f595d"]]), Jc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Xc
}, Symbol.toStringTag, { value: "Module" })), Qc = (e) => {
  try {
    const { label: s, id: t } = e;
    if (s && t)
      return !0;
  } catch {
  }
  return !1;
}, Zc = {
  name: "vu-tree-view-item",
  mixins: [Ie],
  emits: ["load-complete", "click", "expand", "select"],
  props: {
    selected: {
      type: Array,
      default: () => []
    },
    expanded: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Array,
      default: () => []
    },
    depth: {
      type: Number,
      default: () => 0
    },
    hover: {
      type: Boolean,
      default: !1
    },
    siblingsHaveNoType: {
      type: Boolean,
      default: !1
    },
    item: {
      type: Object,
      validator: Qc,
      required: !0
    },
    main: {
      type: Boolean,
      default: !1
    },
    leftPadding: {
      type: Number,
      default: 0
    }
  },
  inject: {
    vuTreeViewLazy: {
      default: !1
    },
    vuTreeViewLeftPadBase: {
      default: 38
    },
    vuTreeViewLeftPadFunc: {
      type: Function,
      default: void 0
    },
    vuTreeViewLeftPadReduce: {
      type: Boolean,
      default: !1
    },
    vuTreeIcon: {
      type: String,
      default: "expand"
    }
  },
  data: () => ({
    guid: ye
  }),
  watch: {
    item: {
      deep: !0,
      handler(e) {
        this.isLoading && this.$emit("load-complete", e);
      }
    }
  },
  created() {
    this.item.expanded && !this.isExpanded && this.$emit("expand", this.item), this.item.selected && !this.isSelected && this.$emit("select", this.item);
  },
  computed: {
    otherSlots() {
      return Object.fromEntries(this.$slots.filter((e) => e.startsWith("item-")));
    },
    showTreeIcon() {
      return (
        // eslint-disable-next-line operator-linebreak
        this.hasItems || this.vuTreeViewLazy && !this.item.leaf && this.item.items === void 0 && !this.isLoading
      );
    },
    hasItems() {
      return this.item.items && this.item.items.length > 0;
    },
    isSelected() {
      return this.selected.includes(this.item);
    },
    isExpanded() {
      return this.expanded.includes(this.item);
    },
    isLoading() {
      return this.vuTreeViewLazy && this.loading.includes(this.item);
    },
    anyChildrenHasIcon() {
      return this.hasItems && this.item.items.some((e) => e.icon !== void 0);
    },
    getTreeIconClass() {
      return this.isExpanded ? `${this.vuTreeIcon}-down` : `${this.vuTreeIcon}-right`;
    },
    calcLeftPadding() {
      return this.vuTreeViewLeftPadFunc ? this.vuTreeViewLeftPadFunc(this.depth, this.leftPadding) : this.depth ? this.vuTreeViewLeftPadReduce ? Math.max(this.leftPadding + this.vuTreeViewLeftPadBase - 6 * this.depth, this.leftPadding + 6) : this.leftPadding + this.vuTreeViewLeftPadBase : 0;
    }
  },
  methods: {
    onClick(e) {
      var t, i;
      [(t = this.$refs.loadingSpinner) == null ? void 0 : t.$el, (i = this.$refs.treeIcon) == null ? void 0 : i.$el].filter((o) => o).every((o) => !o.contains(e.target)) && this.$emit("select", this.item);
    }
  },
  components: { VuIconBtn: U }
}, eh = (e) => (pe("data-v-a2b9f9ba"), e = e(), ge(), e), th = {
  key: 1,
  class: "vu-tree-view-item__tree-icon-loading",
  ref: "loadingSpinner"
}, sh = /* @__PURE__ */ eh(() => /* @__PURE__ */ m("svg", {
  class: "vu-spin",
  viewBox: "25 25 50 50"
}, [
  /* @__PURE__ */ m("circle", {
    class: "path",
    cx: "50",
    cy: "50",
    r: "20",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "5",
    "stroke-miterlimit": "10"
  })
], -1)), nh = {
  key: 2,
  class: "vu-tree-view-item__tree-icon-placeholder"
}, ih = {
  key: 4,
  class: "vu-tree-view-item__type-icon-placeholder"
}, lh = { class: "vu-tree-view-item__label" };
function oh(e, s, t, i, o, n) {
  const a = b("VuIconBtn"), d = b("VuTreeViewItem", !0), u = W("tooltip");
  return l(), r(B, null, [
    m("div", {
      class: y(["vu-tree-view-item", {
        "vu-tree-view-item--selected": n.isSelected,
        "vu-tree-view-item--unselected": !n.isSelected,
        "vu-tree-view-item--main": t.main,
        "vu-tree-view-item--child": !t.main,
        "vu-tree-view-item--chevron-icon": n.vuTreeIcon === "chevron"
      }]),
      style: M({
        "padding-left": `${n.calcLeftPadding}px`
      }),
      onClick: s[1] || (s[1] = (...f) => n.onClick && n.onClick(...f))
    }, [
      n.showTreeIcon ? (l(), _(a, {
        key: 0,
        icon: n.getTreeIconClass,
        class: "vu-tree-view-item__tree-icon",
        onClick: s[0] || (s[0] = (f) => e.$emit("expand", t.item)),
        ref: "treeIcon"
      }, null, 8, ["icon"])) : n.isLoading ? (l(), r("div", th, [
        S(e.$slots, "itemLoading", {}, () => [
          sh
        ], !0)
      ], 512)) : (l(), r("div", nh)),
      t.item.icon ? (l(), _(a, {
        key: 3,
        class: "vu-tree-view-item__type-icon",
        color: "default-inactive",
        icon: t.item.icon
      }, null, 8, ["icon"])) : t.siblingsHaveNoType ? (l(), r("div", ih)) : p("", !0),
      S(e.$slots, "item-" + t.item.type || "default", {}, () => [
        $((l(), r("div", lh, [
          x(g(t.item.label), 1)
        ])), [
          [
            u,
            t.item.label,
            void 0,
            { ellipsis: !0 }
          ]
        ])
      ], !0)
    ], 6),
    n.hasItems && n.isExpanded ? (l(!0), r(B, { key: 0 }, V(t.item.items, (f) => (l(), _(d, {
      key: `${f.id}`,
      item: f,
      depth: t.depth + 1,
      "left-padding": n.calcLeftPadding,
      selected: t.selected,
      loading: t.loading,
      expanded: t.expanded,
      "siblings-have-no-type": n.anyChildrenHasIcon,
      onLoadComplete: s[2] || (s[2] = (c) => e.$emit("load-complete", c)),
      onExpand: s[3] || (s[3] = (c) => e.$emit("expand", c)),
      onSelect: s[4] || (s[4] = (c) => e.$emit("select", c))
    }, null, 8, ["item", "depth", "left-padding", "selected", "loading", "expanded", "siblings-have-no-type"]))), 128)) : p("", !0)
  ], 64);
}
const ht = /* @__PURE__ */ O(Zc, [["render", oh], ["__scopeId", "data-v-a2b9f9ba"]]), ah = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ht
}, Symbol.toStringTag, { value: "Module" })), rh = {
  name: "vu-tree-view",
  emits: ["update:selected", "update:expanded", "fetch", "item-click", "update:loading"],
  props: {
    selected: {
      type: Array,
      default: () => []
    },
    expanded: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Array,
      required: !1,
      default: void 0
    },
    items: {
      type: Array,
      required: !0
    },
    exclusive: {
      type: Boolean,
      default: !0
    },
    firstLevelBigger: {
      type: Boolean,
      default: !1
    }
  },
  data: () => ({
    innerLoading: []
  }),
  methods: {
    toggleSelect(e) {
      if (this.selected.includes(e)) {
        const s = this.expanded.slice();
        s.splice(s.indexOf(e), 1), this.$emit("update:selected", s);
      } else
        this.exclusive ? this.$emit("update:selected", [e]) : this.$emit("update:selected", [e].concat(this.expanded || []));
    },
    toggleExpand(e) {
      const s = this.expanded.slice();
      this.expanded.includes(e) ? (s.splice(s.indexOf(e), 1), this.$emit("update:expanded", s)) : e.items === void 0 ? (this.$emit("fetch", e), this.loading === void 0 ? this.innerLoading.push(e) : this.$emit("update:loading", [e].concat(this.loading || []))) : (s.push(e), this.$emit("update:expanded", s));
    },
    onLoad(e) {
      this.loading === void 0 && this.innerLoading.splice(this.innerLoading.indexOf(e)), e.items && e.items.length > 0 && !e.leaf && this.$emit("update:expanded", [e].concat(this.expanded || []));
    }
  },
  components: { VuTreeViewItem: ht, VuScroller: Ue, VuTreeViewItem: ht }
}, uh = { class: "vu-tree-view" };
function dh(e, s, t, i, o, n) {
  const a = b("VuTreeViewItem"), d = b("VuScroller");
  return l(), r("div", uh, [
    I(d, null, {
      default: C(() => [
        (l(!0), r(B, null, V(t.items, (u) => (l(), _(a, {
          key: `${u.id}`,
          item: u,
          loading: t.loading || e.innerLoading,
          expanded: t.expanded,
          selected: t.selected,
          main: t.firstLevelBigger,
          onExpand: n.toggleExpand,
          onSelect: n.toggleSelect,
          onLoadComplete: n.onLoad
        }, null, 8, ["item", "loading", "expanded", "selected", "main", "onExpand", "onSelect", "onLoadComplete"]))), 128))
      ]),
      _: 1
    })
  ]);
}
const ch = /* @__PURE__ */ O(rh, [["render", dh]]), hh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ch
}, Symbol.toStringTag, { value: "Module" })), Ee = "__v-click-outside", qs = typeof window < "u", fh = typeof navigator < "u", mh = qs && ("ontouchstart" in window || fh && navigator.msMaxTouchPoints > 0), ph = mh ? ["touchstart"] : ["click", "contextmenu"];
function gh(e) {
  const s = typeof e == "function";
  if (!s && typeof e != "object")
    throw new Error("v-click-outside: Binding value must be a function or an object");
  return {
    handler: s ? e : e.handler,
    middleware: e.middleware || ((t) => t),
    events: e.events || ph,
    innerShow: e.innerShow !== !1
  };
}
function vh({
  el: e,
  event: s,
  handler: t,
  middleware: i
}) {
  const o = s.path || s.composedPath && s.composedPath(), n = o ? !o.includes(e) : !e.contains(s.target);
  s.target !== e && n && i(s) && t(s);
}
function Ws(e, { value: s }) {
  const {
    events: t,
    handler: i,
    middleware: o,
    innerShow: n
  } = gh(s);
  n && (e[Ee] = t.map((a) => ({
    event: a,
    handler: (d) => vh({
      event: d,
      el: e,
      handler: i,
      middleware: o
    })
  })), e[Ee].forEach(({ event: a, handler: d }) => setTimeout(() => {
    e[Ee] && document.documentElement.addEventListener(a, d, !1);
  }, 0)));
}
function Ks(e) {
  (e[Ee] || []).forEach(({ event: t, handler: i }) => document.documentElement.removeEventListener(t, i, !1)), delete e[Ee];
}
function yh(e, { value: s, oldValue: t }) {
  JSON.stringify(s) !== JSON.stringify(t) && (Ks(e), Ws(e, { value: s }));
}
const bh = {
  beforeMount: Ws,
  updated: yh,
  beforeUnmount: Ks
}, ft = qs ? bh : {}, _h = {
  viewAll: "View all",
  contactsInCommon: "### contact$(s) in common",
  profile: "See full profile",
  message: "Start conversation",
  network: "Add user to my network",
  audio: "Add audio",
  conferencing: "Add video",
  screenshare: "Share screen",
  FR: "France",
  BR: "Brazil",
  CN: "China",
  DE: "Germany",
  ES: "Spain",
  GB: "United-Kingdom",
  HU: "Hungary",
  IT: "Italy",
  JP: "Japan",
  PL: "Poland",
  PT: "Portugal",
  RU: "Russia",
  SE: "Sweden",
  TR: "Turkey"
}, wh = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
<path style="fill:#73AF00;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.104c0-4.875,3.953-8.828,8.828-8.828  h494.345c4.875,0,8.828,3.953,8.828,8.828v317.793C512,419.773,508.047,423.725,503.172,423.725z"/>
<path style="fill:#FFE15A;" d="M251.41,135.209L65.354,248.46c-5.651,3.439-5.651,11.641,0,15.081L251.41,376.793  c2.819,1.716,6.36,1.716,9.18,0l186.057-113.251c5.651-3.439,5.651-11.641,0-15.081L260.59,135.209  C257.771,133.493,254.229,133.493,251.41,135.209z"/>
<circle style="fill:#41479B;" cx="256" cy="256.001" r="70.62"/>
<g>
	<path style="fill:#F5F5F5;" d="M195.401,219.874c-3.332,5.578-5.905,11.64-7.605,18.077c39.149-2.946,97.062,8.006,133.922,43.773   c2.406-6.141,3.994-12.683,4.59-19.522C288.247,230.169,235.628,218.778,195.401,219.874z"/>
	<path style="fill:#F5F5F5;" d="M258.925,280.1l1.88,5.638l5.943,0.046c0.769,0.006,1.088,0.988,0.47,1.445l-4.781,3.531   l1.793,5.666c0.232,0.734-0.604,1.341-1.229,0.893l-4.835-3.456l-4.835,3.456c-0.626,0.448-1.461-0.159-1.229-0.893l1.793-5.666   l-4.781-3.531c-0.619-0.457-0.3-1.439,0.469-1.445l5.943-0.046l1.88-5.638C257.649,279.37,258.681,279.37,258.925,280.1z"/>
	<path style="fill:#F5F5F5;" d="M282.024,294.685l0.809,2.426l2.558,0.02c0.331,0.002,0.469,0.425,0.202,0.622l-2.058,1.519   l0.771,2.439c0.1,0.316-0.259,0.577-0.529,0.384l-2.081-1.487l-2.081,1.487c-0.269,0.193-0.629-0.068-0.529-0.384l0.771-2.439   l-2.058-1.519c-0.266-0.196-0.129-0.619,0.202-0.622l2.558-0.02l0.809-2.426C281.474,294.37,281.919,294.37,282.024,294.685z"/>
	<path style="fill:#F5F5F5;" d="M248.938,269.39l0.809,2.426l2.558,0.02c0.331,0.002,0.469,0.425,0.202,0.622l-2.058,1.519   l0.771,2.439c0.1,0.316-0.259,0.577-0.529,0.384l-2.081-1.487l-2.081,1.487c-0.269,0.193-0.629-0.068-0.529-0.384l0.771-2.439   l-2.058-1.519c-0.266-0.196-0.129-0.619,0.202-0.622l2.558-0.02l0.809-2.426C248.388,269.076,248.833,269.076,248.938,269.39z"/>
	<path style="fill:#F5F5F5;" d="M204.13,266.448l0.809,2.426l2.558,0.02c0.331,0.002,0.469,0.425,0.202,0.622l-2.058,1.519   l0.771,2.439c0.1,0.316-0.259,0.577-0.529,0.384l-2.081-1.487l-2.081,1.487c-0.269,0.193-0.629-0.068-0.529-0.384l0.771-2.439   l-2.058-1.519c-0.266-0.196-0.129-0.619,0.202-0.622l2.558-0.02l0.809-2.426C203.581,266.134,204.025,266.134,204.13,266.448z"/>
	<path style="fill:#F5F5F5;" d="M241.614,293.847l0.809,2.426l2.558,0.02c0.331,0.002,0.469,0.425,0.202,0.622l-2.058,1.519   l0.771,2.439c0.1,0.316-0.259,0.577-0.529,0.384l-2.081-1.487l-2.081,1.487c-0.269,0.193-0.629-0.068-0.529-0.384l0.771-2.439   l-2.058-1.519c-0.266-0.196-0.129-0.619,0.202-0.622l2.558-0.02l0.809-2.426C241.065,293.534,241.51,293.534,241.614,293.847z"/>
	<path style="fill:#F5F5F5;" d="M220.99,264.755l0.662,1.984l2.092,0.017c0.27,0.002,0.383,0.348,0.166,0.509l-1.683,1.242   l0.631,1.994c0.082,0.258-0.212,0.472-0.433,0.314l-1.702-1.216l-1.702,1.216c-0.221,0.158-0.514-0.056-0.433-0.314l0.631-1.994   l-1.683-1.242c-0.217-0.161-0.106-0.507,0.166-0.509l2.092-0.017l0.662-1.984C220.541,264.498,220.904,264.498,220.99,264.755z"/>
	<path style="fill:#F5F5F5;" d="M283.819,223.794l0.828,2.482l2.616,0.02c0.339,0.002,0.479,0.435,0.206,0.636l-2.104,1.554   l0.789,2.495c0.103,0.323-0.266,0.59-0.541,0.393l-2.129-1.522l-2.129,1.522c-0.276,0.198-0.643-0.071-0.541-0.393l0.789-2.495   l-2.104-1.554c-0.273-0.201-0.132-0.633,0.206-0.636l2.616-0.02l0.828-2.482C283.257,223.472,283.712,223.472,283.819,223.794z"/>
	<path style="fill:#F5F5F5;" d="M207.012,252.617l0.662,1.984l2.092,0.017c0.27,0.002,0.383,0.348,0.166,0.509l-1.683,1.242   l0.631,1.994c0.082,0.258-0.212,0.472-0.433,0.314l-1.702-1.216l-1.702,1.216c-0.221,0.158-0.514-0.056-0.433-0.314l0.631-1.994   l-1.683-1.242c-0.217-0.161-0.106-0.506,0.166-0.509l2.092-0.017l0.662-1.984C206.563,252.36,206.926,252.36,207.012,252.617z"/>
	<path style="fill:#F5F5F5;" d="M217.112,280.581l1.002,3.006l3.168,0.024c0.41,0.003,0.58,0.526,0.25,0.77l-2.549,1.882l0.956,3.02   c0.124,0.391-0.321,0.715-0.655,0.476l-2.578-1.842l-2.578,1.842c-0.333,0.238-0.779-0.085-0.655-0.476l0.956-3.02l-2.549-1.882   c-0.33-0.244-0.16-0.767,0.25-0.77l3.168-0.024l1.002-3.006C216.433,280.193,216.983,280.193,217.112,280.581z"/>
	<path style="fill:#F5F5F5;" d="M294.903,295.315l0.63,1.891l1.993,0.015c0.258,0.002,0.365,0.331,0.158,0.484l-1.603,1.184   l0.601,1.9c0.078,0.246-0.202,0.449-0.413,0.299l-1.621-1.159l-1.622,1.159c-0.21,0.15-0.49-0.053-0.413-0.299l0.601-1.9   l-1.603-1.184c-0.207-0.153-0.1-0.482,0.158-0.484l1.993-0.015l0.63-1.891C294.475,295.07,294.822,295.07,294.903,295.315z"/>
	<path style="fill:#F5F5F5;" d="M301.877,280.885l0.809,2.426l2.558,0.02c0.331,0.002,0.469,0.425,0.202,0.622l-2.058,1.519   l0.771,2.439c0.1,0.316-0.259,0.577-0.529,0.384l-2.081-1.487l-2.081,1.487c-0.269,0.193-0.629-0.068-0.529-0.384l0.771-2.439   l-2.058-1.519c-0.266-0.196-0.129-0.619,0.202-0.622l2.558-0.02l0.809-2.426C301.327,280.57,301.772,280.57,301.877,280.885z"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, kh = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
<path style="fill:#FF4B55;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.104c0-4.875,3.953-8.828,8.828-8.828  h494.345c4.875,0,8.828,3.953,8.828,8.828v317.793C512,419.773,508.047,423.725,503.172,423.725z"/>
<g>
	<path style="fill:#FFE15A;" d="M85.007,140.733l8.416,25.234l26.6,0.206c3.444,0.026,4.872,4.422,2.101,6.467l-21.398,15.801   l8.023,25.362c1.038,3.284-2.7,5.999-5.502,3.997l-21.64-15.469l-21.64,15.468c-2.802,2.003-6.54-0.714-5.502-3.997l8.023-25.362   l-21.398-15.8c-2.771-2.046-1.343-6.441,2.101-6.467l26.6-0.206l8.416-25.234C79.297,137.465,83.918,137.465,85.007,140.733z"/>
	<path style="fill:#FFE15A;" d="M181.599,146.951l6.035,8.23l9.739-3.046c1.261-0.394,2.298,1.044,1.526,2.115l-5.962,8.281   l5.906,8.321c0.765,1.077-0.282,2.508-1.54,2.105l-9.719-3.111l-6.089,8.189c-0.788,1.06-2.473,0.506-2.478-0.814l-0.045-10.205   l-9.67-3.261c-1.251-0.423-1.246-2.195,0.009-2.609l9.69-3.196l0.114-10.204C179.129,146.427,180.818,145.886,181.599,146.951z"/>
	<path style="fill:#FFE15A;" d="M144.857,122.421l10.145,1.102l4.328-9.241c0.561-1.196,2.321-0.991,2.591,0.302l2.086,9.988   l10.126,1.26c1.311,0.163,1.66,1.901,0.513,2.558l-8.855,5.07l1.931,10.02c0.25,1.298-1.295,2.166-2.274,1.279l-7.559-6.855   l-8.932,4.932c-1.156,0.639-2.461-0.563-1.919-1.768l4.183-9.308l-7.452-6.972C142.805,123.89,143.544,122.279,144.857,122.421z"/>
	<path style="fill:#FFE15A;" d="M160.895,221.314l-6.035,8.23l-9.739-3.046c-1.261-0.394-2.298,1.044-1.526,2.115l5.962,8.281   l-5.906,8.321c-0.765,1.077,0.282,2.508,1.54,2.105l9.719-3.111l6.089,8.189c0.788,1.06,2.473,0.506,2.478-0.814l0.045-10.205   l9.67-3.261c1.252-0.423,1.246-2.195-0.009-2.609l-9.69-3.196l-0.114-10.204C163.363,220.791,161.676,220.248,160.895,221.314z"/>
	<path style="fill:#FFE15A;" d="M197.635,198.263l-10.145,1.102l-4.328-9.241c-0.561-1.196-2.321-0.991-2.591,0.302l-2.087,9.988   l-10.126,1.26c-1.311,0.163-1.66,1.901-0.513,2.558l8.855,5.07l-1.931,10.02c-0.25,1.298,1.295,2.166,2.274,1.279l7.559-6.855   l8.932,4.932c1.156,0.639,2.461-0.563,1.919-1.768l-4.183-9.308l7.452-6.972C199.689,199.732,198.95,198.121,197.635,198.263z"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, Sh = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
<path style="fill:#464655;" d="M512,200.093H0V97.104c0-4.875,3.953-8.828,8.828-8.828h494.345c4.875,0,8.828,3.953,8.828,8.828  L512,200.093L512,200.093z"/>
<path style="fill:#FFE15A;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V311.909h512v102.988  C512,419.773,508.047,423.725,503.172,423.725z"/>
<rect y="200.091" style="fill:#FF4B55;" width="512" height="111.81"/>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, Ch = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
<path style="fill:#C8414B;" d="M8.828,423.725h494.345c4.875,0,8.828-3.953,8.828-8.828V97.104c0-4.875-3.953-8.828-8.828-8.828  H8.828C3.953,88.277,0,92.229,0,97.104v317.793C0,419.773,3.953,423.725,8.828,423.725z"/>
<rect y="158.901" style="fill:#FFD250;" width="512" height="194.21"/>
<path style="fill:#C8414B;" d="M216.276,256.001l7.485-33.681c0.69-3.102-1.671-6.044-4.849-6.044h-5.272  c-3.177,0-5.537,2.942-4.849,6.044L216.276,256.001z"/>
<rect x="207.45" y="238.341" style="fill:#F5F5F5;" width="17.655" height="75.03"/>
<rect x="203.03" y="229.521" style="fill:#FAB446;" width="26.483" height="8.828"/>
<g>
	<rect x="185.38" y="256.001" style="fill:#C8414B;" width="44.14" height="8.828"/>
	<polygon style="fill:#C8414B;" points="229.517,291.311 203.034,282.484 203.034,273.656 229.517,282.484  "/>
	<path style="fill:#C8414B;" d="M83.862,256.001l7.485-33.681c0.69-3.102-1.671-6.044-4.849-6.044h-5.272   c-3.177,0-5.537,2.942-4.849,6.044L83.862,256.001z"/>
</g>
<path style="fill:#F5F5F5;" d="M114.759,229.518c-4.875,0-8.828,3.953-8.828,8.828v57.379c0,10.725,10.01,30.897,44.138,30.897  s44.138-20.171,44.138-30.897v-57.379c0-4.875-3.953-8.828-8.828-8.828H114.759z"/>
<g>
	<path style="fill:#C8414B;" d="M150.069,273.656h-44.138v-35.31c0-4.875,3.953-8.828,8.828-8.828h35.31V273.656z"/>
	<path style="fill:#C8414B;" d="M150.069,273.656h44.138v22.069c0,12.189-9.88,22.069-22.069,22.069l0,0   c-12.189,0-22.069-9.88-22.069-22.069V273.656z"/>
</g>
<path style="fill:#FAB446;" d="M105.931,273.656h44.138v22.069c0,12.189-9.88,22.069-22.069,22.069l0,0  c-12.189,0-22.069-9.88-22.069-22.069V273.656z"/>
<g>
	<path style="fill:#C8414B;" d="M141.241,313.281v-39.625h-8.828v43.693C135.697,316.683,138.664,315.229,141.241,313.281z"/>
	<path style="fill:#C8414B;" d="M123.586,317.349v-43.693h-8.828v39.625C117.336,315.229,120.303,316.683,123.586,317.349z"/>
</g>
<rect x="114.76" y="256.001" style="fill:#FFB441;" width="26.483" height="8.828"/>
<g>
	<rect x="114.76" y="238.341" style="fill:#FAB446;" width="26.483" height="8.828"/>
	<rect x="119.17" y="243.591" style="fill:#FAB446;" width="17.655" height="15.992"/>
</g>
<rect x="75.03" y="238.341" style="fill:#F5F5F5;" width="17.655" height="75.03"/>
<g>
	<rect x="70.62" y="308.971" style="fill:#FAB446;" width="26.483" height="8.828"/>
	<rect x="70.62" y="229.521" style="fill:#FAB446;" width="26.483" height="8.828"/>
</g>
<rect x="66.21" y="317.791" style="fill:#5064AA;" width="35.31" height="8.828"/>
<rect x="207.45" y="308.971" style="fill:#FAB446;" width="26.483" height="8.828"/>
<rect x="198.62" y="317.791" style="fill:#5064AA;" width="35.31" height="8.828"/>
<rect x="123.59" y="220.691" style="fill:#FAB446;" width="52.966" height="8.828"/>
<rect x="145.66" y="194.211" style="fill:#FFB441;" width="8.828" height="26.483"/>
<g>
	<path style="fill:#F5F5F5;" d="M141.241,207.449c-7.302,0-13.241-5.94-13.241-13.241c0-7.302,5.94-13.241,13.241-13.241   c7.302,0,13.241,5.94,13.241,13.241C154.483,201.509,148.543,207.449,141.241,207.449z M141.241,189.794   c-2.435,0-4.414,1.978-4.414,4.414c0,2.435,1.978,4.414,4.414,4.414s4.414-1.978,4.414-4.414   C145.655,191.773,143.677,189.794,141.241,189.794z"/>
	<path style="fill:#F5F5F5;" d="M158.897,207.449c-7.302,0-13.241-5.94-13.241-13.241c0-7.302,5.94-13.241,13.241-13.241   c7.302,0,13.241,5.94,13.241,13.241S166.198,207.449,158.897,207.449z M158.897,189.794c-2.435,0-4.414,1.978-4.414,4.414   c0,2.435,1.978,4.414,4.414,4.414c2.435,0,4.414-1.978,4.414-4.414C163.31,191.773,161.332,189.794,158.897,189.794z"/>
	<path style="fill:#F5F5F5;" d="M176.552,216.277c-7.302,0-13.241-5.94-13.241-13.241c0-7.302,5.94-13.241,13.241-13.241   c7.302,0,13.241,5.94,13.241,13.241S183.853,216.277,176.552,216.277z M176.552,198.622c-2.435,0-4.414,1.978-4.414,4.414   c0,2.435,1.978,4.414,4.414,4.414c2.435,0,4.414-1.978,4.414-4.414S178.987,198.622,176.552,198.622z"/>
	<path style="fill:#F5F5F5;" d="M123.586,216.277c-7.302,0-13.241-5.94-13.241-13.241c0-7.302,5.94-13.241,13.241-13.241   c7.302,0,13.241,5.94,13.241,13.241C136.828,210.337,130.888,216.277,123.586,216.277z M123.586,198.622   c-2.435,0-4.414,1.978-4.414,4.414c0,2.435,1.978,4.414,4.414,4.414s4.414-1.979,4.414-4.415   C128,200.6,126.022,198.622,123.586,198.622z"/>
</g>
<path style="fill:#FAB446;" d="M176.552,291.311v4.414c0,2.434-1.98,4.414-4.414,4.414s-4.414-1.98-4.414-4.414v-4.414H176.552   M185.379,282.484h-26.483v13.241c0,7.302,5.94,13.241,13.241,13.241c7.302,0,13.241-5.94,13.241-13.241v-13.241H185.379z"/>
<path style="fill:#FFA0D2;" d="M172.138,264.829L172.138,264.829c-4.875,0-8.828-3.953-8.828-8.828v-8.828  c0-4.875,3.953-8.828,8.828-8.828l0,0c4.875,0,8.828,3.953,8.828,8.828v8.828C180.966,260.876,177.013,264.829,172.138,264.829z"/>
<circle style="fill:#5064AA;" cx="150.07" cy="273.651" r="13.241"/>
<rect x="145.66" y="176.551" style="fill:#FAB446;" width="8.828" height="26.483"/>
<path style="fill:#C8414B;" d="M123.586,220.691l-8.828-8.828l5.171-5.171c7.993-7.993,18.835-12.484,30.14-12.484l0,0  c11.305,0,22.146,4.491,30.14,12.484l5.171,5.171l-8.828,8.828H123.586z"/>
<g>
	<circle style="fill:#FFD250;" cx="150.07" cy="211.861" r="4.414"/>
	<circle style="fill:#FFD250;" cx="132.41" cy="211.861" r="4.414"/>
	<circle style="fill:#FFD250;" cx="167.72" cy="211.861" r="4.414"/>
</g>
<g>
	<rect x="70.62" y="256.001" style="fill:#C8414B;" width="44.14" height="8.828"/>
	<polygon style="fill:#C8414B;" points="70.621,291.311 97.103,282.484 97.103,273.656 70.621,282.484  "/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, Ih = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
<path style="fill:#41479B;" d="M170.667,423.721H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.1c0-4.875,3.953-8.828,8.828-8.828  h161.839V423.721z"/>
<rect x="170.67" y="88.277" style="fill:#F5F5F5;" width="170.67" height="335.45"/>
<path style="fill:#FF4B55;" d="M503.172,423.721H341.333V88.273h161.839c4.875,0,8.828,3.953,8.828,8.828v317.793  C512,419.77,508.047,423.721,503.172,423.721z"/>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, Bh = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.002 512.002" style="enable-background:new 0 0 512.002 512.002;" xml:space="preserve">
<path style="fill:#41479B;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.104c0-4.875,3.953-8.828,8.828-8.828  h494.345c4.875,0,8.828,3.953,8.828,8.828v317.793C512,419.772,508.047,423.725,503.172,423.725z"/>
<path style="fill:#F5F5F5;" d="M512,97.104c0-4.875-3.953-8.828-8.828-8.828h-39.495l-163.54,107.147V88.276h-88.276v107.147  L48.322,88.276H8.828C3.953,88.276,0,92.229,0,97.104v22.831l140.309,91.927H0v88.276h140.309L0,392.066v22.831  c0,4.875,3.953,8.828,8.828,8.828h39.495l163.54-107.147v107.147h88.276V316.578l163.54,107.147h39.495  c4.875,0,8.828-3.953,8.828-8.828v-22.831l-140.309-91.927H512v-88.276H371.691L512,119.935V97.104z"/>
<g>
	<polygon style="fill:#FF4B55;" points="512,229.518 282.483,229.518 282.483,88.276 229.517,88.276 229.517,229.518 0,229.518    0,282.483 229.517,282.483 229.517,423.725 282.483,423.725 282.483,282.483 512,282.483  "/>
	<path style="fill:#FF4B55;" d="M178.948,300.138L0.25,416.135c0.625,4.263,4.14,7.59,8.577,7.59h12.159l190.39-123.586h-32.428   V300.138z"/>
	<path style="fill:#FF4B55;" d="M346.388,300.138H313.96l190.113,123.404c4.431-0.472,7.928-4.09,7.928-8.646v-7.258   L346.388,300.138z"/>
	<path style="fill:#FF4B55;" d="M0,106.849l161.779,105.014h32.428L5.143,89.137C2.123,90.54,0,93.555,0,97.104V106.849z"/>
	<path style="fill:#FF4B55;" d="M332.566,211.863L511.693,95.586c-0.744-4.122-4.184-7.309-8.521-7.309h-12.647L300.138,211.863   H332.566z"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, Oh = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
<path style="fill:#FF4B55;" d="M512,200.093H0V97.104c0-4.875,3.953-8.828,8.828-8.828h494.345c4.875,0,8.828,3.953,8.828,8.828  L512,200.093L512,200.093z"/>
<path style="fill:#73AF00;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V311.909h512v102.988  C512,419.773,508.047,423.725,503.172,423.725z"/>
<rect y="200.091" style="fill:#F5F5F5;" width="512" height="111.81"/>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, Vh = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
<path style="fill:#73AF00;" d="M170.667,423.721H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.1c0-4.875,3.953-8.828,8.828-8.828  h161.839V423.721z"/>
<rect x="170.67" y="88.277" style="fill:#F5F5F5;" width="170.67" height="335.45"/>
<path style="fill:#FF4B55;" d="M503.172,423.721H341.333V88.273h161.839c4.875,0,8.828,3.953,8.828,8.828v317.793  C512,419.77,508.047,423.721,503.172,423.721z"/>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, $h = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
<path style="fill:#F5F5F5;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.104c0-4.875,3.953-8.828,8.828-8.828  h494.345c4.875,0,8.828,3.953,8.828,8.828v317.793C512,419.773,508.047,423.725,503.172,423.725z"/>
<circle style="fill:#FF4B55;" cx="256" cy="256.001" r="97.1"/>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, xh = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
<path style="fill:#FF4B55;" d="M0,256h512v158.897c0,4.875-3.953,8.828-8.828,8.828H8.828c-4.875,0-8.828-3.953-8.828-8.828V256z"/>
<path style="fill:#F5F5F5;" d="M512,256H0V97.103c0-4.875,3.953-8.828,8.828-8.828h494.345c4.875,0,8.828,3.953,8.828,8.828L512,256  L512,256z"/>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, Mh = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
<path style="fill:#FF4B55;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.104c0-4.875,3.953-8.828,8.828-8.828  h494.345c4.875,0,8.828,3.953,8.828,8.828v317.793C512,419.773,508.047,423.725,503.172,423.725z"/>
<path style="fill:#73AF00;" d="M185.379,88.277H8.828C3.953,88.277,0,92.229,0,97.104v317.793c0,4.875,3.953,8.828,8.828,8.828  H185.38V88.277H185.379z"/>
<circle style="fill:#FFE15A;" cx="185.45" cy="256.001" r="79.38"/>
<path style="fill:#FF4B55;" d="M211.932,229.518v35.31c0,14.603-11.88,26.483-26.483,26.483s-26.483-11.88-26.483-26.483v-35.31  H211.932 M220.759,211.863h-70.621c-4.875,0-8.828,3.953-8.828,8.828v44.138c0,24.376,19.762,44.138,44.138,44.138  s44.138-19.762,44.138-44.138v-44.138C229.587,215.816,225.634,211.863,220.759,211.863L220.759,211.863z"/>
<path style="fill:#F5F5F5;" d="M211.932,229.518v35.31c0,14.603-11.88,26.483-26.483,26.483s-26.483-11.88-26.483-26.483v-35.31  H211.932"/>
<g>
	<circle style="fill:#FFE15A;" cx="150.07" cy="220.691" r="4.414"/>
	<circle style="fill:#FFE15A;" cx="220.69" cy="220.691" r="4.414"/>
	<circle style="fill:#FFE15A;" cx="150.07" cy="256.001" r="4.414"/>
	<circle style="fill:#FFE15A;" cx="220.69" cy="256.001" r="4.414"/>
	<circle style="fill:#FFE15A;" cx="185.38" cy="220.691" r="4.414"/>
	<circle style="fill:#FFE15A;" cx="211.88" cy="288.551" r="4.414"/>
	<circle style="fill:#FFE15A;" cx="159.4" cy="288.551" r="4.414"/>
</g>
<g>
	<path style="fill:#41479B;" d="M191.149,253.763v7.602c0,3.144-2.558,5.702-5.702,5.702s-5.702-2.558-5.702-5.702v-7.602   L191.149,253.763"/>
	<path style="fill:#41479B;" d="M191.149,235.741v7.602c0,3.144-2.558,5.702-5.702,5.702s-5.702-2.558-5.702-5.702v-7.602H191.149"/>
	<path style="fill:#41479B;" d="M191.149,271.97v7.602c0,3.144-2.558,5.702-5.702,5.702s-5.702-2.558-5.702-5.702v-7.602H191.149"/>
	<path style="fill:#41479B;" d="M206.506,253.763v7.602c0,3.144-2.558,5.702-5.702,5.702s-5.702-2.558-5.702-5.702v-7.602   L206.506,253.763"/>
	<path style="fill:#41479B;" d="M175.794,253.763v7.602c0,3.144-2.558,5.702-5.702,5.702s-5.702-2.558-5.702-5.702v-7.602   L175.794,253.763"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, Ph = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
<path style="fill:#F5F5F5;" d="M512,200.093H0V97.104c0-4.875,3.953-8.828,8.828-8.828h494.345c4.875,0,8.828,3.953,8.828,8.828  L512,200.093L512,200.093z"/>
<path style="fill:#FF4B55;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V311.909h512v102.988  C512,419.773,508.047,423.725,503.172,423.725z"/>
<rect y="200.091" style="fill:#41479B;" width="512" height="111.81"/>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, Lh = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
<path style="fill:#4173CD;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.104c0-4.875,3.953-8.828,8.828-8.828  h494.345c4.875,0,8.828,3.953,8.828,8.828v317.793C512,419.773,508.047,423.725,503.172,423.725z"/>
<polygon style="fill:#FFE15A;" points="512,229.518 211.862,229.518 211.862,88.277 158.897,88.277 158.897,229.518 0,229.518   0,282.484 158.897,282.484 158.897,423.725 211.862,423.725 211.862,282.484 512,282.484 "/>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, Th = `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512.001 512.001" style="enable-background:new 0 0 512.001 512.001;" xml:space="preserve">
<path style="fill:#FF4B55;" d="M503.172,423.725H8.828c-4.875,0-8.828-3.953-8.828-8.828V97.104c0-4.875,3.953-8.828,8.828-8.828  h494.345c4.875,0,8.828,3.953,8.828,8.828v317.793C512,419.773,508.047,423.725,503.172,423.725z"/>
<g>
	<path style="fill:#F5F5F5;" d="M253.474,225.753l13.837,18.101l21.606-7.232c1.208-0.404,2.236,0.962,1.512,2.01l-12.939,18.753   l13.555,18.314c0.758,1.024-0.224,2.423-1.444,2.059l-21.834-6.511l-13.228,18.55c-0.739,1.037-2.375,0.536-2.406-0.737   l-0.555-22.777l-21.73-6.849c-1.215-0.383-1.244-2.092-0.042-2.515l21.491-7.566l-0.202-22.783   C251.083,225.296,252.701,224.741,253.474,225.753z"/>
	<path style="fill:#F5F5F5;" d="M176.956,326.662c-38.995,0-70.627-31.633-70.627-70.663c0-38.958,31.633-70.662,70.627-70.662   c14.508,0,27.887,4.462,39.037,12.014c1.707,1.156,3.656-1.087,2.227-2.573c-16.664-17.325-40.248-27.894-66.398-27.001   c-44.926,1.533-82.118,37.553-84.989,82.413c-3.287,51.383,37.399,94.086,88.055,94.086c24.953,0,47.379-10.432,63.393-27.112   c1.415-1.473-0.538-3.683-2.229-2.537C204.89,322.196,191.489,326.662,176.956,326.662z"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
`, es = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BR: wh,
  CN: kh,
  DE: Sh,
  ES: Ch,
  FR: Ih,
  GB: Bh,
  HU: Oh,
  IT: Vh,
  JP: $h,
  PL: xh,
  PT: Mh,
  RU: Ph,
  SE: Lh,
  TR: Th
}, Symbol.toStringTag, { value: "Module" })), Gs = (e) => {
  if (e && e.id)
    return !0;
}, Ah = (e) => {
  try {
    const { firstName: s } = e;
    if (s)
      return !0;
  } catch {
  }
  return !1;
}, Fh = (e) => `${e.firstName}${e.lastName ? ` ${e.lastName}` : ""}`, ke = {
  message: {
    name: "message",
    icon: "chat-alt"
  },
  network: {
    name: "network",
    icon: "user-add",
    left: !0
  },
  audio: {
    name: "audio",
    icon: "phone"
  },
  conferencing: {
    name: "conferencing",
    icon: "videocamera"
  },
  screenshare: {
    name: "screenshare",
    icon: "monitor"
  }
};
ke.network;
const Dh = [ke.message, ke.audio, ke.conferencing, ke.screenshare], Xe = (e) => {
  const s = Object.keys(ke);
  return !(e.length > 0 && e.filter((t) => s.indexOf(t)) === -1);
}, zh = {
  name: "vu-rich-user-tooltip",
  emits: ["network", "message", "audio", "conferencing", "screenshare", "see-profile"],
  directives: {
    "click-outside": ft
  },
  inject: {
    vuUserLabels: {
      default: () => _h
    },
    vuDebug: {
      default: !1
    }
  },
  props: {
    show: {
      type: Boolean,
      required: !1
    },
    user: {
      type: Object,
      validator: Gs,
      required: !0
    },
    disabledActions: {
      type: Array,
      validator: Xe,
      required: !1,
      default: () => []
    },
    hiddenActions: {
      type: Array,
      validator: Xe,
      required: !1,
      default: () => []
    },
    side: {
      type: String,
      default: "bottom"
    },
    // eslint-disable-next-line vue/require-prop-types
    attach: {
      default: !1
    },
    activator: {
      type: Object,
      default: void 0
    }
  },
  watch: {
    show(e) {
      this.innerShow = e;
    },
    contacts: {
      immediate: !0,
      handler() {
        this.parseContactsInCommonLabel();
      }
    }
  },
  /* eslint-disable no-unused-vars */
  data: () => ({
    overflowHover: !1,
    actions: ke,
    RHSactions: Dh,
    uuid: ye,
    getFullname: Fh,
    validateName: Ah,
    contactsLabelPart2: "",
    contactsLabelPart1: "",
    visibleAmount: 7
  }),
  /* eslint-enable no-unused-vars */
  computed: {
    hasInfo() {
      return this.user.company || this.user.country;
    },
    hasContacts() {
      return Array.isArray(this.user.contacts) && this.user.contacts.length > 0;
    },
    contacts() {
      return this.hasContacts ? this.user.contacts : [];
    },
    countryImg() {
      return !this.user.countryCode || !es[this.user.countryCode.toUpperCase()] ? !1 : es[this.user.countryCode.toUpperCase()];
    },
    countryLabel() {
      return this.user.countryCode && this.vuUserLabels[this.user.countryCode];
    },
    overflows() {
      return this.user.contacts && this.user.contacts.length > 7;
    },
    visibleContacts() {
      return this.hasContacts && this.overflows ? this.contacts.slice(0, this.visibleAmount) : this.contacts;
    },
    overflowContact() {
      return this.hasContacts && this.overflows ? this.contacts[this.visibleAmount] : null;
    },
    numberOfOverflowingContactsCssVariable() {
      return `"${this.contacts.length - this.visibleAmount}"`;
    }
  },
  methods: {
    parseContactsInCommonLabel() {
      if (!this.vuUserLabels.contactsInCommon && this.vuDebug) {
        console.warn("contactsInCommon nls is missing");
        return;
      }
      let { contactsInCommon: e } = this.vuUserLabels;
      const s = e.match(/\$\(.*\)/).length > 0;
      this.contacts.length > 1 && s ? e = e.replace("$(", "").replace(")", "") : e = e.replace(/\$\(.*\)/, ""), e = e.split("###"), this.contactsLabelPart1 = e[0], this.contactsLabelPart2 = e[1];
    },
    isDisabled(e) {
      return this.disabledActions.length > 0 && this.disabledActions.includes(e);
    }
  },
  components: { VuPopover: ae, VuUserPicture: Le, VuIconBtn: U }
}, Nh = (e) => (pe("data-v-8d121700"), e = e(), ge(), e), Eh = { class: "rich-user-tooltip__header__wrap-name" }, jh = /* @__PURE__ */ Nh(() => /* @__PURE__ */ m("div", { class: "rich-user-tooltip__header__topbar" }, null, -1)), Rh = { class: "rich-user-tooltip__avatar-wrap" }, Uh = {
  key: 0,
  class: "rich-user-tooltip__info"
}, Hh = {
  key: 0,
  class: "rich-user-tooltip__info__company"
}, qh = {
  key: 1,
  class: "rich-user-tooltip__info__locale"
}, Wh = ["src"], Kh = {
  key: 1,
  class: "rich-user-tooltip__info__country"
}, Gh = { class: "rich-user-tooltip__contacts__label" }, Yh = { class: "rich-user-tooltip__contacts__list" }, Xh = { class: "rich-user-tooltip__footer" }, Jh = { class: "rich-user-tooltip__footer__left" };
function Qh(e, s, t, i, o, n) {
  const a = b("VuUserPicture"), d = b("VuIconBtn"), u = b("VuPopover"), f = W("tooltip");
  return l(), _(u, {
    side: t.side,
    show: t.show,
    arrow: "",
    shift: "",
    positions: ["bottom", "top"],
    attach: "body",
    "content-class": "vu-rich-user-tooltip",
    activator: t.activator
  }, dn({
    default: C(() => [
      S(e.$slots, "default", {}, () => [
        $(I(a, {
          id: t.user.id,
          clickable: "",
          src: t.user.imgSrc,
          presence: t.user.presence,
          class: "rich-user-tooltip__default-content"
        }, null, 8, ["id", "src", "presence"]), [
          [
            f,
            e.getFullname(t.user),
            void 0,
            { top: !0 }
          ]
        ])
      ], !0)
    ]),
    arrow: C(({ side: c, shift: h }) => [
      $(m("div", {
        class: y(["rich-user-tooltip__arrow popover-arrow", `rich-user-tooltip__arrow--${c}`])
      }, null, 2), [
        [me, !h]
      ])
    ]),
    title: C(({ side: c }) => [
      m("div", {
        class: y(["rich-user-tooltip__header", `rich-user-tooltip__header--${c}`])
      }, [
        m("div", Eh, [
          $((l(), r("label", {
            class: "rich-user-tooltip__header__name",
            onClick: s[0] || (s[0] = (h) => e.$emit("see-profile", t.user.id))
          }, [
            x(g(e.getFullname(t.user)), 1)
          ])), [
            [f, e.getFullname(t.user)]
          ])
        ]),
        jh,
        $((l(), r("div", Rh, [
          I(a, {
            class: "rich-user-tooltip__header__avatar",
            size: "big",
            clickable: !0,
            id: t.user && t.user.id,
            gutter: !0,
            presence: t.user.presence,
            onClick: s[1] || (s[1] = (h) => e.$emit("see-profile", t.user.id))
          }, null, 8, ["id", "presence"])
        ])), [
          [
            f,
            e.getFullname(t.user),
            void 0,
            { bottom: !0 }
          ]
        ])
      ], 2)
    ]),
    _: 2
  }, [
    (n.hasInfo || n.hasContacts, {
      name: "body",
      fn: C(() => [
        n.hasInfo ? (l(), r("div", Uh, [
          t.user.company ? (l(), r("label", Hh, g(t.user.company), 1)) : p("", !0),
          n.countryImg || n.countryLabel ? (l(), r("label", qh, [
            n.countryImg ? (l(), r("img", {
              key: 0,
              class: "rich-user-tooltip__info__flag",
              src: n.countryImg
            }, null, 8, Wh)) : p("", !0),
            n.countryLabel ? (l(), r("span", Kh, g(n.countryLabel), 1)) : p("", !0)
          ])) : p("", !0)
        ])) : p("", !0),
        S(e.$slots, "content", {}, void 0, !0),
        n.hasContacts ? (l(), r(B, { key: 1 }, [
          m("label", Gh, [
            x(g(e.contactsLabelPart1), 1),
            $((l(), r("span", {
              class: "rich-user-tooltip__contacts__amount",
              onClick: s[2] || (s[2] = (c) => e.$emit("see-profile", t.user.id))
            }, [
              x(g(n.contacts.length), 1)
            ])), [
              [
                f,
                n.vuUserLabels.profile,
                void 0,
                { bottom: !0 }
              ]
            ]),
            e.contactsLabelPart2 ? (l(), r(B, { key: 0 }, [
              x(g(e.contactsLabelPart2), 1)
            ], 64)) : p("", !0)
          ]),
          m("div", Yh, [
            (l(!0), r(B, null, V(n.visibleContacts, (c) => $((l(), _(a, {
              key: c.id || e.uuid(),
              id: c.id || e.uuid(),
              clickable: !0,
              onClick: (h) => e.$emit("see-profile", c.id)
            }, null, 8, ["id", "onClick"])), [
              [
                f,
                e.getFullname(c),
                void 0,
                { bottom: !0 }
              ]
            ])), 128)),
            n.overflowContact ? $((l(), _(a, {
              key: 0,
              class: "rich-user-tooltip__overflow_contact",
              style: M({
                "--numberOfOverflowingContacts": n.numberOfOverflowingContactsCssVariable
              }),
              clickable: !0,
              hoverable: "",
              id: n.overflowContact.id || e.uuid(),
              onClick: s[3] || (s[3] = (c) => e.$emit("see-profile", n.overflowContact.id))
            }, null, 8, ["style", "id"])), [
              [
                f,
                n.vuUserLabels.profile,
                void 0,
                { bottom: !0 }
              ]
            ]) : p("", !0)
          ])
        ], 64)) : p("", !0),
        m("div", Xh, [
          m("div", Jh, [
            S(e.$slots, "footer-left", {}, () => [
              t.hiddenActions.length && t.hiddenActions.includes("network") ? p("", !0) : $((l(), _(a, {
                key: 0,
                icon: e.actions.network.icon,
                class: "add-network",
                disabled: t.disabledActions.length > 0 && t.disabledActions.includes("network"),
                onClick: s[4] || (s[4] = (c) => {
                  n.isDisabled("network") || e.$emit("network", t.user.id);
                })
              }, null, 8, ["icon", "disabled"])), [
                [
                  f,
                  n.vuUserLabels.network,
                  void 0,
                  { bottom: !0 }
                ]
              ])
            ], !0)
          ]),
          S(e.$slots, "footer-right", {}, () => [
            (l(!0), r(B, null, V(e.RHSactions, (c) => (l(), r(B, {
              key: c.name
            }, [
              t.hiddenActions.length && t.hiddenActions.includes(c.name) ? p("", !0) : $((l(), _(d, {
                key: 0,
                class: "right-btn",
                icon: c.icon,
                disabled: n.isDisabled(c.name),
                onClick: (h) => {
                  n.isDisabled(c.name) || e.$emit(c.name, t.user.id);
                }
              }, null, 8, ["icon", "disabled", "onClick"])), [
                [
                  f,
                  n.vuUserLabels[c.name],
                  void 0,
                  { bottom: !0 }
                ]
              ])
            ], 64))), 128))
          ], !0)
        ])
      ]),
      key: "0"
    })
  ]), 1032, ["side", "show", "activator"]);
}
const Ys = /* @__PURE__ */ O(zh, [["render", Qh], ["__scopeId", "data-v-8d121700"]]), Zh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ys
}, Symbol.toStringTag, { value: "Module" })), ef = {
  name: "vu-user-name",
  props: {
    // eslint-disable-next-line vue/require-default-prop
    firstName: String,
    // eslint-disable-next-line vue/require-default-prop
    lastName: String,
    toUpper: {
      type: Boolean,
      required: !1,
      default: !0
    },
    shift: Boolean,
    clickable: Boolean
  },
  emits: ["click"],
  computed: {
    _lastName() {
      return this.toUpper ? this.lastName.toUpperCase() : this.lastName;
    }
  }
};
function tf(e, s, t, i, o, n) {
  return l(), r("div", {
    class: y(["vu-user-name", [
      "vu-user-name--default-color",
      "vu-user-name--default-size",
      { "vu-user-name--with-avatar": t.shift },
      { "vu-user-name--clickable": t.clickable }
    ]])
  }, [
    S(e.$slots, "default", {}, () => [
      m("span", {
        class: "content",
        onClick: s[0] || (s[0] = (a) => e.$emit("click"))
      }, g(t.firstName + " " + n._lastName), 1)
    ], !0)
  ], 2);
}
const Xs = /* @__PURE__ */ O(ef, [["render", tf], ["__scopeId", "data-v-7c3b1fc7"]]), sf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Xs
}, Symbol.toStringTag, { value: "Module" })), nf = {
  name: "vu-user",
  emits: ["click-other-user", "click-user"],
  props: {
    user: {
      type: Object,
      required: !0,
      validator: Gs
    },
    disabledActions: {
      type: Array,
      required: !1,
      default: () => [],
      validator: Xe
    },
    hiddenActions: {
      type: Array,
      required: !1,
      default: () => [],
      validator: Xe
    },
    showPicture: {
      type: Boolean,
      required: !1,
      default: !0
    },
    showName: {
      type: Boolean,
      required: !1,
      default: !1
    },
    showUserTooltip: {
      type: Boolean,
      required: !1,
      default: !0
    },
    clickable: {
      type: Boolean,
      required: !1,
      default: !0
    },
    pictureBackground: {
      type: String,
      required: !1,
      default: "#fff"
    },
    attach: {
      default: () => !1,
      validator: St
    }
  },
  computed: {
    listeners() {
      return ce(this.$attrs, !0);
    }
  },
  data: () => ({
    getListenersFromAttrs: ce
  }),
  components: { VuRichUserTooltip: Ys, VuUserPicture: Le, VuUserName: Xs, VuUserPicture: Le }
}, lf = { class: "vu-user" };
function of(e, s, t, i, o, n) {
  const a = b("VuUserPicture"), d = b("VuUserName"), u = b("VuRichUserTooltip");
  return l(), r("div", lf, [
    t.showUserTooltip ? (l(), _(u, z({
      key: 0,
      user: t.user,
      "disabled-actions": t.disabledActions,
      "hidden-actions": t.hiddenActions,
      attach: t.attach
    }, fe(n.listeners.vOn || {})), {
      default: C(() => [
        t.showPicture ? (l(), _(a, {
          key: 0,
          id: t.user.id,
          src: t.user.imgSrc,
          presence: t.user.presence,
          clickable: t.clickable,
          style: M({ background: t.pictureBackground }),
          onClick: s[0] || (s[0] = (f) => e.$emit("click-user", e.value))
        }, null, 8, ["id", "src", "presence", "clickable", "style"])) : p("", !0),
        t.showName ? (l(), _(d, {
          key: 1,
          "first-name": t.user.firstName,
          "last-name": t.user.lastName,
          clickable: t.clickable,
          shift: t.showPicture,
          onClick: s[1] || (s[1] = (f) => e.$emit("click-user", f))
        }, {
          default: C(() => [
            S(e.$slots, "userName", {}, void 0, !0)
          ]),
          _: 3
        }, 8, ["first-name", "last-name", "clickable", "shift"])) : p("", !0)
      ]),
      _: 3
    }, 16, ["user", "disabled-actions", "hidden-actions", "attach"])) : (l(), r(B, { key: 1 }, [
      t.showPicture ? (l(), _(a, {
        key: 0,
        id: t.user.id,
        src: t.user.imgSrc,
        presence: t.user.presence,
        clickable: t.clickable,
        style: M({ background: t.pictureBackground }),
        onClick: s[2] || (s[2] = (f) => e.$emit("click-user", f))
      }, null, 8, ["id", "src", "presence", "clickable", "style"])) : p("", !0),
      t.showName ? (l(), _(d, {
        key: 1,
        "first-name": t.user.firstName,
        "last-name": t.user.lastName,
        clickable: t.clickable,
        shift: t.showPicture,
        onClick: s[3] || (s[3] = (f) => e.$emit("click-user", f))
      }, {
        default: C(() => [
          S(e.$slots, "userName", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["first-name", "last-name", "clickable", "shift"])) : p("", !0)
    ], 64))
  ]);
}
const af = /* @__PURE__ */ O(nf, [["render", of], ["__scopeId", "data-v-4a92d15b"]]), rf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: af
}, Symbol.toStringTag, { value: "Module" }));
function tt() {
  if (!window)
    return !1;
  const e = navigator.userAgent.toLowerCase();
  return !!(/iPhone|iPad/i.test(e) || /safari/.test(e) && !/chrome/.test(e) && ("ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}
const Dt = ({ userAgent: e }) => e.match(/android/i);
let Js = null;
function uf({ disableTooltipsOnDevices: e }) {
  Js = e;
}
function Qs(e, s, t, i) {
  const o = s.getBoundingClientRect(), {
    left: n,
    right: a,
    top: d,
    shiftX: u,
    offset: f
  } = It(e, o, t.getBoundingClientRect(), i.getBoundingClientRect(), {}, !0);
  t.style.top = `${d}px`, t.style.left = `${n}px`;
  const c = t.querySelector(".tooltip-arrow") || { style: {} };
  return u > 0 ? (c.style.right = `${u - 5}px`, c.style.left = "initial") : u < 0 && (c.style.left = `${o.left - n + s.clientWidth / 2}px`, c.style.right = "initial"), !0;
}
function Zs(e) {
  switch (!0) {
    case e.left:
      return "left";
    case e.right:
      return "right";
    case e.bottom:
      return "bottom";
    default:
      return "top";
  }
}
async function ts(e, s) {
  if (!s.value || s.modifiers.ellipsis && e.offsetWidth >= e.scrollWidth)
    return;
  const t = Zs(s.modifiers);
  bt(e.tooltip, document.body), e.tooltip.component.props.show = !0, e.tooltip.component.props.side = t, await new Promise((i) => setTimeout(i, 1)), Qs(t, e, e.tooltip.el, document.body), (Dt(navigator) || tt()) && (e.stopClickOutside = Pn(e, () => mt(e), { detectIframe: !0 }));
}
function mt(e) {
  const { tooltip: { component: s } } = e;
  s.props.show = !1, (Dt(navigator) || tt()) && e.stopClickOutside && (e.stopClickOutside(), delete e.stopClickOutside);
}
async function df(e, s, t) {
  var o;
  const { tooltip: i } = e;
  if (i) {
    const { component: n } = i;
    if (i.props.text = s.value, n && (n.props.text = s.value), (o = n == null ? void 0 : n.props) != null && o.show) {
      const a = Zs(s.modifiers);
      await new Promise((d) => setTimeout(d, 1)), Qs(a, t.el, i.el, document.body);
    }
  }
}
const at = {
  setConfig: uf,
  mounted(e, s, t) {
    const { modifiers: i } = s, { forceOnDevices: o = !1 } = i, n = Dt(navigator) || tt();
    if (Js && !o && n || s.disabled)
      return;
    const a = I({ ...Bt }, {
      type: s.modifiers.popover ? "popover" : "tooltip",
      text: s.value
    });
    e.tooltip = a, s.modifiers.click || n ? e.addEventListener("click", () => {
      var d, u, f;
      (f = (u = (d = e == null ? void 0 : e.tooltip) == null ? void 0 : d.component) == null ? void 0 : u.props) != null && f.show ? mt(e) : ts(e, s);
    }) : (e.addEventListener("mouseenter", ts.bind(null, e, s, t)), e.addEventListener("mouseleave", mt.bind(null, e, s, t)));
  },
  updated(e, s, t) {
    s.value !== s.oldValue && df(e, s, t);
  },
  beforeUnmount(e) {
    var s, t, i, o, n;
    if (e.tooltip) {
      const { tooltip: a } = e;
      a && ((t = (s = a == null ? void 0 : a.component) == null ? void 0 : s.el) == null || t.remove(), (n = (o = (i = a == null ? void 0 : a.component) == null ? void 0 : i.vnode) == null ? void 0 : o.el) == null || n.remove());
    }
  }
}, ss = (e, s, t) => {
  const i = I(Tt, { mask: !0 });
  if (bt(i, t.el), e.spinner = i, i && typeof s.value == "string") {
    const { component: o } = i;
    i.props.text = s.value, o && (o.props.text = s.value);
  }
  e.classList.add("masked");
}, ns = (e, s, t) => {
  e.spinner && (bt(null, t.el), e.spinner = null, e.classList.remove("masked"));
}, is = {
  mounted(e, s, t) {
    s.value && ss(e, s, t);
  },
  updated(e, s, t) {
    s.value !== s.oldValue && (s.value ? ss : ns)(e, s, t);
  },
  unmounted(e, s, t) {
    ns(e, s, t);
  }
}, cf = {
  install(e, s = { disableTooltipsOnDevices: !0 }) {
    e.directive("click-outside", ft), e.directive("mask", is), at.setConfig(s), e.directive("tooltip", at);
  },
  clickOutside: ft,
  tooltip: at,
  mask: is
};
function hf() {
  return window ? !!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) : !1;
}
function ff(e, s = {}) {
  const { lang: t = "en", country: i = "US", isMobile: o, isIOS: n, globalRegister: a = !0 } = s;
  if (gd(e), Uu(e), Ll(e), a) {
    const d = /* @__PURE__ */ Object.assign({ "./components/layouts/vu-status-bar.vue": ei, "./components/layouts/vu-thumbnail.vue": Wi, "./components/layouts/vu-tile.vue": Ni, "./components/vu-accordion.vue": el, "./components/vu-alert-dialog/vu-alert-dialog-container.vue": Dl, "./components/vu-alert-dialog/vu-alert-dialog.vue": fl, "./components/vu-badge.vue": mn, "./components/vu-btn-dropdown.vue": Kl, "./components/vu-btn-group.vue": Ql, "./components/vu-btn.vue": jl, "./components/vu-carousel-slide.vue": no, "./components/vu-carousel.vue": mo, "./components/vu-checkbox.vue": So, "./components/vu-contextual-dropdown.vue": Oo, "./components/vu-datepicker.vue": Eo, "./components/vu-dropdownmenu-items.vue": _i, "./components/vu-dropdownmenu.vue": ki, "./components/vu-facets-bar.vue": Wo, "./components/vu-form.vue": Yo, "./components/vu-grid-view.vue": Qa, "./components/vu-icon-btn.vue": Bi, "./components/vu-icon-link.vue": sr, "./components/vu-icon.vue": bn, "./components/vu-image.vue": ri, "./components/vu-input-date.vue": cr, "./components/vu-input-number.vue": kr, "./components/vu-input.vue": $r, "./components/vu-lazy.vue": ni, "./components/vu-lightbox/vu-lightbox-bar.vue": Ur, "./components/vu-lightbox/vu-lightbox.vue": eu, "./components/vu-media-upload-droppable.vue": lu, "./components/vu-media-upload-empty.vue": cu, "./components/vu-media-upload-error.vue": pu, "./components/vu-media-upload-loading.vue": Cu, "./components/vu-media-upload-preview.vue": Vu, "./components/vu-media-upload.vue": Fu, "./components/vu-message/vu-message-container.vue": Gu, "./components/vu-message/vu-message.vue": Ru, "./components/vu-modal/vu-mobile-dialog.vue": td, "./components/vu-modal/vu-modal-container.vue": _d, "./components/vu-modal/vu-modal.vue": pd, "./components/vu-multiple-select.vue": Pd, "./components/vu-popover.vue": Xn, "./components/vu-progress-circular.vue": _u, "./components/vu-range.vue": qd, "./components/vu-scroller.vue": Sa, "./components/vu-select-options.vue": ca, "./components/vu-select.vue": Ra, "./components/vu-single-checkbox.vue": Zd, "./components/vu-slider.vue": rc, "./components/vu-spinner.vue": ya, "./components/vu-textarea.vue": gc, "./components/vu-thumbnail-list-item.vue": Bc, "./components/vu-time-picker.vue": Rc, "./components/vu-timeline-divider.vue": Jc, "./components/vu-tooltip.vue": Hn, "./components/vu-tree-view-item.vue": ah, "./components/vu-tree-view.vue": hh, "./components/vu-user/vu-rich-user-tooltip.vue": Zh, "./components/vu-user/vu-user-name.vue": sf, "./components/vu-user/vu-user-picture.vue": ta, "./components/vu-user/vu-user.vue": rf });
    for (const u in d) {
      const f = d[u];
      e.component(f.default.name, f.default);
    }
  }
  t && i ? e.provide("lang", `${t}-${i}`) : e.provide("lang", "en-US"), e.provide(Re, o !== void 0 ? o : hf()), e.provide($t, n !== void 0 ? n : tt()), e.provide("vuCollectionActions", null), e.provide("vuCollectionLazyImages", !0), e.provide("vuTileEmphasizeText", !1), e.provide("vuDateFormatWeekday", !0), e.provide("vuDateFormatShort", !1), e.provide("vuTreeViewLazy", !0), e.provide("vuTreeViewIcon", "chevron"), cf.install(e, s);
}
const vf = { install: ff };
export {
  Bs as alertDialog,
  ff as default,
  ff as install,
  Ye as message,
  ze as modal,
  vf as plugin,
  gf as provideKeys
};
