define('DS/vuekit3/vuekit3', ['exports', 'DS/vue-3.3.4/vue'], (function (exports, vue) { 'use strict';

  const w = (e, s) => {
    const t = e.__vccOpts || e;
    for (const [l, a] of s)
      t[l] = a;
    return t;
  }, it = {
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
        const s = e.filter((l) => l.intersectionRatio < 1);
        let { length: t } = s;
        if (t) {
          const l = this.$refs.inner.getBoundingClientRect(), { right: a } = l, i = s.shift();
          i && a - i.target.getBoundingClientRect().left - 22 < 0 && (t += 1), this.visibleAmount -= t, this.overflows = !0;
        }
        this.intObs2.disconnect();
      },
      units(e) {
        return this.ellipsis ? e > 99 ? "99+" : `${e}` : `${e}`;
      },
      destroyed() {
        this.intObs1 && delete this.intObs1, this.intObs2 && delete this.intObs2;
      }
    }
  }, nt = {
    class: "status-bar__inner",
    ref: "inner"
  };
  function ot(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-badge"), d = vue.resolveComponent("vu-icon"), u = vue.resolveComponent("vu-popover"), g = vue.resolveDirective("tooltip");
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["vu-status-bar", { "status-bar--constrained": t.constrained }]),
      ref: "container"
    }, [
      vue.createElementVNode("div", nt, [
        (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(i.visibleItems, (y) => vue.withDirectives((vue.openBlock(), vue.createBlock(r, {
          key: y.id,
          icon: y.icon,
          text: y.text || y.amount && i.units(y.amount) || "",
          color: y.color || "copy-grey",
          value: y.value,
          togglable: !1,
          style: vue.normalizeStyle([y.amount && y.icon ? "min-width: 45px" : ""])
        }, null, 8, ["icon", "text", "color", "value", "style"])), [
          [
            g,
            y.tooltip || y.text || y.amount || "",
            void 0,
            { hover: !0 }
          ]
        ])), 128)),
        a.overflows ? (vue.openBlock(), vue.createBlock(u, {
          key: 0,
          type: "tooltip",
          contentClass: "vu-status-bar",
          shift: "",
          arrow: ""
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(d, {
              icon: "menu-dot",
              style: { transform: "rotate(90deg)" }
            })
          ]),
          body: vue.withCtx(() => [
            (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(i.hiddenItems, (y) => (vue.openBlock(), vue.createBlock(r, {
              key: y.id,
              icon: y.icon,
              text: y.text || `${y.amount}` || "",
              color: y.color || "copy-grey",
              value: y.value,
              togglable: !1
            }, null, 8, ["icon", "text", "color", "value"]))), 128))
          ]),
          _: 1
        })) : vue.createCommentVNode("", !0)
      ], 512)
    ], 2);
  }
  const lt = /* @__PURE__ */ w(it, [["render", ot], ["__scopeId", "data-v-f3e755ad"]]), at = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: lt
  }, Symbol.toStringTag, { value: "Module" })), rt = /^on[^a-z]/, ut = (e) => rt.test(e), Z = (e, s) => {
    const t = {};
    for (const l in e)
      ut(l) && (t[s ? l[2].toLowerCase() + l.slice(3) : l] = e[l]);
    return t;
  };
  const dt = {
    name: "vu-thumbnail",
    inject: ["vuCollectionLazyImages"],
    props: {
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
      getListenersFromAttrs: Z
    }),
    computed: {
      classes() {
        return {
          "thumbnail--selectable": this.selectable || this.selected,
          "thumbnail--selected": this.selected,
          "thumbnail--active": this.active
        };
      }
    }
  }, ct = {
    class: "thumbnail-wrap",
    style: { position: "relative" }
  }, ht = {
    key: 0,
    class: "thumbnail__thumb"
  }, gt = { class: "thumbnail__content" };
  function mt(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-image"), d = vue.resolveComponent("vu-icon"), u = vue.resolveComponent("vu-tile"), g = vue.resolveComponent("vu-status-bar");
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["vu-thumbnail item", i.classes])
    }, [
      vue.createElementVNode("div", ct, [
        vue.createVNode(r, {
          src: t.src,
          lazy: i.vuCollectionLazyImages,
          aspectRatio: "200/150",
          contain: ""
        }, null, 8, ["src", "lazy"]),
        t.active ? (vue.openBlock(), vue.createElementBlock("div", ht)) : vue.createCommentVNode("", !0),
        t.selectable || t.selected ? (vue.openBlock(), vue.createBlock(d, {
          key: 1,
          icon: "check",
          class: "thumbnail__check"
        })) : vue.createCommentVNode("", !0),
        vue.createVNode(u, {
          thumbnail: "",
          title: t.title,
          type: t.type,
          author: t.author,
          date: t.date,
          actions: t.actions,
          customMetaData: t.customMetaData,
          hideStatusBar: "",
          onClickAction: e.getListenersFromAttrs(e.$attrs).onClickAction
        }, null, 8, ["title", "type", "author", "date", "actions", "customMetaData", "onClickAction"]),
        vue.createElementVNode("div", gt, vue.toDisplayString(t.text), 1),
        t.hideStatusBar ? vue.createCommentVNode("", !0) : (vue.openBlock(), vue.createBlock(g, {
          key: 2,
          status: t.status
        }, null, 8, ["status"]))
      ])
    ], 2);
  }
  const Mt = /* @__PURE__ */ w(dt, [["render", mt], ["__scopeId", "data-v-5b6adc83"]]), yt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Mt
  }, Symbol.toStringTag, { value: "Module" }));
  const vt = {
    name: "vu-tile",
    inject: ["vuCollectionActions", "vuCollectionLazyImages", "lang", "vuTileEmphasizeText", "vuDateFormatWeekday", "vuDateFormatShort"],
    emits: ["click-action"],
    props: {
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
    methods: {}
  }, pt = { class: "tile-wrap" }, ft = {
    key: 0,
    class: "tile__thumb"
  }, bt = {
    key: 1,
    class: "tile__image"
  }, jt = { class: "tile__title" }, _t = { class: "inner" }, wt = {
    key: 0,
    class: "tile__meta"
  }, Lt = { class: "inner" }, It = {
    key: 1,
    class: "tile__text"
  }, Nt = { class: "inner" }, Ct = {
    key: 2,
    class: "tile__action-icon"
  };
  function Dt(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-image"), d = vue.resolveComponent("vu-icon"), u = vue.resolveComponent("vu-icon-btn"), g = vue.resolveComponent("vu-dropdownmenu"), y = vue.resolveComponent("vu-status-bar");
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["vu-tile", i.classes])
    }, [
      vue.createElementVNode("div", pt, [
        t.active ? (vue.openBlock(), vue.createElementBlock("div", ft)) : vue.createCommentVNode("", !0),
        t.src ? (vue.openBlock(), vue.createElementBlock("div", bt, [
          vue.createVNode(r, {
            src: t.src,
            width: "80",
            height: "60",
            contain: "",
            aspectRatio: "1",
            lazy: i.vuCollectionLazyImages
          }, null, 8, ["src", "lazy"]),
          t.src && (t.selectable || t.selected) ? (vue.openBlock(), vue.createBlock(d, {
            key: 0,
            icon: "check",
            class: "tile__check"
          })) : vue.createCommentVNode("", !0)
        ])) : vue.createCommentVNode("", !0),
        vue.createElementVNode("div", {
          class: vue.normalizeClass(["tile__content", i.contentClasses])
        }, [
          vue.createElementVNode("div", jt, [
            t.type ? (vue.openBlock(), vue.createBlock(d, {
              key: 0,
              icon: t.type
            }, null, 8, ["icon"])) : vue.createCommentVNode("", !0),
            vue.createElementVNode("span", _t, vue.toDisplayString(t.title), 1)
          ]),
          i.meta ? (vue.openBlock(), vue.createElementBlock("div", wt, [
            vue.createElementVNode("span", Lt, vue.toDisplayString(i.meta), 1)
          ])) : vue.createCommentVNode("", !0),
          t.text ? (vue.openBlock(), vue.createElementBlock("div", It, [
            vue.createElementVNode("span", Nt, vue.toDisplayString(t.text), 1)
          ])) : vue.createCommentVNode("", !0)
        ], 2),
        i._actions ? (vue.openBlock(), vue.createElementBlock("div", Ct, [
          i._actions.length > 1 ? (vue.openBlock(), vue.createBlock(g, {
            key: 0,
            items: i._actions,
            onClickItem: s[0] || (s[0] = (f) => e.$emit("click-action", { item: f, id: t.id }))
          }, {
            default: vue.withCtx((f) => [
              vue.createVNode(u, {
                icon: "chevron-down",
                class: vue.normalizeClass(f)
              }, null, 8, ["class"])
            ]),
            _: 1
          }, 8, ["items"])) : (vue.openBlock(), vue.createBlock(u, {
            key: 1,
            icon: i._actions[0].fonticon,
            onClick: s[1] || (s[1] = (f) => e.$emit("click-action", { item: f, id: t.id }))
          }, null, 8, ["icon"]))
        ])) : vue.createCommentVNode("", !0)
      ]),
      t.hideStatusBar ? vue.createCommentVNode("", !0) : (vue.openBlock(), vue.createBlock(y, {
        key: 0,
        status: t.status
      }, null, 8, ["status"]))
    ], 2);
  }
  const Tt = /* @__PURE__ */ w(vt, [["render", Dt], ["__scopeId", "data-v-1f51231a"]]), kt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Tt
  }, Symbol.toStringTag, { value: "Module" })), $ = () => window ? ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (e) => (e ^ (window.crypto || window.msCrypto).getRandomValues(new Uint8Array(1))[0] & 15 >> e / 4).toString(16)) : crypto.uuid(), V = {
    props: {
      loading: {
        type: Boolean,
        default: () => !1
      }
    }
  }, zt = {
    name: "vu-accordion",
    mixins: [V],
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
    data: () => ({
      guid: $
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
  }, St = { class: "accordion-container" }, Ot = ["onClick"], xt = /* @__PURE__ */ vue.createElementVNode("i", { class: "caret-left" }, null, -1), Pt = {
    key: 0,
    class: "content-wrapper"
  };
  function At(e, s, t, l, a, i) {
    const r = vue.resolveDirective("mask");
    return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", St, [
      vue.createElementVNode("div", {
        class: vue.normalizeClass(["accordion accordion-root", {
          filled: t.filled,
          "filled-separate": t.separated,
          divided: t.divided,
          styled: t.outlined,
          animated: t.animated
        }])
      }, [
        (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(t.items, (d) => (vue.openBlock(), vue.createElementBlock("div", {
          key: `${e.guid}-accordion-${d}`,
          class: vue.normalizeClass(["accordion-item", { active: i.value.includes(d) }])
        }, [
          vue.createElementVNode("div", {
            onClick: (u) => i.toggle(d),
            class: "accordion-title"
          }, [
            xt,
            vue.renderSlot(e.$slots, "title-" + d)
          ], 8, Ot),
          t.keepRendered || i.value.includes(d) ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", Pt, [
            vue.createElementVNode("div", {
              class: vue.normalizeClass(["content", { "accordion-animated-content": t.animated }])
            }, [
              vue.renderSlot(e.$slots, "item-" + d)
            ], 2)
          ], 512)), [
            [vue.vShow, i.value.includes(d)]
          ]) : vue.createCommentVNode("", !0)
        ], 2))), 128))
      ], 2)
    ])), [
      [r, e.loading]
    ]);
  }
  const Et = /* @__PURE__ */ w(zt, [["render", At]]), Bt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Et
  }, Symbol.toStringTag, { value: "Module" })), F = {
    props: {
      color: {
        type: String,
        default: () => "default"
      }
    }
  }, S = {
    props: {
      disabled: {
        type: Boolean,
        default: () => !1
      }
    }
  };
  const Ut = {
    name: "vu-badge",
    mixins: [F, S],
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
  }, Zt = {
    key: 1,
    class: "badge-content"
  };
  function Gt(e, s, t, l, a, i) {
    const r = vue.resolveDirective("click-outside");
    return vue.withDirectives((vue.openBlock(), vue.createElementBlock("span", {
      class: vue.normalizeClass(i.classes),
      onClick: s[1] || (s[1] = (d) => i.selectBadge(d))
    }, [
      t.icon ? (vue.openBlock(), vue.createElementBlock("span", {
        key: 0,
        class: vue.normalizeClass(i.iconClasses)
      }, null, 2)) : vue.createCommentVNode("", !0),
      i.showContent ? (vue.openBlock(), vue.createElementBlock("span", Zt, [
        vue.renderSlot(e.$slots, "default", {}, () => [
          vue.createTextVNode(vue.toDisplayString(t.text), 1)
        ], !0)
      ])) : vue.createCommentVNode("", !0),
      t.closable ? (vue.openBlock(), vue.createElementBlock("span", {
        key: 2,
        class: "fonticon fonticon-cancel",
        onClick: s[0] || (s[0] = (d) => e.$emit("close"))
      })) : vue.createCommentVNode("", !0)
    ], 2)), [
      [r, {
        handler: i.onClickOutside,
        events: ["click"]
      }]
    ]);
  }
  const Yt = /* @__PURE__ */ w(Ut, [["render", Gt], ["__scopeId", "data-v-67d2e91a"]]), Qt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Yt
  }, Symbol.toStringTag, { value: "Module" })), Rt = {
    name: "vu-btn-grp",
    mixins: [V],
    props: {
      color: {
        type: String,
        default: () => "default"
      }
    }
  }, $t = { class: "btn-grp" };
  function Vt(e, s, t, l, a, i) {
    const r = vue.resolveDirective("mask");
    return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", $t, [
      vue.renderSlot(e.$slots, "default")
    ])), [
      [r, e.loading]
    ]);
  }
  const Wt = /* @__PURE__ */ w(Rt, [["render", Vt]]), Ht = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Wt
  }, Symbol.toStringTag, { value: "Module" })), he = {
    props: {
      active: {
        type: Boolean,
        default: () => !1
      }
    }
  }, x = {
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
      value() {
        return this.modelValue;
      }
    }
  }, Ft = {
    name: "vu-btn",
    mixins: [V, he, F, x, S],
    // exposes: ['tooltip'],
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
      }
    },
    data: () => ({
      getListenersFromAttrs: Z
      // tooltip: {},
    }),
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
  }, Kt = ["disabled"];
  function Jt(e, s, t, l, a, i) {
    const r = vue.resolveDirective("mask");
    return vue.withDirectives((vue.openBlock(), vue.createElementBlock("button", vue.mergeProps({
      type: "button",
      disabled: e.disabled
    }, vue.toHandlers(e.getListenersFromAttrs(e.$attrs), !0), { class: i.classes }), [
      vue.renderSlot(e.$slots, "default")
    ], 16, Kt)), [
      [r, e.loading]
    ]);
  }
  const Xt = /* @__PURE__ */ w(Ft, [["render", Jt]]), qt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Xt
  }, Symbol.toStringTag, { value: "Module" }));
  const es = {
    name: "vu-carousel-slide",
    props: ["title"],
    data() {
      return {
        width: null,
        id: "",
        carousel: void 0,
        guid: $
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
        const { currentPage: e = 0, breakpointSlidesPerPage: s, children: t } = this.carousel, l = [], a = t.filter(
          (r) => r.$el && r.$el.className.indexOf("vu-slide") >= 0
        ).map((r) => r._uid || r.id);
        let i = 0;
        for (; i < s; ) {
          const r = a[e * s + i];
          l.push(r), i++;
        }
        return l;
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
  }, ts = ["aria-hidden"];
  function ss(e, s, t, l, a, i) {
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["vu-slide", {
        "vu-slide-active": i.isActive,
        "vu-slide-center": i.isCenter,
        "vu-slide-adjustableHeight": i.isAdjustableHeight
      }]),
      tabindex: "-1",
      "aria-hidden": !i.isActive,
      role: "tabpanel"
    }, [
      vue.renderSlot(e.$slots, "default")
    ], 10, ts);
  }
  const is = /* @__PURE__ */ w(es, [["render", ss]]), ns = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: is
  }, Symbol.toStringTag, { value: "Module" })), os = {
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
  }, ls = (e, s, t) => {
    let l;
    return () => {
      const a = globalThis, i = () => {
        l = null, t || e.apply(a);
      }, r = t && !l;
      clearTimeout(l), l = setTimeout(i, s), r && e.apply(a);
    };
  };
  const ie = {
    onwebkittransitionend: "webkitTransitionEnd",
    onmoztransitionend: "transitionend",
    onotransitionend: "oTransitionEnd otransitionend",
    ontransitionend: "transitionend"
  }, pe = () => {
    const e = Object.keys(ie).find((s) => s in window);
    return e ? ie[e] : ie.ontransitionend;
  }, as = {
    name: "vu-carousel",
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
    mixins: [os],
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
        type: String
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
        type: Number
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
        const e = this.perPageCustom, s = this.browserWidth, l = e.sort(
          (i, r) => i[0] > r[0] ? -1 : 1
        ).filter((i) => s >= i[0]);
        return l[0] && l[0][1] || this.perPage;
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
            for (let l = 0; l < t.length; l++)
              this.mutationObserver.observe(t[l], s);
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
        const e = this.currentPerPage * (this.currentPage + 1) - 1, s = [...Array(this.currentPerPage)].map((t, l) => this.getSlide(e + l)).reduce(
          (t, l) => Math.max(t, l && l.$el.clientHeight || 0),
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
          const l = this.scrollPerPage ? this.slideWidth * this.currentPerPage : this.slideWidth;
          this.dragOffset += Math.sign(t) * (l / 2);
        }
        this.offset += this.dragOffset, this.dragOffset = 0, this.dragging = !1, this.render(), document.removeEventListener(this.isTouch ? "touchend" : "mouseup", this.onEnd, !0), document.removeEventListener(this.isTouch ? "touchmove" : "mousemove", this.onDrag, !0);
      },
      /**
         * Trigger actions when mouse is pressed and then moved (mouse drag)
         * @param  {Object} e The event object
         */
      onDrag(e) {
        const s = this.isTouch ? e.touches[0].clientX : e.clientX, t = this.isTouch ? e.touches[0].clientY : e.clientY, l = this.dragStartX - s, a = this.dragStartY - t;
        if (this.isTouch && Math.abs(l) < Math.abs(a))
          return;
        e.stopImmediatePropagation(), this.dragOffset = l;
        const i = this.offset + this.dragOffset;
        i < 0 ? this.dragOffset = -Math.sqrt(-this.resistanceCoef * this.dragOffset) : i > this.maxOffset && (this.dragOffset = Math.sqrt(this.resistanceCoef * this.dragOffset));
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
        ls(this.onResize, this.refreshRate)
      ), (this.isTouch && this.touchDrag || this.mouseDrag) && this.$refs["vu-carousel-wrapper"].addEventListener(
        this.isTouch ? "touchstart" : "mousedown",
        this.onStart
      ), this.attachMutationObserver(), this.computeCarouselWidth(), this.computeCarouselHeight(), this.transitionstart = pe(), this.$refs["vu-carousel-inner"].addEventListener(this.transitionstart, this.handleTransitionStart), this.transitionend = pe(), this.$refs["vu-carousel-inner"].addEventListener(this.transitionend, this.handleTransitionEnd), this.$emit("mounted"), this.autoplayDirection === "backward" && this.goToLastSlide();
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
  }, rs = { class: "vu-carousel" }, us = {
    class: "vu-carousel-wrapper",
    ref: "vu-carousel-wrapper"
  }, ds = {
    key: 0,
    class: "carousel-indicators"
  }, cs = ["onClick"];
  function hs(e, s, t, l, a, i) {
    return vue.openBlock(), vue.createElementBlock("div", rs, [
      vue.createElementVNode("div", us, [
        vue.createElementVNode("div", {
          ref: "vu-carousel-inner",
          class: vue.normalizeClass([
            "vu-carousel-inner",
            { "vu-carousel-inner--center": i.isCenterModeEnabled }
          ]),
          style: vue.normalizeStyle({
            transform: `translate(${i.currentOffset}px, 0)`,
            transition: a.dragging ? "none" : i.transitionStyle,
            "ms-flex-preferred-size": `${i.slideWidth}px`,
            "webkit-flex-basis": `${i.slideWidth}px`,
            "flex-basis": `${i.slideWidth}px`,
            visibility: i.slideWidth ? "visible" : "hidden",
            height: `${a.currentHeight}`,
            "padding-left": `${i.padding}px`,
            "padding-right": `${i.padding}px`
          })
        }, [
          vue.renderSlot(e.$slots, "default")
        ], 6)
      ], 512),
      t.pagination && i.pageCount > 1 ? (vue.openBlock(), vue.createElementBlock("ol", ds, [
        (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(i.pageCount, (r, d) => (vue.openBlock(), vue.createElementBlock("li", {
          key: `carousel-pagination_${d}`,
          class: vue.normalizeClass(["indicator", { active: d === a.currentPage }]),
          onClick: (u) => i.goToPage(d, "pagination")
        }, null, 10, cs))), 128))
      ])) : vue.createCommentVNode("", !0)
    ]);
  }
  const gs = /* @__PURE__ */ w(as, [["render", hs]]), ms = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: gs
  }, Symbol.toStringTag, { value: "Module" })), P = {
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
      }
    },
    data: () => ({
      errorBucket: [],
      valid: !0,
      localRules: []
    }),
    inject: ["vuDebug"],
    watch: {
      value(e) {
        this.valid = this.validate(e);
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
        let l = 0;
        const a = e || this.value, i = [...this.localRules, ...this.rules];
        for (let r = 0; r < i.length; r++) {
          const d = i[r], u = typeof d == "function" ? d(a) : d;
          typeof u == "string" ? (t.push(u), l += 1) : typeof u == "boolean" && !u ? l += 1 : typeof u != "boolean" && this.vuDebug && console.error(`Rules should return a string or boolean, received '${typeof u}' instead`, this);
        }
        return s && (this.errorBucket = t), this.valid = l === 0 && this.isValid, this.valid;
      }
    }
  }, Ms = {
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
  }, A = {
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
  }, fe = [...Array(256).keys()].map((e) => e.toString(16).padStart(2, "0")), G = () => {
    const e = crypto.getRandomValues(new Uint8Array(16));
    return e[6] = e[6] & 15 | 64, e[8] = e[8] & 63 | 128, [...e.entries()].map(([s, t]) => [4, 6, 8, 10].includes(s) ? `-${fe[t]}` : fe[t]).join("");
  };
  const ys = {
    name: "vu-checkbox",
    mixins: [x, P, A, S],
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
    data: () => ({ uid: G() }),
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
  }, vs = {
    key: 0,
    class: "control-label"
  }, ps = {
    key: 0,
    class: "label-field-required"
  }, fs = ["type", "id", "value", "disabled", "checked"], bs = ["innerHTML", "for"], js = {
    key: 1,
    class: "form-control-helper-text"
  };
  function _s(e, s, t, l, a, i) {
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["form-group", { dense: t.dense }])
    }, [
      e.label.length ? (vue.openBlock(), vue.createElementBlock("label", vs, [
        vue.createTextVNode(vue.toDisplayString(e.label), 1),
        e.required ? (vue.openBlock(), vue.createElementBlock("span", ps, " *")) : vue.createCommentVNode("", !0)
      ])) : vue.createCommentVNode("", !0),
      (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.options, (r, d) => (vue.openBlock(), vue.createElementBlock("div", {
        key: `${e.uid}-${r.value}-${d}`,
        class: vue.normalizeClass(["toggle", i.internalClasses])
      }, [
        (vue.openBlock(), vue.createElementBlock("input", {
          type: t.type === "radio" ? "radio" : "checkbox",
          id: `${e.uid}-${r.value}-${d}`,
          value: r.value,
          disabled: e.disabled || r.disabled,
          checked: i.isChecked(r.value),
          key: i.isChecked(r.value),
          onClick: s[0] || (s[0] = vue.withModifiers((...u) => i.input && i.input(...u), ["prevent"]))
        }, null, 8, fs)),
        vue.createElementVNode("label", {
          class: "control-label",
          innerHTML: r.label,
          for: `${e.uid}-${r.value}-${d}`
        }, null, 8, bs),
        vue.renderSlot(e.$slots, "prepend-icon", { item: r }, void 0, !0)
      ], 2))), 128)),
      (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.errorBucket, (r, d) => (vue.openBlock(), vue.createElementBlock("span", {
        key: `${d}-error-${r}`,
        style: { display: "block" },
        class: "form-control-error-text"
      }, vue.toDisplayString(r), 1))), 128)),
      e.helper.length ? (vue.openBlock(), vue.createElementBlock("span", js, vue.toDisplayString(e.helper), 1)) : vue.createCommentVNode("", !0)
    ], 2);
  }
  const ws = /* @__PURE__ */ w(ys, [["render", _s], ["__scopeId", "data-v-b625a777"]]), Ls = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: ws
  }, Symbol.toStringTag, { value: "Module" })), ze = (e) => e instanceof Date && !Number.isNaN(e.getTime()), Is = (e) => e % 4 === 0 && e % 100 !== 0 || e % 400 === 0, Ns = (e, s) => [31, Is(e) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][s], be = (e, s) => e.getTime() === s.getTime(), Cs = (e) => {
    let s;
    if (ze(e))
      s = e;
    else if (e && typeof e == "string")
      try {
        s = new Date(Date.parse(e));
      } catch {
      }
    return s;
  }, se = {
    emits: ["update:modelValue", "boundary-change"],
    props: {
      modelValue: {
        type: [Array],
        default: () => []
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
      getListenersFromAttrs: Z
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
      checkBoundary(e, s) {
        if (!this.value)
          return;
        const t = this.getListenersFromAttrs(this.$attrs)["boundary-change"] ? "boundary-change" : "update:modelValue";
        (["min"].includes(s) && this.value < e || ["max"].includes(s) && this.value > e) && (e ? this.$emit(t, t === "update:modelValue" ? new Date(e) : { boundary: s, value: new Date(e) }) : this.$emit(t, t === "update:modelValue" ? e : { boundary: s, value: e }));
      }
    }
  }, Ds = {
    name: "vu-datepicker-table-date",
    mixins: [se],
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
        return vue.h("table", {
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
          const t = vue.h("th", {
            attrs: { scope: "col", cellspacing: "0", cellpadding: "0" }
          }, [
            vue.h("abbr", {
              attrs: {
                title: this.renderDayName(s)
              }
            }, this.renderDayName(s, !0))
          ]);
          e.push(t);
        }
        return vue.h("thead", {}, e);
      },
      renderBody(e) {
        return vue.h("tbody", {}, e);
      },
      renderWeek(e, s, t) {
        const l = new Date(t, 0, 1), a = Math.ceil(((new Date(t, s, e) - l) / 864e5 + l.getDay() + 1) / 7), i = `datepicker${this.week}`;
        return vue.h("td", { class: i }, a);
      },
      renderDayName(e, s) {
        let t = e + this.firstDay;
        for (; t >= 7; )
          t -= 7;
        return s ? this.weekdaysShortLabels[t] : this.weekdaysLabels[t];
      },
      renderDay(e, s, t, l, a, i, r) {
        const d = [];
        return r ? vue.h("td", { class: "is-empty" }) : (i && d.push("is-disabled"), a && d.push("is-today"), l && d.push("is-selected"), vue.h("td", {
          class: d.join(" "),
          attrs: {
            "data-day": e
          }
        }, [
          vue.h("button", {
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
        return vue.h("tr", {}, e);
      },
      onSelect(e) {
        const s = e.target.getAttribute("data-year"), t = e.target.getAttribute("data-month"), l = e.target.getAttribute("data-day");
        this.$emit("select", new Date(s, t, l));
      }
    },
    render() {
      const e = /* @__PURE__ */ new Date();
      e.setHours(0, 0, 0, 0);
      const s = Ns(this.year, this.month);
      let t = new Date(this.year, this.month, 1).getDay();
      const l = [];
      let a = [], i, r;
      for (this.firstDay > 0 && (t -= this.firstDay, t < 0 && (t += 7)), i = s + t, r = i; r > 7; )
        r -= 7;
      i += 7 - r;
      for (let d = 0, u = 0; d < i; d++) {
        const g = new Date(this.year, this.month, 1 + (d - t)), y = Date.parse(this.min), f = Date.parse(this.max), k = y && g < y || f && g > f || this.unselectableDaysOfWeek && this.unselectableDaysOfWeek.indexOf(g.getDay()) > -1, I = ze(this.date) ? be(g, this.date) : !1, U = be(g, e), X = d < t || d >= s + t;
        a.push(this.renderDay(1 + (d - t), this.month, this.year, I, U, k, X)), ++u === 7 && (this.showWeekNumber && a.unshift(this.renderWeek(d - t, this.month, this.year)), l.push(this.renderRow(a, this.isRTL)), a = [], u = 0);
      }
      return this.renderTable(l);
    }
  }, K = {
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
  }, Ts = {
    name: "vu-datepicker",
    mixins: [K, se],
    components: {
      "vu-datepicker-table-date": Ds
    },
    props: {
      className: String,
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
      }
    },
    data: () => ({
      left: 0,
      top: 38,
      month: 0,
      year: 0
    }),
    computed: {
      date: {
        get() {
          return this.value;
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
        return Array(s - e).fill({}).map((l, a) => ({ value: e + a }));
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
        const e = Cs(this.date) || /* @__PURE__ */ new Date();
        this.month = e.getMonth(), this.year = e.getFullYear();
      },
      onSelect(e) {
        this.month = e.getMonth(), this.year = e.getFullYear(), this.date = e;
      }
    }
  }, ks = { class: "datepicker-calendar" }, zs = { class: "datepicker-title" }, Ss = { class: "datepicker-label" }, Os = ["disabled", "value"], xs = { class: "datepicker-label" }, Ps = ["disabled", "value"];
  function As(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-datepicker-table-date");
    return e.innerShow ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      class: vue.normalizeClass(["datepicker datepicker-root", t.className])
    }, [
      vue.createElementVNode("div", ks, [
        vue.createElementVNode("div", zs, [
          vue.createElementVNode("div", Ss, [
            vue.createTextVNode(vue.toDisplayString(i.currentMonth) + " ", 1),
            vue.withDirectives(vue.createElementVNode("select", {
              class: "datepicker-select datepicker-select-month",
              "onUpdate:modelValue": s[0] || (s[0] = (d) => e.month = d)
            }, [
              (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(i.selectableMonths, (d) => (vue.openBlock(), vue.createElementBlock("option", {
                key: d.value,
                disabled: d.disabled,
                value: d.value
              }, vue.toDisplayString(d.label), 9, Os))), 128))
            ], 512), [
              [vue.vModelSelect, e.month]
            ])
          ]),
          vue.createElementVNode("div", xs, [
            vue.createTextVNode(vue.toDisplayString(e.year) + " ", 1),
            vue.withDirectives(vue.createElementVNode("select", {
              class: "datepicker-select datepicker-select-year",
              "onUpdate:modelValue": s[1] || (s[1] = (d) => e.year = d)
            }, [
              (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(i.selectableYears, (d) => (vue.openBlock(), vue.createElementBlock("option", {
                key: d.value,
                disabled: d.disabled,
                value: d.value
              }, vue.toDisplayString(d.value), 9, Ps))), 128))
            ], 512), [
              [vue.vModelSelect, e.year]
            ])
          ]),
          vue.createElementVNode("button", {
            class: vue.normalizeClass(["datepicker-prev", { "is-disabled": !i.hasPrevMonth }]),
            type: "button",
            onClick: s[2] || (s[2] = (d) => i.hasPrevMonth && e.month--)
          }, vue.toDisplayString(t.previousMonthLabel), 3),
          vue.createElementVNode("button", {
            class: vue.normalizeClass(["datepicker-next", { "is-disabled": !i.hasNextMonth }]),
            type: "button",
            onClick: s[3] || (s[3] = (d) => i.hasNextMonth && e.month++)
          }, vue.toDisplayString(t.nextMonthLabel), 3)
        ]),
        vue.createVNode(r, {
          date: i.date,
          year: e.year,
          month: e.month,
          min: e.min,
          max: e.max,
          firstDay: t.firstDay,
          unselectableDaysOfWeek: t.unselectableDaysOfWeek,
          monthsLabels: t.monthsLabels,
          weekdaysLabels: t.weekdaysLabels,
          weekdaysShortLabels: t.weekdaysShortLabels,
          onSelect: s[4] || (s[4] = (d) => i.onSelect(d))
        }, null, 8, ["date", "year", "month", "min", "max", "firstDay", "unselectableDaysOfWeek", "monthsLabels", "weekdaysLabels", "weekdaysShortLabels"])
      ])
    ], 2)) : vue.createCommentVNode("", !0);
  }
  const Es = /* @__PURE__ */ w(Ts, [["render", As]]), Bs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Es
  }, Symbol.toStringTag, { value: "Module" }));
  const Us = {
    name: "vu-icon",
    mixins: [F],
    data: () => ({
      getListenersFromAttrs: Z
    }),
    props: {
      icon: {
        required: !0,
        type: String
      }
    }
  };
  function Zs(e, s, t, l, a, i) {
    return vue.openBlock(), vue.createElementBlock("span", vue.mergeProps({
      class: ["vu-icon", "fonticon", "fonticon-within-text", `fonticon-${t.icon}`, `${e.color}`]
    }, vue.toHandlers(e.getListenersFromAttrs(e.$attrs), !0)), null, 16);
  }
  const Se = /* @__PURE__ */ w(Us, [["render", Zs], ["__scopeId", "data-v-34622646"]]), Gs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Se
  }, Symbol.toStringTag, { value: "Module" }));
  function Oe(e, s = !0) {
    let t = s;
    return e.forEach((l) => {
      !l.text && !l.label && (!l.class || !l.class.includes("divider")) && (t = !1), l.items && (t = Oe(l.items, t));
    }), t;
  }
  const Ys = {
    name: "vu-dropdownmenu-items",
    components: { VuIcon: Se },
    emits: ["update:responsive", "click-item"],
    props: {
      target: {
        type: HTMLElement,
        required: !1
      },
      items: {
        type: Array,
        required: !0,
        validator: Oe
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
      uuid: $,
      root: !1,
      parent: {}
    }),
    computed: {
      classes() {
        return {
          "open-left": this.left,
          "responsive-menu": this.responsive,
          "dropdown-menu-responsive-wrap": this.responsive
        };
      },
      hasIcons() {
        return this.items && this.items.some((e) => e.fonticon);
      },
      _items() {
        return this.stack[this.stack.length - 1] || this.items;
      },
      _parent() {
        return (this.stack[this.stack.length - 2] || this.items).find((e) => JSON.stringify(e.items) === JSON.stringify(this._items));
      }
    },
    async mounted() {
      if (this.disableResponsive)
        return;
      await this.$nextTick();
      const e = {
        root: this.target,
        threshold: 1
      }, s = this.target.getBoundingClientRect(), t = new IntersectionObserver(async ([l]) => {
        t.unobserve(this.$el);
        const a = l.target.getBoundingClientRect();
        s.right < a.right && !this.left ? (this.left = !0, await this.$nextTick(), t.observe(this.$el)) : s.left > a.left && this.left && this.$emit("update:responsive", !0);
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
  }, Qs = (e) => (vue.pushScopeId("data-v-0db0b77e"), e = e(), vue.popScopeId(), e), Rs = {
    key: 0,
    class: "item item-back"
  }, $s = { class: "item-text" }, Vs = ["onClick"], Ws = { class: "item-text" }, Hs = ["onClick"], Fs = /* @__PURE__ */ Qs(() => /* @__PURE__ */ vue.createElementVNode("span", { class: "divider" }, null, -1)), Ks = {
    key: 0,
    class: "item-text"
  };
  function Js(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-icon"), d = vue.resolveComponent("vu-dropdownmenu-items", !0);
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["dropdown-menu dropdown-menu-root dropdown-root", i.classes]),
      style: vue.normalizeStyle([{ zIndex: t.zIndex }])
    }, [
      vue.createElementVNode("ul", {
        class: vue.normalizeClass(["dropdown-menu-wrap", { "dropdown-menu-icons": i.hasIcons }])
      }, [
        t.responsive && e.stack.length ? (vue.openBlock(), vue.createElementBlock("li", Rs, [
          vue.createVNode(r, {
            icon: "left-open",
            class: "back-item",
            onClick: vue.withModifiers(i.onBackItemClick, ["stop"])
          }, null, 8, ["onClick"]),
          vue.createElementVNode("span", $s, vue.toDisplayString(i._parent.text), 1)
        ])) : vue.createCommentVNode("", !0),
        (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(i._items, (u) => (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          !u.class || !u.class.includes("header") && !u.class.includes("divider") ? (vue.openBlock(), vue.createElementBlock("li", {
            key: u.text || u.label,
            class: vue.normalizeClass(["item", {
              "item-submenu": u.items,
              selectable: !u.disabled && u.selectable || u.selected || t.selected.includes(u),
              selected: u.selected || t.selected.includes(u),
              hidden: u.hidden,
              disabled: u.disabled,
              "hide-responsive-divider": !t.dividedResponsiveItems
            }, u.class]),
            onClick: vue.withModifiers((g) => u.items && t.responsive && !t.dividedResponsiveItems ? i.onNextItemClick(u) : i.onItemClick(u), ["stop"])
          }, [
            vue.renderSlot(e.$slots, "default", { item: u }, () => [
              u.fonticon ? (vue.openBlock(), vue.createBlock(r, {
                key: 0,
                icon: u.fonticon
              }, null, 8, ["icon"])) : vue.createCommentVNode("", !0),
              vue.createElementVNode("span", Ws, vue.toDisplayString(u.text || u.label), 1)
            ], !0),
            u.items ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: "next-icon",
              onClick: vue.withModifiers((g) => i.onNextItemClick(u), ["stop"])
            }, [
              Fs,
              vue.createVNode(r, { icon: "right-open" })
            ], 8, Hs)) : vue.createCommentVNode("", !0),
            !t.responsive && u.items ? (vue.openBlock(), vue.createBlock(d, {
              key: 1,
              target: t.target,
              items: u.items,
              selected: t.selected,
              onClickItem: i.onItemClick,
              "onUpdate:selected": s[0] || (s[0] = (g) => e.$emit("update:selected", g)),
              "onUpdate:responsive": s[1] || (s[1] = (g) => e.$emit("update:responsive", g))
            }, null, 8, ["target", "items", "selected", "onClickItem"])) : vue.createCommentVNode("", !0)
          ], 10, Vs)) : (vue.openBlock(), vue.createElementBlock("li", {
            key: u.text || u.label || e.uuid(),
            class: vue.normalizeClass(u.class)
          }, [
            u.class !== "divider" ? (vue.openBlock(), vue.createElementBlock("span", Ks, vue.toDisplayString(u.text || u.label), 1)) : vue.createCommentVNode("", !0)
          ], 2))
        ], 64))), 256))
      ], 2)
    ], 6);
  }
  const xe = /* @__PURE__ */ w(Ys, [["render", Js], ["__scopeId", "data-v-0db0b77e"]]), Xs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: xe
  }, Symbol.toStringTag, { value: "Module" })), Pe = (e) => {
    const s = typeof e;
    return s === "boolean" || s === "string" ? !0 : e.nodeType === Node.ELEMENT_NODE;
  }, ge = {
    name: "detachable",
    props: {
      attach: {
        default: () => !1,
        validator: Pe
      },
      contentClass: {
        type: String,
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
          console.warn(`Unable to locate target ${this.attach}`, this);
          return;
        }
        e.tagName.toLowerCase() !== "body" && window.getComputedStyle(e).position !== "relative" && console.warn(`target (${e.tagName.toLowerCase()}${e.className && ` #${e.className}`}${e.id && ` .${e.id}`}) element should have a relative position`), this.target = e, this.hasDetached = !0;
      }
    }
  }, qs = ["top", "top-right", "bottom-right", "bottom", "bottom-left", "top-left"], ei = ({ intersectionRatio: e, intersectionRect: s, elementRect: t }) => e < 1 && !(s.top < t.top || s.bottom > t.bottom), ti = (e, s, t, l) => l.length === 0 ? s.includes("top") ? s.replace("top", "bottom") : s.replace("bottom", "top") : s, me = (e, s, t, l = { width: 0, x: 0, y: 0 }, { scrollTop: a = 0, scrollLeft: i = 0 } = {}, r = !1, d = { left: 2, right: 2 }) => {
    let u = s.y - l.y + a, g = s.x - l.x + i;
    isNaN(s.width) && (s.width = 0), isNaN(s.height) && (s.height = 0), /-right/.test(e) ? g += s.width - t.width : /^(top|bottom)$/.test(e) && (g += s.width / 2 - t.width / 2), /^bottom/.test(e) ? u += s.height : /^(left|right)(-top|-bottom)?$/.test(e) ? (g -= t.width, /^(right|right-\w{3,6})$/.test(e) && (g += s.width + t.width), /(-top|-bottom)/.test(e) ? /-bottom/.test(e) && (u += s.height - t.height) : u += s.height / 2 - t.height / 2) : u -= t.height;
    let y = 0;
    if (r) {
      const f = d.left, k = l.width - t.width - d.right, I = Math.max(f, Math.min(g, k));
      y = g - I, g = I;
    }
    return { left: g, top: u, shiftX: y };
  };
  const si = {
    name: "vu-tooltip",
    mixins: [K],
    data: () => ({
      setPosition: me
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
        required: !1
      },
      prerender: {
        type: Boolean,
        required: !1
      }
    }
  }, ii = ["innerHTML"];
  function ni(e, s, t, l, a, i) {
    return vue.openBlock(), vue.createElementBlock("div", {
      ref: "content",
      class: vue.normalizeClass([`${t.side} ${t.type} ${t.type}-root`, { "without-arrow": !t.arrow }, { prerender: t.prerender }])
    }, [
      vue.createVNode(vue.Transition, {
        name: t.animated ? "fade" : "",
        mode: "out-in"
      }, {
        default: vue.withCtx(() => [
          e.show ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass([`${t.type}-wrapper`])
          }, [
            vue.renderSlot(e.$slots, "arrow", { side: t.side }, () => [
              t.arrow ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                class: vue.normalizeClass(`${t.type}-arrow`)
              }, null, 2)) : vue.createCommentVNode("", !0)
            ], !0),
            vue.renderSlot(e.$slots, "title", { side: t.side }, void 0, !0),
            vue.createElementVNode("div", {
              ref: "body",
              class: vue.normalizeClass(`${t.type}-body`)
            }, [
              t.text ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 0,
                innerHTML: t.text
              }, null, 8, ii)) : vue.renderSlot(e.$slots, "default", {
                key: 1,
                side: t.side
              }, void 0, !0)
            ], 2)
          ], 2)) : vue.createCommentVNode("", !0)
        ]),
        _: 3
      }, 8, ["name"])
    ], 2);
  }
  const Me = /* @__PURE__ */ w(si, [["render", ni], ["__scopeId", "data-v-175c9d30"]]), oi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Me
  }, Symbol.toStringTag, { value: "Module" })), li = ["top", "top-right", "right-bottom", "right", "right-top", "bottom-right", "bottom", "bottom-left", "left-top", "left", "left-bottom", "top-left"], ai = (e, s, t, l) => {
    const a = t.indexOf(e), i = t[(a + 1) % t.length];
    return l.includes(i) ? s : i;
  }, ri = ({ intersectionRatio: e }) => e < 1;
  const ui = {
    name: "vu-popover",
    mixins: [K, ge],
    expose: ["updatePosition"],
    emits: ["unpositionable"],
    components: { VuTooltip: Me },
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
      animated: {
        type: Boolean,
        default: !0
      },
      overlay: {
        type: Boolean,
        default: !1
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
        default: () => li
      },
      getNextPosition: {
        type: Function,
        required: !1,
        default: ai
      },
      checkPosition: {
        type: Function,
        required: !1,
        default: ri
      }
    },
    data: () => ({
      open: !1,
      resizeObs: null,
      intersectionObs: null,
      setPositionBound: null,
      shifted: !1,
      positioned: !1,
      positionAttempts: [],
      scrollableAncestors: [],
      // put in positionable
      innerSide: ""
    }),
    watch: {
      innerShow: {
        immediate: !0,
        async handler(e) {
          await new Promise((s) => setTimeout(s, 10)), e ? (this.open = !0, this.positioned = !1, await this.$nextTick(), this.setPositionBound(), this.intersectionObs.observe(this.$refs.tooltip.$el), this.listenScrolls()) : (this.open = !1, this.$refs.tooltip && this.resizeObs.disconnect(), this.stopScrollListening());
        }
      },
      innerSide: {
        handler() {
          this.updatePosition();
        }
      },
      attach() {
        this.innerShow && this.updatePosition();
      }
    },
    created() {
      this.setPositionBound = this.setPosition.bind(this), this.resizeObs = new ResizeObserver(async () => {
        await this.$nextTick(), this.setPositionBound();
      });
    },
    async mounted() {
      await this.$nextTick();
      let e = 0;
      const s = 5;
      for (; e < s && this.$refs.activator === void 0 && this.$refs.tooltip === void 0; )
        e++, await this.$nextTick();
      const { target: t, positionAttempts: l } = this;
      this.intersectionObs = new IntersectionObserver(([{ boundingClientRect: a, root: i, intersectionRatio: r, intersectionRect: d }]) => {
        if (this.intersectionObs.unobserve(this.$refs.tooltip.$el), this.checkPosition({ intersectionRatio: r, elementRect: a, targetRect: i, intersectionRect: d, positionAttempts: l })) {
          const u = this.getNextPosition(this.innerSide || this.side, this.side, this.positions, this.positionAttempts);
          if (u === (this.innerSide || this.side)) {
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
          const { overflow: t } = window.getComputedStyle(s), l = t.split(" ");
          ["auto", "scroll"].some((a) => l.includes(a)) && e.push(s), s = s.parentElement;
        }
        this.scrollableAncestors = e, this.scrollableAncestors.forEach((t) => t.addEventListener("scroll", this.setPositionBound));
      },
      stopScrollListening() {
        this.scrollableAncestors.forEach((e) => e.removeEventListener("scroll", this.setPositionBound));
      },
      updatePosition() {
        this.setPositionBound(), this.intersectionObs.observe(this.$refs.tooltip.$el);
      },
      setPosition() {
        const e = this.target.getBoundingClientRect(), s = this.$refs.activator.getBoundingClientRect(), t = this.$refs.tooltip.$el.getBoundingClientRect(), l = me(
          this.innerSide || this.side,
          s,
          t,
          e,
          this.target,
          this.shift
        );
        this.shifted = l.shiftX, this.$refs.tooltip.$el.style.top = `${l.top}px`, this.$refs.tooltip.$el.style.left = `${l.left}px`, this.overlay && (this.$refs.overlay.style.top = `${this.target === document.body ? document.scrollingElement.scrollTop : this.target.scrollTop}px`);
      },
      // eslint-disable-next-line no-unused-vars
      onClickOutside(e, s = !1) {
        if (!this.innerShow)
          return;
        const { target: t } = e;
        s && e.preventDefault(), !(this.$refs.tooltip && (t === this.$refs.tooltip.$el || this.$refs.tooltip.$el.contains(t))) && (this.innerShow = !1);
      }
    }
  };
  function di(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-tooltip"), d = vue.resolveDirective("click-outside");
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.withDirectives((vue.openBlock(), vue.createElementBlock("span", vue.mergeProps({
        ref: "activator",
        class: "vu-popover__activator",
        onClick: s[0] || (s[0] = (u) => e.innerShow = !e.innerShow)
      }, e.$attrs), [
        vue.renderSlot(e.$slots, "default", {}, void 0, !0)
      ], 16)), [
        [d, { handler: i.onClickOutside }]
      ]),
      e.open || t.persistent ? vue.withDirectives((vue.openBlock(), vue.createBlock(vue.Teleport, {
        key: 0,
        to: e.target
      }, [
        vue.createVNode(vue.Transition, {
          name: t.animated ? "fade" : "",
          mode: "out-in"
        }, {
          default: vue.withCtx(() => [
            e.innerShow && t.overlay ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: "mask popover-mask",
              ref: "overlay",
              onWheel: s[1] || (s[1] = vue.withModifiers((...u) => i.onClickOutside && i.onClickOutside(...u), ["prevent"])),
              onTouchstart: s[2] || (s[2] = (u) => i.onClickOutside(u, !0))
            }, null, 544)) : vue.createCommentVNode("", !0)
          ]),
          _: 1
        }, 8, ["name"]),
        vue.createVNode(r, {
          ref: "tooltip",
          arrow: t.arrow,
          prerender: !e.positioned,
          show: e.innerShow || e.show,
          type: t.type,
          side: e.innerSide || t.side,
          class: vue.normalizeClass(e.contentClass),
          style: vue.normalizeStyle(e.contentStyle),
          animated: t.animated,
          "onUpdate:show": s[3] || (s[3] = (u) => e.open = !1)
        }, {
          arrow: vue.withCtx(({ side: u }) => [
            vue.renderSlot(e.$slots, "arrow", {
              side: e.innerSide || u,
              shift: e.shifted
            }, void 0, !0)
          ]),
          title: vue.withCtx(({ side: u }) => [
            vue.renderSlot(e.$slots, "title", {
              side: e.innerSide || u
            }, () => [
              t.title ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                vue.createTextVNode(vue.toDisplayString(t.title), 1)
              ], 64)) : vue.createCommentVNode("", !0)
            ], !0)
          ]),
          default: vue.withCtx(() => [
            vue.renderSlot(e.$slots, "body", {}, void 0, !0)
          ]),
          _: 3
        }, 8, ["arrow", "prerender", "show", "type", "side", "class", "style", "animated"])
      ], 8, ["to"])), [
        [vue.vShow, e.open]
      ]) : vue.createCommentVNode("", !0)
    ], 64);
  }
  const Ae = /* @__PURE__ */ w(ui, [["render", di], ["__scopeId", "data-v-3a4f34a0"]]), ci = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Ae
  }, Symbol.toStringTag, { value: "Module" }));
  function Ee(e, s = !0) {
    let t = s;
    return e.forEach((l) => {
      !l.text && !l.label && (!l.class || !l.class.includes("divider")) && (t = !1), l.items && (t = Ee(l.items, t));
    }), t;
  }
  const hi = {
    components: { vuDropdownmenuItems: xe, vuPopover: Ae },
    name: "vu-dropdownmenu",
    mixins: [K, ge],
    emits: ["close", "click-item"],
    props: {
      value: {
        type: Array,
        default: () => []
      },
      items: {
        type: Array,
        required: !0,
        validator: Ee
      },
      preventDropup: {
        type: Boolean,
        default: !1
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
        default: () => qs
      },
      getNextPosition: {
        type: Function,
        required: !1,
        default: ti
      },
      checkPosition: {
        type: Function,
        required: !1,
        default: ei
      }
    },
    data: () => ({
      open: !1,
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
  };
  function gi(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-dropdownmenu-items"), d = vue.resolveComponent("vu-popover");
    return vue.openBlock(), vue.createBlock(d, {
      ref: "popover",
      show: e.innerShow,
      "onUpdate:show": [
        s[2] || (s[2] = (u) => e.innerShow = u),
        i.updateShow
      ],
      shift: t.shift || t.responsive,
      type: "dropdownmenu popover",
      attach: e.target,
      side: t.position,
      overlay: t.overlay,
      animated: !1,
      checkPosition: t.checkPosition,
      getNextPosition: t.getNextPosition,
      arrow: !1
    }, {
      body: vue.withCtx(() => [
        vue.createVNode(r, {
          responsive: i.isResponsive,
          "onUpdate:responsive": s[0] || (s[0] = (u) => i.isResponsive = u),
          dividedResponsiveItems: t.dividedResponsiveItems,
          target: e.target,
          items: t.items,
          selected: t.value,
          onClickItem: i.handleClick,
          "onUpdate:selected": s[1] || (s[1] = (u) => e.open = !1)
        }, null, 8, ["responsive", "dividedResponsiveItems", "target", "items", "selected", "onClickItem"])
      ]),
      default: vue.withCtx(() => [
        vue.renderSlot(e.$slots, "default", { active: e.innerShow })
      ]),
      _: 3
    }, 8, ["show", "shift", "attach", "side", "overlay", "checkPosition", "getNextPosition", "onUpdate:show"]);
  }
  const mi = /* @__PURE__ */ w(hi, [["render", gi]]), Mi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: mi
  }, Symbol.toStringTag, { value: "Module" }));
  const yi = {
    name: "vu-facets-bar",
    emits: ["update:modelValue"],
    props: {
      modelValue: Object,
      items: {
        type: Array,
        default: () => []
      }
    },
    data: () => ({
      uuidv4: G,
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
        (e.length !== s.length || e.any((t, l) => t.text !== s[l].text)) && (this.labelsTruncated = !1, this.activeLabelTruncated = !1, this.intxObs.observe());
      }
    },
    methods: {
      async intersects(e) {
        if (this.intxObs.unobserve(this.$refs.inner), e && e[0] && e[0].intersectionRatio < 1) {
          const s = this.$refs.inner.querySelectorAll(".facet"), t = this.$refs.inner.querySelector(".facet.facet--selected"), { width: l = 0 } = t || {}, a = Array.from(s).reduce((i, r) => Math.max(i.width, r));
          this.activeFacetVsLongestFacet = a - l, this.labelsTruncated = !0, await this.$nextTick(), this.intxObs2.observe(this.$refs.inner);
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
  }, vi = {
    class: "vu-facets-bar",
    ref: "container"
  }, pi = {
    class: "facets-bar__inner",
    ref: "inner"
  };
  function fi(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-icon"), d = vue.resolveComponent("vu-popover"), u = vue.resolveComponent("vu-btn"), g = vue.resolveComponent("vu-icon-btn"), y = vue.resolveComponent("vu-dropdownmenu");
    return vue.openBlock(), vue.createElementBlock("div", vi, [
      vue.createElementVNode("div", pi, [
        (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(i.visibleItems, (f) => (vue.openBlock(), vue.createBlock(u, {
          key: `${e.uuidv4()}`,
          class: vue.normalizeClass([
            "facet",
            {
              default: f !== t.modelValue,
              "facet--selected": f === t.modelValue,
              "facet--unselected": f !== t.modelValue,
              "facet--icon-only": e.labelsTruncated && !(!e.activeLabelTruncated && f === t.modelValue)
            }
          ]),
          onClick: (k) => e.$emit("update:modelValue", f)
        }, {
          default: vue.withCtx(() => [
            !e.labelsTruncated || !e.activeLabelTruncated && f === t.modelValue ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
              f.icon ? (vue.openBlock(), vue.createBlock(r, {
                key: 0,
                icon: f.icon,
                active: f === t.modelValue
              }, null, 8, ["icon", "active"])) : vue.createCommentVNode("", !0),
              vue.createElementVNode("span", null, vue.toDisplayString(f.text), 1)
            ], 64)) : (vue.openBlock(), vue.createBlock(d, {
              key: 1,
              type: "tooltip",
              arrow: ""
            }, {
              default: vue.withCtx(() => [
                f.icon ? (vue.openBlock(), vue.createBlock(r, {
                  key: 0,
                  icon: f.icon
                }, null, 8, ["icon"])) : vue.createCommentVNode("", !0)
              ]),
              body: vue.withCtx(() => [
                vue.createTextVNode(vue.toDisplayString(f.text), 1)
              ]),
              _: 2
            }, 1024))
          ]),
          _: 2
        }, 1032, ["class", "onClick"]))), 128)),
        e.labelsTruncated && !e.activeLabelTruncated ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          style: vue.normalizeStyle([{ visibility: "hidden" }, { width: `${e.activeFacetVsLongestFacet}+px` }])
        }, null, 4)) : vue.createCommentVNode("", !0),
        e.visibleFacets ? (vue.openBlock(), vue.createBlock(y, {
          key: 1,
          shift: !0,
          class: "vu-facets-bar__dropdownmenu",
          items: t.items,
          model: t.modelValue,
          "onUpdate:modelValue": s[0] || (s[0] = (f) => e.$emit("update:modelValue", f)),
          onClickItem: s[1] || (s[1] = (f) => e.$emit("update:modelValue", f))
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(g, { icon: "menu-dot" })
          ]),
          _: 1
        }, 8, ["items", "model"])) : vue.createCommentVNode("", !0)
      ], 512)
    ], 512);
  }
  const bi = /* @__PURE__ */ w(yi, [["render", fi], ["__scopeId", "data-v-06819e51"]]), ji = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: bi
  }, Symbol.toStringTag, { value: "Module" }));
  const _i = {
    name: "vu-form",
    mixins: [Ms]
  }, wi = ["onSubmit"];
  function Li(e, s, t, l, a, i) {
    return vue.openBlock(), vue.createElementBlock("form", {
      novalidate: "novalidate",
      class: "form form-root",
      onSubmit: vue.withModifiers(() => {
      }, ["prevent"])
    }, [
      vue.renderSlot(e.$slots, "default")
    ], 40, wi);
  }
  const Ii = /* @__PURE__ */ w(_i, [["render", Li]]), Ni = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Ii
  }, Symbol.toStringTag, { value: "Module" })), Ci = {
    props: {
      elevated: {
        type: Boolean,
        default: !1
      }
    }
  };
  const Di = {
    name: "vu-grid-view",
    mixins: [V, Ci],
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
        type: Number
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
          const l = t.indexOf(e);
          t.splice(l, 1);
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
    }
  }, Ti = {
    key: 0,
    class: "grid-view__table__header-intersection"
  }, ki = { class: "grid-view__table__body" }, zi = ["onClick"], Si = {
    key: 0,
    class: "grid-view__table__row__header"
  }, Oi = ["onClick"], xi = { style: { "margin-right": "5px" } };
  function Pi(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-checkbox"), d = vue.resolveComponent("vu-icon-btn"), u = vue.resolveComponent("vu-select"), g = vue.resolveComponent("vu-btn"), y = vue.resolveDirective("mask");
    return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["vu-grid-view", { elevated: e.elevated, "vu-grid-view--rich": t.rich }, e.classes]),
      onWheel: s[0] || (s[0] = (...f) => i.scrollHorizontal && i.scrollHorizontal(...f))
    }, [
      vue.createElementVNode("div", {
        class: "grid-view__container",
        style: vue.normalizeStyle(`height: ${(t.dense ? 24 : 38) + (t.dense ? 24 : 38) * (i.sortedItems.length < t.rowsPerPage ? i.sortedItems.length : t.rowsPerPage)}px;`)
      }, [
        vue.createElementVNode("table", {
          class: vue.normalizeClass([
            "grid-view__table",
            { dense: t.dense, "grid-view__table--has-selection": i.hasSelected }
          ])
        }, [
          vue.createElementVNode("thead", null, [
            vue.createElementVNode("tr", null, [
              t.selectable ? (vue.openBlock(), vue.createElementBlock("th", Ti, [
                t.allSelectable ? (vue.openBlock(), vue.createBlock(r, {
                  key: 0,
                  dense: "",
                  class: "grid-view__table__checkbox",
                  value: t.value.length === t.items.length && t.items.length,
                  options: [{}],
                  onInput: i.selectAll
                }, null, 8, ["value", "onInput"])) : vue.createCommentVNode("", !0)
              ])) : vue.createCommentVNode("", !0),
              (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(t.headers, (f, k) => (vue.openBlock(), vue.createElementBlock("th", {
                key: `header_${f.property}_${k}`
              }, [
                vue.createTextVNode(vue.toDisplayString(f.label) + " ", 1),
                f.sortable !== !1 ? (vue.openBlock(), vue.createBlock(d, {
                  key: 0,
                  class: "icon-smaller",
                  icon: f.property === a.sortKey && a.isAscending ? "expand-up" : "expand-down",
                  active: f.property === a.sortKey,
                  onClick: (I) => i.sortBy(f.property)
                }, null, 8, ["icon", "active", "onClick"])) : vue.createCommentVNode("", !0)
              ]))), 128))
            ])
          ]),
          vue.createElementVNode("tbody", ki, [
            (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(i.sortedItems, (f, k) => (vue.openBlock(), vue.createElementBlock("tr", {
              class: vue.normalizeClass({ dense: t.dense, selected: t.value.includes(f) }),
              key: `line_${k}`,
              onClick: (I) => i.selectItem(f)
            }, [
              t.selectable ? (vue.openBlock(), vue.createElementBlock("td", Si, [
                vue.createVNode(r, {
                  dense: "",
                  class: "grid-view__table__body__checkbox",
                  onInput: (I) => i.selectItem(f),
                  value: t.value.includes(f),
                  options: [{}]
                }, null, 8, ["onInput", "value"])
              ])) : vue.createCommentVNode("", !0),
              (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(t.headers, (I) => (vue.openBlock(), vue.createElementBlock("td", {
                key: `${I.property}_${f[I.property]}`,
                class: vue.normalizeClass([
                  i.isEqual(f, a.selectedCellItem) && i.isEqual(I.property, a.selectedCellProperty) ? "selected" : ""
                ]),
                onClick: () => {
                  a.selectedCellItem = f, a.selectedCellProperty = I.property, e.$emit("cellClick", { item: f, header: I, property: e.property });
                }
              }, [
                vue.renderSlot(e.$slots, I.property, vue.normalizeProps(vue.guardReactiveProps(f)), () => [
                  vue.createTextVNode(vue.toDisplayString(f[I.property]), 1)
                ], !0)
              ], 10, Oi))), 128))
            ], 10, zi))), 128))
          ])
        ], 2)
      ], 4),
      vue.createElementVNode("div", {
        class: vue.normalizeClass(["grid-view__pagination", { "grid-view__pagination--top": t.topPagination }])
      }, [
        vue.renderSlot(e.$slots, "pagination", {}, () => [
          vue.createVNode(u, {
            options: t.itemPerPageOptions.map((f) => ({ value: f, label: f })),
            rules: [(f) => f.length > 0],
            hidePlaceholderOption: !0,
            value: t.rowsPerPage,
            onInput: i.updateRows
          }, null, 8, ["options", "rules", "value", "onInput"]),
          vue.createElementVNode("div", xi, vue.toDisplayString(a.startRow + 1) + "-" + vue.toDisplayString(i.itemMax) + " / " + vue.toDisplayString(t.serverItemsLength || t.items.length), 1),
          vue.createVNode(g, {
            disabled: a.startRow === 0,
            onClick: i.pageDown
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(vue.toDisplayString(t.labels.previousLabel), 1)
            ]),
            _: 1
          }, 8, ["disabled", "onClick"]),
          vue.createVNode(g, {
            disabled: a.startRow + t.rowsPerPage >= (t.serverItemsLength || t.items.length),
            onClick: i.pageUp
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(vue.toDisplayString(t.labels.nextLabel), 1)
            ]),
            _: 1
          }, 8, ["disabled", "onClick"])
        ], !0)
      ], 2)
    ], 34)), [
      [y, e.loading]
    ]);
  }
  const Ai = /* @__PURE__ */ w(Di, [["render", Pi], ["__scopeId", "data-v-ca6c4f11"]]), Ei = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Ai
  }, Symbol.toStringTag, { value: "Module" })), Bi = {
    props: {
      size: {
        type: String,
        default: () => ""
      }
    }
  };
  const Ui = {
    name: "vu-icon-btn",
    mixins: [he, S, F, Bi],
    props: {
      icon: {
        required: !0,
        type: String
      },
      disableChevronResize: {
        default: !1,
        type: Boolean
      }
    }
  };
  function Zi(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-icon");
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["vu-icon-btn", [e.color, e.size, { active: e.active, disabled: e.disabled }]]),
      onClickCapture: s[0] || (s[0] = (d) => {
        this.disabled && d.stopPropagation();
      })
    }, [
      vue.createVNode(r, {
        icon: t.icon,
        color: e.color,
        class: vue.normalizeClass({ "chevron-menu-icon": t.icon === "chevron-down" && t.disableChevronResize, disabled: e.disabled })
      }, null, 8, ["icon", "color", "class"])
    ], 34);
  }
  const Gi = /* @__PURE__ */ w(Ui, [["render", Zi], ["__scopeId", "data-v-fb2e5aac"]]), Yi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Gi
  }, Symbol.toStringTag, { value: "Module" }));
  const Qi = {
    name: "vu-icon-link",
    mixins: [he],
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
  }, Ri = { class: "icon-link__link" };
  function $i(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-icon");
    return vue.openBlock(), vue.createElementBlock("a", {
      class: vue.normalizeClass(["vu-icon-link", { active: e.active }])
    }, [
      t.icon ? (vue.openBlock(), vue.createBlock(r, {
        key: 0,
        icon: t.icon,
        active: e.active
      }, null, 8, ["icon", "active"])) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
        vue.createTextVNode(" ")
      ], 64)),
      vue.createElementVNode("span", Ri, [
        vue.renderSlot(e.$slots, "default", {}, () => [
          vue.createTextVNode(vue.toDisplayString(t.label), 1)
        ], !0)
      ])
    ], 2);
  }
  const Vi = /* @__PURE__ */ w(Qi, [["render", $i], ["__scopeId", "data-v-01f8c814"]]), Wi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Vi
  }, Symbol.toStringTag, { value: "Module" }));
  const Hi = {
    name: "vu-image",
    props: {
      lazy: {
        type: Boolean,
        required: !1
      },
      src: {
        type: String,
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
          isNaN(this.width) ? "" : { width: `${this.width}px` },
          isNaN(this.height) ? "" : { height: `${this.height}px` },
          isNaN(this.minHeight) ? "" : { minHeight: `${this.minHeight}px` },
          isNaN(this.maxHeight) ? "" : { height: `${this.maxHeight}px` },
          isNaN(this.minWidth) ? "" : { height: `${this.minWidth}px` },
          isNaN(this.maxWidth) ? "" : { height: `${this.maxWidth}px` }
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
          const { naturalHeight: l, naturalWidth: a } = e;
          l || a ? (this.naturalWidth = a, this.calculatedAspectRatio = a / l, this.image = null) : !e.complete && this.isLoading && !this.hasError && s != null && setTimeout(t, s);
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
  }, Fi = (e) => (vue.pushScopeId("data-v-7cc6d9ac"), e = e(), vue.popScopeId(), e), Ki = /* @__PURE__ */ Fi(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "vu-image__fill" }, null, -1));
  function Ji(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-lazy");
    return vue.openBlock(), vue.createElementBlock("div", {
      class: "vu-image",
      style: vue.normalizeStyle(i.imageStyle)
    }, [
      vue.createElementVNode("div", {
        class: "vu-image__sizer",
        style: vue.normalizeStyle(i.imageSizerStyle)
      }, null, 4),
      t.lazy ? (vue.openBlock(), vue.createBlock(r, {
        key: 0,
        onIntersect: s[0] || (s[0] = (d) => i.loadImage())
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("div", {
            class: vue.normalizeClass(["vu-image__image", i.imageClasses]),
            style: vue.normalizeStyle([[e.isLoading ? "" : { backgroundImage: `url(${t.src})` }], { "background-position": "center center" }])
          }, null, 6)
        ]),
        _: 1
      })) : (vue.openBlock(), vue.createElementBlock("div", {
        key: 1,
        class: vue.normalizeClass(["vu-image__image", i.imageClasses]),
        style: vue.normalizeStyle([[e.isLoading ? "" : { backgroundImage: `url(${t.src})` }], { "background-position": "center center" }])
      }, null, 6)),
      Ki,
      vue.renderSlot(e.$slots, "default", {}, void 0, !0)
    ], 4);
  }
  const Xi = /* @__PURE__ */ w(Hi, [["render", Ji], ["__scopeId", "data-v-7cc6d9ac"]]), qi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Xi
  }, Symbol.toStringTag, { value: "Module" })), Be = {
    props: {
      clearable: {
        type: Boolean,
        default: () => !1
      }
    }
  };
  const en = {
    name: "vu-input-date",
    mixins: [x, se, Be, P, A, S],
    emits: ["update:modelValue"],
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
        type: String
      },
      nextMonthLabel: {
        type: String
      },
      monthsLabels: {
        type: Array
      },
      weekdaysLabels: {
        type: Array
      },
      weekdaysShortLabels: {
        type: Array
      }
    },
    data: () => ({
      open: !1,
      stringifedValue: ""
    }),
    mounted() {
      console.log(this);
    },
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
  }, tn = ["classes"], sn = {
    key: 0,
    class: "control-label"
  }, nn = {
    key: 0,
    class: "label-field-required"
  }, on = {
    ref: "activator",
    class: "input-date"
  }, ln = ["value", "placeholder", "disabled"], an = {
    key: 1,
    class: "form-control-helper-text"
  };
  function rn(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-datepicker"), d = vue.resolveDirective("click-outside");
    return vue.openBlock(), vue.createElementBlock("div", {
      class: "form-group",
      classes: e.classes
    }, [
      e.label.length ? (vue.openBlock(), vue.createElementBlock("label", sn, [
        vue.createTextVNode(vue.toDisplayString(e.label), 1),
        e.required ? (vue.openBlock(), vue.createElementBlock("span", nn, " * " + vue.toDisplayString(e.uuid), 1)) : vue.createCommentVNode("", !0)
      ])) : vue.createCommentVNode("", !0),
      vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", on, [
        vue.createElementVNode("input", {
          ref: "input",
          value: e.stringifedValue,
          placeholder: t.placeholder,
          disabled: e.disabled,
          readonly: "",
          type: "text",
          class: vue.normalizeClass(["form-control input-date", { filled: !i.isEmpty }]),
          onClick: s[0] || (s[0] = (u) => {
            e.open = !0;
          })
        }, null, 10, ln),
        e.clearable ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 0,
          class: "input-date-reset fonticon fonticon-clear",
          onClick: s[1] || (s[1] = (u) => i.click())
        })) : vue.createCommentVNode("", !0),
        vue.createVNode(r, {
          style: vue.normalizeStyle([{ position: "absolute", top: "38px" }, t.contentStyle]),
          class: vue.normalizeClass(t.contentClass),
          "v-model": e.value,
          show: e.open,
          min: e.min,
          max: e.max,
          unselectableDaysOfWeek: t.unselectableDaysOfWeek,
          yearRange: t.yearRange,
          firstDay: t.firstDay,
          previousMonthLabel: t.previousMonthLabel,
          nextMonthLabel: t.nextMonthLabel,
          monthsLabels: t.monthsLabels,
          weekdaysLabels: t.weekdaysLabels,
          weekdaysShortLabels: t.weekdaysShortLabels,
          "onUpdate:modelValue": i.handleSelect,
          onBoundaryChange: s[2] || (s[2] = (u) => i.date = u.value)
        }, null, 8, ["style", "class", "v-model", "show", "min", "max", "unselectableDaysOfWeek", "yearRange", "firstDay", "previousMonthLabel", "nextMonthLabel", "monthsLabels", "weekdaysLabels", "weekdaysShortLabels", "onUpdate:modelValue"])
      ])), [
        [d, function() {
          e.open = !1;
        }]
      ]),
      (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.errorBucket, (u, g) => (vue.openBlock(), vue.createElementBlock("span", {
        key: `${g}-error-${u}`,
        style: { display: "block" },
        class: "form-control-error-text"
      }, vue.toDisplayString(u), 1))), 128)),
      e.helper.length ? (vue.openBlock(), vue.createElementBlock("span", an, vue.toDisplayString(e.helper), 1)) : vue.createCommentVNode("", !0)
    ], 8, tn);
  }
  const un = /* @__PURE__ */ w(en, [["render", rn], ["__scopeId", "data-v-f552edc2"]]), dn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: un
  }, Symbol.toStringTag, { value: "Module" }));
  const cn = {
    name: "vu-input-number",
    inheritAttrs: !1,
    mixins: [x, P, A, S],
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
    methods: {
      input(e, s) {
        if (s && e === "" && this.value !== "") {
          this.$refs.input.value = this.value;
          return;
        }
        e === "" && s === "-" || s === "." || s === "," || (this.$emit("update:modelValue", e ? this.parseValue(this.fixed(e)) : ""), this.$refs.input.value = this.value);
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
  }, hn = {
    key: 0,
    class: "control-label"
  }, gn = {
    key: 0,
    class: "label-field-required"
  }, mn = { class: "input-number" }, Mn = ["disabled"], yn = ["value", "placeholder", "disabled", "min", "max", "step"], vn = ["disabled"], pn = {
    key: 1,
    class: "form-control-helper-text"
  };
  function fn(e, s, t, l, a, i) {
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["vu-number form-group", { ...e.classes, "vu-number--no-buttons": !t.showButtons }])
    }, [
      e.label.length ? (vue.openBlock(), vue.createElementBlock("label", hn, [
        vue.createTextVNode(vue.toDisplayString(e.label), 1),
        e.required ? (vue.openBlock(), vue.createElementBlock("span", gn, " *")) : vue.createCommentVNode("", !0)
      ])) : vue.createCommentVNode("", !0),
      vue.createElementVNode("div", mn, [
        t.showButtons ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 0,
          type: "button",
          disabled: e.disabled,
          class: "input-number-button input-number-button-left btn btn-default",
          onClick: s[0] || (s[0] = (...r) => i.decrement && i.decrement(...r))
        }, null, 8, Mn)) : vue.createCommentVNode("", !0),
        vue.createElementVNode("input", vue.mergeProps(e.$attrs, {
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
            s[1] || (s[1] = vue.withKeys((...r) => i.increment && i.increment(...r), ["up"])),
            s[2] || (s[2] = vue.withKeys((...r) => i.decrement && i.decrement(...r), ["down"]))
          ],
          onInput: s[3] || (s[3] = (r) => i.input(r.target.value, r.data))
        }), null, 16, yn),
        t.showButtons ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 1,
          type: "button",
          disabled: e.disabled,
          class: "input-number-button input-number-button-right btn btn-default",
          onClick: s[4] || (s[4] = (...r) => i.increment && i.increment(...r))
        }, null, 8, vn)) : vue.createCommentVNode("", !0)
      ]),
      (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.errorBucket, (r, d) => (vue.openBlock(), vue.createElementBlock("span", {
        key: `${d}-error-${r}`,
        style: { display: "block" },
        class: "form-control-error-text"
      }, vue.toDisplayString(r), 1))), 128)),
      e.helper.length ? (vue.openBlock(), vue.createElementBlock("span", pn, vue.toDisplayString(e.helper), 1)) : vue.createCommentVNode("", !0)
    ], 2);
  }
  const bn = /* @__PURE__ */ w(cn, [["render", fn], ["__scopeId", "data-v-206b202c"]]), jn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: bn
  }, Symbol.toStringTag, { value: "Module" }));
  const _n = {
    name: "vu-input",
    inheritAttrs: !1,
    inject: {
      vuInputComposition: {
        default: !1
      }
    },
    mixins: [x, P, S, A]
  }, wn = {
    key: 0,
    class: "control-label"
  }, Ln = {
    key: 0,
    class: "label-field-required"
  }, In = ["value", "placeholder", "disabled", "type"], Nn = {
    key: 1,
    class: "form-control-helper-text"
  };
  function Cn(e, s, t, l, a, i) {
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["form-group", e.classes])
    }, [
      e.label.length ? (vue.openBlock(), vue.createElementBlock("label", wn, [
        vue.createTextVNode(vue.toDisplayString(e.label), 1),
        e.required ? (vue.openBlock(), vue.createElementBlock("span", Ln, " *")) : vue.createCommentVNode("", !0)
      ])) : vue.createCommentVNode("", !0),
      vue.createElementVNode("input", vue.mergeProps(e.$attrs, {
        value: e.value,
        placeholder: e.placeholder,
        disabled: e.disabled,
        type: e.type,
        class: "form-control",
        onInput: s[0] || (s[0] = ({ target: r }) => {
          i.vuInputComposition || (r.composing = !1), e.$emit("update:modelValue", r.value);
        })
      }), null, 16, In),
      (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.errorBucket, (r, d) => (vue.openBlock(), vue.createElementBlock("span", {
        key: `${d}-error-${r}`,
        style: { display: "block" },
        class: "form-control-error-text"
      }, vue.toDisplayString(r), 1))), 128)),
      e.helper.length ? (vue.openBlock(), vue.createElementBlock("span", Nn, vue.toDisplayString(e.helper), 1)) : vue.createCommentVNode("", !0)
    ], 2);
  }
  const Dn = /* @__PURE__ */ w(_n, [["render", Cn], ["__scopeId", "data-v-fd191f07"]]), Tn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Dn
  }, Symbol.toStringTag, { value: "Module" })), kn = {
    name: "vu-lazy",
    props: {
      height: {
        type: String,
        default: () => "10px"
      },
      options: {
        type: Object,
        default: () => ({})
      }
    },
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
  function zn(e, s, t, l, a, i) {
    return vue.openBlock(), vue.createElementBlock("div", {
      style: vue.normalizeStyle(e.intersected ? "" : `min-height: ${t.height}`)
    }, [
      e.intersected ? vue.renderSlot(e.$slots, "default", { key: 0 }) : vue.renderSlot(e.$slots, "placeholder", { key: 1 })
    ], 4);
  }
  const Sn = /* @__PURE__ */ w(kn, [["render", zn]]), On = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Sn
  }, Symbol.toStringTag, { value: "Module" })), Ue = (e) => typeof e != "string" ? "" : e.charAt(0).toUpperCase() + e.slice(1);
  const xn = {
    name: "vu-lightbox-bar",
    props: {
      showCloseIcon: { default: () => !0 },
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
      }
    },
    data: () => ({
      getListenersFromAttrs: Z,
      capitalize: Ue,
      uid: G()
    }),
    computed: {
      menuIcon() {
        return this.responsive ? "menu-dot" : "chevron-down";
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
        const t = s.filter(({ name: i }) => e.find(({ name: r }) => i === r)), l = s.filter(({ name: i }) => !t.find(({ name: r }) => i === r));
        e.forEach(({ name: i, items: r }) => {
          const d = t.find(({ name: u }) => u === i);
          if (d) {
            const { items: u } = d;
            u && (Array.isArray(r) || (r = []), r.push(...u));
          }
        });
        let a = [...e, ...l];
        return a = a.map((i) => {
          if (i.text === void 0) {
            const r = this.capitalize(i.name);
            i.text = r;
          }
          return i;
        }), a;
      },
      selectedItemsArray(e) {
        return this.customItems ? this.getSelectedItems(e) : [];
      },
      getSelectedItems(e) {
        let s = [];
        return Array.isArray(e) && e.forEach((t) => {
          if (t.items) {
            const l = this.getSelectedItems(t);
            s = [s, ...l];
          }
        }), s.filter((t) => t.selected);
      }
    }
  }, Ze = (e) => (vue.pushScopeId("data-v-c341f592"), e = e(), vue.popScopeId(), e), Pn = { class: "lightbox-bar__left" }, An = /* @__PURE__ */ Ze(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "lightbox-bar__compass-active" }, null, -1)), En = [
    An
  ], Bn = { class: "lightbox-bar-menu-item lightbox-bar-menu-item--no-cursor" }, Un = { class: "lightbox-bar__title" }, Zn = { class: "lightbox-bar__right" }, Gn = { class: "lightbox-bar__menu" }, Yn = {
    key: 2,
    class: "lightbox-bar__divider"
  }, Qn = /* @__PURE__ */ Ze(() => /* @__PURE__ */ vue.createElementVNode("hr", { class: "divider divider--vertical" }, null, -1)), Rn = [
    Qn
  ];
  function $n(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-icon-btn"), d = vue.resolveComponent("vu-dropdownmenu"), u = vue.resolveDirective("tooltip");
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["vu-lightbox-bar", {
        "lightbox-bar--responsive": t.responsive,
        "lightbox-bar--widget-header": t.widget
      }])
    }, [
      vue.createElementVNode("div", Pn, [
        t.showCompass && !t.widget ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(["lightbox-bar__compass", { "lightbox-bar__compass--disabled": t.disableCompass }]),
          onClick: s[0] || (s[0] = (g) => e.$emit("click-compass"))
        }, En, 2)) : vue.createCommentVNode("", !0),
        vue.renderSlot(e.$slots, "lightbox-bar__object-type", {}, () => [
          vue.createElementVNode("div", Bn, [
            vue.createElementVNode("div", {
              class: "lightbox-bar__media-type",
              style: vue.normalizeStyle({ "background-color": t.type.backgroundColor })
            }, [
              vue.createElementVNode("span", {
                class: vue.normalizeClass(`fonticon fonticon-${t.type.icon}`)
              }, null, 2)
            ], 4)
          ])
        ], !0),
        vue.createElementVNode("div", Un, [
          vue.renderSlot(e.$slots, "lightbox-bar__title", {}, () => [
            vue.createElementVNode("span", null, vue.toDisplayString(t.label), 1)
          ], !0)
        ])
      ]),
      vue.createElementVNode("div", Zn, [
        vue.createElementVNode("div", Gn, [
          t.responsive ? vue.createCommentVNode("", !0) : (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList(i._items, (g, y) => (vue.openBlock(), vue.createElementBlock(vue.Fragment, {
            key: `${e.uid}-${y}-rm`
          }, [
            g.items && !g.hidden ? (vue.openBlock(), vue.createBlock(d, vue.mergeProps({
              "v-model": i.selectedItemsArray(i._items),
              key: `lightbox-dropdownmenu_${e.uid}-${y}`,
              items: g.items,
              shift: !0,
              disabled: g.disabled,
              class: "lightbox-bar-dropdown-wrap"
            }, vue.toHandlers(i.dropdownMenuListeners)), {
              default: vue.withCtx(({ active: f }) => [
                vue.withDirectives(vue.createVNode(r, {
                  icon: i.icon(g),
                  active: g.selected || f,
                  disabled: g.disabled,
                  color: t.widget ? "default" : "secondary",
                  class: "lightbox-bar-menu-item",
                  onClick: () => i.actionClick(g)
                }, null, 8, ["icon", "active", "disabled", "color", "onClick"]), [
                  [
                    u,
                    `${g.label || e.capitalize(g.name)}`,
                    void 0,
                    {
                      body: !0,
                      bottom: !0
                    }
                  ]
                ])
              ]),
              _: 2
            }, 1040, ["v-model", "items", "disabled"])) : g.hidden ? vue.createCommentVNode("", !0) : vue.withDirectives((vue.openBlock(), vue.createBlock(r, {
              key: 1,
              icon: i.icon(g),
              active: g.selected,
              disabled: g.disabled,
              color: t.widget ? "default" : "secondary",
              class: "lightbox-bar-menu-item",
              onClick: () => i.actionClick(g)
            }, null, 8, ["icon", "active", "disabled", "color", "onClick"])), [
              [
                u,
                `${g.label || e.capitalize(g.name)}`,
                void 0,
                {
                  body: !0,
                  bottom: !0
                }
              ]
            ])
          ], 64))), 128)),
          i._dropdownMenuItems.length > 0 ? (vue.openBlock(), vue.createBlock(d, vue.mergeProps({
            key: 1,
            "v-model": i.selectedItemsArray(i._dropdownMenuItems),
            class: "lightbox-bar-dropdown-wrap",
            preventDropup: !0,
            items: i._dropdownMenuItems,
            position: "bottom-left",
            shift: !0
          }, vue.toHandlers(i.dropdownMenuListeners)), {
            default: vue.withCtx(({ active: g }) => [
              vue.withDirectives(vue.createVNode(r, {
                icon: i.menuIcon,
                active: g,
                color: t.widget ? "default" : "secondary",
                class: vue.normalizeClass(["lightbox-bar-menu-item", t.responsive ? "" : "chevron-menu-icon"])
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
          }, 16, ["v-model", "items"])) : vue.createCommentVNode("", !0),
          vue.renderSlot(e.$slots, "lightbox-bar__special-actions", {}, void 0, !0),
          t.items.length > 0 && t.items.some((g) => !g.hidden) || i._dropdownMenuItems.length > 0 ? (vue.openBlock(), vue.createElementBlock("div", Yn, Rn)) : vue.createCommentVNode("", !0),
          (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(t.rightItems, (g, y) => (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
            g.hidden ? vue.createCommentVNode("", !0) : vue.withDirectives((vue.openBlock(), vue.createBlock(r, {
              key: `${e.uid}-sa-${y}`,
              class: "lightbox-bar-menu-item",
              color: t.widget ? "default" : "secondary",
              icon: i.icon(g),
              active: g.selected,
              disabled: g.disabled,
              onClick: (f) => i.actionClick(g, "side-action")
            }, null, 8, ["color", "icon", "active", "disabled", "onClick"])), [
              [
                u,
                `${g.label || e.capitalize(g.name)}`,
                void 0,
                {
                  body: !0,
                  bottom: !0
                }
              ]
            ])
          ], 64))), 256)),
          vue.withDirectives(vue.createVNode(r, {
            class: "lightbox-bar-menu-item",
            color: t.widget ? "default" : "secondary",
            icon: "close",
            onClick: s[1] || (s[1] = (g) => e.$emit("close", !1))
          }, null, 8, ["color"]), [
            [
              u,
              t.closeLabel,
              void 0,
              {
                body: !0,
                bottom: !0
              }
            ]
          ])
        ])
      ])
    ], 2);
  }
  const Vn = /* @__PURE__ */ w(xn, [["render", $n], ["__scopeId", "data-v-c341f592"]]), Wn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Vn
  }, Symbol.toStringTag, { value: "Module" })), je = {
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
  }, _e = [
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
  ], we = [
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
  ];
  const Hn = {
    name: "vu-lightbox",
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
        capitalize: Ue,
        customItems: [],
        getListenersFromAttrs: Z,
        uid: G()
      };
    },
    props: {
      title: {
        type: String,
        default: () => ""
      },
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
        validator: (e) => !!je[e] || e && e.icon && e.backgroundColor
      },
      primaryActions: {
        type: [Array, String],
        default: () => _e
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
        default: () => we
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
      }
    },
    created() {
      this.panels.find(({ show: e }) => e !== void 0) || (this.panelStates = this.panels.map((e) => ({ ...e, show: !1 })));
    },
    computed: {
      typeInfo() {
        return typeof this.objectType == "object" ? this.objectType : je[this.objectType];
      },
      compassIframeUrl() {
        return `${this.serviceUrl || ""}/${this.compassPath}${this.userId ? `#userId:${this.userId}` : ""}`;
      },
      listeners() {
        return Z(this.$attrs, !0);
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
        const e = this.primaryActions, s = _e;
        if (this.widget) {
          const t = e.find(({ name: a }) => a === "information"), l = e.find(({ name: a }) => a === "comment");
          t && !t.fonticon && (s.find(({ name: a }) => a === "information").fonticon = "info"), l && !l.fonticon && (s.find(({ name: a }) => a === "comment").fonticon = "comment");
        }
        return this.actionsMerge(e, s, this.customActions);
      },
      _sideActions() {
        return this.actionsMerge(this.sideActions, we, this.customSideActions);
      }
    },
    mounted() {
      this.onResize();
      const e = new ResizeObserver(() => {
        this.onResize();
      });
      e.observe(this.$refs.lightbox), this.resizeObserver = e;
      const s = this;
      !this.noCompass && window && window.require && window.require(
        [
          "DS/UWPClientCode/Data/Utils",
          "DS/UWPClientCode/PublicAPI"
        ],
        (t, l) => {
          this.getCompassUrl = () => {
            t.getServiceUrl({
              serviceName: "3DCompass",
              onComplete: (a) => {
                s.serviceUrl = a;
              },
              onFailure: () => {
                UWA && UWA.debug && console.error("Lightbox Compass failed to retrieve 3DCompass service url");
              },
              scope: s
            });
          }, this.userId ? this.getCompassUrl() : l.getCurrentUser().then(({ login: a }) => {
            s.userId = a, this.getCompassUrl();
          }, () => this.getCompassUrl());
        }
      );
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
        const t = this.panelStates.find(({ name: l }) => e === l);
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
        let l = e;
        return t || (l = e.slice(0, s.length).filter(({ name: a }) => s.find(({ name: i }) => a === i)), l = l.map((a) => ({
          // If component user messes up order \o/
          ...s.find(({ name: i }) => a.name === i),
          ...a
        }))), l = l.map((a) => {
          if (a.text === void 0) {
            const i = this.capitalize(a.name);
            a.text = i;
          }
          return a;
        }), l;
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
  }, Fn = (e) => (vue.pushScopeId("data-v-93fb8dd2"), e = e(), vue.popScopeId(), e), Kn = ["data-id"], Jn = /* @__PURE__ */ Fn(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "lightbox__overlay" }, null, -1)), Xn = ["src"], qn = {
    key: 0,
    class: "panel__header"
  }, eo = { class: "panel__title" }, to = { class: "panel__title__text" };
  function so(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-lightbox-bar"), d = vue.resolveComponent("vu-icon-btn");
    return vue.openBlock(), vue.createElementBlock("div", null, [
      vue.renderSlot(e.$slots, "lightbox-activator", {}, void 0, !0),
      vue.createElementVNode("div", {
        ref: "lightbox",
        class: vue.normalizeClass(["vu-lightbox", {
          "lightbox--responsive": a.transforms.responsive,
          "lightbox--widget-header": t.widget,
          "vu-lightbox--appear-faster": !t.widget && !t.noAnimation && t.fasterAnimation,
          "vu-lightbox--appear-fast": !t.widget && !t.noAnimation && !t.fasterAnimation
        }]),
        style: vue.normalizeStyle({
          zIndex: t.zIndex
        }),
        "data-id": a.uid
      }, [
        vue.createVNode(r, vue.mergeProps({
          label: t.title,
          showCompass: !i.noCompass,
          disableCompass: t.disableCompass,
          class: { "lightbox-bar--compass-open": a.openCompass },
          type: i.typeInfo,
          items: i._primaryActions,
          customItems: a.customItems,
          subItems: t.menuActions,
          rightItems: i._sideActions,
          responsive: a.transforms.responsive,
          widget: t.widget,
          moreActionsLabel: t.moreActionsLabel,
          closeLabel: t.closeLabel
        }, vue.toHandlers(i.listeners), {
          onClickCompass: s[0] || (s[0] = () => {
            t.disableCompass || (a.openCompass = !a.openCompass, a.compassAlreadyOpened = !0), e.$emit("click-compass", a.openCompass);
          })
        }), {
          "lightbox-bar__object-type": vue.withCtx((u) => [
            vue.renderSlot(e.$slots, "lightbox-bar__object-type", vue.normalizeProps(vue.guardReactiveProps(u)), void 0, !0)
          ]),
          "lightbox-bar__title": vue.withCtx((u) => [
            vue.renderSlot(e.$slots, "lightbox-bar__title", vue.normalizeProps(vue.guardReactiveProps(u)), void 0, !0)
          ]),
          "lightbox-bar__special-actions": vue.withCtx(() => [
            vue.renderSlot(e.$slots, "lightbox-bar__special-actions", {}, void 0, !0)
          ]),
          _: 3
        }, 16, ["label", "showCompass", "disableCompass", "class", "type", "items", "customItems", "subItems", "rightItems", "responsive", "widget", "moreActionsLabel", "closeLabel"]),
        Jn,
        vue.createElementVNode("div", {
          class: "lightbox__content",
          ref: "content",
          style: vue.normalizeStyle(a.transforms.center || {})
        }, [
          vue.renderSlot(e.$slots, "lightbox-content", {}, void 0, !0)
        ], 4),
        !i.noCompass && a.compassAlreadyOpened ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: "vu-panel lightbox__panel lightbox__panel--left column",
          style: vue.normalizeStyle(a.transforms.left || {})
        }, [
          vue.createElementVNode("iframe", {
            class: "compass",
            src: i.compassIframeUrl
          }, null, 8, Xn),
          a.transforms.responsive ? (vue.openBlock(), vue.createBlock(d, {
            key: 0,
            icon: "close",
            style: { position: "absolute", right: "0", top: "0", zIndex: "21" },
            onClick: s[1] || (s[1] = (u) => a.openCompass = !1)
          })) : vue.createCommentVNode("", !0)
        ], 4)), [
          [vue.vShow, a.openCompass]
        ]) : vue.createCommentVNode("", !0),
        (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(i._panels, ({ name: u, show: g, showClose: y = !1, showEdit: f, classes: k = [], title: I }, U) => vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
          key: `${a.uid}-${U}`,
          class: vue.normalizeClass(["vu-panel lightbox__panel column", [...k, "lightbox__panel--right", { "panel--responsive": a.transforms.responsive }]]),
          style: vue.normalizeStyle(a.transforms.right)
        }, [
          I ? (vue.openBlock(), vue.createElementBlock("div", qn, [
            vue.createElementVNode("span", eo, [
              vue.createElementVNode("span", to, vue.toDisplayString(I), 1),
              f ? (vue.openBlock(), vue.createBlock(d, {
                key: 0,
                class: "panel__edit__icon",
                icon: "pencil",
                onClick: (X) => e.$emit(`panel-edit-${u}`)
              }, null, 8, ["onClick"])) : vue.createCommentVNode("", !0)
            ]),
            y ? (vue.openBlock(), vue.createBlock(d, {
              key: 0,
              class: "panel__close_icon",
              icon: "close",
              onClick: (X) => e.$emit(`close-panel-${u}`)
            }, null, 8, ["onClick"])) : vue.createCommentVNode("", !0)
          ])) : a.transforms.responsive || y ? (vue.openBlock(), vue.createBlock(d, {
            key: 1,
            class: "panel__close_icon",
            icon: "close",
            onClick: (X) => e.$emit(`close-panel-${u}`)
          }, null, 8, ["onClick"])) : vue.createCommentVNode("", !0),
          vue.createElementVNode("div", {
            class: vue.normalizeClass([`vu-dynamic-panel-wrap-${u}`, "panel__content"])
          }, [
            vue.renderSlot(e.$slots, `lightbox-panel-${u}`, {}, void 0, !0)
          ], 2)
        ], 6)), [
          [vue.vShow, g]
        ])), 128))
      ], 14, Kn)
    ]);
  }
  const io = /* @__PURE__ */ w(Hn, [["render", so], ["__scopeId", "data-v-93fb8dd2"]]), no = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: io
  }, Symbol.toStringTag, { value: "Module" }));
  const oo = {
    name: "vu-media-upload-droppable",
    props: {
      isOver: {
        type: Boolean
      },
      validDrop: {
        type: Boolean
      }
      // TD orange state.
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
    // created: {},
    mounted() {
    },
    beforeUnmount() {
    },
    methods: {}
  }, lo = { class: "vu-media-upload-droppable__icon" }, ao = { class: "vu-media-upload-droppable__label" };
  function ro(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-icon");
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["vu-media-upload-droppable", i.classes]),
      onDrop: s[0] || (s[0] = vue.withModifiers((d) => e.$emit("drop", d), ["prevent", "stop"]))
    }, [
      vue.renderSlot(e.$slots, "drop-main", {}, () => [
        vue.createElementVNode("div", lo, [
          vue.createVNode(r, {
            icon: "up",
            color: "none"
          })
        ])
      ]),
      vue.renderSlot(e.$slots, "drop-alt", {}, () => [
        vue.createElementVNode("span", ao, vue.toDisplayString(i.vuMediaUploadDropText), 1)
      ])
    ], 34);
  }
  const uo = /* @__PURE__ */ w(oo, [["render", ro]]), co = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: uo
  }, Symbol.toStringTag, { value: "Module" }));
  const ho = {
    name: "vu-media-upload-empty",
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
  }, go = { class: "vu-media-upload-empty" }, mo = { class: "vu-media-upload-empty__OR" }, Mo = { key: 1 };
  function yo(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-icon"), d = vue.resolveComponent("vu-btn"), u = vue.resolveComponent("vu-icon-link");
    return vue.openBlock(), vue.createElementBlock("div", go, [
      vue.createVNode(r, { icon: "drag-drop" }),
      t.rich ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
        vue.createElementVNode("span", null, vue.toDisplayString(i.vuMediaUploadPlaceholderLong), 1),
        vue.createElementVNode("span", mo, vue.toDisplayString(i.vuMediaUploadOR), 1),
        vue.createVNode(d, {
          onClick: s[0] || (s[0] = (g) => e.$emit("browse")),
          color: "primary"
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode(vue.toDisplayString(i.vuMediaUploadBrowse), 1)
          ]),
          _: 1
        })
      ], 64)) : (vue.openBlock(), vue.createElementBlock("div", Mo, [
        vue.createTextVNode(vue.toDisplayString(i.vuMediaUploadPlaceholder), 1),
        vue.createVNode(u, {
          onClick: s[1] || (s[1] = (g) => e.$emit("browse"))
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode(vue.toDisplayString(i.vuMediaUploadBrowse), 1)
          ]),
          _: 1
        })
      ]))
    ]);
  }
  const vo = /* @__PURE__ */ w(ho, [["render", yo], ["__scopeId", "data-v-b7ff155a"]]), po = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: vo
  }, Symbol.toStringTag, { value: "Module" }));
  const fo = {
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
      errorBucket: {
        default: []
      }
    }
  }, bo = { class: "vu-media-upload-error" };
  function jo(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-icon"), d = vue.resolveComponent("vu-btn");
    return vue.openBlock(), vue.createElementBlock("div", bo, [
      vue.createVNode(r, {
        icon: t.icon,
        class: "vu-media-upload-error__icon"
      }, null, 8, ["icon"]),
      (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(t.errorBucket, (u, g) => (vue.openBlock(), vue.createElementBlock("span", {
        class: "vu-media-upload-error__error_label",
        key: g
      }, vue.toDisplayString(u), 1))), 128)),
      vue.createVNode(d, {
        onClick: s[0] || (s[0] = (u) => e.$emit("retry")),
        class: "vu-media-upload-error__retry",
        small: ""
      }, {
        default: vue.withCtx(() => [
          vue.createTextVNode(vue.toDisplayString(i.vuMediaUploadRetry), 1)
        ]),
        _: 1
      })
    ]);
  }
  const _o = /* @__PURE__ */ w(fo, [["render", jo], ["__scopeId", "data-v-393471c6"]]), wo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: _o
  }, Symbol.toStringTag, { value: "Module" }));
  const Lo = {
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
    emits: ["upload-abort"]
  }, Io = { class: "vu-media-upload-loading" };
  function No(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-progress-circular"), d = vue.resolveComponent("vu-btn");
    return vue.openBlock(), vue.createElementBlock("div", Io, [
      vue.createVNode(r, { value: t.progress }, null, 8, ["value"]),
      vue.createVNode(d, {
        color: "default",
        onClick: s[0] || (s[0] = (u) => e.$emit("upload-abort")),
        small: "",
        class: "vu-media-upload-loading__abort"
      }, {
        default: vue.withCtx(() => [
          vue.createTextVNode(vue.toDisplayString(i.vuMediaUploadAbortButton), 1)
        ]),
        _: 1
      })
    ]);
  }
  const Co = /* @__PURE__ */ w(Lo, [["render", No], ["__scopeId", "data-v-925a0a9d"]]), Do = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Co
  }, Symbol.toStringTag, { value: "Module" }));
  const To = {
    name: "vu-media-upload-preview",
    computed: {
      videoSizer() {
        var l;
        const [e, s] = (l = this.displayRatio) == null ? void 0 : l.replace(",", "").split("/"), t = Number(e) / Number(s);
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
    emits: ["delete"]
  }, ko = ["src", "controls"];
  function zo(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-icon-btn"), d = vue.resolveComponent("vu-image"), u = vue.resolveComponent("vu-spinner");
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      t.isVideo ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: "vu-media-upload-preview__video-container",
        style: vue.normalizeStyle(i.videoSizer)
      }, [
        vue.createElementVNode("video", {
          class: "vu-media-upload-preview",
          src: t.src,
          controls: t.videoControls
        }, null, 8, ko)
      ], 4)) : t.isVideo ? e.loading ? (vue.openBlock(), vue.createBlock(u, { key: 2 })) : vue.createCommentVNode("", !0) : (vue.openBlock(), vue.createBlock(d, {
        key: 1,
        class: "vu-media-upload-preview",
        aspectRatio: t.displayRatio,
        src: t.src,
        contain: "",
        style: { height: "100%" }
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("div", {
            class: "vu-media-upload-preview__delete-icon",
            onClick: s[0] || (s[0] = (g) => e.$emit("delete"))
          }, [
            vue.createVNode(r, { icon: t.deleteIcon }, null, 8, ["icon"])
          ])
        ]),
        _: 1
      }, 8, ["aspectRatio", "src"])),
      t.isVideo ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 3,
        class: "vu-media-upload-preview__delete-icon",
        onClick: s[1] || (s[1] = (g) => e.$emit("delete"))
      }, [
        vue.createVNode(r, { icon: t.deleteIcon }, null, 8, ["icon"])
      ])) : vue.createCommentVNode("", !0)
    ], 64);
  }
  const So = /* @__PURE__ */ w(To, [["render", zo], ["__scopeId", "data-v-fd4dfdc6"]]), Oo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: So
  }, Symbol.toStringTag, { value: "Module" })), xo = {
    empty: "empty",
    loading: "loading",
    error: "error",
    complete: "complete"
  };
  const Po = {
    name: "vu-media-upload",
    mixins: [x, S, V, P, A],
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
        required: !1
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
        states: xo,
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
    }
  }, Ao = {
    key: 0,
    class: "control-label"
  }, Eo = {
    key: 0,
    class: "label-field-required"
  }, Bo = ["multiple"];
  function Uo(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-icon"), d = vue.resolveComponent("vu-media-upload-droppable"), u = vue.resolveComponent("vu-media-upload-empty"), g = vue.resolveComponent("vu-media-upload-loading"), y = vue.resolveComponent("vu-media-upload-error"), f = vue.resolveComponent("vu-media-upload-preview");
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["vu-media-upload", [{ "has-error": a.error, "vu-media-upload--border": !i.hasLabel, "vu-media-upload--inner-flex": i.hasLabel }]]),
      style: vue.normalizeStyle(i.hasLabel ? {} : i.wrapStyle)
    }, [
      i.hasLabel ? (vue.openBlock(), vue.createElementBlock("label", Ao, [
        t.icon ? (vue.openBlock(), vue.createBlock(r, {
          key: 0,
          icon: t.icon
        }, null, 8, ["icon"])) : vue.createCommentVNode("", !0),
        vue.renderSlot(e.$slots, "label", {}, () => [
          vue.createTextVNode(vue.toDisplayString(e.label), 1),
          e.required ? (vue.openBlock(), vue.createElementBlock("span", Eo, " *")) : vue.createCommentVNode("", !0)
        ], !0)
      ])) : vue.createCommentVNode("", !0),
      vue.createElementVNode("input", {
        ref: "upload-input",
        type: "file",
        name: "upload",
        style: { display: "none" },
        onChange: s[0] || (s[0] = (k) => i.selectFiles(e.$refs["upload-input"].files)),
        multiple: t.multiple
      }, null, 40, Bo),
      vue.createElementVNode("div", {
        class: vue.normalizeClass(["vu-media-upload__inner", { "vu-media-upload--border": i.hasLabel, "full-height": !i.hasLabel }]),
        ref: "inner",
        style: vue.normalizeStyle(i.hasLabel ? i.wrapStyle : ""),
        onDragover: s[4] || (s[4] = vue.withModifiers((k) => i.dragOver(), ["prevent"])),
        onDragenter: s[5] || (s[5] = vue.withModifiers((k) => i.dragOver(), ["prevent"])),
        onDragleave: s[6] || (s[6] = (...k) => i.dragLeave && i.dragLeave(...k)),
        onDragend: s[7] || (s[7] = (...k) => i.dragLeave && i.dragLeave(...k))
      }, [
        a.dragged ? (vue.openBlock(), vue.createBlock(d, {
          key: 0,
          validDrop: a.allowDrop,
          onDrop: i.onFileDrop
        }, {
          "drop-icon": vue.withCtx(() => [
            vue.renderSlot(e.$slots, "drop-icon", {}, void 0, !0)
          ]),
          "drop-label": vue.withCtx(() => [
            vue.renderSlot(e.$slots, "drop-label", {}, void 0, !0)
          ]),
          _: 3
        }, 8, ["validDrop", "onDrop"])) : vue.createCommentVNode("", !0),
        i.status === a.states.empty ? vue.renderSlot(e.$slots, "empty", {
          key: 1,
          input: e.$refs["upload-input"]
        }, () => [
          vue.createVNode(u, {
            onBrowse: s[1] || (s[1] = (k) => {
              e.$refs["upload-input"].value = "", e.$refs["upload-input"].click();
            })
          })
        ], !0) : i.status === a.states.loading ? vue.renderSlot(e.$slots, "loading", { key: 2 }, () => [
          vue.createVNode(g, {
            progress: t.uploadProgress,
            onUploadAbort: s[2] || (s[2] = (k) => e.$emit("upload-abort"))
          }, null, 8, ["progress"])
        ], !0) : i.status === a.states.error ? vue.renderSlot(e.$slots, "error", { key: 3 }, () => [
          vue.createVNode(y, vue.mergeProps({ onRetry: i.onRetry }, { errorBucket: e.errorBucket }), null, 16, ["onRetry"])
        ], !0) : i.status === a.states.complete ? vue.renderSlot(e.$slots, "preview", { key: 4 }, () => [
          vue.createVNode(f, vue.mergeProps(i.preview, {
            onDelete: s[3] || (s[3] = (k) => {
              e.$emit("delete"), i.status = a.states.empty;
            })
          }), null, 16)
        ], !0) : vue.createCommentVNode("", !0)
      ], 38)
    ], 6);
  }
  const Zo = /* @__PURE__ */ w(Po, [["render", Uo], ["__scopeId", "data-v-1067002b"]]), Go = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Zo
  }, Symbol.toStringTag, { value: "Module" }));
  const Yo = {
    name: "vu-message-container",
    props: {
      namespace: {
        type: String,
        default: "main"
      }
    },
    created() {
      this.api._exists(this.namespace) ? this.disabled = !0 : this.api._register(this.namespace);
    },
    data: () => ({
      disabled: !1
    })
  }, Qo = {
    key: 0,
    class: "alert alert-root",
    style: { visibility: "visible" }
  };
  function Ro(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-message");
    return e.disabled ? vue.createCommentVNode("", !0) : (vue.openBlock(), vue.createElementBlock("div", Qo, [
      (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.api._messages[t.namespace], (d) => (vue.openBlock(), vue.createBlock(r, vue.mergeProps(d.bind, {
        key: `${d.id}`,
        "onUpdate:show": (u) => e.api.hide(d)
      }), null, 16, ["onUpdate:show"]))), 128))
    ]));
  }
  const Ge = /* @__PURE__ */ w(Yo, [["render", Ro], ["__scopeId", "data-v-c39c9526"]]), $o = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Ge
  }, Symbol.toStringTag, { value: "Module" }));
  const Vo = {
    name: "vu-message",
    mixins: [K, F],
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
      timeout: {
        type: Number,
        default: () => 0
      },
      _dispose: Boolean,
      target: String
    },
    data: () => ({
      activeTimeout: 0,
      in: !0
    }),
    computed: {
      colored() {
        return !!this.color;
      },
      classes() {
        return [`alert-${this.color}`, {
          "alert-closable": this.closable,
          "alert-has-icon": !!this.icon
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
        this.$emit("update:show", !1);
      },
      setTimeout() {
        this.show && this.timeout && (window.clearTimeout(this.activeTimeout), this.activeTimeout = window.setTimeout(() => {
          this.$emit("update:show", !1);
        }, this.timeout));
      }
    }
  }, Wo = {
    key: 0,
    class: "icon fonticon"
  }, Ho = { class: "alert-message-wrap" }, Fo = ["innerHTML"];
  function Ko(e, s, t, l, a, i) {
    return vue.openBlock(), vue.createBlock(vue.Transition, { name: "alert-fade" }, {
      default: vue.withCtx(() => [
        e.show ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(["vu-message alert-has-icon", i.classes])
        }, [
          i.colored ? (vue.openBlock(), vue.createElementBlock("span", Wo)) : vue.createCommentVNode("", !0),
          vue.createElementVNode("span", Ho, [
            vue.renderSlot(e.$slots, "default", {}, () => [
              vue.createElementVNode("div", { innerHTML: t.text }, null, 8, Fo)
            ], !0)
          ]),
          t.closable ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 1,
            class: "close fonticon fonticon-cancel",
            onClick: s[0] || (s[0] = (r) => e.$emit("update:show", !1))
          })) : vue.createCommentVNode("", !0)
        ], 2)) : vue.createCommentVNode("", !0)
      ]),
      _: 3
    });
  }
  const Jo = /* @__PURE__ */ w(Vo, [["render", Ko], ["__scopeId", "data-v-9097a1e0"]]), Xo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Jo
  }, Symbol.toStringTag, { value: "Module" }));
  const qo = {
    name: "vu-mobile-dialog",
    emits: ["close", "confirm"],
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
  }, el = { class: "vu-mobile-dialog" }, tl = { class: "vu-mobile-dialog__header" }, sl = { class: "vu-mobile-dialog__header__default" }, il = {
    class: "vu-label-wrap",
    style: { overflow: "hidden" }
  };
  function nl(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-icon-btn"), d = vue.resolveComponent("vu-scroller"), u = vue.resolveDirective("tooltip");
    return vue.openBlock(), vue.createElementBlock("div", el, [
      vue.createElementVNode("div", tl, [
        vue.renderSlot(e.$slots, "mobile-dialog-header", {}, () => [
          vue.createElementVNode("div", sl, [
            vue.withDirectives(vue.createVNode(r, {
              icon: i._backIcon,
              class: vue.normalizeClass([i.backClasses, "vu-mobile-dialog__header_back topbar"]),
              onClick: s[0] || (s[0] = (g) => e.$emit("close"))
            }, null, 8, ["icon", "class"]), [
              [
                u,
                t.backIconTooltip,
                void 0,
                { bottom: !0 }
              ]
            ]),
            vue.createElementVNode("div", il, [
              vue.withDirectives((vue.openBlock(), vue.createElementBlock("label", null, [
                vue.createTextVNode(vue.toDisplayString(t.title), 1)
              ])), [
                [
                  u,
                  t.title,
                  void 0,
                  { bottom: !0 }
                ]
              ])
            ]),
            vue.withDirectives(vue.createVNode(r, {
              icon: i._icon,
              class: vue.normalizeClass([i.nextClasses, "vu-mobile-dialog__header_next topbar"]),
              disabled: t.nextIconDisabled,
              onClick: s[1] || (s[1] = (g) => e.$emit("confirm"))
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
      vue.createElementVNode("div", {
        class: vue.normalizeClass(["vu-mobile-dialog__content", `vu-mobile-dialog__content--${t.scrollable ? "" : "non-"}scrollable`])
      }, [
        t.scrollable ? (vue.openBlock(), vue.createBlock(d, { key: 0 }, {
          default: vue.withCtx(() => [
            vue.renderSlot(e.$slots, "default", {}, void 0, !0)
          ]),
          _: 3
        })) : vue.renderSlot(e.$slots, "default", { key: 1 }, void 0, !0)
      ], 2)
    ]);
  }
  const ol = /* @__PURE__ */ w(qo, [["render", nl], ["__scopeId", "data-v-e0bcc432"]]), ll = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: ol
  }, Symbol.toStringTag, { value: "Module" })), al = {
    name: "vu-modal-container"
  };
  function rl(e, s, t, l, a, i) {
    return vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.api._modals, (r) => (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(r.component), vue.mergeProps({
      key: r.id
    }, r.bind, {
      modelValue: r.value,
      "onUpdate:modelValue": (d) => r.value = d
    }, vue.toHandlers(r.on)), null, 16, ["modelValue", "onUpdate:modelValue"]))), 128);
  }
  const Ye = /* @__PURE__ */ w(al, [["render", rl]]), ul = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Ye
  }, Symbol.toStringTag, { value: "Module" })), dl = (e, ...s) => Object.fromEntries(
    s.filter((t) => t in e).map((t) => [t, e[t]])
  ), cl = (e, ...s) => Object.fromEntries(
    s.filter(({ key: t }) => t in e).map(({ key: t, newName: l = t }) => [l, e[t]])
  );
  const hl = {
    name: "vu-modal",
    data: () => ({
      model: "",
      mobileWidth: !1,
      resizeObs: {},
      pick: dl,
      pickNRename: cl
    }),
    emits: ["close", "cancel", "confirm"],
    mixins: [K],
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
      color: {
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
        this.showInput ? this.$refs.form.validate() && (this.$emit("confirm", this.model), this.isActive = !1, this.clear()) : (this.$emit("confirm", !0), this.isActive = !1);
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
    }
  }, gl = { key: 0 }, ml = ["innerHTML"], Ml = { key: 1 }, yl = {
    class: "vu-modal modal modal-root",
    style: { display: "block" }
  }, vl = { class: "modal-wrap" }, pl = { class: "modal-header" }, fl = { class: "modal-body" }, bl = ["innerHTML"], jl = { key: 1 }, _l = {
    key: 0,
    class: "modal-footer"
  }, wl = /* @__PURE__ */ vue.createElementVNode("div", { class: "modal-overlay in" }, null, -1);
  function Ll(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-input"), d = vue.resolveComponent("vu-form"), u = vue.resolveComponent("vu-mobile-dialog"), g = vue.resolveComponent("vu-btn");
    return t.keepRendered || e.innerShow ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", gl, [
      !t.noMobile && e.mobileWidth ? (vue.openBlock(), vue.createBlock(u, vue.mergeProps({ key: 0 }, {
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
        onClose: s[1] || (s[1] = (y) => i.cancel()),
        onConfirm: s[2] || (s[2] = (y) => i.confirm())
      }), {
        "mobile-dialog-header": vue.withCtx(() => [
          vue.renderSlot(e.$slots, "mobile-header")
        ]),
        default: vue.withCtx(() => [
          vue.renderSlot(e.$slots, "modal-body", {}, () => [
            t.rawContent ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              innerHTML: t.rawContent
            }, null, 8, ml)) : t.message ? (vue.openBlock(), vue.createElementBlock("p", Ml, vue.toDisplayString(t.message), 1)) : vue.createCommentVNode("", !0),
            t.showInput ? (vue.openBlock(), vue.createBlock(d, {
              key: 2,
              ref: "form"
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(r, {
                  label: t.label,
                  required: t.required,
                  helper: t.helper,
                  success: t.success,
                  placeholder: t.placeholder,
                  rules: t.rules,
                  modelValue: e.model,
                  "onUpdate:modelValue": s[0] || (s[0] = (y) => e.model = y)
                }, null, 8, ["label", "required", "helper", "success", "placeholder", "rules", "modelValue"])
              ]),
              _: 1
            }, 512)) : vue.createCommentVNode("", !0)
          ])
        ]),
        _: 3
      }, 16)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
        vue.createElementVNode("div", yl, [
          vue.createElementVNode("div", vl, [
            vue.createElementVNode("div", {
              class: "modal-content",
              onKeyup: [
                s[6] || (s[6] = vue.withKeys(() => {
                  t.keyboard && (!t.showInput || e.$refs.form.validate()) && i.confirm();
                }, ["enter"])),
                s[7] || (s[7] = vue.withKeys(() => {
                  t.keyboard && (t.showCancelButton ? i.cancel() : e.close());
                }, ["escape"]))
              ]
            }, [
              vue.createElementVNode("div", pl, [
                vue.renderSlot(e.$slots, "modal-header", {}, () => [
                  t.showCancelIcon ? (vue.openBlock(), vue.createElementBlock("span", {
                    key: 0,
                    onClick: s[3] || (s[3] = (y) => i.cancel(!0)),
                    class: "close fonticon fonticon-cancel",
                    title: ""
                  })) : vue.createCommentVNode("", !0),
                  vue.createElementVNode("h4", null, vue.toDisplayString(t.title), 1)
                ])
              ]),
              vue.createElementVNode("div", fl, [
                vue.renderSlot(e.$slots, "modal-body", {}, () => [
                  t.rawContent ? (vue.openBlock(), vue.createElementBlock("div", {
                    key: 0,
                    innerHTML: t.rawContent
                  }, null, 8, bl)) : t.message ? (vue.openBlock(), vue.createElementBlock("p", jl, vue.toDisplayString(t.message), 1)) : vue.createCommentVNode("", !0),
                  t.showInput ? (vue.openBlock(), vue.createBlock(d, {
                    key: 2,
                    ref: "form"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(r, {
                        label: t.label,
                        required: t.required,
                        helper: t.helper,
                        success: t.success,
                        placeholder: t.placeholder,
                        rules: t.rules,
                        modelValue: e.model,
                        "onUpdate:modelValue": s[4] || (s[4] = (y) => e.model = y)
                      }, null, 8, ["label", "required", "helper", "success", "placeholder", "rules", "modelValue"])
                    ]),
                    _: 1
                  }, 512)) : vue.createCommentVNode("", !0)
                ])
              ]),
              t.showFooter ? (vue.openBlock(), vue.createElementBlock("div", _l, [
                vue.renderSlot(e.$slots, "modal-footer", {}, () => [
                  vue.createVNode(g, {
                    color: "primary",
                    onClick: i.confirm
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode(vue.toDisplayString(t.okLabel), 1)
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  t.showCancelButton ? (vue.openBlock(), vue.createBlock(g, {
                    key: 0,
                    color: "default",
                    onClick: s[5] || (s[5] = (y) => i.cancel())
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode(vue.toDisplayString(t.cancelLabel), 1)
                    ]),
                    _: 1
                  })) : vue.createCommentVNode("", !0)
                ])
              ])) : vue.createCommentVNode("", !0)
            ], 32)
          ])
        ]),
        wl
      ], 64))
    ], 512)), [
      [vue.vShow, e.innerShow]
    ]) : vue.createCommentVNode("", !0);
  }
  const Qe = /* @__PURE__ */ w(hl, [["render", Ll]]), Il = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Qe
  }, Symbol.toStringTag, { value: "Module" }));
  const Nl = {
    name: "vu-multiple-select",
    inject: {
      vuMultipleSelectLabels: {
        default: () => ({
          noResults: "No results."
        })
      },
      vuInputComposition: {
        default: !1
      }
    },
    mixins: [x, S, V, P, ge, A],
    props: {
      modelValue: {
        type: [Object, String, Number, Array, Boolean, Date],
        default: () => ""
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
        required: !1
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
      noLocalFiltering: {
        type: Boolean,
        default: !1
      }
    },
    emits: ["search"],
    data: () => ({
      open: !1,
      positioned: !0,
      intxObs: null,
      search: "",
      bottom: 40,
      top: !1,
      resizeObs: null,
      uid: G()
    }),
    created() {
      this.resizeObs = new ResizeObserver((e) => {
        this.bottom = e[0].contentRect.height + 4;
      });
    },
    mounted() {
      this.$refs.searchfield && this.resizeObs.observe(this.$refs.searchfield), this.target && (this.intxObs = new IntersectionObserver((e) => {
        this.intxObs.unobserve(this.$refs.dropdown);
        const s = this.target.getBoundingClientRect(), t = this.$refs.dropdown.getBoundingClientRect();
        s.bottom < t.bottom && (this.top = !0), this.positioned = !0;
      }, {
        root: this.target,
        threshold: 1
      }));
    },
    watch: {
      search(e) {
        this.$emit("search", e), e && !this.open && this.openAndIntersect();
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
      }
    },
    methods: {
      toggle(e) {
        if (e.disabled)
          return;
        this.search = "";
        const s = this.value || [], t = s.findIndex((l) => l.value === e.value);
        if (this.values.includes(e.value))
          if (this.maxSelectable === 1)
            this.$emit("update:modelValue", []);
          else {
            const l = s.slice();
            l.splice(t, 1), this.$emit("update:modelValue", l);
          }
        else
          this.maxSelectable === 1 ? (this.$emit("update:modelValue", [e]), this.close()) : this.$emit("update:modelValue", s.concat([e]));
      },
      getOption(e) {
        return this.options.find((s) => s.value === e) || {};
      },
      close() {
        this.open = !1, this.top = !1;
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
      }
    }
  }, Cl = {
    key: 0,
    class: "control-label"
  }, Dl = {
    key: 0,
    class: "label-field-required"
  }, Tl = {
    key: 1,
    style: { "line-height": "30px" }
  }, kl = ["placeholder"], zl = { style: { "padding-top": "15px" } }, Sl = { class: "message" }, Ol = { class: "multiple-select__no-results" }, xl = {
    key: 1,
    class: "form-control-helper-text"
  };
  function Pl(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-user-picture"), d = vue.resolveComponent("vu-icon-btn"), u = vue.resolveComponent("vu-badge"), g = vue.resolveComponent("vu-select-options"), y = vue.resolveComponent("vu-spinner"), f = vue.resolveComponent("vu-scroller"), k = vue.resolveDirective("click-outside");
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["vu-multiple-select form-group", e.classes])
    }, [
      e.label.length ? (vue.openBlock(), vue.createElementBlock("label", Cl, [
        vue.createTextVNode(vue.toDisplayString(e.label), 1),
        e.required ? (vue.openBlock(), vue.createElementBlock("span", Dl, " *")) : vue.createCommentVNode("", !0)
      ])) : vue.createCommentVNode("", !0),
      vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
        ref: "searchfield",
        class: vue.normalizeClass([
          "select",
          "select-autocomplete",
          {
            "dropdown-visible": e.open,
            "select-disabled": e.disabled,
            "single-select": t.maxSelectable === 1
          }
        ])
      }, [
        vue.createElementVNode("div", {
          onClick: s[5] || (s[5] = (I) => {
            t.maxSelectable === 1 && i.values.length || (e.$refs.input.focus(), i.openAndIntersect());
          }),
          class: vue.normalizeClass(["autocomplete-searchbox", {
            "autocomplete-searchbox-active": e.open,
            disabled: e.disabled,
            "autocomplete-searchbox--user": t.user,
            "autocomplete-searchbox--user-big-badges": t.user && t.userBigBadges
          }])
        }, [
          t.user ? (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList(e.value, (I) => (vue.openBlock(), vue.createElementBlock("div", {
            key: `${e.uid}-tag-${I}`,
            class: "vu-user-badge"
          }, [
            vue.createVNode(r, {
              id: I.value,
              src: I.src,
              size: "tiny"
            }, null, 8, ["id", "src"]),
            vue.createElementVNode("span", null, vue.toDisplayString(I.label), 1),
            vue.createVNode(d, {
              class: "vu-user-badge__close",
              icon: "close",
              size: "icon-smaller",
              onClick: (U) => i.toggle(I)
            }, null, 8, ["onClick"])
          ]))), 128)) : (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList(e.value, (I) => (vue.openBlock(), vue.createElementBlock("span", {
            key: `${e.uid}-tag-${I}`,
            onClick: s[1] || (s[1] = (...U) => i.toggle && i.toggle(...U))
          }, [
            vue.renderSlot(e.$slots, "badge", { value: I }, () => [
              t.maxSelectable !== 1 ? (vue.openBlock(), vue.createBlock(u, {
                key: 0,
                closable: "",
                onClick: s[0] || (s[0] = vue.withModifiers(() => {
                }, ["stop"])),
                onClose: (U) => i.toggle(I)
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(vue.toDisplayString(I.label), 1)
                ]),
                _: 2
              }, 1032, ["onClose"])) : (vue.openBlock(), vue.createElementBlock("span", Tl, vue.toDisplayString(I.label), 1))
            ], !0)
          ]))), 128)),
          i.values.length < t.maxSelectable ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
            key: 2,
            ref: "input",
            "onUpdate:modelValue": s[2] || (s[2] = (I) => e.search = I),
            type: "text",
            onInput: s[3] || (s[3] = ({ target: I }) => {
              i.vuInputComposition || (I.composing = !1);
            }),
            placeholder: i.values.length && t.shortPlaceholder ? t.shortPlaceholder : e.placeholder,
            class: "autocomplete-input",
            onClick: s[4] || (s[4] = (I) => {
              i.openAndIntersect();
            })
          }, null, 40, kl)), [
            [vue.vModelText, e.search]
          ]) : vue.createCommentVNode("", !0)
        ], 2),
        t.maxSelectable === 1 && !t.user && e.value && e.value.length ? (vue.openBlock(), vue.createBlock(d, {
          key: 0,
          icon: "clear",
          class: "select__clear-icon",
          onClick: s[6] || (s[6] = vue.withModifiers((I) => i.toggle(e.value[0]), ["stop"]))
        })) : vue.createCommentVNode("", !0),
        e.open && i.searchLengthMet ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 1,
          ref: "dropdown",
          class: vue.normalizeClass(["select-dropdown", [{ "select-dropdown--no-results": i.noResults, "select-dropdown--dropup": e.top }, e.contentClass]]),
          style: vue.normalizeStyle([
            `height: ${i.dropdownHeight}${i.dropdownHeight !== "auto" ? "px" : ""}`,
            e.top ? `bottom: ${e.bottom}px` : "",
            e.positioned ? "" : "opacity: 0",
            e.contentStyle
          ])
        }, [
          vue.createVNode(f, { alwaysShow: "" }, {
            default: vue.withCtx(() => [
              vue.withDirectives(vue.createVNode(g, {
                multiple: "",
                user: t.user,
                selected: e.value,
                options: i.innerOptions,
                onClickItem: i.toggle
              }, {
                default: vue.withCtx(({ item: I }) => [
                  vue.renderSlot(e.$slots, "default", { item: I }, void 0, !0)
                ]),
                _: 3
              }, 8, ["user", "selected", "options", "onClickItem"]), [
                [vue.vShow, i.searchLengthMet && !e.loading]
              ]),
              e.loading ? vue.renderSlot(e.$slots, "loading", { key: 0 }, () => [
                vue.createElementVNode("ul", zl, [
                  vue.createElementVNode("li", Sl, [
                    vue.createVNode(y, { show: "" })
                  ])
                ])
              ], !0) : vue.createCommentVNode("", !0),
              !e.loading && i.noResults ? vue.renderSlot(e.$slots, "noResults", { key: 1 }, () => [
                vue.createElementVNode("ul", Ol, [
                  vue.createElementVNode("li", null, vue.toDisplayString(i.vuMultipleSelectLabels.noResults), 1)
                ])
              ], !0) : vue.createCommentVNode("", !0)
            ]),
            _: 3
          })
        ], 6)) : vue.createCommentVNode("", !0)
      ], 2)), [
        [k, function() {
          i.close(), e.search = "";
        }]
      ]),
      (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.errorBucket, (I, U) => (vue.openBlock(), vue.createElementBlock("span", {
        key: `${U}-error-${I}`,
        style: { display: "block" },
        class: "form-control-error-text"
      }, vue.toDisplayString(I), 1))), 128)),
      e.helper.length ? (vue.openBlock(), vue.createElementBlock("span", xl, vue.toDisplayString(e.helper), 1)) : vue.createCommentVNode("", !0)
    ], 2);
  }
  const Al = /* @__PURE__ */ w(Nl, [["render", Pl], ["__scopeId", "data-v-984a4a9d"]]), El = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Al
  }, Symbol.toStringTag, { value: "Module" }));
  const Bl = {
    name: "vu-progress-circular",
    mixins: [F],
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
        required: !1
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
  }, Ul = { class: "vu-progress-circular" }, Zl = { class: "vu-progress-circular__content" };
  function Gl(e, s, t, l, a, i) {
    return vue.openBlock(), vue.createElementBlock("div", Ul, [
      vue.createElementVNode("div", {
        class: vue.normalizeClass(["vu-progress-circular__circle", t.hexColor ? "" : `vu-progress-circular--${t.color}`]),
        style: vue.normalizeStyle({
          background: `conic-gradient( currentcolor ${a.progressAngle}deg, ${t.unfilledColor} ${a.progressAngle}deg)`,
          width: i.radiusPx,
          height: i.radiusPx,
          color: t.hexColor !== void 0 && t.hexColor,
          "-webkit-mask": `radial-gradient(${t.radius * (2 / 5)}px, #0000 98%, #000)`
        })
      }, [
        i.renderHatch ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(["vu-progress-circular__hatch-container", { "vu-progress-circular__hatch-clip": a.progressAngle < 180 }])
        }, [
          vue.createElementVNode("div", {
            class: "vu-progress-circular__hatch",
            style: vue.normalizeStyle(`transform: rotate(${a.progressAngle}deg)`)
          }, null, 4)
        ], 2)) : vue.createCommentVNode("", !0)
      ], 6),
      vue.createElementVNode("div", Zl, [
        a.completedView && this.$slots.complete ? vue.renderSlot(e.$slots, "complete", { key: 0 }, void 0, !0) : vue.renderSlot(e.$slots, "default", { key: 1 }, () => [
          vue.createVNode(vue.Transition, {
            name: "fade",
            mode: "out-in"
          }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", {
                key: "uncomplete-view",
                style: vue.normalizeStyle({ fontSize: `${t.radius / 5}px` })
              }, vue.toDisplayString(Math.round(a.progressAngle / 360 * 100)) + "%", 5)
            ]),
            _: 1
          })
        ], !0)
      ])
    ]);
  }
  const Yl = /* @__PURE__ */ w(Bl, [["render", Gl], ["__scopeId", "data-v-8c2ebdc7"]]), Ql = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Yl
  }, Symbol.toStringTag, { value: "Module" }));
  const Rl = {
    name: "vu-range",
    mixins: [x, se, S, P, A],
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
        required: !1
      }
    },
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
          width: `${(this.uppervalue - this.min - (this.lowervalue - this.min)) / (this.max - this.min) * 100}%`,
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
        let t, l;
        e === "lower" ? (l = Math.min(s, this.uppervalue), t = Math.max(s, this.uppervalue), l > t && (t = Math.min(t + this.step, this.max))) : (l = Math.min(s, this.lowervalue), t = Math.max(s, this.lowervalue), l > t && (l = Math.max(l - this.step, this.min))), this.lowervalue = l, this.uppervalue = t, this.$emit("update:modelValue", [this.lowervalue, this.uppervalue]);
      }
    }
  }, $l = {
    key: 0,
    class: "control-label"
  }, Vl = {
    key: 0,
    class: "label-field-required"
  }, Wl = ["disabled", "value", "min", "max", "step"], Hl = ["disabled", "value", "min", "max", "step"], Fl = { class: "vu-range__grey-bar" }, Kl = {
    key: 0,
    class: "vu-range__labels-container"
  }, Jl = { class: "vu-range__left vu-range__left-label" }, Xl = { class: "vu-range__right vu-range__right-label" }, ql = {
    key: 1,
    class: "form-control-helper-text"
  };
  function ea(e, s, t, l, a, i) {
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["form-group", e.classes])
    }, [
      e.label.length ? (vue.openBlock(), vue.createElementBlock("label", $l, [
        vue.createTextVNode(vue.toDisplayString(e.label), 1),
        e.required ? (vue.openBlock(), vue.createElementBlock("span", Vl, " *")) : vue.createCommentVNode("", !0)
      ])) : vue.createCommentVNode("", !0),
      vue.createElementVNode("div", {
        class: vue.normalizeClass(["vu-range", { disabled: e.disabled }])
      }, [
        vue.createElementVNode("div", {
          onMouseup: s[2] || (s[2] = (...r) => i.commit && i.commit(...r)),
          class: "vu-range__inputs-container"
        }, [
          vue.createElementVNode("input", {
            disabled: e.disabled,
            onInput: s[0] || (s[0] = (r) => i.update("lower", parseFloat(r.target.value))),
            value: a.lowervalue,
            min: e.min,
            max: e.max,
            step: t.step,
            class: "slider vu-range__left",
            type: "range"
          }, null, 40, Wl),
          vue.createElementVNode("input", {
            disabled: e.disabled,
            onInput: s[1] || (s[1] = (r) => i.update("upper", parseFloat(r.target.value))),
            value: a.uppervalue,
            min: e.min,
            max: e.max,
            step: t.step,
            class: "slider vu-range__right",
            type: "range"
          }, null, 40, Hl),
          vue.createElementVNode("div", Fl, [
            vue.createElementVNode("div", {
              class: "vu-range__blue-bar",
              style: vue.normalizeStyle(i.computedStyles)
            }, null, 4)
          ])
        ], 32),
        t.showLabels ? (vue.openBlock(), vue.createElementBlock("div", Kl, [
          vue.createElementVNode("div", Jl, vue.toDisplayString(i.minLabel), 1),
          vue.createElementVNode("div", Xl, vue.toDisplayString(i.maxLabel), 1),
          a.lowervalue !== e.min && a.uppervalue !== a.lowervalue ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "vu-range__lower-label",
            style: vue.normalizeStyle("left: " + (a.lowervalue - e.min) / (e.max - e.min) * 100 + "%")
          }, vue.toDisplayString(i.lowerLabel), 5)) : vue.createCommentVNode("", !0),
          a.uppervalue !== e.max ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 1,
            class: "vu-range__upper-label",
            style: vue.normalizeStyle("left: " + (a.uppervalue - e.min) / (e.max - e.min) * 100 + "%")
          }, vue.toDisplayString(i.upperLabel), 5)) : vue.createCommentVNode("", !0)
        ])) : vue.createCommentVNode("", !0)
      ], 2),
      (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.errorBucket, (r, d) => (vue.openBlock(), vue.createElementBlock("span", {
        key: `${d}-error-${r}`,
        style: { display: "block" },
        class: "form-control-error-text"
      }, vue.toDisplayString(r), 1))), 128)),
      e.helper.length ? (vue.openBlock(), vue.createElementBlock("span", ql, vue.toDisplayString(e.helper), 1)) : vue.createCommentVNode("", !0)
    ], 2);
  }
  const ta = /* @__PURE__ */ w(Rl, [["render", ea], ["__scopeId", "data-v-fc6d46b2"]]), sa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: ta
  }, Symbol.toStringTag, { value: "Module" }));
  const ia = {
    name: "vu-scroller",
    props: {
      reverse: {
        type: Boolean,
        default: !1
      },
      infinite: {
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
    data() {
      return {
        lazyKeyIndex: 0,
        lazyKeyIndex2: 0,
        wait: !1
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
      this.$emit("mounted");
    }
  }, na = { class: "vu-scroll-container__inner" };
  function oa(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-spinner"), d = vue.resolveComponent("vu-lazy");
    return vue.openBlock(), vue.createElementBlock("div", {
      ref: "scroll-container",
      class: vue.normalizeClass([{ "vu-scroll-container--reverse": t.reverse, "vu-scroll-container--horizontal": t.horizontal, "vu-scroll-container--always-show": t.alwaysShow }, "vu-scroll-container"])
    }, [
      vue.createElementVNode("div", na, [
        t.dataBefore ? (vue.openBlock(), vue.createBlock(d, {
          key: 0,
          onIntersect: s[0] || (s[0] = (u) => {
            e.$emit("loading-before"), e.$emit("loading", !0);
          }),
          options: i.options,
          height: t.infiniteBeforeHeight || t.infiniteHeight,
          class: "vu-scroll__lazy vu-scroll__lazy-top"
        }, {
          default: vue.withCtx(() => [
            vue.renderSlot(e.$slots, "loadingBefore", {}, () => [
              vue.createVNode(r, { text: t.loadingText }, null, 8, ["text"])
            ], !0)
          ]),
          _: 3
        }, 8, ["options", "height"])) : vue.createCommentVNode("", !0),
        vue.renderSlot(e.$slots, "default", {}, void 0, !0),
        t.infinite || t.dataAfter ? (vue.openBlock(), vue.createBlock(d, {
          key: 1,
          onIntersect: s[1] || (s[1] = (u) => e.$emit("loading")),
          options: i.options,
          height: t.infiniteHeight,
          class: "vu-scroll__lazy vu-scroll__lazy-bottom"
        }, {
          default: vue.withCtx(() => [
            vue.renderSlot(e.$slots, "loading", {}, () => [
              vue.createVNode(r, { text: t.loadingText }, null, 8, ["text"])
            ], !0)
          ]),
          _: 3
        }, 8, ["options", "height"])) : vue.createCommentVNode("", !0)
      ])
    ], 2);
  }
  const la = /* @__PURE__ */ w(ia, [["render", oa], ["__scopeId", "data-v-30ee64ee"]]), aa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: la
  }, Symbol.toStringTag, { value: "Module" }));
  const ra = {
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
      zIndex: {
        type: Number,
        required: !1
      }
    },
    data: () => ({
      uuidv4: G
    })
  }, ua = ["disabled", "onClick"], da = {
    key: 0,
    class: "flex items-center"
  }, ca = { class: "option__text" }, ha = { class: "option__text" };
  function ga(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-user-picture"), d = vue.resolveComponent("vu-icon");
    return vue.openBlock(), vue.createElementBlock("ul", {
      class: vue.normalizeClass(["vu-select-options", { "select-options--multiple": t.multiple, "select-options--user": t.user }])
    }, [
      (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(t.options, (u) => (vue.openBlock(), vue.createElementBlock("li", {
        key: `${u.id || e.uuidv4()}`,
        class: vue.normalizeClass({ "option--selected": u.selected || t.selected.includes(u) }),
        disabled: u.disabled,
        onClick: (g) => e.$emit("click-item", u)
      }, [
        t.user ? (vue.openBlock(), vue.createElementBlock("div", da, [
          vue.createVNode(r, {
            size: "small",
            id: u.value,
            src: u.src
          }, null, 8, ["id", "src"]),
          vue.createElementVNode("span", ca, vue.toDisplayString(u.text || u.label), 1)
        ])) : vue.renderSlot(e.$slots, "default", {
          key: 1,
          item: u
        }, () => [
          u.fonticon ? (vue.openBlock(), vue.createBlock(d, {
            key: 0,
            icon: u.fonticon
          }, null, 8, ["icon"])) : vue.createCommentVNode("", !0),
          vue.createElementVNode("span", ha, vue.toDisplayString(u.text || u.label), 1)
        ], !0)
      ], 10, ua))), 128))
    ], 2);
  }
  const ma = /* @__PURE__ */ w(ra, [["render", ga], ["__scopeId", "data-v-43f43f3f"]]), Ma = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: ma
  }, Symbol.toStringTag, { value: "Module" }));
  const ya = {
    name: "vu-select",
    inheritAttrs: !1,
    mixins: [x, Be, S, P, A],
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
      }
    },
    data: () => ({
      open: !1,
      focused: !1,
      search: "",
      uid: G()
    }),
    watch: {
      value() {
        this.search = this.selected.label;
      }
    },
    created() {
      this.search = this.value && this.selected.label || this.value;
    },
    computed: {
      innerOptions() {
        return this.autocomplete ? this.options.filter((e) => e.label.toLowerCase().includes(this.search.toLowerCase()) || e.value.toLowerCase().includes(this.search.toLowerCase())) : this.options;
      },
      selected() {
        return this.options.find((e) => e.value === this.value) || {
          label: this.placeholder
        };
      },
      groupedOptions() {
        return this.grouped ? this.options.reduce((e, s) => (e[s.group] || (e[s.group] = []), e[s.group].push(s), e), {}) : null;
      },
      internMaxVisible() {
        return this.maxVisible > this.options.length ? this.options.length : this.maxVisible;
      }
    },
    methods: {
      innerSelectKeydown(e) {
        switch (e.code) {
          case "Space":
          case "Enter":
          case "NumpadEnter":
            this.open = !this.open, e.preventDefault(), e.stopPropagation();
            break;
          case "Escape":
            this.open = !1, e.preventDefault(), e.stopPropagation();
            break;
        }
      },
      blur() {
        this.focused = !1, this.open = !1;
      }
    }
  }, va = {
    key: 0,
    class: "control-label"
  }, pa = {
    key: 0,
    class: "label-field-required"
  }, fa = ["disabled", "placeholder"], ba = ["disabled"], ja = {
    key: 3,
    class: "select-handle"
  }, _a = {
    key: 4,
    class: "select-choices form-control"
  }, wa = { class: "select-choice" }, La = { class: "select-results" }, Ia = ["onClick"], Na = { class: "result-group-label" }, Ca = { class: "result-group-sub" }, Da = ["onClick"], Ta = {
    key: 1,
    class: "form-control-helper-text"
  };
  function ka(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-icon-btn"), d = vue.resolveDirective("click-outside");
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["form-group", e.classes])
    }, [
      e.label.length ? (vue.openBlock(), vue.createElementBlock("label", va, [
        vue.createTextVNode(vue.toDisplayString(e.label), 1),
        e.required ? (vue.openBlock(), vue.createElementBlock("span", pa, " *")) : vue.createCommentVNode("", !0)
      ])) : vue.createCommentVNode("", !0),
      vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
        onClick: s[6] || (s[6] = (u) => {
          e.open = !e.open && !e.disabled, e.search = e.value && i.selected.label || e.value;
        }),
        class: vue.normalizeClass(["select", {
          "select-placeholder": !t.autocomplete,
          "select-not-chosen": !t.autocomplete && !e.value,
          "dropdown-visible": e.open,
          "select-disabled": e.disabled,
          "select-autocomplete": t.autocomplete,
          "select-clearable": e.clearable,
          "select-focus": e.focused
        }])
      }, [
        t.autocomplete ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
          key: 0,
          disabled: e.disabled,
          placeholder: i.selected.label,
          class: "form-control",
          "onUpdate:modelValue": s[0] || (s[0] = (u) => e.search = u)
        }, null, 8, fa)), [
          [vue.vModelText, e.search]
        ]) : vue.createCommentVNode("", !0),
        e.value && (t.autocomplete || e.clearable) ? (vue.openBlock(), vue.createBlock(r, {
          key: 1,
          icon: "clear",
          class: vue.normalizeClass(["select__clear-icon", { "select--has-handle": t.autocomplete }]),
          onClick: s[1] || (s[1] = (u) => {
            e.$emit("update:modelValue", ""), e.search = "";
          })
        }, null, 8, ["class"])) : vue.createCommentVNode("", !0),
        !t.autocomplete && e.value ? (vue.openBlock(), vue.createElementBlock("select", {
          key: 2,
          class: "form-control select-hidden",
          disabled: e.disabled,
          onFocus: s[2] || (s[2] = (u) => e.focused = !0),
          onBlur: s[3] || (s[3] = (u) => i.blur()),
          onKeydown: s[4] || (s[4] = (u) => i.innerSelectKeydown(u))
        }, null, 40, ba)) : vue.createCommentVNode("", !0),
        t.autocomplete ? vue.createCommentVNode("", !0) : (vue.openBlock(), vue.createElementBlock("div", ja)),
        t.autocomplete ? vue.createCommentVNode("", !0) : (vue.openBlock(), vue.createElementBlock("ul", _a, [
          vue.createElementVNode("li", wa, vue.toDisplayString(i.selected.label), 1)
        ])),
        e.open ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 5,
          class: "select-dropdown",
          style: vue.normalizeStyle(`height: ${38 * (i.innerOptions.length + (!t.autocomplete && !t.hidePlaceholderOption ? 1 : 0))}px; max-height: ${38 * (i.internMaxVisible + 1)}px;`)
        }, [
          vue.createElementVNode("ul", La, [
            !t.autocomplete && !t.hidePlaceholderOption ? (vue.openBlock(), vue.createElementBlock("li", {
              key: 0,
              class: "result-option result-option-placeholder",
              onClick: s[5] || (s[5] = (u) => {
                e.$emit("update:modelValue", ""), e.search = "";
              })
            }, vue.toDisplayString(e.placeholder), 1)) : vue.createCommentVNode("", !0),
            t.grouped ? (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, { key: 2 }, vue.renderList(i.groupedOptions, (u, g) => (vue.openBlock(), vue.createElementBlock("li", {
              key: `${e.uid}-${u.group}`,
              class: "result-group"
            }, [
              vue.createElementVNode("span", Na, vue.toDisplayString(g), 1),
              vue.createElementVNode("ul", Ca, [
                (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(u, (y) => (vue.openBlock(), vue.createElementBlock("li", {
                  key: `${e.uid}-${y.value}`,
                  class: vue.normalizeClass([{
                    "result-option-disabled": y.disabled,
                    "result-option-selected": y.value === e.value
                  }, "result-option"]),
                  onClick: (f) => y.disabled ? null : e.$emit("update:modelValue", y.value)
                }, vue.toDisplayString(y.label), 11, Da))), 128))
              ])
            ]))), 128)) : (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList(i.innerOptions, (u) => (vue.openBlock(), vue.createElementBlock("li", {
              key: `${e.uid}-${u.value || u.label}`,
              class: vue.normalizeClass([{
                "result-option-disabled": u.disabled,
                "result-option-selected": u.value === e.value
              }, "result-option"]),
              onClick: (g) => {
                u.disabled || e.$emit("update:modelValue", u.value), e.search = u.label;
              }
            }, vue.toDisplayString(u.label), 11, Ia))), 128))
          ])
        ], 4)) : vue.createCommentVNode("", !0)
      ], 2)), [
        [d, function() {
          e.open = !1, e.search = e.value && i.selected.label || e.value;
        }]
      ]),
      (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.errorBucket, (u, g) => (vue.openBlock(), vue.createElementBlock("span", {
        key: `${g}-error-${u}`,
        style: { display: "block" },
        class: "form-control-error-text"
      }, vue.toDisplayString(u), 1))), 128)),
      e.helper.length ? (vue.openBlock(), vue.createElementBlock("span", Ta, vue.toDisplayString(e.helper), 1)) : vue.createCommentVNode("", !0)
    ], 2);
  }
  const za = /* @__PURE__ */ w(ya, [["render", ka], ["__scopeId", "data-v-3c8ccd67"]]), Sa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: za
  }, Symbol.toStringTag, { value: "Module" }));
  const Oa = {
    name: "vu-single-checkbox",
    mixins: [P, A, S],
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
      group: {
        type: String,
        required: !1
      },
      // Required by radio
      value: {
        type: String,
        required: !1
      },
      // Excludes radio
      switch: {
        type: Boolean,
        required: !1
      },
      id: {
        type: [String, Number],
        required: !1
      }
    },
    data: () => ({ uid: G() }),
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
    }
  }, xa = ["type", "checked", "name", "value", "id", "disabled"], Pa = ["for"], Aa = { class: "vu-single-checkbox__inner-span" }, Ea = {
    key: 0,
    class: "vu-single-checkbox__extra-content"
  };
  function Ba(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-icon");
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["vu-single-checkbox", i.topClasses])
    }, [
      vue.createElementVNode("div", {
        class: vue.normalizeClass(["toggle", i.internalClasses])
      }, [
        vue.createElementVNode("input", vue.mergeProps({
          class: "vu-single-checkbox__input",
          type: t.radio ? "radio" : "checkbox",
          checked: t.radio ? t.group === t.modelValue : t.modelValue
        }, e.$attrs, {
          name: t.radio ? t.group : void 0,
          value: t.radio ? t.value : void 0,
          id: e.$attrs[t.id] || `${e.uid}`,
          disabled: e.disabled,
          onClick: s[0] || (s[0] = (...d) => i.input && i.input(...d))
        }), null, 16, xa),
        t.standalone ? vue.createCommentVNode("", !0) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
          vue.createElementVNode("label", {
            class: "control-label vu-single-checkbox__label",
            for: e.$attrs[t.id] || `${e.uid}`
          }, [
            t.icon ? (vue.openBlock(), vue.createBlock(r, {
              key: 0,
              icon: t.icon
            }, null, 8, ["icon"])) : vue.createCommentVNode("", !0),
            vue.createElementVNode("span", Aa, vue.toDisplayString(t.label), 1)
          ], 8, Pa),
          vue.renderSlot(e.$slots, "label-prepend", {}, void 0, !0)
        ], 64))
      ], 2),
      i.hasExtraContent ? (vue.openBlock(), vue.createElementBlock("div", Ea, [
        vue.renderSlot(e.$slots, "default", {}, void 0, !0)
      ])) : vue.createCommentVNode("", !0)
    ], 2);
  }
  const Ua = /* @__PURE__ */ w(Oa, [["render", Ba], ["__scopeId", "data-v-bbb3e60c"]]), Za = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Ua
  }, Symbol.toStringTag, { value: "Module" }));
  const Ga = {
    name: "vu-slider",
    mixins: [x, S, P, A],
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
        default: 0
      },
      max: {
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
  }, Ya = {
    key: 0,
    class: "control-label"
  }, Qa = {
    key: 0,
    class: "label-field-required"
  }, Ra = ["disabled", "value", "min", "max", "step"], $a = {
    key: 0,
    class: "vu-slider__steps"
  }, Va = {
    key: 1,
    class: "form-control-helper-text"
  };
  function Wa(e, s, t, l, a, i) {
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["form-group", e.classes])
    }, [
      e.label.length ? (vue.openBlock(), vue.createElementBlock("label", Ya, [
        vue.createTextVNode(vue.toDisplayString(e.label), 1),
        e.required ? (vue.openBlock(), vue.createElementBlock("span", Qa, " *")) : vue.createCommentVNode("", !0)
      ])) : vue.createCommentVNode("", !0),
      vue.createElementVNode("div", {
        class: vue.normalizeClass(["vu-slider", { disabled: e.disabled }])
      }, [
        vue.createElementVNode("div", {
          onMouseup: s[1] || (s[1] = (...r) => i.commit && i.commit(...r)),
          class: "vu-slider__container"
        }, [
          vue.createElementVNode("div", {
            ref: "leftLabel",
            class: "vu-slider__left vu-slider__label"
          }, vue.toDisplayString(t.showLabels ? t.labels.min : t.min), 513),
          vue.createElementVNode("div", {
            ref: "rightLabel",
            class: "vu-slider__right vu-slider__label"
          }, vue.toDisplayString(t.showLabels ? t.labels.max : t.max), 513),
          vue.createElementVNode("input", {
            class: "slider vu-slider__left",
            type: "range",
            disabled: e.disabled,
            value: e.innerValue,
            min: t.min,
            max: t.max,
            step: t.step,
            style: vue.normalizeStyle(t.labelsBeneath ? {} : i.computedStyle),
            onInput: s[0] || (s[0] = (r) => i.update(parseFloat(r.target.value)))
          }, null, 44, Ra),
          vue.createElementVNode("div", {
            class: "vu-slider__grey-bar",
            style: vue.normalizeStyle({ left: i.labelsMargin, right: i.labelsMargin })
          }, [
            vue.createElementVNode("div", {
              class: "vu-slider__blue-bar vu-slider__blue-bar--left",
              style: vue.normalizeStyle(i.innerBlueBarStyle)
            }, null, 4)
          ], 4)
        ], 32),
        t.stepped ? (vue.openBlock(), vue.createElementBlock("div", $a, [
          (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(i.steps, (r, d) => (vue.openBlock(), vue.createElementBlock("div", {
            key: d,
            class: "vu-slider__step",
            style: vue.normalizeStyle(r.style)
          }, null, 4))), 128))
        ])) : vue.createCommentVNode("", !0)
      ], 2),
      (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.errorBucket, (r, d) => (vue.openBlock(), vue.createElementBlock("span", {
        key: `${d}-error-${r}`,
        style: { display: "block" },
        class: "form-control-error-text"
      }, vue.toDisplayString(r), 1))), 128)),
      e.helper.length ? (vue.openBlock(), vue.createElementBlock("span", Va, vue.toDisplayString(e.helper), 1)) : vue.createCommentVNode("", !0)
    ], 2);
  }
  const Ha = /* @__PURE__ */ w(Ga, [["render", Wa], ["__scopeId", "data-v-dbb6fe79"]]), Fa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Ha
  }, Symbol.toStringTag, { value: "Module" })), Ka = {
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
  }, Ja = { class: "mask-wrapper" }, Xa = { class: "mask-content" }, qa = /* @__PURE__ */ vue.createStaticVNode('<div class="spinner spinning fade in"><span class="spinner-bar"></span><span class="spinner-bar spinner-bar1"></span><span class="spinner-bar spinner-bar2"></span><span class="spinner-bar spinner-bar3"></span></div>', 1), er = {
    key: 0,
    class: "text"
  };
  function tr(e, s, t, l, a, i) {
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass({ mask: t.mask })
    }, [
      vue.createElementVNode("div", Ja, [
        vue.createElementVNode("div", Xa, [
          qa,
          t.text.length ? (vue.openBlock(), vue.createElementBlock("span", er, vue.toDisplayString(t.text), 1)) : vue.createCommentVNode("", !0)
        ])
      ])
    ], 2);
  }
  const Re = /* @__PURE__ */ w(Ka, [["render", tr]]), sr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Re
  }, Symbol.toStringTag, { value: "Module" }));
  const ir = {
    name: "vu-textarea",
    mixins: [x, S, P, A],
    props: {
      rows: {
        type: [Number, String],
        default: () => 2
      }
    }
  }, nr = {
    key: 0,
    class: "control-label"
  }, or = {
    key: 0,
    class: "label-field-required"
  }, lr = ["value", "placeholder", "disabled", "rows"], ar = {
    key: 1,
    class: "form-control-helper-text"
  };
  function rr(e, s, t, l, a, i) {
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["form-group", e.classes])
    }, [
      e.label.length ? (vue.openBlock(), vue.createElementBlock("label", nr, [
        vue.createTextVNode(vue.toDisplayString(e.label), 1),
        e.required ? (vue.openBlock(), vue.createElementBlock("span", or, " *")) : vue.createCommentVNode("", !0)
      ])) : vue.createCommentVNode("", !0),
      vue.createElementVNode("textarea", {
        value: e.value,
        placeholder: e.placeholder,
        disabled: e.disabled,
        rows: t.rows,
        class: "form-control",
        onInput: s[0] || (s[0] = (r) => e.$emit("update:modelValue", r.target.value))
      }, null, 40, lr),
      (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.errorBucket, (r, d) => (vue.openBlock(), vue.createElementBlock("p", {
        key: `${d}-error-${r}`,
        style: { display: "block" },
        class: "form-control-error-text"
      }, vue.toDisplayString(r), 1))), 128)),
      e.helper.length ? (vue.openBlock(), vue.createElementBlock("span", ar, vue.toDisplayString(e.helper), 1)) : vue.createCommentVNode("", !0)
    ], 2);
  }
  const ur = /* @__PURE__ */ w(ir, [["render", rr], ["__scopeId", "data-v-7046c99f"]]), dr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: ur
  }, Symbol.toStringTag, { value: "Module" }));
  const cr = {
    name: "vu-time-picker",
    inheritAttrs: !1,
    inject: {
      vuInputComposition: {
        default: !1
      }
    },
    mixins: [x, P, S, A],
    props: {
      useNativeInput: {
        type: Boolean,
        required: !1,
        default: !1
      }
    },
    data() {
      return {
        minutes: "00",
        hours: "00",
        isPopoverOpen: !1
      };
    },
    computed: {
      isMobileOrTablet() {
        return window ? !!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) : !1;
      }
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
    }
  }, hr = {
    key: 0,
    class: "control-label"
  }, gr = {
    key: 0,
    class: "label-field-required"
  }, mr = { key: 1 }, Mr = ["value", "placeholder", "disabled"], yr = { class: "vu-time-picker__display form-control" }, vr = { class: "vu-time-picker__body" }, pr = { class: "vu-time-picker__hours" }, fr = ["value"], br = { class: "vu-time-picker__minutes" }, jr = ["value"], _r = {
    key: 3,
    class: "form-control vu-time-picker__display",
    disabled: ""
  }, wr = {
    key: 4,
    class: "form-control-helper-text"
  };
  function Lr(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-popover");
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["vu-time-picker form-group", e.classes])
    }, [
      e.label.length ? (vue.openBlock(), vue.createElementBlock("label", hr, [
        vue.createTextVNode(vue.toDisplayString(e.label) + " ", 1),
        e.required ? (vue.openBlock(), vue.createElementBlock("span", gr, " *")) : vue.createCommentVNode("", !0)
      ])) : vue.createCommentVNode("", !0),
      t.useNativeInput || i.isMobileOrTablet ? (vue.openBlock(), vue.createElementBlock("div", mr, [
        vue.createElementVNode("input", vue.mergeProps(e.$attrs, {
          value: e.value,
          placeholder: e.placeholder,
          disabled: e.disabled,
          type: "time",
          class: "vu-time-picker__display-native form-control",
          style: { width: "fit-content" },
          onInput: s[0] || (s[0] = ({ target: d }) => {
            i.vuInputComposition || (d.composing = !1), e.$emit("update:modelValue", d.value);
          })
        }), null, 16, Mr)
      ])) : e.disabled ? (vue.openBlock(), vue.createElementBlock("div", _r, [
        vue.createElementVNode("span", null, vue.toDisplayString(a.hours), 1),
        vue.createTextVNode(":"),
        vue.createElementVNode("span", null, vue.toDisplayString(a.minutes), 1)
      ])) : (vue.openBlock(), vue.createBlock(r, {
        key: 2,
        class: "vu-time-picker__popover",
        style: { width: "fit-content" },
        show: a.isPopoverOpen
      }, {
        body: vue.withCtx(() => [
          vue.createElementVNode("div", vr, [
            vue.createElementVNode("div", pr, [
              (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList([...Array(24).keys()], (d) => (vue.openBlock(), vue.createElementBlock("label", {
                key: d,
                class: vue.normalizeClass({ "vu-time-picker__hours--selected": a.hours === i.formatNumberForTime(d) })
              }, [
                vue.createElementVNode("span", null, vue.toDisplayString(i.formatNumberForTime(d)), 1),
                vue.withDirectives(vue.createElementVNode("input", {
                  type: "radio",
                  name: "hours",
                  value: i.formatNumberForTime(d),
                  "onUpdate:modelValue": s[1] || (s[1] = (u) => a.hours = u)
                }, null, 8, fr), [
                  [vue.vModelRadio, a.hours]
                ])
              ], 2))), 128))
            ]),
            vue.createElementVNode("div", br, [
              (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList([...Array(60).keys()], (d) => (vue.openBlock(), vue.createElementBlock("label", {
                key: d,
                class: vue.normalizeClass({ "vu-time-picker__minutes--selected": a.minutes === i.formatNumberForTime(d) })
              }, [
                vue.createElementVNode("span", null, vue.toDisplayString(i.formatNumberForTime(d)), 1),
                vue.withDirectives(vue.createElementVNode("input", {
                  type: "radio",
                  name: "minutes",
                  value: i.formatNumberForTime(d),
                  "onUpdate:modelValue": s[2] || (s[2] = (u) => a.minutes = u)
                }, null, 8, jr), [
                  [vue.vModelRadio, a.minutes]
                ])
              ], 2))), 128))
            ])
          ])
        ]),
        default: vue.withCtx(() => [
          vue.createElementVNode("div", yr, [
            vue.createElementVNode("span", null, vue.toDisplayString(a.hours), 1),
            vue.createTextVNode(":"),
            vue.createElementVNode("span", null, vue.toDisplayString(a.minutes), 1)
          ])
        ]),
        _: 1
      }, 8, ["show"])),
      (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.errorBucket, (d, u) => (vue.openBlock(), vue.createElementBlock("span", {
        key: `${u}-error-${d}`,
        style: { display: "block" },
        class: "form-control-error-text"
      }, vue.toDisplayString(d), 1))), 128)),
      e.helper.length ? (vue.openBlock(), vue.createElementBlock("span", wr, vue.toDisplayString(e.helper), 1)) : vue.createCommentVNode("", !0)
    ], 2);
  }
  const Ir = /* @__PURE__ */ w(cr, [["render", Lr], ["__scopeId", "data-v-b97d0cec"]]), Nr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Ir
  }, Symbol.toStringTag, { value: "Module" })), Cr = (e) => {
    try {
      const { label: s, id: t } = e;
      if (s && t)
        return !0;
    } catch {
    }
    return !1;
  };
  const Dr = {
    name: "vu-tree-view-item",
    mixins: [V],
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
        validator: Cr()
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
      guid: $
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
        var t, l;
        [(t = this.$refs.loadingSpinner) == null ? void 0 : t.$el, (l = this.$refs.treeIcon) == null ? void 0 : l.$el].filter((a) => a).every((a) => !a.contains(e.target)) && this.$emit("select", this.item);
      }
    }
  }, Tr = (e) => (vue.pushScopeId("data-v-6c9a94fc"), e = e(), vue.popScopeId(), e), kr = {
    key: 1,
    class: "vu-tree-view-item__tree-icon-loading",
    ref: "loadingSpinner"
  }, zr = /* @__PURE__ */ Tr(() => /* @__PURE__ */ vue.createElementVNode("svg", {
    class: "vu-spin",
    viewBox: "25 25 50 50"
  }, [
    /* @__PURE__ */ vue.createElementVNode("circle", {
      class: "path",
      cx: "50",
      cy: "50",
      r: "20",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "5",
      "stroke-miterlimit": "10"
    })
  ], -1)), Sr = {
    key: 2,
    class: "vu-tree-view-item__tree-icon-placeholder"
  }, Or = {
    key: 4,
    class: "vu-tree-view-item__type-icon-placeholder"
  }, xr = { class: "vu-tree-view-item__label" };
  function Pr(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-icon-btn"), d = vue.resolveComponent("vu-tree-view-item", !0), u = vue.resolveDirective("tooltip");
    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
      vue.createElementVNode("div", {
        class: vue.normalizeClass(["vu-tree-view-item", {
          "vu-tree-view-item--selected": i.isSelected,
          "vu-tree-view-item--unselected": !i.isSelected,
          "vu-tree-view-item--main": t.main,
          "vu-tree-view-item--child": !t.main,
          "vu-tree-view-item--chevron-icon": i.vuTreeIcon === "chevron"
        }]),
        style: vue.normalizeStyle({
          "padding-left": `${i.calcLeftPadding}px`
        }),
        onClick: s[1] || (s[1] = (...g) => i.onClick && i.onClick(...g))
      }, [
        i.showTreeIcon ? (vue.openBlock(), vue.createBlock(r, {
          key: 0,
          icon: i.getTreeIconClass,
          class: "vu-tree-view-item__tree-icon",
          onClick: s[0] || (s[0] = (g) => e.$emit("expand", t.item)),
          ref: "treeIcon"
        }, null, 8, ["icon"])) : i.isLoading ? (vue.openBlock(), vue.createElementBlock("div", kr, [
          vue.renderSlot(e.$slots, "itemLoading", {}, () => [
            zr
          ], !0)
        ], 512)) : (vue.openBlock(), vue.createElementBlock("div", Sr)),
        t.item.icon ? (vue.openBlock(), vue.createBlock(r, {
          key: 3,
          class: "vu-tree-view-item__type-icon",
          color: "default-inactive",
          icon: t.item.icon
        }, null, 8, ["icon"])) : t.siblingsHaveNoType ? (vue.openBlock(), vue.createElementBlock("div", Or)) : vue.createCommentVNode("", !0),
        vue.renderSlot(e.$slots, "item-" + t.item.type || "default", {}, () => [
          vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", xr, [
            vue.createTextVNode(vue.toDisplayString(t.item.label), 1)
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
      i.hasItems && i.isExpanded ? (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList(t.item.items, (g) => (vue.openBlock(), vue.createBlock(d, {
        key: `${g.id}`,
        item: g,
        depth: t.depth + 1,
        leftPadding: i.calcLeftPadding,
        selected: t.selected,
        loading: t.loading,
        expanded: t.expanded,
        siblingsHaveNoType: i.anyChildrenHasIcon,
        onLoadComplete: s[2] || (s[2] = (y) => e.$emit("load-complete", y)),
        onExpand: s[3] || (s[3] = (y) => e.$emit("expand", y)),
        onSelect: s[4] || (s[4] = (y) => e.$emit("select", y))
      }, null, 8, ["item", "depth", "leftPadding", "selected", "loading", "expanded", "siblingsHaveNoType"]))), 128)) : vue.createCommentVNode("", !0)
    ], 64);
  }
  const Ar = /* @__PURE__ */ w(Dr, [["render", Pr], ["__scopeId", "data-v-6c9a94fc"]]), Er = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Ar
  }, Symbol.toStringTag, { value: "Module" }));
  const Br = {
    name: "vu-tree-view",
    emits: ["update:selected", "update:expanded", "fetch", "item-click"],
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
        required: !1
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
    }
  }, Ur = { class: "vu-tree-view" };
  function Zr(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-tree-view-item"), d = vue.resolveComponent("vu-scroller");
    return vue.openBlock(), vue.createElementBlock("div", Ur, [
      vue.createVNode(d, null, {
        default: vue.withCtx(() => [
          (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(t.items, (u) => (vue.openBlock(), vue.createBlock(r, {
            key: `${u.id}`,
            item: u,
            loading: t.loading || e.innerLoading,
            expanded: t.expanded,
            selected: t.selected,
            main: t.firstLevelBigger,
            onExpand: i.toggleExpand,
            onSelect: i.toggleSelect,
            onLoadComplete: i.onLoad
          }, null, 8, ["item", "loading", "expanded", "selected", "main", "onExpand", "onSelect", "onLoadComplete"]))), 128))
        ]),
        _: 1
      })
    ]);
  }
  const Gr = /* @__PURE__ */ w(Br, [["render", Zr]]), Yr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Gr
  }, Symbol.toStringTag, { value: "Module" })), J = "__v-click-outside", $e = typeof window < "u", Qr = typeof navigator < "u", Rr = $e && ("ontouchstart" in window || Qr && navigator.msMaxTouchPoints > 0), $r = Rr ? ["touchstart"] : ["click"];
  function Vr(e) {
    const s = typeof e == "function";
    if (!s && typeof e != "object")
      throw new Error("v-click-outside: Binding value must be a function or an object");
    return {
      handler: s ? e : e.handler,
      middleware: e.middleware || ((t) => t),
      events: e.events || $r,
      innerShow: e.innerShow !== !1
    };
  }
  function Wr({
    el: e,
    event: s,
    handler: t,
    middleware: l
  }) {
    const a = s.path || s.composedPath && s.composedPath(), i = a ? a.indexOf(e) < 0 : !e.contains(s.target);
    s.target !== e && i && l(s) && t(s);
  }
  function Ve(e, { value: s }) {
    const {
      events: t,
      handler: l,
      middleware: a,
      innerShow: i
    } = Vr(s);
    i && (e[J] = t.map((r) => ({
      event: r,
      handler: (d) => Wr({
        event: d,
        el: e,
        handler: l,
        middleware: a
      })
    })), e[J].forEach(({ event: r, handler: d }) => setTimeout(() => {
      e[J] && document.documentElement.addEventListener(r, d, !1);
    }, 0)));
  }
  function We(e) {
    (e[J] || []).forEach(({ event: t, handler: l }) => document.documentElement.removeEventListener(t, l, !1)), delete e[J];
  }
  function Hr(e, { value: s, oldValue: t }) {
    JSON.stringify(s) !== JSON.stringify(t) && (We(e), Ve(e, { value: s }));
  }
  const Fr = {
    beforeMount: Ve,
    updated: Hr,
    beforeUnmount: We
  }, de = $e ? Fr : {}, Kr = {
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
  }, Jr = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIuMDAxIDUxMi4wMDEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMi4wMDEgNTEyLjAwMTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBzdHlsZT0iZmlsbDojNzNBRjAwOyIgZD0iTTUwMy4xNzIsNDIzLjcyNUg4LjgyOGMtNC44NzUsMC04LjgyOC0zLjk1My04LjgyOC04LjgyOFY5Ny4xMDRjMC00Ljg3NSwzLjk1My04LjgyOCw4LjgyOC04LjgyOCAgaDQ5NC4zNDVjNC44NzUsMCw4LjgyOCwzLjk1Myw4LjgyOCw4LjgyOHYzMTcuNzkzQzUxMiw0MTkuNzczLDUwOC4wNDcsNDIzLjcyNSw1MDMuMTcyLDQyMy43MjV6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNGRkUxNUE7IiBkPSJNMjUxLjQxLDEzNS4yMDlMNjUuMzU0LDI0OC40NmMtNS42NTEsMy40MzktNS42NTEsMTEuNjQxLDAsMTUuMDgxTDI1MS40MSwzNzYuNzkzICBjMi44MTksMS43MTYsNi4zNiwxLjcxNiw5LjE4LDBsMTg2LjA1Ny0xMTMuMjUxYzUuNjUxLTMuNDM5LDUuNjUxLTExLjY0MSwwLTE1LjA4MUwyNjAuNTksMTM1LjIwOSAgQzI1Ny43NzEsMTMzLjQ5MywyNTQuMjI5LDEzMy40OTMsMjUxLjQxLDEzNS4yMDl6Ii8+CjxjaXJjbGUgc3R5bGU9ImZpbGw6IzQxNDc5QjsiIGN4PSIyNTYiIGN5PSIyNTYuMDAxIiByPSI3MC42MiIvPgo8Zz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNGNUY1RjU7IiBkPSJNMTk1LjQwMSwyMTkuODc0Yy0zLjMzMiw1LjU3OC01LjkwNSwxMS42NC03LjYwNSwxOC4wNzdjMzkuMTQ5LTIuOTQ2LDk3LjA2Miw4LjAwNiwxMzMuOTIyLDQzLjc3MyAgIGMyLjQwNi02LjE0MSwzLjk5NC0xMi42ODMsNC41OS0xOS41MjJDMjg4LjI0NywyMzAuMTY5LDIzNS42MjgsMjE4Ljc3OCwxOTUuNDAxLDIxOS44NzR6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRjVGNUY1OyIgZD0iTTI1OC45MjUsMjgwLjFsMS44OCw1LjYzOGw1Ljk0MywwLjA0NmMwLjc2OSwwLjAwNiwxLjA4OCwwLjk4OCwwLjQ3LDEuNDQ1bC00Ljc4MSwzLjUzMSAgIGwxLjc5Myw1LjY2NmMwLjIzMiwwLjczNC0wLjYwNCwxLjM0MS0xLjIyOSwwLjg5M2wtNC44MzUtMy40NTZsLTQuODM1LDMuNDU2Yy0wLjYyNiwwLjQ0OC0xLjQ2MS0wLjE1OS0xLjIyOS0wLjg5M2wxLjc5My01LjY2NiAgIGwtNC43ODEtMy41MzFjLTAuNjE5LTAuNDU3LTAuMy0xLjQzOSwwLjQ2OS0xLjQ0NWw1Ljk0My0wLjA0NmwxLjg4LTUuNjM4QzI1Ny42NDksMjc5LjM3LDI1OC42ODEsMjc5LjM3LDI1OC45MjUsMjgwLjF6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRjVGNUY1OyIgZD0iTTI4Mi4wMjQsMjk0LjY4NWwwLjgwOSwyLjQyNmwyLjU1OCwwLjAyYzAuMzMxLDAuMDAyLDAuNDY5LDAuNDI1LDAuMjAyLDAuNjIybC0yLjA1OCwxLjUxOSAgIGwwLjc3MSwyLjQzOWMwLjEsMC4zMTYtMC4yNTksMC41NzctMC41MjksMC4zODRsLTIuMDgxLTEuNDg3bC0yLjA4MSwxLjQ4N2MtMC4yNjksMC4xOTMtMC42MjktMC4wNjgtMC41MjktMC4zODRsMC43NzEtMi40MzkgICBsLTIuMDU4LTEuNTE5Yy0wLjI2Ni0wLjE5Ni0wLjEyOS0wLjYxOSwwLjIwMi0wLjYyMmwyLjU1OC0wLjAybDAuODA5LTIuNDI2QzI4MS40NzQsMjk0LjM3LDI4MS45MTksMjk0LjM3LDI4Mi4wMjQsMjk0LjY4NXoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNGNUY1RjU7IiBkPSJNMjQ4LjkzOCwyNjkuMzlsMC44MDksMi40MjZsMi41NTgsMC4wMmMwLjMzMSwwLjAwMiwwLjQ2OSwwLjQyNSwwLjIwMiwwLjYyMmwtMi4wNTgsMS41MTkgICBsMC43NzEsMi40MzljMC4xLDAuMzE2LTAuMjU5LDAuNTc3LTAuNTI5LDAuMzg0bC0yLjA4MS0xLjQ4N2wtMi4wODEsMS40ODdjLTAuMjY5LDAuMTkzLTAuNjI5LTAuMDY4LTAuNTI5LTAuMzg0bDAuNzcxLTIuNDM5ICAgbC0yLjA1OC0xLjUxOWMtMC4yNjYtMC4xOTYtMC4xMjktMC42MTksMC4yMDItMC42MjJsMi41NTgtMC4wMmwwLjgwOS0yLjQyNkMyNDguMzg4LDI2OS4wNzYsMjQ4LjgzMywyNjkuMDc2LDI0OC45MzgsMjY5LjM5eiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0Y1RjVGNTsiIGQ9Ik0yMDQuMTMsMjY2LjQ0OGwwLjgwOSwyLjQyNmwyLjU1OCwwLjAyYzAuMzMxLDAuMDAyLDAuNDY5LDAuNDI1LDAuMjAyLDAuNjIybC0yLjA1OCwxLjUxOSAgIGwwLjc3MSwyLjQzOWMwLjEsMC4zMTYtMC4yNTksMC41NzctMC41MjksMC4zODRsLTIuMDgxLTEuNDg3bC0yLjA4MSwxLjQ4N2MtMC4yNjksMC4xOTMtMC42MjktMC4wNjgtMC41MjktMC4zODRsMC43NzEtMi40MzkgICBsLTIuMDU4LTEuNTE5Yy0wLjI2Ni0wLjE5Ni0wLjEyOS0wLjYxOSwwLjIwMi0wLjYyMmwyLjU1OC0wLjAybDAuODA5LTIuNDI2QzIwMy41ODEsMjY2LjEzNCwyMDQuMDI1LDI2Ni4xMzQsMjA0LjEzLDI2Ni40NDh6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRjVGNUY1OyIgZD0iTTI0MS42MTQsMjkzLjg0N2wwLjgwOSwyLjQyNmwyLjU1OCwwLjAyYzAuMzMxLDAuMDAyLDAuNDY5LDAuNDI1LDAuMjAyLDAuNjIybC0yLjA1OCwxLjUxOSAgIGwwLjc3MSwyLjQzOWMwLjEsMC4zMTYtMC4yNTksMC41NzctMC41MjksMC4zODRsLTIuMDgxLTEuNDg3bC0yLjA4MSwxLjQ4N2MtMC4yNjksMC4xOTMtMC42MjktMC4wNjgtMC41MjktMC4zODRsMC43NzEtMi40MzkgICBsLTIuMDU4LTEuNTE5Yy0wLjI2Ni0wLjE5Ni0wLjEyOS0wLjYxOSwwLjIwMi0wLjYyMmwyLjU1OC0wLjAybDAuODA5LTIuNDI2QzI0MS4wNjUsMjkzLjUzNCwyNDEuNTEsMjkzLjUzNCwyNDEuNjE0LDI5My44NDd6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRjVGNUY1OyIgZD0iTTIyMC45OSwyNjQuNzU1bDAuNjYyLDEuOTg0bDIuMDkyLDAuMDE3YzAuMjcsMC4wMDIsMC4zODMsMC4zNDgsMC4xNjYsMC41MDlsLTEuNjgzLDEuMjQyICAgbDAuNjMxLDEuOTk0YzAuMDgyLDAuMjU4LTAuMjEyLDAuNDcyLTAuNDMzLDAuMzE0bC0xLjcwMi0xLjIxNmwtMS43MDIsMS4yMTZjLTAuMjIxLDAuMTU4LTAuNTE0LTAuMDU2LTAuNDMzLTAuMzE0bDAuNjMxLTEuOTk0ICAgbC0xLjY4My0xLjI0MmMtMC4yMTctMC4xNjEtMC4xMDYtMC41MDcsMC4xNjYtMC41MDlsMi4wOTItMC4wMTdsMC42NjItMS45ODRDMjIwLjU0MSwyNjQuNDk4LDIyMC45MDQsMjY0LjQ5OCwyMjAuOTksMjY0Ljc1NXoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNGNUY1RjU7IiBkPSJNMjgzLjgxOSwyMjMuNzk0bDAuODI4LDIuNDgybDIuNjE2LDAuMDJjMC4zMzksMC4wMDIsMC40NzksMC40MzUsMC4yMDYsMC42MzZsLTIuMTA0LDEuNTU0ICAgbDAuNzg5LDIuNDk1YzAuMTAzLDAuMzIzLTAuMjY2LDAuNTktMC41NDEsMC4zOTNsLTIuMTI5LTEuNTIybC0yLjEyOSwxLjUyMmMtMC4yNzYsMC4xOTgtMC42NDMtMC4wNzEtMC41NDEtMC4zOTNsMC43ODktMi40OTUgICBsLTIuMTA0LTEuNTU0Yy0wLjI3My0wLjIwMS0wLjEzMi0wLjYzMywwLjIwNi0wLjYzNmwyLjYxNi0wLjAybDAuODI4LTIuNDgyQzI4My4yNTcsMjIzLjQ3MiwyODMuNzEyLDIyMy40NzIsMjgzLjgxOSwyMjMuNzk0eiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0Y1RjVGNTsiIGQ9Ik0yMDcuMDEyLDI1Mi42MTdsMC42NjIsMS45ODRsMi4wOTIsMC4wMTdjMC4yNywwLjAwMiwwLjM4MywwLjM0OCwwLjE2NiwwLjUwOWwtMS42ODMsMS4yNDIgICBsMC42MzEsMS45OTRjMC4wODIsMC4yNTgtMC4yMTIsMC40NzItMC40MzMsMC4zMTRsLTEuNzAyLTEuMjE2bC0xLjcwMiwxLjIxNmMtMC4yMjEsMC4xNTgtMC41MTQtMC4wNTYtMC40MzMtMC4zMTRsMC42MzEtMS45OTQgICBsLTEuNjgzLTEuMjQyYy0wLjIxNy0wLjE2MS0wLjEwNi0wLjUwNiwwLjE2Ni0wLjUwOWwyLjA5Mi0wLjAxN2wwLjY2Mi0xLjk4NEMyMDYuNTYzLDI1Mi4zNiwyMDYuOTI2LDI1Mi4zNiwyMDcuMDEyLDI1Mi42MTd6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRjVGNUY1OyIgZD0iTTIxNy4xMTIsMjgwLjU4MWwxLjAwMiwzLjAwNmwzLjE2OCwwLjAyNGMwLjQxLDAuMDAzLDAuNTgsMC41MjYsMC4yNSwwLjc3bC0yLjU0OSwxLjg4MmwwLjk1NiwzLjAyICAgYzAuMTI0LDAuMzkxLTAuMzIxLDAuNzE1LTAuNjU1LDAuNDc2bC0yLjU3OC0xLjg0MmwtMi41NzgsMS44NDJjLTAuMzMzLDAuMjM4LTAuNzc5LTAuMDg1LTAuNjU1LTAuNDc2bDAuOTU2LTMuMDJsLTIuNTQ5LTEuODgyICAgYy0wLjMzLTAuMjQ0LTAuMTYtMC43NjcsMC4yNS0wLjc3bDMuMTY4LTAuMDI0bDEuMDAyLTMuMDA2QzIxNi40MzMsMjgwLjE5MywyMTYuOTgzLDI4MC4xOTMsMjE3LjExMiwyODAuNTgxeiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0Y1RjVGNTsiIGQ9Ik0yOTQuOTAzLDI5NS4zMTVsMC42MywxLjg5MWwxLjk5MywwLjAxNWMwLjI1OCwwLjAwMiwwLjM2NSwwLjMzMSwwLjE1OCwwLjQ4NGwtMS42MDMsMS4xODQgICBsMC42MDEsMS45YzAuMDc4LDAuMjQ2LTAuMjAyLDAuNDQ5LTAuNDEzLDAuMjk5bC0xLjYyMS0xLjE1OWwtMS42MjIsMS4xNTljLTAuMjEsMC4xNS0wLjQ5LTAuMDUzLTAuNDEzLTAuMjk5bDAuNjAxLTEuOSAgIGwtMS42MDMtMS4xODRjLTAuMjA3LTAuMTUzLTAuMS0wLjQ4MiwwLjE1OC0wLjQ4NGwxLjk5My0wLjAxNWwwLjYzLTEuODkxQzI5NC40NzUsMjk1LjA3LDI5NC44MjIsMjk1LjA3LDI5NC45MDMsMjk1LjMxNXoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNGNUY1RjU7IiBkPSJNMzAxLjg3NywyODAuODg1bDAuODA5LDIuNDI2bDIuNTU4LDAuMDJjMC4zMzEsMC4wMDIsMC40NjksMC40MjUsMC4yMDIsMC42MjJsLTIuMDU4LDEuNTE5ICAgbDAuNzcxLDIuNDM5YzAuMSwwLjMxNi0wLjI1OSwwLjU3Ny0wLjUyOSwwLjM4NGwtMi4wODEtMS40ODdsLTIuMDgxLDEuNDg3Yy0wLjI2OSwwLjE5My0wLjYyOS0wLjA2OC0wLjUyOS0wLjM4NGwwLjc3MS0yLjQzOSAgIGwtMi4wNTgtMS41MTljLTAuMjY2LTAuMTk2LTAuMTI5LTAuNjE5LDAuMjAyLTAuNjIybDIuNTU4LTAuMDJsMC44MDktMi40MjZDMzAxLjMyNywyODAuNTcsMzAxLjc3MiwyODAuNTcsMzAxLjg3NywyODAuODg1eiIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=", Xr = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIuMDAxIDUxMi4wMDEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMi4wMDEgNTEyLjAwMTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBzdHlsZT0iZmlsbDojRkY0QjU1OyIgZD0iTTUwMy4xNzIsNDIzLjcyNUg4LjgyOGMtNC44NzUsMC04LjgyOC0zLjk1My04LjgyOC04LjgyOFY5Ny4xMDRjMC00Ljg3NSwzLjk1My04LjgyOCw4LjgyOC04LjgyOCAgaDQ5NC4zNDVjNC44NzUsMCw4LjgyOCwzLjk1Myw4LjgyOCw4LjgyOHYzMTcuNzkzQzUxMiw0MTkuNzczLDUwOC4wNDcsNDIzLjcyNSw1MDMuMTcyLDQyMy43MjV6Ii8+CjxnPgoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRTE1QTsiIGQ9Ik04NS4wMDcsMTQwLjczM2w4LjQxNiwyNS4yMzRsMjYuNiwwLjIwNmMzLjQ0NCwwLjAyNiw0Ljg3Miw0LjQyMiwyLjEwMSw2LjQ2N2wtMjEuMzk4LDE1LjgwMSAgIGw4LjAyMywyNS4zNjJjMS4wMzgsMy4yODQtMi43LDUuOTk5LTUuNTAyLDMuOTk3bC0yMS42NC0xNS40NjlsLTIxLjY0LDE1LjQ2OGMtMi44MDIsMi4wMDMtNi41NC0wLjcxNC01LjUwMi0zLjk5N2w4LjAyMy0yNS4zNjIgICBsLTIxLjM5OC0xNS44Yy0yLjc3MS0yLjA0Ni0xLjM0My02LjQ0MSwyLjEwMS02LjQ2N2wyNi42LTAuMjA2bDguNDE2LTI1LjIzNEM3OS4yOTcsMTM3LjQ2NSw4My45MTgsMTM3LjQ2NSw4NS4wMDcsMTQwLjczM3oiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkUxNUE7IiBkPSJNMTgxLjU5OSwxNDYuOTUxbDYuMDM1LDguMjNsOS43MzktMy4wNDZjMS4yNjEtMC4zOTQsMi4yOTgsMS4wNDQsMS41MjYsMi4xMTVsLTUuOTYyLDguMjgxICAgbDUuOTA2LDguMzIxYzAuNzY1LDEuMDc3LTAuMjgyLDIuNTA4LTEuNTQsMi4xMDVsLTkuNzE5LTMuMTExbC02LjA4OSw4LjE4OWMtMC43ODgsMS4wNi0yLjQ3MywwLjUwNi0yLjQ3OC0wLjgxNGwtMC4wNDUtMTAuMjA1ICAgbC05LjY3LTMuMjYxYy0xLjI1MS0wLjQyMy0xLjI0Ni0yLjE5NSwwLjAwOS0yLjYwOWw5LjY5LTMuMTk2bDAuMTE0LTEwLjIwNEMxNzkuMTI5LDE0Ni40MjcsMTgwLjgxOCwxNDUuODg2LDE4MS41OTksMTQ2Ljk1MXoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkUxNUE7IiBkPSJNMTQ0Ljg1NywxMjIuNDIxbDEwLjE0NSwxLjEwMmw0LjMyOC05LjI0MWMwLjU2MS0xLjE5NiwyLjMyMS0wLjk5MSwyLjU5MSwwLjMwMmwyLjA4Niw5Ljk4OCAgIGwxMC4xMjYsMS4yNmMxLjMxMSwwLjE2MywxLjY2LDEuOTAxLDAuNTEzLDIuNTU4bC04Ljg1NSw1LjA3bDEuOTMxLDEwLjAyYzAuMjUsMS4yOTgtMS4yOTUsMi4xNjYtMi4yNzQsMS4yNzlsLTcuNTU5LTYuODU1ICAgbC04LjkzMiw0LjkzMmMtMS4xNTYsMC42MzktMi40NjEtMC41NjMtMS45MTktMS43NjhsNC4xODMtOS4zMDhsLTcuNDUyLTYuOTcyQzE0Mi44MDUsMTIzLjg5LDE0My41NDQsMTIyLjI3OSwxNDQuODU3LDEyMi40MjF6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRkZFMTVBOyIgZD0iTTE2MC44OTUsMjIxLjMxNGwtNi4wMzUsOC4yM2wtOS43MzktMy4wNDZjLTEuMjYxLTAuMzk0LTIuMjk4LDEuMDQ0LTEuNTI2LDIuMTE1bDUuOTYyLDguMjgxICAgbC01LjkwNiw4LjMyMWMtMC43NjUsMS4wNzcsMC4yODIsMi41MDgsMS41NCwyLjEwNWw5LjcxOS0zLjExMWw2LjA4OSw4LjE4OWMwLjc4OCwxLjA2LDIuNDczLDAuNTA2LDIuNDc4LTAuODE0bDAuMDQ1LTEwLjIwNSAgIGw5LjY3LTMuMjYxYzEuMjUyLTAuNDIzLDEuMjQ2LTIuMTk1LTAuMDA5LTIuNjA5bC05LjY5LTMuMTk2bC0wLjExNC0xMC4yMDRDMTYzLjM2MywyMjAuNzkxLDE2MS42NzYsMjIwLjI0OCwxNjAuODk1LDIyMS4zMTR6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRkZFMTVBOyIgZD0iTTE5Ny42MzUsMTk4LjI2M2wtMTAuMTQ1LDEuMTAybC00LjMyOC05LjI0MWMtMC41NjEtMS4xOTYtMi4zMjEtMC45OTEtMi41OTEsMC4zMDJsLTIuMDg3LDkuOTg4ICAgbC0xMC4xMjYsMS4yNmMtMS4zMTEsMC4xNjMtMS42NiwxLjkwMS0wLjUxMywyLjU1OGw4Ljg1NSw1LjA3bC0xLjkzMSwxMC4wMmMtMC4yNSwxLjI5OCwxLjI5NSwyLjE2NiwyLjI3NCwxLjI3OWw3LjU1OS02Ljg1NSAgIGw4LjkzMiw0LjkzMmMxLjE1NiwwLjYzOSwyLjQ2MS0wLjU2MywxLjkxOS0xLjc2OGwtNC4xODMtOS4zMDhsNy40NTItNi45NzJDMTk5LjY4OSwxOTkuNzMyLDE5OC45NSwxOTguMTIxLDE5Ny42MzUsMTk4LjI2M3oiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K", qr = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIuMDAxIDUxMi4wMDEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMi4wMDEgNTEyLjAwMTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBzdHlsZT0iZmlsbDojNDY0NjU1OyIgZD0iTTUxMiwyMDAuMDkzSDBWOTcuMTA0YzAtNC44NzUsMy45NTMtOC44MjgsOC44MjgtOC44MjhoNDk0LjM0NWM0Ljg3NSwwLDguODI4LDMuOTUzLDguODI4LDguODI4ICBMNTEyLDIwMC4wOTNMNTEyLDIwMC4wOTN6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNGRkUxNUE7IiBkPSJNNTAzLjE3Miw0MjMuNzI1SDguODI4Yy00Ljg3NSwwLTguODI4LTMuOTUzLTguODI4LTguODI4VjMxMS45MDloNTEydjEwMi45ODggIEM1MTIsNDE5Ljc3Myw1MDguMDQ3LDQyMy43MjUsNTAzLjE3Miw0MjMuNzI1eiIvPgo8cmVjdCB5PSIyMDAuMDkxIiBzdHlsZT0iZmlsbDojRkY0QjU1OyIgd2lkdGg9IjUxMiIgaGVpZ2h0PSIxMTEuODEiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==", eu = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIuMDAxIDUxMi4wMDEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMi4wMDEgNTEyLjAwMTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBzdHlsZT0iZmlsbDojQzg0MTRCOyIgZD0iTTguODI4LDQyMy43MjVoNDk0LjM0NWM0Ljg3NSwwLDguODI4LTMuOTUzLDguODI4LTguODI4Vjk3LjEwNGMwLTQuODc1LTMuOTUzLTguODI4LTguODI4LTguODI4ICBIOC44MjhDMy45NTMsODguMjc3LDAsOTIuMjI5LDAsOTcuMTA0djMxNy43OTNDMCw0MTkuNzczLDMuOTUzLDQyMy43MjUsOC44MjgsNDIzLjcyNXoiLz4KPHJlY3QgeT0iMTU4LjkwMSIgc3R5bGU9ImZpbGw6I0ZGRDI1MDsiIHdpZHRoPSI1MTIiIGhlaWdodD0iMTk0LjIxIi8+CjxwYXRoIHN0eWxlPSJmaWxsOiNDODQxNEI7IiBkPSJNMjE2LjI3NiwyNTYuMDAxbDcuNDg1LTMzLjY4MWMwLjY5LTMuMTAyLTEuNjcxLTYuMDQ0LTQuODQ5LTYuMDQ0aC01LjI3MiAgYy0zLjE3NywwLTUuNTM3LDIuOTQyLTQuODQ5LDYuMDQ0TDIxNi4yNzYsMjU2LjAwMXoiLz4KPHJlY3QgeD0iMjA3LjQ1IiB5PSIyMzguMzQxIiBzdHlsZT0iZmlsbDojRjVGNUY1OyIgd2lkdGg9IjE3LjY1NSIgaGVpZ2h0PSI3NS4wMyIvPgo8cmVjdCB4PSIyMDMuMDMiIHk9IjIyOS41MjEiIHN0eWxlPSJmaWxsOiNGQUI0NDY7IiB3aWR0aD0iMjYuNDgzIiBoZWlnaHQ9IjguODI4Ii8+CjxnPgoJPHJlY3QgeD0iMTg1LjM4IiB5PSIyNTYuMDAxIiBzdHlsZT0iZmlsbDojQzg0MTRCOyIgd2lkdGg9IjQ0LjE0IiBoZWlnaHQ9IjguODI4Ii8+Cgk8cG9seWdvbiBzdHlsZT0iZmlsbDojQzg0MTRCOyIgcG9pbnRzPSIyMjkuNTE3LDI5MS4zMTEgMjAzLjAzNCwyODIuNDg0IDIwMy4wMzQsMjczLjY1NiAyMjkuNTE3LDI4Mi40ODQgICIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0M4NDE0QjsiIGQ9Ik04My44NjIsMjU2LjAwMWw3LjQ4NS0zMy42ODFjMC42OS0zLjEwMi0xLjY3MS02LjA0NC00Ljg0OS02LjA0NGgtNS4yNzIgICBjLTMuMTc3LDAtNS41MzcsMi45NDItNC44NDksNi4wNDRMODMuODYyLDI1Ni4wMDF6Ii8+CjwvZz4KPHBhdGggc3R5bGU9ImZpbGw6I0Y1RjVGNTsiIGQ9Ik0xMTQuNzU5LDIyOS41MThjLTQuODc1LDAtOC44MjgsMy45NTMtOC44MjgsOC44Mjh2NTcuMzc5YzAsMTAuNzI1LDEwLjAxLDMwLjg5Nyw0NC4xMzgsMzAuODk3ICBzNDQuMTM4LTIwLjE3MSw0NC4xMzgtMzAuODk3di01Ny4zNzljMC00Ljg3NS0zLjk1My04LjgyOC04LjgyOC04LjgyOEgxMTQuNzU5eiIvPgo8Zz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNDODQxNEI7IiBkPSJNMTUwLjA2OSwyNzMuNjU2aC00NC4xMzh2LTM1LjMxYzAtNC44NzUsMy45NTMtOC44MjgsOC44MjgtOC44MjhoMzUuMzFWMjczLjY1NnoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNDODQxNEI7IiBkPSJNMTUwLjA2OSwyNzMuNjU2aDQ0LjEzOHYyMi4wNjljMCwxMi4xODktOS44OCwyMi4wNjktMjIuMDY5LDIyLjA2OWwwLDAgICBjLTEyLjE4OSwwLTIyLjA2OS05Ljg4LTIyLjA2OS0yMi4wNjlWMjczLjY1NnoiLz4KPC9nPgo8cGF0aCBzdHlsZT0iZmlsbDojRkFCNDQ2OyIgZD0iTTEwNS45MzEsMjczLjY1Nmg0NC4xMzh2MjIuMDY5YzAsMTIuMTg5LTkuODgsMjIuMDY5LTIyLjA2OSwyMi4wNjlsMCwwICBjLTEyLjE4OSwwLTIyLjA2OS05Ljg4LTIyLjA2OS0yMi4wNjlWMjczLjY1NnoiLz4KPGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojQzg0MTRCOyIgZD0iTTE0MS4yNDEsMzEzLjI4MXYtMzkuNjI1aC04LjgyOHY0My42OTNDMTM1LjY5NywzMTYuNjgzLDEzOC42NjQsMzE1LjIyOSwxNDEuMjQxLDMxMy4yODF6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojQzg0MTRCOyIgZD0iTTEyMy41ODYsMzE3LjM0OXYtNDMuNjkzaC04LjgyOHYzOS42MjVDMTE3LjMzNiwzMTUuMjI5LDEyMC4zMDMsMzE2LjY4MywxMjMuNTg2LDMxNy4zNDl6Ii8+CjwvZz4KPHJlY3QgeD0iMTE0Ljc2IiB5PSIyNTYuMDAxIiBzdHlsZT0iZmlsbDojRkZCNDQxOyIgd2lkdGg9IjI2LjQ4MyIgaGVpZ2h0PSI4LjgyOCIvPgo8Zz4KCTxyZWN0IHg9IjExNC43NiIgeT0iMjM4LjM0MSIgc3R5bGU9ImZpbGw6I0ZBQjQ0NjsiIHdpZHRoPSIyNi40ODMiIGhlaWdodD0iOC44MjgiLz4KCTxyZWN0IHg9IjExOS4xNyIgeT0iMjQzLjU5MSIgc3R5bGU9ImZpbGw6I0ZBQjQ0NjsiIHdpZHRoPSIxNy42NTUiIGhlaWdodD0iMTUuOTkyIi8+CjwvZz4KPHJlY3QgeD0iNzUuMDMiIHk9IjIzOC4zNDEiIHN0eWxlPSJmaWxsOiNGNUY1RjU7IiB3aWR0aD0iMTcuNjU1IiBoZWlnaHQ9Ijc1LjAzIi8+CjxnPgoJPHJlY3QgeD0iNzAuNjIiIHk9IjMwOC45NzEiIHN0eWxlPSJmaWxsOiNGQUI0NDY7IiB3aWR0aD0iMjYuNDgzIiBoZWlnaHQ9IjguODI4Ii8+Cgk8cmVjdCB4PSI3MC42MiIgeT0iMjI5LjUyMSIgc3R5bGU9ImZpbGw6I0ZBQjQ0NjsiIHdpZHRoPSIyNi40ODMiIGhlaWdodD0iOC44MjgiLz4KPC9nPgo8cmVjdCB4PSI2Ni4yMSIgeT0iMzE3Ljc5MSIgc3R5bGU9ImZpbGw6IzUwNjRBQTsiIHdpZHRoPSIzNS4zMSIgaGVpZ2h0PSI4LjgyOCIvPgo8cmVjdCB4PSIyMDcuNDUiIHk9IjMwOC45NzEiIHN0eWxlPSJmaWxsOiNGQUI0NDY7IiB3aWR0aD0iMjYuNDgzIiBoZWlnaHQ9IjguODI4Ii8+CjxyZWN0IHg9IjE5OC42MiIgeT0iMzE3Ljc5MSIgc3R5bGU9ImZpbGw6IzUwNjRBQTsiIHdpZHRoPSIzNS4zMSIgaGVpZ2h0PSI4LjgyOCIvPgo8cmVjdCB4PSIxMjMuNTkiIHk9IjIyMC42OTEiIHN0eWxlPSJmaWxsOiNGQUI0NDY7IiB3aWR0aD0iNTIuOTY2IiBoZWlnaHQ9IjguODI4Ii8+CjxyZWN0IHg9IjE0NS42NiIgeT0iMTk0LjIxMSIgc3R5bGU9ImZpbGw6I0ZGQjQ0MTsiIHdpZHRoPSI4LjgyOCIgaGVpZ2h0PSIyNi40ODMiLz4KPGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRjVGNUY1OyIgZD0iTTE0MS4yNDEsMjA3LjQ0OWMtNy4zMDIsMC0xMy4yNDEtNS45NC0xMy4yNDEtMTMuMjQxYzAtNy4zMDIsNS45NC0xMy4yNDEsMTMuMjQxLTEzLjI0MSAgIGM3LjMwMiwwLDEzLjI0MSw1Ljk0LDEzLjI0MSwxMy4yNDFDMTU0LjQ4MywyMDEuNTA5LDE0OC41NDMsMjA3LjQ0OSwxNDEuMjQxLDIwNy40NDl6IE0xNDEuMjQxLDE4OS43OTQgICBjLTIuNDM1LDAtNC40MTQsMS45NzgtNC40MTQsNC40MTRjMCwyLjQzNSwxLjk3OCw0LjQxNCw0LjQxNCw0LjQxNHM0LjQxNC0xLjk3OCw0LjQxNC00LjQxNCAgIEMxNDUuNjU1LDE5MS43NzMsMTQzLjY3NywxODkuNzk0LDE0MS4yNDEsMTg5Ljc5NHoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNGNUY1RjU7IiBkPSJNMTU4Ljg5NywyMDcuNDQ5Yy03LjMwMiwwLTEzLjI0MS01Ljk0LTEzLjI0MS0xMy4yNDFjMC03LjMwMiw1Ljk0LTEzLjI0MSwxMy4yNDEtMTMuMjQxICAgYzcuMzAyLDAsMTMuMjQxLDUuOTQsMTMuMjQxLDEzLjI0MVMxNjYuMTk4LDIwNy40NDksMTU4Ljg5NywyMDcuNDQ5eiBNMTU4Ljg5NywxODkuNzk0Yy0yLjQzNSwwLTQuNDE0LDEuOTc4LTQuNDE0LDQuNDE0ICAgYzAsMi40MzUsMS45NzgsNC40MTQsNC40MTQsNC40MTRjMi40MzUsMCw0LjQxNC0xLjk3OCw0LjQxNC00LjQxNEMxNjMuMzEsMTkxLjc3MywxNjEuMzMyLDE4OS43OTQsMTU4Ljg5NywxODkuNzk0eiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0Y1RjVGNTsiIGQ9Ik0xNzYuNTUyLDIxNi4yNzdjLTcuMzAyLDAtMTMuMjQxLTUuOTQtMTMuMjQxLTEzLjI0MWMwLTcuMzAyLDUuOTQtMTMuMjQxLDEzLjI0MS0xMy4yNDEgICBjNy4zMDIsMCwxMy4yNDEsNS45NCwxMy4yNDEsMTMuMjQxUzE4My44NTMsMjE2LjI3NywxNzYuNTUyLDIxNi4yNzd6IE0xNzYuNTUyLDE5OC42MjJjLTIuNDM1LDAtNC40MTQsMS45NzgtNC40MTQsNC40MTQgICBjMCwyLjQzNSwxLjk3OCw0LjQxNCw0LjQxNCw0LjQxNGMyLjQzNSwwLDQuNDE0LTEuOTc4LDQuNDE0LTQuNDE0UzE3OC45ODcsMTk4LjYyMiwxNzYuNTUyLDE5OC42MjJ6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRjVGNUY1OyIgZD0iTTEyMy41ODYsMjE2LjI3N2MtNy4zMDIsMC0xMy4yNDEtNS45NC0xMy4yNDEtMTMuMjQxYzAtNy4zMDIsNS45NC0xMy4yNDEsMTMuMjQxLTEzLjI0MSAgIGM3LjMwMiwwLDEzLjI0MSw1Ljk0LDEzLjI0MSwxMy4yNDFDMTM2LjgyOCwyMTAuMzM3LDEzMC44ODgsMjE2LjI3NywxMjMuNTg2LDIxNi4yNzd6IE0xMjMuNTg2LDE5OC42MjIgICBjLTIuNDM1LDAtNC40MTQsMS45NzgtNC40MTQsNC40MTRjMCwyLjQzNSwxLjk3OCw0LjQxNCw0LjQxNCw0LjQxNHM0LjQxNC0xLjk3OSw0LjQxNC00LjQxNSAgIEMxMjgsMjAwLjYsMTI2LjAyMiwxOTguNjIyLDEyMy41ODYsMTk4LjYyMnoiLz4KPC9nPgo8cGF0aCBzdHlsZT0iZmlsbDojRkFCNDQ2OyIgZD0iTTE3Ni41NTIsMjkxLjMxMXY0LjQxNGMwLDIuNDM0LTEuOTgsNC40MTQtNC40MTQsNC40MTRzLTQuNDE0LTEuOTgtNC40MTQtNC40MTR2LTQuNDE0SDE3Ni41NTIgICBNMTg1LjM3OSwyODIuNDg0aC0yNi40ODN2MTMuMjQxYzAsNy4zMDIsNS45NCwxMy4yNDEsMTMuMjQxLDEzLjI0MWM3LjMwMiwwLDEzLjI0MS01Ljk0LDEzLjI0MS0xMy4yNDF2LTEzLjI0MUgxODUuMzc5eiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojRkZBMEQyOyIgZD0iTTE3Mi4xMzgsMjY0LjgyOUwxNzIuMTM4LDI2NC44MjljLTQuODc1LDAtOC44MjgtMy45NTMtOC44MjgtOC44Mjh2LTguODI4ICBjMC00Ljg3NSwzLjk1My04LjgyOCw4LjgyOC04LjgyOGwwLDBjNC44NzUsMCw4LjgyOCwzLjk1Myw4LjgyOCw4LjgyOHY4LjgyOEMxODAuOTY2LDI2MC44NzYsMTc3LjAxMywyNjQuODI5LDE3Mi4xMzgsMjY0LjgyOXoiLz4KPGNpcmNsZSBzdHlsZT0iZmlsbDojNTA2NEFBOyIgY3g9IjE1MC4wNyIgY3k9IjI3My42NTEiIHI9IjEzLjI0MSIvPgo8cmVjdCB4PSIxNDUuNjYiIHk9IjE3Ni41NTEiIHN0eWxlPSJmaWxsOiNGQUI0NDY7IiB3aWR0aD0iOC44MjgiIGhlaWdodD0iMjYuNDgzIi8+CjxwYXRoIHN0eWxlPSJmaWxsOiNDODQxNEI7IiBkPSJNMTIzLjU4NiwyMjAuNjkxbC04LjgyOC04LjgyOGw1LjE3MS01LjE3MWM3Ljk5My03Ljk5MywxOC44MzUtMTIuNDg0LDMwLjE0LTEyLjQ4NGwwLDAgIGMxMS4zMDUsMCwyMi4xNDYsNC40OTEsMzAuMTQsMTIuNDg0bDUuMTcxLDUuMTcxbC04LjgyOCw4LjgyOEgxMjMuNTg2eiIvPgo8Zz4KCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGRDI1MDsiIGN4PSIxNTAuMDciIGN5PSIyMTEuODYxIiByPSI0LjQxNCIvPgoJPGNpcmNsZSBzdHlsZT0iZmlsbDojRkZEMjUwOyIgY3g9IjEzMi40MSIgY3k9IjIxMS44NjEiIHI9IjQuNDE0Ii8+Cgk8Y2lyY2xlIHN0eWxlPSJmaWxsOiNGRkQyNTA7IiBjeD0iMTY3LjcyIiBjeT0iMjExLjg2MSIgcj0iNC40MTQiLz4KPC9nPgo8Zz4KCTxyZWN0IHg9IjcwLjYyIiB5PSIyNTYuMDAxIiBzdHlsZT0iZmlsbDojQzg0MTRCOyIgd2lkdGg9IjQ0LjE0IiBoZWlnaHQ9IjguODI4Ii8+Cgk8cG9seWdvbiBzdHlsZT0iZmlsbDojQzg0MTRCOyIgcG9pbnRzPSI3MC42MjEsMjkxLjMxMSA5Ny4xMDMsMjgyLjQ4NCA5Ny4xMDMsMjczLjY1NiA3MC42MjEsMjgyLjQ4NCAgIi8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==", tu = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxwYXRoIHN0eWxlPSJmaWxsOiM0MTQ3OUI7IiBkPSJNMTcwLjY2Nyw0MjMuNzIxSDguODI4Yy00Ljg3NSwwLTguODI4LTMuOTUzLTguODI4LTguODI4Vjk3LjFjMC00Ljg3NSwzLjk1My04LjgyOCw4LjgyOC04LjgyOCAgaDE2MS44MzlWNDIzLjcyMXoiLz4KPHJlY3QgeD0iMTcwLjY3IiB5PSI4OC4yNzciIHN0eWxlPSJmaWxsOiNGNUY1RjU7IiB3aWR0aD0iMTcwLjY3IiBoZWlnaHQ9IjMzNS40NSIvPgo8cGF0aCBzdHlsZT0iZmlsbDojRkY0QjU1OyIgZD0iTTUwMy4xNzIsNDIzLjcyMUgzNDEuMzMzVjg4LjI3M2gxNjEuODM5YzQuODc1LDAsOC44MjgsMy45NTMsOC44MjgsOC44Mjh2MzE3Ljc5MyAgQzUxMiw0MTkuNzcsNTA4LjA0Nyw0MjMuNzIxLDUwMy4xNzIsNDIzLjcyMXoiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==", su = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIuMDAyIDUxMi4wMDIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMi4wMDIgNTEyLjAwMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBzdHlsZT0iZmlsbDojNDE0NzlCOyIgZD0iTTUwMy4xNzIsNDIzLjcyNUg4LjgyOGMtNC44NzUsMC04LjgyOC0zLjk1My04LjgyOC04LjgyOFY5Ny4xMDRjMC00Ljg3NSwzLjk1My04LjgyOCw4LjgyOC04LjgyOCAgaDQ5NC4zNDVjNC44NzUsMCw4LjgyOCwzLjk1Myw4LjgyOCw4LjgyOHYzMTcuNzkzQzUxMiw0MTkuNzcyLDUwOC4wNDcsNDIzLjcyNSw1MDMuMTcyLDQyMy43MjV6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNGNUY1RjU7IiBkPSJNNTEyLDk3LjEwNGMwLTQuODc1LTMuOTUzLTguODI4LTguODI4LTguODI4aC0zOS40OTVsLTE2My41NCwxMDcuMTQ3Vjg4LjI3NmgtODguMjc2djEwNy4xNDcgIEw0OC4zMjIsODguMjc2SDguODI4QzMuOTUzLDg4LjI3NiwwLDkyLjIyOSwwLDk3LjEwNHYyMi44MzFsMTQwLjMwOSw5MS45MjdIMHY4OC4yNzZoMTQwLjMwOUwwLDM5Mi4wNjZ2MjIuODMxICBjMCw0Ljg3NSwzLjk1Myw4LjgyOCw4LjgyOCw4LjgyOGgzOS40OTVsMTYzLjU0LTEwNy4xNDd2MTA3LjE0N2g4OC4yNzZWMzE2LjU3OGwxNjMuNTQsMTA3LjE0N2gzOS40OTUgIGM0Ljg3NSwwLDguODI4LTMuOTUzLDguODI4LTguODI4di0yMi44MzFsLTE0MC4zMDktOTEuOTI3SDUxMnYtODguMjc2SDM3MS42OTFMNTEyLDExOS45MzVWOTcuMTA0eiIvPgo8Zz4KCTxwb2x5Z29uIHN0eWxlPSJmaWxsOiNGRjRCNTU7IiBwb2ludHM9IjUxMiwyMjkuNTE4IDI4Mi40ODMsMjI5LjUxOCAyODIuNDgzLDg4LjI3NiAyMjkuNTE3LDg4LjI3NiAyMjkuNTE3LDIyOS41MTggMCwyMjkuNTE4ICAgIDAsMjgyLjQ4MyAyMjkuNTE3LDI4Mi40ODMgMjI5LjUxNyw0MjMuNzI1IDI4Mi40ODMsNDIzLjcyNSAyODIuNDgzLDI4Mi40ODMgNTEyLDI4Mi40ODMgICIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGNEI1NTsiIGQ9Ik0xNzguOTQ4LDMwMC4xMzhMMC4yNSw0MTYuMTM1YzAuNjI1LDQuMjYzLDQuMTQsNy41OSw4LjU3Nyw3LjU5aDEyLjE1OWwxOTAuMzktMTIzLjU4NmgtMzIuNDI4ICAgVjMwMC4xMzh6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRkY0QjU1OyIgZD0iTTM0Ni4zODgsMzAwLjEzOEgzMTMuOTZsMTkwLjExMywxMjMuNDA0YzQuNDMxLTAuNDcyLDcuOTI4LTQuMDksNy45MjgtOC42NDZ2LTcuMjU4ICAgTDM0Ni4zODgsMzAwLjEzOHoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNGRjRCNTU7IiBkPSJNMCwxMDYuODQ5bDE2MS43NzksMTA1LjAxNGgzMi40MjhMNS4xNDMsODkuMTM3QzIuMTIzLDkwLjU0LDAsOTMuNTU1LDAsOTcuMTA0VjEwNi44NDl6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRkY0QjU1OyIgZD0iTTMzMi41NjYsMjExLjg2M0w1MTEuNjkzLDk1LjU4NmMtMC43NDQtNC4xMjItNC4xODQtNy4zMDktOC41MjEtNy4zMDloLTEyLjY0N0wzMDAuMTM4LDIxMS44NjMgICBIMzMyLjU2NnoiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K", iu = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIuMDAxIDUxMi4wMDEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMi4wMDEgNTEyLjAwMTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBzdHlsZT0iZmlsbDojRkY0QjU1OyIgZD0iTTUxMiwyMDAuMDkzSDBWOTcuMTA0YzAtNC44NzUsMy45NTMtOC44MjgsOC44MjgtOC44MjhoNDk0LjM0NWM0Ljg3NSwwLDguODI4LDMuOTUzLDguODI4LDguODI4ICBMNTEyLDIwMC4wOTNMNTEyLDIwMC4wOTN6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiM3M0FGMDA7IiBkPSJNNTAzLjE3Miw0MjMuNzI1SDguODI4Yy00Ljg3NSwwLTguODI4LTMuOTUzLTguODI4LTguODI4VjMxMS45MDloNTEydjEwMi45ODggIEM1MTIsNDE5Ljc3Myw1MDguMDQ3LDQyMy43MjUsNTAzLjE3Miw0MjMuNzI1eiIvPgo8cmVjdCB5PSIyMDAuMDkxIiBzdHlsZT0iZmlsbDojRjVGNUY1OyIgd2lkdGg9IjUxMiIgaGVpZ2h0PSIxMTEuODEiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==", nu = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxwYXRoIHN0eWxlPSJmaWxsOiM3M0FGMDA7IiBkPSJNMTcwLjY2Nyw0MjMuNzIxSDguODI4Yy00Ljg3NSwwLTguODI4LTMuOTUzLTguODI4LTguODI4Vjk3LjFjMC00Ljg3NSwzLjk1My04LjgyOCw4LjgyOC04LjgyOCAgaDE2MS44MzlWNDIzLjcyMXoiLz4KPHJlY3QgeD0iMTcwLjY3IiB5PSI4OC4yNzciIHN0eWxlPSJmaWxsOiNGNUY1RjU7IiB3aWR0aD0iMTcwLjY3IiBoZWlnaHQ9IjMzNS40NSIvPgo8cGF0aCBzdHlsZT0iZmlsbDojRkY0QjU1OyIgZD0iTTUwMy4xNzIsNDIzLjcyMUgzNDEuMzMzVjg4LjI3M2gxNjEuODM5YzQuODc1LDAsOC44MjgsMy45NTMsOC44MjgsOC44Mjh2MzE3Ljc5MyAgQzUxMiw0MTkuNzcsNTA4LjA0Nyw0MjMuNzIxLDUwMy4xNzIsNDIzLjcyMXoiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==", ou = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIuMDAxIDUxMi4wMDEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMi4wMDEgNTEyLjAwMTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBzdHlsZT0iZmlsbDojRjVGNUY1OyIgZD0iTTUwMy4xNzIsNDIzLjcyNUg4LjgyOGMtNC44NzUsMC04LjgyOC0zLjk1My04LjgyOC04LjgyOFY5Ny4xMDRjMC00Ljg3NSwzLjk1My04LjgyOCw4LjgyOC04LjgyOCAgaDQ5NC4zNDVjNC44NzUsMCw4LjgyOCwzLjk1Myw4LjgyOCw4LjgyOHYzMTcuNzkzQzUxMiw0MTkuNzczLDUwOC4wNDcsNDIzLjcyNSw1MDMuMTcyLDQyMy43MjV6Ii8+CjxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGNEI1NTsiIGN4PSIyNTYiIGN5PSIyNTYuMDAxIiByPSI5Ny4xIi8+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=", lu = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIuMDAxIDUxMi4wMDEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMi4wMDEgNTEyLjAwMTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBzdHlsZT0iZmlsbDojRkY0QjU1OyIgZD0iTTAsMjU2aDUxMnYxNTguODk3YzAsNC44NzUtMy45NTMsOC44MjgtOC44MjgsOC44MjhIOC44MjhjLTQuODc1LDAtOC44MjgtMy45NTMtOC44MjgtOC44MjhWMjU2eiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojRjVGNUY1OyIgZD0iTTUxMiwyNTZIMFY5Ny4xMDNjMC00Ljg3NSwzLjk1My04LjgyOCw4LjgyOC04LjgyOGg0OTQuMzQ1YzQuODc1LDAsOC44MjgsMy45NTMsOC44MjgsOC44MjhMNTEyLDI1NiAgTDUxMiwyNTZ6Ii8+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=", au = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIuMDAxIDUxMi4wMDEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMi4wMDEgNTEyLjAwMTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBzdHlsZT0iZmlsbDojRkY0QjU1OyIgZD0iTTUwMy4xNzIsNDIzLjcyNUg4LjgyOGMtNC44NzUsMC04LjgyOC0zLjk1My04LjgyOC04LjgyOFY5Ny4xMDRjMC00Ljg3NSwzLjk1My04LjgyOCw4LjgyOC04LjgyOCAgaDQ5NC4zNDVjNC44NzUsMCw4LjgyOCwzLjk1Myw4LjgyOCw4LjgyOHYzMTcuNzkzQzUxMiw0MTkuNzczLDUwOC4wNDcsNDIzLjcyNSw1MDMuMTcyLDQyMy43MjV6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiM3M0FGMDA7IiBkPSJNMTg1LjM3OSw4OC4yNzdIOC44MjhDMy45NTMsODguMjc3LDAsOTIuMjI5LDAsOTcuMTA0djMxNy43OTNjMCw0Ljg3NSwzLjk1Myw4LjgyOCw4LjgyOCw4LjgyOCAgSDE4NS4zOFY4OC4yNzdIMTg1LjM3OXoiLz4KPGNpcmNsZSBzdHlsZT0iZmlsbDojRkZFMTVBOyIgY3g9IjE4NS40NSIgY3k9IjI1Ni4wMDEiIHI9Ijc5LjM4Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNGRjRCNTU7IiBkPSJNMjExLjkzMiwyMjkuNTE4djM1LjMxYzAsMTQuNjAzLTExLjg4LDI2LjQ4My0yNi40ODMsMjYuNDgzcy0yNi40ODMtMTEuODgtMjYuNDgzLTI2LjQ4M3YtMzUuMzEgIEgyMTEuOTMyIE0yMjAuNzU5LDIxMS44NjNoLTcwLjYyMWMtNC44NzUsMC04LjgyOCwzLjk1My04LjgyOCw4LjgyOHY0NC4xMzhjMCwyNC4zNzYsMTkuNzYyLDQ0LjEzOCw0NC4xMzgsNDQuMTM4ICBzNDQuMTM4LTE5Ljc2Miw0NC4xMzgtNDQuMTM4di00NC4xMzhDMjI5LjU4NywyMTUuODE2LDIyNS42MzQsMjExLjg2MywyMjAuNzU5LDIxMS44NjNMMjIwLjc1OSwyMTEuODYzeiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojRjVGNUY1OyIgZD0iTTIxMS45MzIsMjI5LjUxOHYzNS4zMWMwLDE0LjYwMy0xMS44OCwyNi40ODMtMjYuNDgzLDI2LjQ4M3MtMjYuNDgzLTExLjg4LTI2LjQ4My0yNi40ODN2LTM1LjMxICBIMjExLjkzMiIvPgo8Zz4KCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGRTE1QTsiIGN4PSIxNTAuMDciIGN5PSIyMjAuNjkxIiByPSI0LjQxNCIvPgoJPGNpcmNsZSBzdHlsZT0iZmlsbDojRkZFMTVBOyIgY3g9IjIyMC42OSIgY3k9IjIyMC42OTEiIHI9IjQuNDE0Ii8+Cgk8Y2lyY2xlIHN0eWxlPSJmaWxsOiNGRkUxNUE7IiBjeD0iMTUwLjA3IiBjeT0iMjU2LjAwMSIgcj0iNC40MTQiLz4KCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGRTE1QTsiIGN4PSIyMjAuNjkiIGN5PSIyNTYuMDAxIiByPSI0LjQxNCIvPgoJPGNpcmNsZSBzdHlsZT0iZmlsbDojRkZFMTVBOyIgY3g9IjE4NS4zOCIgY3k9IjIyMC42OTEiIHI9IjQuNDE0Ii8+Cgk8Y2lyY2xlIHN0eWxlPSJmaWxsOiNGRkUxNUE7IiBjeD0iMjExLjg4IiBjeT0iMjg4LjU1MSIgcj0iNC40MTQiLz4KCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGRTE1QTsiIGN4PSIxNTkuNCIgY3k9IjI4OC41NTEiIHI9IjQuNDE0Ii8+CjwvZz4KPGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojNDE0NzlCOyIgZD0iTTE5MS4xNDksMjUzLjc2M3Y3LjYwMmMwLDMuMTQ0LTIuNTU4LDUuNzAyLTUuNzAyLDUuNzAycy01LjcwMi0yLjU1OC01LjcwMi01LjcwMnYtNy42MDIgICBMMTkxLjE0OSwyNTMuNzYzIi8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojNDE0NzlCOyIgZD0iTTE5MS4xNDksMjM1Ljc0MXY3LjYwMmMwLDMuMTQ0LTIuNTU4LDUuNzAyLTUuNzAyLDUuNzAycy01LjcwMi0yLjU1OC01LjcwMi01LjcwMnYtNy42MDJIMTkxLjE0OSIvPgoJPHBhdGggc3R5bGU9ImZpbGw6IzQxNDc5QjsiIGQ9Ik0xOTEuMTQ5LDI3MS45N3Y3LjYwMmMwLDMuMTQ0LTIuNTU4LDUuNzAyLTUuNzAyLDUuNzAycy01LjcwMi0yLjU1OC01LjcwMi01LjcwMnYtNy42MDJIMTkxLjE0OSIvPgoJPHBhdGggc3R5bGU9ImZpbGw6IzQxNDc5QjsiIGQ9Ik0yMDYuNTA2LDI1My43NjN2Ny42MDJjMCwzLjE0NC0yLjU1OCw1LjcwMi01LjcwMiw1LjcwMnMtNS43MDItMi41NTgtNS43MDItNS43MDJ2LTcuNjAyICAgTDIwNi41MDYsMjUzLjc2MyIvPgoJPHBhdGggc3R5bGU9ImZpbGw6IzQxNDc5QjsiIGQ9Ik0xNzUuNzk0LDI1My43NjN2Ny42MDJjMCwzLjE0NC0yLjU1OCw1LjcwMi01LjcwMiw1LjcwMnMtNS43MDItMi41NTgtNS43MDItNS43MDJ2LTcuNjAyICAgTDE3NS43OTQsMjUzLjc2MyIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=", ru = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIuMDAxIDUxMi4wMDEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMi4wMDEgNTEyLjAwMTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBzdHlsZT0iZmlsbDojRjVGNUY1OyIgZD0iTTUxMiwyMDAuMDkzSDBWOTcuMTA0YzAtNC44NzUsMy45NTMtOC44MjgsOC44MjgtOC44MjhoNDk0LjM0NWM0Ljg3NSwwLDguODI4LDMuOTUzLDguODI4LDguODI4ICBMNTEyLDIwMC4wOTNMNTEyLDIwMC4wOTN6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNGRjRCNTU7IiBkPSJNNTAzLjE3Miw0MjMuNzI1SDguODI4Yy00Ljg3NSwwLTguODI4LTMuOTUzLTguODI4LTguODI4VjMxMS45MDloNTEydjEwMi45ODggIEM1MTIsNDE5Ljc3Myw1MDguMDQ3LDQyMy43MjUsNTAzLjE3Miw0MjMuNzI1eiIvPgo8cmVjdCB5PSIyMDAuMDkxIiBzdHlsZT0iZmlsbDojNDE0NzlCOyIgd2lkdGg9IjUxMiIgaGVpZ2h0PSIxMTEuODEiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==", uu = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIuMDAxIDUxMi4wMDEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMi4wMDEgNTEyLjAwMTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBzdHlsZT0iZmlsbDojNDE3M0NEOyIgZD0iTTUwMy4xNzIsNDIzLjcyNUg4LjgyOGMtNC44NzUsMC04LjgyOC0zLjk1My04LjgyOC04LjgyOFY5Ny4xMDRjMC00Ljg3NSwzLjk1My04LjgyOCw4LjgyOC04LjgyOCAgaDQ5NC4zNDVjNC44NzUsMCw4LjgyOCwzLjk1Myw4LjgyOCw4LjgyOHYzMTcuNzkzQzUxMiw0MTkuNzczLDUwOC4wNDcsNDIzLjcyNSw1MDMuMTcyLDQyMy43MjV6Ii8+Cjxwb2x5Z29uIHN0eWxlPSJmaWxsOiNGRkUxNUE7IiBwb2ludHM9IjUxMiwyMjkuNTE4IDIxMS44NjIsMjI5LjUxOCAyMTEuODYyLDg4LjI3NyAxNTguODk3LDg4LjI3NyAxNTguODk3LDIyOS41MTggMCwyMjkuNTE4ICAgMCwyODIuNDg0IDE1OC44OTcsMjgyLjQ4NCAxNTguODk3LDQyMy43MjUgMjExLjg2Miw0MjMuNzI1IDIxMS44NjIsMjgyLjQ4NCA1MTIsMjgyLjQ4NCAiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==", du = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIuMDAxIDUxMi4wMDEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMi4wMDEgNTEyLjAwMTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBzdHlsZT0iZmlsbDojRkY0QjU1OyIgZD0iTTUwMy4xNzIsNDIzLjcyNUg4LjgyOGMtNC44NzUsMC04LjgyOC0zLjk1My04LjgyOC04LjgyOFY5Ny4xMDRjMC00Ljg3NSwzLjk1My04LjgyOCw4LjgyOC04LjgyOCAgaDQ5NC4zNDVjNC44NzUsMCw4LjgyOCwzLjk1Myw4LjgyOCw4LjgyOHYzMTcuNzkzQzUxMiw0MTkuNzczLDUwOC4wNDcsNDIzLjcyNSw1MDMuMTcyLDQyMy43MjV6Ii8+CjxnPgoJPHBhdGggc3R5bGU9ImZpbGw6I0Y1RjVGNTsiIGQ9Ik0yNTMuNDc0LDIyNS43NTNsMTMuODM3LDE4LjEwMWwyMS42MDYtNy4yMzJjMS4yMDgtMC40MDQsMi4yMzYsMC45NjIsMS41MTIsMi4wMWwtMTIuOTM5LDE4Ljc1MyAgIGwxMy41NTUsMTguMzE0YzAuNzU4LDEuMDI0LTAuMjI0LDIuNDIzLTEuNDQ0LDIuMDU5bC0yMS44MzQtNi41MTFsLTEzLjIyOCwxOC41NWMtMC43MzksMS4wMzctMi4zNzUsMC41MzYtMi40MDYtMC43MzcgICBsLTAuNTU1LTIyLjc3N2wtMjEuNzMtNi44NDljLTEuMjE1LTAuMzgzLTEuMjQ0LTIuMDkyLTAuMDQyLTIuNTE1bDIxLjQ5MS03LjU2NmwtMC4yMDItMjIuNzgzICAgQzI1MS4wODMsMjI1LjI5NiwyNTIuNzAxLDIyNC43NDEsMjUzLjQ3NCwyMjUuNzUzeiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0Y1RjVGNTsiIGQ9Ik0xNzYuOTU2LDMyNi42NjJjLTM4Ljk5NSwwLTcwLjYyNy0zMS42MzMtNzAuNjI3LTcwLjY2M2MwLTM4Ljk1OCwzMS42MzMtNzAuNjYyLDcwLjYyNy03MC42NjIgICBjMTQuNTA4LDAsMjcuODg3LDQuNDYyLDM5LjAzNywxMi4wMTRjMS43MDcsMS4xNTYsMy42NTYtMS4wODcsMi4yMjctMi41NzNjLTE2LjY2NC0xNy4zMjUtNDAuMjQ4LTI3Ljg5NC02Ni4zOTgtMjcuMDAxICAgYy00NC45MjYsMS41MzMtODIuMTE4LDM3LjU1My04NC45ODksODIuNDEzYy0zLjI4Nyw1MS4zODMsMzcuMzk5LDk0LjA4Niw4OC4wNTUsOTQuMDg2YzI0Ljk1MywwLDQ3LjM3OS0xMC40MzIsNjMuMzkzLTI3LjExMiAgIGMxLjQxNS0xLjQ3My0wLjUzOC0zLjY4My0yLjIyOS0yLjUzN0MyMDQuODksMzIyLjE5NiwxOTEuNDg5LDMyNi42NjIsMTc2Ljk1NiwzMjYuNjYyeiIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=", Le = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    BR: Jr,
    CN: Xr,
    DE: qr,
    ES: eu,
    FR: tu,
    GB: su,
    HU: iu,
    IT: nu,
    JP: ou,
    PL: lu,
    PT: au,
    RU: ru,
    SE: uu,
    TR: du
  }, Symbol.toStringTag, { value: "Module" })), He = (e) => {
    if (e && e.id)
      return !0;
  }, cu = (e) => {
    try {
      const { firstName: s } = e;
      if (s)
        return !0;
    } catch {
    }
    return !1;
  }, hu = (e) => `${e.firstName}${e.lastName ? ` ${e.lastName}` : ""}`, Y = {
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
  Y.network;
  const gu = [Y.message, Y.audio, Y.conferencing, Y.screenshare], ee = (e) => {
    const s = Object.keys(Y);
    return e.filter((t) => s.indexOf(t)) !== -1;
  };
  const mu = {
    name: "vu-rich-user-tooltip",
    emits: ["network", "message", "audio", "conferencing", "screenshare", "see-profile"],
    directives: {
      "click-outside": de
    },
    inject: {
      vuUserLabels: {
        default: () => Kr
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
        validator: He,
        required: !0
      },
      disabledActions: {
        type: Array,
        validator: ee,
        required: !1,
        default: () => []
      },
      hiddenActions: {
        type: Array,
        validator: ee,
        required: !1,
        default: () => []
      },
      side: {
        type: String,
        default: "bottom"
      },
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
      actions: Y,
      RHSactions: gu,
      uuid: $,
      getFullname: hu,
      validateName: cu,
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
        return !this.user.countryCode || !Le[this.user.countryCode.toUpperCase()] ? !1 : Le[this.user.countryCode.toUpperCase()];
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
    }
  }, Mu = (e) => (vue.pushScopeId("data-v-38304617"), e = e(), vue.popScopeId(), e), yu = { class: "rich-user-tooltip__header__wrap-name" }, vu = /* @__PURE__ */ Mu(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "rich-user-tooltip__header__topbar" }, null, -1)), pu = { class: "rich-user-tooltip__avatar-wrap" }, fu = {
    key: 0,
    class: "rich-user-tooltip__info"
  }, bu = {
    key: 0,
    class: "rich-user-tooltip__info__company"
  }, ju = {
    key: 1,
    class: "rich-user-tooltip__info__locale"
  }, _u = ["src"], wu = {
    key: 1,
    class: "rich-user-tooltip__info__country"
  }, Lu = { class: "rich-user-tooltip__contacts__label" }, Iu = { class: "rich-user-tooltip__contacts__list" }, Nu = { class: "rich-user-tooltip__footer" }, Cu = { class: "rich-user-tooltip__footer__left" };
  function Du(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-user-picture"), d = vue.resolveComponent("vu-icon-btn"), u = vue.resolveComponent("vu-popover"), g = vue.resolveDirective("tooltip");
    return vue.openBlock(), vue.createBlock(u, {
      side: t.side,
      show: t.show,
      arrow: "",
      shift: "",
      positions: ["bottom", "top"],
      attach: "body",
      contentClass: "vu-rich-user-tooltip",
      activator: t.activator
    }, vue.createSlots({
      default: vue.withCtx(() => [
        vue.renderSlot(e.$slots, "default", {}, () => [
          vue.withDirectives(vue.createVNode(r, {
            id: t.user.id,
            clickable: "",
            src: t.user.imgSrc,
            presence: t.user.presence,
            class: "rich-user-tooltip__default-content"
          }, null, 8, ["id", "src", "presence"]), [
            [
              g,
              e.getFullname(t.user),
              void 0,
              { top: !0 }
            ]
          ])
        ], !0)
      ]),
      arrow: vue.withCtx(({ side: y, shift: f }) => [
        vue.withDirectives(vue.createElementVNode("div", {
          class: vue.normalizeClass(["rich-user-tooltip__arrow popover-arrow", `rich-user-tooltip__arrow--${y}`])
        }, null, 2), [
          [vue.vShow, !f]
        ])
      ]),
      title: vue.withCtx(({ side: y }) => [
        vue.createElementVNode("div", {
          class: vue.normalizeClass(["rich-user-tooltip__header", `rich-user-tooltip__header--${y}`])
        }, [
          vue.createElementVNode("div", yu, [
            vue.withDirectives((vue.openBlock(), vue.createElementBlock("label", {
              class: "rich-user-tooltip__header__name",
              onClick: s[0] || (s[0] = (f) => e.$emit("see-profile", t.user.id))
            }, [
              vue.createTextVNode(vue.toDisplayString(e.getFullname(t.user)), 1)
            ])), [
              [g, e.getFullname(t.user)]
            ])
          ]),
          vu,
          vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", pu, [
            vue.createVNode(r, {
              class: "rich-user-tooltip__header__avatar",
              size: "big",
              clickable: !0,
              id: t.user && t.user.id,
              gutter: !0,
              presence: t.user.presence,
              onClick: s[1] || (s[1] = (f) => e.$emit("see-profile", t.user.id))
            }, null, 8, ["id", "presence"])
          ])), [
            [
              g,
              e.getFullname(t.user),
              void 0,
              { bottom: !0 }
            ]
          ])
        ], 2)
      ]),
      _: 2
    }, [
      (i.hasInfo || i.hasContacts, {
        name: "body",
        fn: vue.withCtx(() => [
          i.hasInfo ? (vue.openBlock(), vue.createElementBlock("div", fu, [
            t.user.company ? (vue.openBlock(), vue.createElementBlock("label", bu, vue.toDisplayString(t.user.company), 1)) : vue.createCommentVNode("", !0),
            i.countryImg || i.countryLabel ? (vue.openBlock(), vue.createElementBlock("label", ju, [
              i.countryImg ? (vue.openBlock(), vue.createElementBlock("img", {
                key: 0,
                class: "rich-user-tooltip__info__flag",
                src: i.countryImg
              }, null, 8, _u)) : vue.createCommentVNode("", !0),
              i.countryLabel ? (vue.openBlock(), vue.createElementBlock("span", wu, vue.toDisplayString(i.countryLabel), 1)) : vue.createCommentVNode("", !0)
            ])) : vue.createCommentVNode("", !0)
          ])) : vue.createCommentVNode("", !0),
          vue.renderSlot(e.$slots, "content", {}, void 0, !0),
          i.hasContacts ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
            vue.createElementVNode("label", Lu, [
              vue.createTextVNode(vue.toDisplayString(e.contactsLabelPart1), 1),
              vue.withDirectives((vue.openBlock(), vue.createElementBlock("span", {
                class: "rich-user-tooltip__contacts__amount",
                onClick: s[2] || (s[2] = (y) => e.$emit("see-profile", t.user.id))
              }, [
                vue.createTextVNode(vue.toDisplayString(i.contacts.length), 1)
              ])), [
                [
                  g,
                  i.vuUserLabels.profile,
                  void 0,
                  { bottom: !0 }
                ]
              ]),
              e.contactsLabelPart2 ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                vue.createTextVNode(vue.toDisplayString(e.contactsLabelPart2), 1)
              ], 64)) : vue.createCommentVNode("", !0)
            ]),
            vue.createElementVNode("div", Iu, [
              (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(i.visibleContacts, (y) => vue.withDirectives((vue.openBlock(), vue.createBlock(r, {
                key: y.id || e.uuid(),
                id: y.id || e.uuid(),
                clickable: !0,
                onClick: (f) => e.$emit("see-profile", y.id)
              }, null, 8, ["id", "onClick"])), [
                [
                  g,
                  e.getFullname(y),
                  void 0,
                  { bottom: !0 }
                ]
              ])), 128)),
              i.overflowContact ? vue.withDirectives((vue.openBlock(), vue.createBlock(r, {
                key: 0,
                class: "rich-user-tooltip__overflow_contact",
                style: vue.normalizeStyle({
                  "--numberOfOverflowingContacts": i.numberOfOverflowingContactsCssVariable
                }),
                clickable: !0,
                hoverable: "",
                id: i.overflowContact.id || e.uuid(),
                onClick: s[3] || (s[3] = (y) => e.$emit("see-profile", i.overflowContact.id))
              }, null, 8, ["style", "id"])), [
                [
                  g,
                  i.vuUserLabels.profile,
                  void 0,
                  { bottom: !0 }
                ]
              ]) : vue.createCommentVNode("", !0)
            ])
          ], 64)) : vue.createCommentVNode("", !0),
          vue.createElementVNode("div", Nu, [
            vue.createElementVNode("div", Cu, [
              vue.renderSlot(e.$slots, "footer-left", {}, () => [
                t.hiddenActions.length && t.hiddenActions.includes("network") ? vue.createCommentVNode("", !0) : vue.withDirectives((vue.openBlock(), vue.createBlock(d, {
                  key: 0,
                  icon: e.actions.network.icon,
                  class: "add-network",
                  disabled: t.disabledActions.length > 0 && t.disabledActions.includes("network"),
                  onClick: s[4] || (s[4] = (y) => {
                    i.isDisabled("network") || e.$emit("network", t.user.id);
                  })
                }, null, 8, ["icon", "disabled"])), [
                  [
                    g,
                    i.vuUserLabels.network,
                    void 0,
                    { bottom: !0 }
                  ]
                ])
              ], !0)
            ]),
            vue.renderSlot(e.$slots, "footer-right", {}, () => [
              (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(e.RHSactions, (y) => (vue.openBlock(), vue.createElementBlock(vue.Fragment, {
                key: y.name
              }, [
                t.hiddenActions.length && t.hiddenActions.includes(y.name) ? vue.createCommentVNode("", !0) : vue.withDirectives((vue.openBlock(), vue.createBlock(d, {
                  key: 0,
                  class: "right-btn",
                  icon: y.icon,
                  disabled: i.isDisabled(y.name),
                  onClick: (f) => {
                    i.isDisabled(y.name) || e.$emit(y.name, t.user.id);
                  }
                }, null, 8, ["icon", "disabled", "onClick"])), [
                  [
                    g,
                    i.vuUserLabels[y.name],
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
  const Tu = /* @__PURE__ */ w(mu, [["render", Du], ["__scopeId", "data-v-38304617"]]), ku = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Tu
  }, Symbol.toStringTag, { value: "Module" }));
  const zu = {
    name: "vu-user-name",
    props: {
      firstName: String,
      lastName: String,
      toUpper: {
        type: Boolean,
        required: !1,
        default: !0
      },
      shift: Boolean,
      clickable: Boolean
    },
    computed: {
      _lastName() {
        return this.toUpper ? this.lastName.toUpperCase() : this.lastName;
      }
    }
  };
  function Su(e, s, t, l, a, i) {
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["vu-user-name", [
        "vu-user-name--default-color",
        "vu-user-name--default-size",
        { "vu-user-name--with-avatar": t.shift },
        { "vu-user-name--clickable": t.clickable }
      ]])
    }, [
      vue.renderSlot(e.$slots, "default", {}, () => [
        vue.createElementVNode("span", {
          class: "content",
          onClick: s[0] || (s[0] = (r) => e.$emit("click"))
        }, vue.toDisplayString(t.firstName + " " + i._lastName), 1)
      ], !0)
    ], 2);
  }
  const Ou = /* @__PURE__ */ w(zu, [["render", Su], ["__scopeId", "data-v-5ae1fb82"]]), xu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Ou
  }, Symbol.toStringTag, { value: "Module" })), ne = {
    offline: "status-empty",
    online: "status-ok",
    busy: "status-noway",
    away: "status-clock"
  };
  const Pu = {
    name: "vu-user-picture",
    inject: [
      "vuUserPictureSrcUrl"
    ],
    props: {
      size: {
        type: String,
        default: "medium",
        validator: (e) => ["tiny", "small", "medium", "medium-1", "big", "large", "extra-large"].includes(e)
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
      presence: {
        type: String,
        required: !1,
        validator: (e) => e ? ne[e] !== void 0 : !0
      },
      src: {
        type: String,
        required: !1
      },
      id: {
        type: String,
        required: !1
      }
    },
    data: () => ({
      presenceStates: ne,
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
        return this.presence && ne[this.presence];
      },
      _src() {
        return this.vuUserPictureSrcUrl && this.id && !this.src ? `${this.vuUserPictureSrcUrl}/${this.id}` : this.src;
      }
    }
  }, Au = {
    key: 0,
    class: "vu-user-picture__hover-mask"
  }, Eu = {
    key: 1,
    class: "vu-presence"
  };
  function Bu(e, s, t, l, a, i) {
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(["vu-user-picture", [t.size ? `vu-user-picture--${t.size}` : "", {
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
      vue.createElementVNode("div", {
        class: "vu-user-picture-wrap",
        style: vue.normalizeStyle([t.presence ? { background: "inherit" } : ""])
      }, [
        vue.createElementVNode("div", {
          class: "vu-user-picture__image",
          style: vue.normalizeStyle({ "background-image": `url(${i._src})` })
        }, null, 4),
        e.hovered ? (vue.openBlock(), vue.createElementBlock("div", Au)) : vue.createCommentVNode("", !0),
        t.size !== "tiny" ? (vue.openBlock(), vue.createElementBlock("div", Eu, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass(`vu-presence__indicator vu-presence__indicator--${t.presence}`)
          }, null, 2)
        ])) : vue.createCommentVNode("", !0)
      ], 4)
    ], 34);
  }
  const Uu = /* @__PURE__ */ w(Pu, [["render", Bu], ["__scopeId", "data-v-d59f012e"]]), Zu = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Uu
  }, Symbol.toStringTag, { value: "Module" }));
  const Gu = {
    name: "vu-user",
    emits: ["click-other-user", "click-user"],
    props: {
      user: {
        type: Object,
        required: !0,
        validator: He
      },
      disabledActions: {
        required: !1,
        validator: ee
      },
      hiddenActions: {
        required: !1,
        validator: ee
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
        validator: Pe
      }
    },
    computed: {
      listeners() {
        return Z(this.$attrs, !0);
      }
    },
    data: () => ({
      getListenersFromAttrs: Z
    })
  }, Yu = { class: "vu-user" };
  function Qu(e, s, t, l, a, i) {
    const r = vue.resolveComponent("vu-user-picture"), d = vue.resolveComponent("vu-user-name"), u = vue.resolveComponent("vu-rich-user-tooltip");
    return vue.openBlock(), vue.createElementBlock("div", Yu, [
      t.showUserTooltip ? (vue.openBlock(), vue.createBlock(u, vue.mergeProps({
        key: 0,
        user: t.user,
        disabledActions: t.disabledActions,
        hiddenActions: t.hiddenActions,
        attach: t.attach
      }, vue.toHandlers(i.listeners.vOn || {})), {
        default: vue.withCtx(() => [
          t.showPicture ? (vue.openBlock(), vue.createBlock(r, {
            key: 0,
            id: t.user.id,
            src: t.user.imgSrc,
            presence: t.user.presence,
            clickable: t.clickable,
            style: vue.normalizeStyle({ background: t.pictureBackground }),
            onClick: s[0] || (s[0] = (g) => e.$emit("click-user", e.value))
          }, null, 8, ["id", "src", "presence", "clickable", "style"])) : vue.createCommentVNode("", !0),
          t.showName ? (vue.openBlock(), vue.createBlock(d, {
            key: 1,
            firstName: t.user.firstName,
            lastName: t.user.lastName,
            clickable: t.clickable,
            shift: t.showPicture,
            onClick: s[1] || (s[1] = (g) => e.$emit("click-user", g))
          }, {
            default: vue.withCtx(() => [
              vue.renderSlot(e.$slots, "userName", {}, void 0, !0)
            ]),
            _: 3
          }, 8, ["firstName", "lastName", "clickable", "shift"])) : vue.createCommentVNode("", !0)
        ]),
        _: 3
      }, 16, ["user", "disabledActions", "hiddenActions", "attach"])) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
        t.showPicture ? (vue.openBlock(), vue.createBlock(r, {
          key: 0,
          id: t.user.id,
          src: t.user.imgSrc,
          presence: t.user.presence,
          clickable: t.clickable,
          style: vue.normalizeStyle({ background: t.pictureBackground }),
          onClick: s[2] || (s[2] = (g) => e.$emit("click-user", g))
        }, null, 8, ["id", "src", "presence", "clickable", "style"])) : vue.createCommentVNode("", !0),
        t.showName ? (vue.openBlock(), vue.createBlock(d, {
          key: 1,
          firstName: t.user.firstName,
          lastName: t.user.lastName,
          clickable: t.clickable,
          shift: t.showPicture,
          onClick: s[3] || (s[3] = (g) => e.$emit("click-user", g))
        }, {
          default: vue.withCtx(() => [
            vue.renderSlot(e.$slots, "userName", {}, void 0, !0)
          ]),
          _: 3
        }, 8, ["firstName", "lastName", "clickable", "shift"])) : vue.createCommentVNode("", !0)
      ], 64))
    ]);
  }
  const Ru = /* @__PURE__ */ w(Gu, [["render", Qu], ["__scopeId", "data-v-e50afb8f"]]), $u = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: Ru
  }, Symbol.toStringTag, { value: "Module" }));
  function Vu() {
    let e = null;
    return {
      show(s) {
        return this.hide(), new Promise((t, l) => {
          const a = {
            value: !0,
            id: $(),
            component: e,
            bind: vue.reactive({ ...s, show: !0 }),
            on: {
              close: () => {
                this.hide(a), l();
              },
              confirm: (i) => {
                this.hide(a), t(i);
              },
              cancel: () => {
                this.hide(a), l();
              }
            }
          };
          this._modals.push(vue.shallowReactive(a));
        });
      },
      hide(s) {
        if (s) {
          const t = this._modals.find((l) => l.id === s.id);
          t.bind.show = !1, setTimeout(() => {
            const l = this._modals.findIndex((a) => a.id === s.id);
            l > -1 && this._modals.splice(l, 1);
          }, 1e3);
        } else
          this._modals.forEach((t) => {
            t._cancel = !0;
          }), this._modals.splice(0, this._modals.length);
      },
      alert(s) {
        return this.show(s);
      },
      confirm(s) {
        return this.show({
          showCancelIcon: !0,
          showCancelButton: !0,
          ...s
        });
      },
      prompt(s) {
        return this.show({
          showCancelIcon: !0,
          showCancelButton: !0,
          showInput: !0,
          ...s
        });
      },
      _modals: vue.shallowReactive([]),
      _setDefaultModal(s) {
        e = s;
      }
    };
  }
  function Fe(e, s) {
    const t = { ...e, props: { ...e.props } };
    return Object.assign(t.props, {
      api: { type: Object, default: () => s }
    }), t;
  }
  function Wu(e) {
    const s = Fe(Qe, e);
    return e._setDefaultModal(s), s;
  }
  function Hu(e) {
    return Fe(Ye, e);
  }
  const Fu = () => {
    const e = Vu();
    return {
      modal: e,
      Modal: Wu(e),
      ModalsContainer: Hu(e)
    };
  }, Ku = Fu(), { modal: ud, Modal: dd, ModalsContainer: cd } = Ku;
  function Ju() {
    const e = [];
    return {
      create(s) {
        const { target: t = "main" } = s;
        if (!this._exists(t))
          throw new Error("Target namespace is unknown");
        const l = {
          id: $(),
          bind: {
            target: t,
            _dispose: !1,
            show: !0,
            ...s
          },
          dispose() {
            this.bind._dispose = !0;
          }
        };
        return this._messages[t].push(vue.reactive(l)), l;
      },
      hide(s) {
        const { target: t = "main" } = s.bind;
        this._messages[t].splice(this._messages[t].indexOf(s), 1);
      },
      _exists(s) {
        return e.includes(s);
      },
      _register(s) {
        e.push(s), this._messages[s] = vue.shallowReactive([]);
      },
      _messages: vue.reactive([])
    };
  }
  function Xu(e, s) {
    const t = { ...e, props: { ...e.props } };
    return Object.assign(t.props, {
      api: { type: Object, default: () => s }
    }), t;
  }
  function qu(e) {
    return Xu(Ge, e);
  }
  const ed = () => {
    const e = Ju();
    return {
      message: e,
      MessageContainer: qu(e)
    };
  }, td = ed(), { message: hd, MessageContainer: gd } = td, sd = (e) => {
    const { userAgent: s } = e;
    return s.match(/ipad/i) || e.platform === "MacIntel" && e.maxTouchPoints > 1;
  }, id = ({ userAgent: e }) => e.match(/android/i);
  let Ke = null;
  const nd = ({ disableTooltipsOnDevices: e }) => {
    Ke = e;
  }, Je = (e, s, t, l) => {
    const a = me(
      e,
      s.getBoundingClientRect(),
      t.getBoundingClientRect(),
      l.getBoundingClientRect(),
      {},
      !0
    );
    return t.style.top = `${a.top}px`, t.style.left = `${a.left}px`, !0;
  }, Xe = (e) => {
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
  }, Ie = async (e, s) => {
    if (!s.value || s.modifiers.ellipsis && e.offsetWidth >= e.scrollWidth)
      return;
    const t = Xe(s.modifiers);
    vue.render(e.tooltip, document.body), e.tooltip.component.props.show = !0, e.tooltip.component.props.side = t, await new Promise((l) => setTimeout(l, 1)), Je(t, e, e.tooltip.el, document.body);
  }, Ne = (e) => {
    const { tooltip: { component: s } } = e;
    s.props.show = !1;
  }, od = async (e, s, t) => {
    var a;
    const { tooltip: l } = e;
    if (l) {
      const { component: i } = l;
      if (l.props.text = s.value, i && (i.props.text = s.value), (a = i == null ? void 0 : i.props) != null && a.show) {
        const r = Xe(s.modifiers);
        await new Promise((d) => setTimeout(d, 1)), Je(r, t.el, l.el, document.body);
      }
    }
  }, oe = {
    setConfig: nd,
    mounted(e, s, t) {
      if (Ke && (id(navigator) || sd(navigator)) || s.disabled)
        return;
      const l = vue.createVNode({ ...Me }, {
        type: s.modifiers.popover ? "popover" : "tooltip",
        text: s.value
      });
      e.tooltip = l, s.modifiers.click ? e.addEventListener("click", () => {
        var a, i, r;
        (r = (i = (a = e == null ? void 0 : e.tooltip) == null ? void 0 : a.component) == null ? void 0 : i.props) != null && r.show ? Ne(e) : Ie(e, s);
      }) : (e.addEventListener("mouseenter", Ie.bind(null, e, s, t)), e.addEventListener("mouseleave", Ne.bind(null, e, s, t)));
    },
    updated(e, s, t) {
      s.value !== s.oldValue && od(e, s, t);
    },
    beforeUnmount(e) {
      var s, t, l, a, i;
      if (e.tooltip) {
        const { tooltip: r } = e;
        r && ((t = (s = r == null ? void 0 : r.component) == null ? void 0 : s.el) == null || t.remove(), (i = (a = (l = r == null ? void 0 : r.component) == null ? void 0 : l.vnode) == null ? void 0 : a.el) == null || i.remove());
      }
    }
  }, Ce = (e, s, t) => {
    const l = vue.createVNode(Re, { mask: !0 });
    if (vue.render(l, t.el), e.spinner = l, l && typeof s.value == "string") {
      const { component: a } = l;
      l.props.text = s.value, a && (a.props.text = s.value);
    }
    e.classList.add("masked");
  }, De = (e, s, t) => {
    e.spinner && (vue.render(null, t.el), e.spinner = null, e.classList.remove("masked"));
  }, Te = {
    mounted(e, s, t) {
      s.value && Ce(e, s, t);
    },
    updated(e, s, t) {
      s.value !== s.oldValue && (s.value ? Ce : De)(e, s, t);
    },
    unmounted(e, s, t) {
      De(e, s, t);
    }
  }, ld = {
    install(e, s = { disableTooltipsOnDevices: !0 }) {
      e.directive("click-outside", de), e.directive("mask", Te), oe.setConfig(s), e.directive("tooltip", oe);
    },
    clickOutside: de,
    tooltip: oe,
    mask: Te
    // denseGroup,
    // denseClass,
  };
  const ad = (e, s = {}) => {
    const { lang: t, country: l } = s, a = /* @__PURE__ */ Object.assign({ "./components/layouts/vu-status-bar.vue": at, "./components/layouts/vu-thumbnail.vue": yt, "./components/layouts/vu-tile.vue": kt, "./components/vu-accordion.vue": Bt, "./components/vu-badge.vue": Qt, "./components/vu-btn-group.vue": Ht, "./components/vu-btn.vue": qt, "./components/vu-carousel-slide.vue": ns, "./components/vu-carousel.vue": ms, "./components/vu-checkbox.vue": Ls, "./components/vu-datepicker.vue": Bs, "./components/vu-dropdownmenu-items.vue": Xs, "./components/vu-dropdownmenu.vue": Mi, "./components/vu-facets-bar.vue": ji, "./components/vu-form.vue": Ni, "./components/vu-grid-view.vue": Ei, "./components/vu-icon-btn.vue": Yi, "./components/vu-icon-link.vue": Wi, "./components/vu-icon.vue": Gs, "./components/vu-image.vue": qi, "./components/vu-input-date.vue": dn, "./components/vu-input-number.vue": jn, "./components/vu-input.vue": Tn, "./components/vu-lazy.vue": On, "./components/vu-lightbox/vu-lightbox-bar.vue": Wn, "./components/vu-lightbox/vu-lightbox.vue": no, "./components/vu-media-upload-droppable.vue": co, "./components/vu-media-upload-empty.vue": po, "./components/vu-media-upload-error.vue": wo, "./components/vu-media-upload-loading.vue": Do, "./components/vu-media-upload-preview.vue": Oo, "./components/vu-media-upload.vue": Go, "./components/vu-message/vu-message-container.vue": $o, "./components/vu-message/vu-message.vue": Xo, "./components/vu-modal/vu-mobile-dialog.vue": ll, "./components/vu-modal/vu-modal-container.vue": ul, "./components/vu-modal/vu-modal.vue": Il, "./components/vu-multiple-select.vue": El, "./components/vu-popover.vue": ci, "./components/vu-progress-circular.vue": Ql, "./components/vu-range.vue": sa, "./components/vu-scroller.vue": aa, "./components/vu-select-options.vue": Ma, "./components/vu-select.vue": Sa, "./components/vu-single-checkbox.vue": Za, "./components/vu-slider.vue": Fa, "./components/vu-spinner.vue": sr, "./components/vu-textarea.vue": dr, "./components/vu-time-picker.vue": Nr, "./components/vu-tooltip.vue": oi, "./components/vu-tree-view-item.vue": Er, "./components/vu-tree-view.vue": Yr, "./components/vu-user/vu-rich-user-tooltip.vue": ku, "./components/vu-user/vu-user-name.vue": xu, "./components/vu-user/vu-user-picture.vue": Zu, "./components/vu-user/vu-user.vue": $u });
    for (const i in a) {
      const r = a[i].default;
      e.component(r.name, r);
    }
    t && l ? e.provide("lang", `${t}-${l}`) : e.provide("lang", "en-US"), e.provide("vuCollectionActions", null), e.provide("vuCollectionLazyImages", !0), e.provide("vuTileEmphasizeText", !1), e.provide("vuDateFormatWeekday", !0), e.provide("vuDateFormatShort", !1), e.provide("vuTreeViewLazy", !0), e.provide("vuTreeViewIcon", "chevron"), ld.install(e, s);
  }, md = { install: ad };

  exports.default = ad;
  exports.install = ad;
  exports.message = hd;
  exports.modal = ud;
  exports.plugin = md;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
