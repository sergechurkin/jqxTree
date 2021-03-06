/*
jQWidgets v4.5.3 (2017-June)
Copyright (c) 2011-2017 jQWidgets.
License: http://jqwidgets.com/license/
*/
! function(a) {
	a.jqx.jqxWidget("jqxTree", "", {}), a.extend(a.jqx._jqxTree.prototype, {
		defineInstance: function() {
			var b = {
				items: new Array,
				width: null,
				height: null,
				easing: "easeInOutCirc",
				animationShowDuration: "fast",
				animationHideDuration: "fast",
				treeElements: new Array,
				disabled: !1,
				itemsMember: "",
				displayMember: "",
				valueMember: "",
				enableHover: !0,
				keyboardNavigation: !0,
				enableKeyboardNavigation: !0,
				toggleMode: "dblclick",
				source: null,
				checkboxes: !1,
				checkSize: 13,
				toggleIndicatorSize: 16,
				hasThreeStates: !1,
				selectedItem: null,
				touchMode: "auto",
				allowDrag: !0,
				allowDrop: !0,
				searchMode: "startswithignorecase",
				incrementalSearch: !0,
				incrementalSearchDelay: 700,
				animationHideDelay: 0,
				submitCheckedItems: !1,
				dragStart: null,
				dragEnd: null,
				rtl: !1,
				dropAction: "default",
				events: ["expand", "collapse", "select", "initialized", "added", "removed", "checkChange", "dragEnd", "dragStart", "itemClick"],
				aria: {
					"aria-activedescendant": {
						name: "getActiveDescendant",
						type: "string"
					},
					"aria-disabled": {
						name: "disabled",
						type: "boolean"
					}
				}
			};
			return this === a.jqx._jqxTree.prototype ? b : (a.extend(!0, this, b), b)
		},
		createInstance: function(b) {
			var c = this;
			if(this.host.attr("role", "tree"), this.host.attr("data-role", "treeview"), this.enableKeyboardNavigation = this.keyboardNavigation, this.propertyChangeMap.disabled = function(b, d, e, f) {
					c.disabled ? c.host.addClass(c.toThemeProperty("jqx-tree-disabled")) : c.host.removeClass(c.toThemeProperty("jqx-tree-disabled")), a.jqx.aria(c, "aria-disabled", f)
				}, null != this.width && -1 != this.width.toString().indexOf("px") ? this.host.width(this.width) : void 0 == this.width || isNaN(this.width) || this.host.width(this.width), null != this.height && -1 != this.height.toString().indexOf("px") ? this.host.height(this.height) : void 0 == this.height || isNaN(this.height) || this.host.height(this.height), null != this.width && -1 != this.width.toString().indexOf("%") && this.host.width(this.width), null != this.height && -1 != this.height.toString().indexOf("%") && this.host.height(this.height), this.host.attr("tabindex") || this.host.attr("tabIndex", 1), this.disabled && (this.host.addClass(this.toThemeProperty("jqx-tree-disabled")), a.jqx.aria(this, "aria-disabled", !0)), this.host.jqxDragDrop && jqxTreeDragDrop(), this.originalInnerHTML = this.element.innerHTML, this.createdTree = !1, this.element.innerHTML.indexOf("UL")) {
				var d = this.host.find("ul:first");
				d.length > 0 && (this.createTree(d[0]), this.createdTree = !0)
			}
			if(null != this.source) {
				var e = this.loadItems(this.source);
				this.element.innerHTML = e;
				var d = this.host.find("ul:first");
				d.length > 0 && (this.createTree(d[0]), this.createdTree = !0)
			}
			if(this._itemslength = this.items.length, !this.createdTree && 0 == this.host.find("ul").length) {
				this.host.append(a("<ul></ul>"));
				var d = this.host.find("ul:first");
				d.length > 0 && (this.createTree(d[0]), this.createdTree = !0), this.createdTree = !0
			}
			1 == this.createdTree && (this._render(), this._handleKeys()), this._updateCheckLayout()
		},
		checkItems: function(b, c) {
			var d = this;
			if(null != b) {
				var e = 0,
					f = !1,
					g = 0,
					h = a(b.element).find("li");
				if(g = h.length, a.each(h, function(a) {
						var b = d.itemMapping["id" + this.id].item;
						0 != b.checked && (null == b.checked && (f = !0), e++)
					}), b != c) e == g ? this.checkItem(b.element, !0, "tree") : e > 0 ? this.checkItem(b.element, null, "tree") : this.checkItem(b.element, !1, "tree");
				else {
					var i = c.checked,
						h = a(c.element).find("li");
					a.each(h, function() {
						d.itemMapping["id" + this.id].item;
						d.checkItem(this, i, "tree")
					})
				}
				this.checkItems(this._parentItem(b), c)
			} else {
				var i = c.checked,
					h = a(c.element).find("li");
				a.each(h, function() {
					d.itemMapping["id" + this.id].item;
					d.checkItem(this, i, "tree")
				})
			}
		},
		_getMatches: function(b, c) {
			if(void 0 == b || 0 == b.length) return -1;
			for(var d = this.items, e = new Array, f = 0; f < d.length; f++) this._isVisible(d[f]) && !d[f].disabled && e.push(d[f]);
			d = e, void 0 != c && (d = d.slice(c));
			var g = new Array;
			return a.each(d, function(c) {
				var d = this.label;
				d || (d = ""), a.jqx.string.startsWithIgnoreCase(d.toString(), b) && g.push({
					id: this.id,
					element: this.element
				})
			}), g
		},
		_handleKeys: function() {
			var b = this;
			this.addHandler(this.host, "keydown", function(c) {
				var d = c.keyCode;
				if((b.keyboardNavigation || b.enableKeyboardNavigation) && null != b.selectedItem) {
					var e = b.selectedItem.element;
					if(b.incrementalSearch && !(d >= 33 && d <= 40)) {
						b._searchString || (b._searchString = ""), (8 == d || 46 == d) && b._searchString.length >= 1 && (b._searchString = b._searchString.substr(0, b._searchString.length - 1));
						var f = String.fromCharCode(d),
							g = !isNaN(parseInt(f));
						if(d >= 65 && d <= 97 || g || 8 == d || 32 == d || 46 == d) {
							c.shiftKey || (f = f.toLocaleLowerCase()), 8 != d && 32 != d && 46 != d && (b._searchString.length > 0 && b._searchString.substr(0, 1) == f || (b._searchString += f)), 32 == d && (b._searchString += " "), b._searchTime = new Date;
							var h = b.selectedItem;
							if(h) {
								for(var i = h.id, j = -1, k = 0; k < b.items.length; k++)
									if(b.items[k].id == i) {
										j = k + 1;
										break
									}
								var l = b._getMatches(b._searchString, j);
								if(0 == l.length || l.length > 0 && l[0].id == i) var l = b._getMatches(b._searchString)
							} else var l = b._getMatches(b._searchString);
							if(l.length > 0) {
								var h = b.selectedItem;
								b.selectedItem && b.selectedItem.id != l[0].id && (b.clearSelection(), b.selectItem(l[0].element, "keyboard")), b._lastSearchString = b._searchString
							}
						}
						void 0 != b._searchTimer && clearTimeout(b._searchTimer), 27 != d && 13 != d || (b._searchString = "", b._lastSearchString = ""), b._searchTimer = setTimeout(function() {
							b._searchString = "", b._lastSearchString = ""
						}, 500)
					}
					switch(d) {
						case 32:
							if(b.checkboxes) {
								b.fromKey = !0;
								var m = a(b.selectedItem.checkBoxElement).jqxCheckBox("checked");
								return b.checkItem(b.selectedItem.element, !m, "tree"), b.hasThreeStates && b.checkItems(b.selectedItem, b.selectedItem), !1
							}
							return !0;
						case 33:
							for(var n = b._getItemsOnPage(), o = b.selectedItem, k = 0; k < n; k++) o = b._prevVisibleItem(o);
							return null != o ? (b.selectItem(o.element, "keyboard"), b.ensureVisible(o.element)) : (b.selectItem(b._firstItem().element, "keyboard"), b.ensureVisible(b._firstItem().element)), !1;
						case 34:
							for(var n = b._getItemsOnPage(), p = b.selectedItem, k = 0; k < n; k++) p = b._nextVisibleItem(p);
							return null != p ? (b.selectItem(p.element, "keyboard"), b.ensureVisible(p.element)) : (b.selectItem(b._lastItem().element, "keyboard"), b.ensureVisible(b._lastItem().element)), !1;
						case 37:
						case 39:
							if(37 == d && !b.rtl || 39 == d && b.rtl)
								if(b.selectedItem.hasItems && b.selectedItem.isExpanded) b.collapseItem(e);
								else {
									var q = b._parentItem(b.selectedItem);
									null != q && (b.selectItem(q.element, "keyboard"), b.ensureVisible(q.element))
								}
							if((39 == d && !b.rtl || 37 == d && b.rtl) && b.selectedItem.hasItems)
								if(b.selectedItem.isExpanded) {
									var p = b._nextVisibleItem(b.selectedItem);
									null != p && (b.selectItem(p.element, "keyboard"), b.ensureVisible(p.element))
								} else b.expandItem(e);
							return !1;
						case 13:
							return b.selectedItem.hasItems && (b.selectedItem.isExpanded ? b.collapseItem(e) : b.expandItem(e)), !1;
						case 36:
							return b.selectItem(b._firstItem().element, "keyboard"), b.ensureVisible(b._firstItem().element), !1;
						case 35:
							return b.selectItem(b._lastItem().element, "keyboard"), b.ensureVisible(b._lastItem().element), !1;
						case 38:
							var o = b._prevVisibleItem(b.selectedItem);
							return null != o && (b.selectItem(o.element, "keyboard"), b.ensureVisible(o.element)), !1;
						case 40:
							var p = b._nextVisibleItem(b.selectedItem);
							return null != p && (b.selectItem(p.element, "keyboard"), b.ensureVisible(p.element)), !1
					}
				}
			})
		},
		_firstItem: function() {
			var b = null,
				c = this,
				d = this.host.find("ul:first"),
				e = a(d).find("li");
			for(i = 0; i <= e.length - 1; i++) {
				var f = e[i];
				if(b = this.itemMapping["id" + f.id].item, c._isVisible(b)) return b
			}
			return null
		},
		_lastItem: function() {
			var b = null,
				c = this,
				d = this.host.find("ul:first"),
				e = a(d).find("li");
			for(i = e.length - 1; i >= 0; i--) {
				var f = e[i];
				if(b = this.itemMapping["id" + f.id].item, c._isVisible(b)) return b
			}
			return null
		},
		_parentItem: function(b) {
			if(null == b || void 0 == b) return null;
			var c = b.parentElement;
			if(!c) return null;
			var d = null;
			return a.each(this.items, function() {
				if(this.element == c) return d = this, !1
			}), d
		},
		_nextVisibleItem: function(a) {
			if(null == a || void 0 == a) return null;
			for(var b = a; null != b;)
				if(b = b.nextItem, this._isVisible(b) && !b.disabled) return b;
			return null
		},
		_prevVisibleItem: function(a) {
			if(null == a || void 0 == a) return null;
			for(var b = a; null != b;)
				if(b = b.prevItem, this._isVisible(b) && !b.disabled) return b;
			return null
		},
		_isVisible: function(a) {
			if(null == a || void 0 == a) return !1;
			if(!this._isElementVisible(a.element)) return !1;
			var b = this._parentItem(a);
			if(null == b) return !0;
			if(null != b) {
				if(!this._isElementVisible(b.element)) return !1;
				if(!b.isExpanded) return !1;
				for(; null != b;) {
					if(null != (b = this._parentItem(b)) && !this._isElementVisible(b.element)) return !1;
					if(null != b && !b.isExpanded) return !1
				}
			}
			return !0
		},
		_getItemsOnPage: function() {
			var b = 0,
				c = (this.panel.jqxPanel("getVScrollPosition"), parseInt(this.host.height())),
				d = 0,
				e = this._firstItem();
			if(parseInt(a(e.element).height()) > 0)
				for(; d <= c;) d += parseInt(a(e.element).outerHeight()), b++;
			return b
		},
		_isElementVisible: function(b) {
			return null != b && ("none" != a(b).css("display") && "hidden" != a(b).css("visibility"))
		},
		refresh: function(b) {
			if(null != this.width && -1 != this.width.toString().indexOf("px") ? this.host.width(this.width) : void 0 == this.width || isNaN(this.width) || this.host.width(this.width), null != this.height && -1 != this.height.toString().indexOf("px") ? this.host.height(this.height) : void 0 == this.height || isNaN(this.height) || this.host.height(this.height), this.panel) {
				if(null != this.width && -1 != this.width.toString().indexOf("%")) {
					var c = this;
					this.panel.jqxPanel("width", "100%"), c.removeHandler(a(window), "resize.jqxtree" + c.element.id), c.addHandler(a(window), "resize.jqxtree" + c.element.id, function() {
						c._calculateWidth()
					})
				} else this.panel.jqxPanel("width", this.host.width());
				this.panel.jqxPanel("_arrange")
			}
			if(this._calculateWidth(), a.jqx.isHidden(this.host)) {
				var c = this;
				this._hiddenTimer && clearInterval(this._hiddenTimer), this._hiddenTimer = setInterval(function() {
					a.jqx.isHidden(c.host) || (clearInterval(c._hiddenTimer), c._calculateWidth())
				}, 100)
			}
			1 != b && this.checkboxes && this._updateCheckLayout(null)
		},
		resize: function(a, b) {
			this.width = a, this.height = b, this.refresh()
		},
		loadItems: function(b) {
			if(null != b) {
				var c = this;
				this.items = new Array;
				var d = "<ul>";
				return a.map(b, function(a) {
					if(void 0 == a) return null;
					d += c._parseItem(a)
				}), d += "</ul>"
			}
		},
		_parseItem: function(a) {
			var b = "";
			if(void 0 == a) return null;
			var c = a.label,
				d = a.value;
			!a.label && a.html && (c = a.html), void 0 != this.displayMember && "" != this.displayMember && (c = a[this.displayMember]), void 0 != this.valueMember && "" != this.valueMember && (d = a[this.valueMember]), c || (c = "Item"), "string" == typeof a && (c = a);
			var e = !1;
			void 0 != a.expanded && a.expanded && (e = !0);
			var f = !1;
			void 0 != a.locked && a.locked && (f = !0);
			var g = !1;
			void 0 != a.selected && a.selected && (g = !0);
			var h = !1;
			void 0 != a.disabled && a.disabled && (h = !0);
			var i = !1;
			void 0 != a.checked && a.checked && (i = !0);
			var j = a.icon,
				k = a.iconsize;
			b += "<li", e && (b += ' item-expanded="true" '), f && (b += ' item-locked="true" '), h && (b += ' item-disabled="true" '), g && (b += ' item-selected="true" '), k && (b += ' item-iconsize="' + a.iconsize + '" '), null != j && void 0 != j && (b += ' item-icon="' + j + '" '), a.label && !a.html && (b += ' item-label="' + c + '" '), null != d && (b += ' item-value="' + d + '" '), void 0 != a.checked && (b += ' item-checked="' + i + '" ');
			var l = "";
			return void 0 != a.id ? (l = a.id, b += ' id="' + l + '" ') : (l = this.createID(), b += ' id="' + l + '" '), b += ">" + c, a.items ? b += this.loadItems(a.items) : void 0 != this.itemsMember && "" != this.itemsMember && a[this.itemsMember] && (b += this.loadItems(a[this.itemsMember])), this._valueList || (this._valueList = new Array), this._valueList[l] = a.value, b += "</li>"
		},
		ensureVisible: function(b) {
			if(null != b && void 0 != b && this.panel) {
				var c = this.panel.jqxPanel("getVScrollPosition"),
					d = this.panel.jqxPanel("getHScrollPosition"),
					e = parseInt(this.host.height()),
					f = a(b).position().top;
				(f <= c || f >= e + c) && this.panel.jqxPanel("scrollTo", d, f - e + a(b).outerHeight())
			}
		},
		_syncItems: function(b) {
			this._visibleItems = new Array;
			var c = this;
			a.each(b, function() {
				var b = a(this);
				if("none" != b.css("display")) {
					var d = b.outerHeight();
					if(b.height() > 0) {
						var e = parseInt(b.offset().top);
						c._visibleItems[c._visibleItems.length] = {
							element: this,
							top: e,
							height: d,
							bottom: e + d
						}
					}
				}
			})
		},
		hitTest: function(b, c) {
			var d = this,
				e = null,
				f = this.host.find(".jqx-item");
			if(this._syncItems(f), d._visibleItems) {
				var g = parseInt(d.host.offset().left),
					h = d.host.outerWidth();
				a.each(d._visibleItems, function(f) {
					if(b >= g && b < g + h && this.top + 5 < c && c < this.top + this.height) {
						var i = a(this.element).parents("li:first");
						if(i.length > 0 && null != (e = d.getItem(i[0]))) return e.height = this.height, e.top = this.top, !1
					}
				})
			}
			return e
		},
		addBefore: function(a, b, c) {
			return this.addBeforeAfter(a, b, !0, c)
		},
		addAfter: function(a, b, c) {
			return this.addBeforeAfter(a, b, !1, c)
		},
		addBeforeAfter: function(b, c, d, e) {
			var f = this,
				g = new Array;
			c && void 0 != c.treeInstance && (c = c.element), a.isArray(b) ? g = b : g[0] = b;
			var h = "",
				i = this;
			a.each(g, function() {
				h += i._parseItem(this)
			});
			var j = a(h);
			if(f.element.innerHTML.indexOf("UL")) var k = f.host.find("ul:first");
			void 0 == c && null == c ? k.append(j) : d ? a(c).before(j) : a(c).after(j);
			for(var l = j, m = 0; m < l.length; m++) {
				this._createItem(l[m]);
				var n = a(l[m]).find("li");
				if(n.length > 0)
					for(var o = 0; o < n.length; o++) this._createItem(n[o])
			}
			var p = function(b) {
				i._refreshMapping(!1), i._updateItemsNavigation(), b && i.allowDrag && i._enableDragDrop && i._enableDragDrop(), null != i.selectedItem && (a(i.selectedItem.titleElement).addClass(i.toThemeProperty("jqx-fill-state-pressed")), a(i.selectedItem.titleElement).addClass(i.toThemeProperty("jqx-tree-item-selected")))
			};
			if(0 == e) return p(!0), void this._raiseEvent("4", {
				items: this.getItems()
			});
			p(!1), i._render(), this._raiseEvent("4", {
				items: this.getItems()
			}), i.checkboxes && i._updateCheckLayout(null)
		},
		addTo: function(b, c, d) {
			var e = this,
				f = new Array;
			c && void 0 != c.treeInstance && (c = c.element), a.isArray(b) ? f = b : f[0] = b;
			var g = "",
				h = this;
			a.each(f, function() {
				g += h._parseItem(this)
			});
			var i = a(g);
			if(e.element.innerHTML.indexOf("UL")) var j = e.host.find("ul:first");
			if(void 0 == c && null == c) j.append(i);
			else {
				c = a(c);
				var k = c.find("ul:first");
				if(0 == k.length) {
					ulElement = a("<ul></ul>"), a(c).append(ulElement), k = c.find("ul:first");
					var l = e.itemMapping["id" + c[0].id].item;
					l.subtreeElement = k[0], l.hasItems = !0, k.addClass(e.toThemeProperty("jqx-tree-dropdown")), h.rtl && k.addClass(e.toThemeProperty("jqx-tree-dropdown-rtl")), k.append(i);
					var m = k.find("li:first");
					l.parentElement = m
				} else k.append(i)
			}
			for(var n = i, o = 0; o < n.length; o++) {
				this._createItem(n[o]);
				var p = a(n[o]).find("li");
				if(p.length > 0)
					for(var q = 0; q < p.length; q++) this._createItem(p[q])
			}
			var r = function(b) {
				h._refreshMapping(!1), h._updateItemsNavigation(), b && h.allowDrag && h._enableDragDrop && h._enableDragDrop(), null != h.selectedItem && (a(h.selectedItem.titleElement).addClass(h.toThemeProperty("jqx-fill-state-pressed")), a(h.selectedItem.titleElement).addClass(h.toThemeProperty("jqx-tree-item-selected")))
			};
			if(0 == d) return r(!0), void this._raiseEvent("4", {
				items: this.getItems()
			});
			r(!1), h._render(), h.checkboxes && h._updateCheckLayout(null), this._raiseEvent("4", {
				items: this.getItems()
			})
		},
		updateItem: function(b, c) {
			var d = void 0 != b.treeInstance ? b : this.getItem(b);
			if(!d) {
				var e = b;
				b = c, c = e;
				var d = void 0 != b.treeInstance ? b : this.getItem(b)
			}
			if(d) {
				if("string" == typeof c && (c = {
						label: c
					}), c.value && (d.value = c.value), c.label) {
					d.label = c.label, a.jqx.utilities.html(a(d.titleElement), c.label);
					if(a.jqx.browser.msie && a.jqx.browser.version < 8) {
						a(document.body).append(this._measureItem), this._measureItem.html(a(d.titleElement).text());
						var f = this._measureItem.width();
						d.icon && (f += 20), a(a(d.titleElement).find("img")).length > 0 && (f += 20), a(d.titleElement).css("max-width", f + "px"), this._measureItem.remove()
					}
				}
				if(c.icon)
					if(a(d.element).children(".itemicon").length > 0) a(d.element).find(".itemicon")[0].src = c.icon;
					else {
						var g = c.iconsize;
						g || (g = 16);
						var h = a('<img width="' + g + '" height="' + g + '" style="float: left;" class="itemicon" src="' + c.icon + '"/>');
						a(d.titleElement).prepend(h), h.css("margin-right", "4px"), this.rtl && (h.css("margin-right", "0px"), h.css("margin-left", "4px"), h.css("float", "right"))
					}
				return c.expanded && this.expandItem(d), c.disabled && this.disableItem(d), c.selected && this.selectItem(d), !0
			}
			return !1
		},
		removeItem: function(b, c) {
			if(void 0 != b && null != b) {
				void 0 != b.treeInstance && (b = b.element);
				var d = this,
					e = (b.id, this.getItem(b));
				if(e && -1 != this.items.indexOf(e) && function b(c) {
						var d = -1; - 1 != (d = this.items.indexOf(c)) && this.items.splice(d, 1);
						var e = a(c.element).find("li"),
							f = e.length,
							g = this,
							h = new Array;
						if(f > 0) {
							a.each(e, function(a) {
								var b = g.itemMapping["id" + this.id].item;
								h.push(b)
							});
							for(var i = 0; i < h.length; i++) b.apply(this, [h[i]])
						}
					}.apply(this, [e]), this.host.find("#" + b.id).length > 0 && a(b).remove(), 0 == c) return void this._raiseEvent("5");
				d._updateItemsNavigation(), d.allowDrag && d._enableDragDrop ? d._render(!0, !1) : d._render(), null != d.selectedItem && d.selectedItem.element == b && (a(d.selectedItem.titleElement).removeClass(d.toThemeProperty("jqx-fill-state-pressed")), a(d.selectedItem.titleElement).removeClass(d.toThemeProperty("jqx-tree-item-selected")), d.selectedItem = null), this._raiseEvent("5"), d.checkboxes && d._updateCheckLayout(null)
			}
		},
		clear: function() {
			this.items = new Array, this.itemMapping = new Array;
			var a = this.host.find("ul:first");
			a.length > 0 && (a[0].innerHTML = ""), this.selectedItem = null
		},
		disableItem: function(b) {
			if(null == b) return !1;
			void 0 != b.treeInstance && (b = b.element);
			var c = this;
			a.each(c.items, function() {
				var d = this;
				if(d.element == b) return d.disabled = !0, a(d.titleElement).addClass(c.toThemeProperty("jqx-fill-state-disabled")), a(d.titleElement).addClass(c.toThemeProperty("jqx-tree-item-disabled")), c.checkboxes && d.checkBoxElement && a(d.checkBoxElement).jqxCheckBox({
					disabled: !0
				}), !1
			})
		},
		_updateInputSelection: function() {
			if(this.input) {
				if(null == this.selectedItem) this.input.val("");
				else {
					var a = this.selectItem.value;
					null == a && (a = this.selectedItem.label), this.input.val(a)
				}
				if(this.checkboxes) {
					var b = this.getCheckedItems();
					if(this.submitCheckedItems) {
						for(var c = "", d = 0; d < b.length; d++) {
							var e = b[d].value;
							null == e && (e = b[d].label), d == b.length - 1 ? c += e : c += e + ","
						}
						this.input.val(c)
					}
				}
			}
		},
		getCheckedItems: function() {
			var b = new Array,
				c = this;
			return a.each(c.items, function() {
				var a = this;
				a.checked && b.push(a)
			}), b
		},
		getUncheckedItems: function() {
			var b = new Array,
				c = this;
			return a.each(c.items, function() {
				var a = this;
				a.checked || b.push(a)
			}), b
		},
		checkAll: function() {
			var b = this;
			a.each(b.items, function() {
				var b = this;
				b.disabled || (b.checked = !0, a(b.checkBoxElement).jqxCheckBox("_setState", !0))
			}), this._raiseEvent("6", {
				element: this,
				checked: !0
			})
		},
		uncheckAll: function() {
			var b = this;
			a.each(b.items, function() {
				var b = this;
				b.disabled || (b.checked = !1, a(b.checkBoxElement).jqxCheckBox("_setState", !1))
			}), this._raiseEvent("6", {
				element: this,
				checked: !1
			})
		},
		checkItem: function(b, c, d) {
			if(null == b) return !1;
			void 0 === c && (c = !0), void 0 != b.treeInstance && (b = b.element);
			var e = this,
				f = !1,
				g = null;
			a.each(e.items, function() {
				var d = this;
				if(d.element == b && !d.disabled) return f = !0, d.checked = c, g = d, a(d.checkBoxElement).jqxCheckBox({
					checked: c
				}), !1
			}), f && (this._raiseEvent("6", {
				element: b,
				checked: c
			}), this._updateInputSelection()), void 0 == d && g && this.hasThreeStates && this.checkItems(g, g)
		},
		uncheckItem: function(a) {
			this.checkItem(a, !1)
		},
		enableItem: function(b) {
			if(null == b) return !1;
			void 0 != b.treeInstance && (b = b.element);
			var c = this;
			a.each(c.items, function() {
				var d = this;
				if(d.element == b) return d.disabled = !1, a(d.titleElement).removeClass(c.toThemeProperty("jqx-fill-state-disabled")), a(d.titleElement).removeClass(c.toThemeProperty("jqx-tree-item-disabled")), c.checkboxes && d.checkBoxElement && a(d.checkBoxElement).jqxCheckBox({
					disabled: !1
				}), !1
			})
		},
		enableAll: function() {
			var b = this;
			a.each(b.items, function() {
				var c = this;
				c.disabled = !1, a(c.titleElement).removeClass(b.toThemeProperty("jqx-tree-item-disabled")), a(c.titleElement).removeClass(b.toThemeProperty("jqx-fill-state-disabled")), b.checkboxes && c.checkBoxElement && a(c.checkBoxElement).jqxCheckBox({
					disabled: !1
				})
			})
		},
		lockItem: function(b) {
			if(null == b) return !1;
			var c = this;
			a.each(c.items, function() {
				var a = this;
				if(a.element == b) return a.locked = !0, !1
			})
		},
		unlockItem: function(b) {
			if(null == b) return !1;
			var c = this;
			a.each(c.items, function() {
				var a = this;
				if(a.element == b) return a.locked = !1, !1
			})
		},
		getItems: function() {
			return this.items
		},
		getItem: function(a) {
			if(null == a || void 0 == a) return null;
			if(this.itemMapping["id" + a.id]) {
				return this.itemMapping["id" + a.id].item
			}
			return null
		},
		isExpanded: function(a) {
			if(null == a || void 0 == a) return !1;
			var b = this.itemMapping["id" + a.id].item;
			return null != b && b.isExpanded
		},
		isSelected: function(a) {
			if(null == a || void 0 == a) return !1;
			var b = this.itemMapping["id" + a.id].item;
			return null != b && b == this.selectedItem
		},
		getPrevItem: function(a) {
			var b = this.getItem(a);
			return void 0 != a.treeInstance && (b = a), this._prevVisibleItem(b)
		},
		getNextItem: function(a) {
			var b = this.getItem(a);
			return void 0 != a.treeInstance && (b = a), this._nextVisibleItem(b)
		},
		getSelectedItem: function(a) {
			return this.selectedItem
		},
		val: function(a) {
			if(0 == arguments.length || "object" == typeof a) return this.selectedItem;
			if("string" == typeof a) {
				var b = this.host.find("#" + a);
				if(b.length > 0) {
					var c = this.getItem(b[0]);
					this.selectItem(c)
				}
			} else {
				var c = this.getItem(a);
				this.selectItem(c)
			}
		},
		getActiveDescendant: function() {
			return this.selectedItem ? this.selectedItem.element.id : ""
		},
		clearSelection: function() {
			this.selectItem(null)
		},
		selectItem: function(b, c) {
			if(!this.disabled) {
				var d = this;
				if(b && void 0 != b.treeInstance && (b = b.element), null == b || void 0 == b) return void(null != d.selectedItem && (a(d.selectedItem.titleElement).removeClass(d.toThemeProperty("jqx-fill-state-pressed")), a(d.selectedItem.titleElement).removeClass(d.toThemeProperty("jqx-tree-item-selected")), d.selectedItem = null));
				if(null == this.selectedItem || this.selectedItem.element != b) {
					var e = null != this.selectedItem ? this.selectedItem.element : null;
					e && a(e).removeAttr("aria-selected"), a.each(d.items, function() {
						var c = this;
						this.selected = !1, c.disabled || c.element == b && (null == d.selectedItem || null != d.selectedItem && d.selectedItem.titleElement != c.titleElement) && (null != d.selectedItem && (a(d.selectedItem.titleElement).removeClass(d.toThemeProperty("jqx-fill-state-pressed")), a(d.selectedItem.titleElement).removeClass(d.toThemeProperty("jqx-tree-item-selected"))), a(c.titleElement).addClass(d.toThemeProperty("jqx-fill-state-pressed")), a(c.titleElement).addClass(d.toThemeProperty("jqx-tree-item-selected")), d.selectedItem = c, this.selected = !0, a(c.element).attr("aria-selected", "true"), a.jqx.aria(d, "aria-activedescendant", c.element.id))
					}), this._updateInputSelection(), c || (c = null), this._raiseEvent("2", {
						element: b,
						prevElement: e,
						type: c
					})
				}
			}
		},
		collapseAll: function() {
			this.isUpdating = !0;
			var b = this,
				c = b.items,
				d = this.animationHideDuration;
			this.animationHideDuration = 0, a.each(c, function() {
				var a = this;
				1 == a.isExpanded && b._collapseItem(b, a)
			}), setTimeout(function() {
				b.isUpdating = !1, b._calculateWidth()
			}, this.animationHideDuration), this.animationHideDuration = d
		},
		expandAll: function() {
			var b = this;
			this.isUpdating = !0;
			var c = this.animationShowDuration;
			this.animationShowDuration = 0, a.each(this.items, function() {
				var a = this;
				a.hasItems && b._expandItem(b, a)
			}), setTimeout(function() {
				b.isUpdating = !1, b._calculateWidth()
			}, this.animationShowDuration), this.animationShowDuration = c
		},
		collapseItem: function(b) {
			if(null == b) return !1;
			void 0 != b.treeInstance && (b = b.element);
			var c = this;
			return a.each(this.items, function() {
				var a = this;
				if(1 == a.isExpanded && a.element == b) return c._collapseItem(c, a), !1
			}), !0
		},
		expandItem: function(b) {
			if(null == b) return !1;
			void 0 != b.treeInstance && (b = b.element);
			var c = this;
			return a.each(c.items, function() {
				var a = this;
				0 != a.isExpanded || a.element != b || a.disabled || a.locked || (c._expandItem(c, a), a.parentElement && c.expandItem(a.parentElement))
			}), !0
		},
		_getClosedSubtreeOffset: function(b) {
			var c = a(b.subtreeElement),
				d = -c.outerHeight(),
				e = -c.outerWidth();
			return e = 0, {
				left: e,
				top: d
			}
		},
		_collapseItem: function(b, c, d, e) {
			if(null == b || null == c) return !1;
			if(c.disabled) return !1;
			if(b.disabled) return !1;
			if(b.locked) return !1;
			var f = a(c.subtreeElement),
				g = this._getClosedSubtreeOffset(c);
			g.top, g.left;
			$treeElement = a(c.element);
			var h = b.animationHideDelay;
			h = 0, null != f.data("timer").show && (clearTimeout(f.data("timer").show), f.data("timer").show = null);
			var i = function() {
				if(c.isExpanded = !1, b.checkboxes) {
					var d = f.find(".chkbox");
					d.stop(), d.css("opacity", 1), f.find(".chkbox").animate({
						opacity: 0
					}, 50)
				}
				var e = a(c.arrow);
				b._arrowStyle(e, "", c.isExpanded), f.slideUp(b.animationHideDuration, function() {
					c.isCollapsing = !1, b._calculateWidth();
					var d = a(c.arrow);
					b._arrowStyle(d, "", c.isExpanded), f.hide(), b._raiseEvent("1", {
						element: c.element
					})
				})
			};
			h > 0 ? f.data("timer").hide = setTimeout(function() {
				i()
			}, h) : i()
		},
		_expandItem: function(b, c) {
			if(null == b || null == c) return !1;
			if(c.isExpanded) return !1;
			if(c.locked) return !1;
			if(c.disabled) return !1;
			if(b.disabled) return !1;
			var d = a(c.subtreeElement);
			null != d.data("timer") && null != d.data("timer").hide && clearTimeout(d.data("timer").hide);
			a(c.element);
			if(0 == parseInt(d.css("top"))) return void(c.isExpanded = !0);
			var e = a(c.arrow);
			if(b._arrowStyle(e, "", c.isExpanded), b.checkboxes) {
				var f = d.find(".chkbox");
				f.stop(), f.css("opacity", 0), f.animate({
					opacity: 1
				}, b.animationShowDuration)
			}
			if(d.slideDown(b.animationShowDuration, b.easing, function() {
					var d = a(c.arrow);
					c.isExpanded = !0, b._arrowStyle(d, "", c.isExpanded), c.isExpanding = !1, b._raiseEvent("0", {
						element: c.element
					}), b._calculateWidth()
				}), b.checkboxes && (b._updateCheckItemLayout(c), c.subtreeElement)) {
				var g = a(c.subtreeElement).find("li");
				a.each(g, function() {
					var a = b.getItem(this);
					null != a && b._updateCheckItemLayout(a)
				})
			}
		},
		_calculateWidth: function() {
			var b = this,
				c = this.checkboxes ? 20 : 0,
				d = 0;
			if(!this.isUpdating) {
				if(a.each(this.items, function() {
						if(0 != a(this.element).height()) {
							var b = a(this.titleElement).outerWidth() + 10 + c + 20 * (1 + this.level);
							if(d = Math.max(d, b), this.hasItems) {
								var e = parseInt(a(this.titleElement).css("padding-top"));
								isNaN(e) && (e = 0), e *= 2, e += 2;
								var f = (e + a(this.titleElement).height()) / 2 - 8.5;
								a.jqx.browser.msie && a.jqx.browser.version < 9 ? a(this.arrow).css("margin-top", "3px") : parseInt(f) >= 0 && a(this.arrow).css("margin-top", parseInt(f) + "px")
							}
						}
					}), this.toggleIndicatorSize > 16 && (d = d + this.toggleIndicatorSize - 16), b.panel)
					if(d > this.host.width()) {
						var e = d - this.host.width(),
							f = "hidden" !== b.panel.jqxPanel("vScrollBar").css("visibility") ? 10 : 0;
						e += f, b.panel.jqxPanel({
							horizontalScrollBarMax: e
						})
					} else b.panel.jqxPanel({
						horizontalScrollBarMax: 0
					});
				this.host.find("ul:first").width(d);
				var g = this.host.width() - 30;
				g > 0 && this.host.find("ul:first").css("min-width", g), b.panel && b.panel.jqxPanel("_arrange")
			}
		},
		_arrowStyle: function(a, b, c) {
			var d = this;
			if(a.length > 0) {
				a.removeClass();
				var e = "";
				"hover" == b && (e = "-" + b);
				var f = c ? "-expand" : "-collapse",
					g = "jqx-tree-item-arrow" + f + e;
				if(a.addClass(d.toThemeProperty(g)), !this.rtl) {
					var f = c ? "-down" : "-right";
					a.addClass(d.toThemeProperty("jqx-icon-arrow" + f))
				}
				if(this.rtl) {
					a.addClass(d.toThemeProperty(g + "-rtl"));
					var f = c ? "-down" : "-left";
					a.addClass(d.toThemeProperty("jqx-icon-arrow" + f))
				}
			}
		},
		_initialize: function(b, c) {
			var d = this;
			this.host.addClass(d.toThemeProperty("jqx-widget")), this.host.addClass(d.toThemeProperty("jqx-widget-content")), this.host.addClass(d.toThemeProperty("jqx-tree")), this._updateDisabledState();
			var e = a.jqx.browser.msie && a.jqx.browser.version < 8;
			a.each(this.items, function() {
				var b = this;
				$element = a(b.element);
				var c = null;
				if(d.checkboxes && !b.hasItems && b.checkBoxElement && a(b.checkBoxElement).css("margin-left", "0px"), e) !b.hasItems && a(b.element).find("ul").length > 0 && a(b.element).find("ul").remove();
				else {
					if(!b.hasItems) {
						d.rtl ? b.element.style.marginRight = parseInt(d.toggleIndicatorSize) + "px" : b.element.style.marginLeft = parseInt(d.toggleIndicatorSize) + "px";
						var f = a(b.arrow);
						return f.length > 0 && (f.remove(), b.arrow = null), !0
					}
					d.rtl ? b.element.style.marginRight = "0px" : b.element.style.marginLeft = "0px"
				}
				var f = a(b.arrow);
				f.length > 0 && f.remove(), c = a('<span style="height: 17px; border: none; background-color: transparent;" id="arrow' + $element[0].id + '"></span>'), c.prependTo($element), d.rtl ? c.css("float", "right") : c.css("float", "left"), c.css("clear", "both"), c.width(d.toggleIndicatorSize), d._arrowStyle(c, "", b.isExpanded);
				var g = parseInt(a(this.titleElement).css("padding-top"));
				isNaN(g) && (g = 0), g *= 2, g += 2;
				var h = (g + a(this.titleElement).height()) / 2 - 8.5;
				a.jqx.browser.msie && a.jqx.browser.version < 9 ? c.css("margin-top", "3px") : parseInt(h) >= 0 && c.css("margin-top", parseInt(h) + "px"), $element.addClass(d.toThemeProperty("jqx-disableselect")), c.addClass(d.toThemeProperty("jqx-disableselect"));
				var i = "click",
					j = d.isTouchDevice();
				j && (i = a.jqx.mobile.getTouchEventName("touchend")), d.addHandler(c, i, function() {
					return b.isExpanded ? d._collapseItem(d, b) : d._expandItem(d, b), !1
				}), d.addHandler(c, "selectstart", function() {
					return !1
				}), d.addHandler(c, "mouseup", function() {
					if(!j) return !1
				}), b.hasItems = a(b.element).find("li").length > 0, b.arrow = c[0], b.hasItems || c.css("visibility", "hidden"), $element.css("float", "none")
			})
		},
		_getOffset: function(b) {
			var c = a(window).scrollTop(),
				d = a(window).scrollLeft(),
				e = a.jqx.mobile.isSafariMobileBrowser(),
				f = a(b).offset(),
				g = f.top,
				h = f.left;
			return null != e && e ? {
				left: h - d,
				top: g - c
			} : a(b).offset()
		},
		_renderHover: function(b, c, d) {
			var e = this;
			if(!d) {
				var f = a(c.titleElement);
				e.addHandler(f, "mouseenter", function() {
					c.disabled || !e.enableHover || e.disabled || (f.addClass(e.toThemeProperty("jqx-fill-state-hover")), f.addClass(e.toThemeProperty("jqx-tree-item-hover")))
				}), e.addHandler(f, "mouseleave", function() {
					c.disabled || !e.enableHover || e.disabled || (f.removeClass(e.toThemeProperty("jqx-fill-state-hover")), f.removeClass(e.toThemeProperty("jqx-tree-item-hover")))
				})
			}
		},
		_updateDisabledState: function() {
			this.disabled ? this.host.addClass(this.toThemeProperty("jqx-fill-state-disabled")) : this.host.removeClass(this.toThemeProperty("jqx-fill-state-disabled"))
		},
		_addInput: function() {
			if(null == this.input) {
				var b = this.host.attr("name");
				b && this.host.attr("name", ""), this.input = a("<input type='hidden'/>"), this.host.append(this.input), this.input.attr("name", b), this._updateInputSelection()
			}
		},
		render: function() {
			this._updateItemsNavigation(), this._render()
		},
		_render: function(b, c) {
			if(a.jqx.browser.msie && a.jqx.browser.version < 8) {
				var d = this;
				a.each(this.items, function() {
					var b = a(this.element),
						c = b.parent(),
						d = parseInt(this.titleElement.css("margin-left")) + this.titleElement[0].scrollWidth + 13;
					b.css("min-width", d);
					var e = parseInt(c.css("min-width"));
					isNaN(e) && (e = 0);
					var f = b.css("min-width");
					e < parseInt(b.css("min-width")) && c.css("min-width", f), this.titleElement[0].style.width = null
				})
			}
			var d = this;
			if(a.data(d.element, "animationHideDelay", d.animationHideDelay), a.data(document.body, "treeel", this), this._initialize(), this.isTouchDevice() && "dblclick" == this.toggleMode && (this.toggleMode = "click"), void 0 != b && 1 != b || a.each(this.items, function() {
					d._updateItemEvents(d, this)
				}), this.allowDrag && this._enableDragDrop && (void 0 == c || 1 == c) && this._enableDragDrop(), this._addInput(), this.host.jqxPanel) {
				if(this.host.find("#panel" + this.element.id).length > 0) return this.panel.jqxPanel({
					touchMode: this.touchMode
				}), void this.panel.jqxPanel("refresh");
				this.host.find("ul:first").wrap('<div style="background-color: transparent; overflow: hidden; width: 100%; height: 100%;" id="panel' + this.element.id + '"></div>');
				var e = this.host.find("div:first"),
					f = "fixed";
				null != this.height && "auto" != this.height || (f = "verticalwrap"), null != this.width && "auto" != this.width || (f = "fixed" == f ? "horizontalwrap" : "wrap"), e.jqxPanel({
					rtl: this.rtl,
					theme: this.theme,
					width: "100%",
					height: "100%",
					touchMode: this.touchMode,
					sizeMode: f
				}), a.jqx.browser.msie && a.jqx.browser.version < 8 && e.jqxPanel("content").css("left", "0px"), e.data({
					nestedWidget: !0
				}), (null == this.height || null != this.height && -1 != this.height.toString().indexOf("%")) && this.isTouchDevice() && (this.removeHandler(e, a.jqx.mobile.getTouchEventName("touchend") + ".touchScroll touchcancel.touchScroll"), this.removeHandler(e, a.jqx.mobile.getTouchEventName("touchmove") + ".touchScroll"), this.removeHandler(e, a.jqx.mobile.getTouchEventName("touchstart") + ".touchScroll"));
				var g = a.data(e[0], "jqxPanel").instance;
				null != g && (this.vScrollInstance = g.vScrollInstance, this.hScrollInstance = g.hScrollInstance), this.panelInstance = g, a.jqx.browser.msie && a.jqx.browser.version < 8 && (this.host.attr("hideFocus", !0), this.host.find("div").attr("hideFocus", !0), this.host.find("ul").attr("hideFocus", !0)), e[0].className = "", this.panel = e
			}
			this._raiseEvent("3", this)
		},
		focus: function() {
			try {
				this.host.focus()
			} catch(a) {}
		},
		_updateItemEvents: function(b, c) {
			var d = this.isTouchDevice();
			d && (this.toggleMode = a.jqx.mobile.getTouchEventName("touchend"));
			var e = a(c.element);
			b.enableRoundedCorners && e.addClass(b.toThemeProperty("jqx-rc-all"));
			var f = d ? a.jqx.mobile.getTouchEventName("touchend") : "mousedown";
			!0 === b.touchMode && b.removeHandler(a(c.checkBoxElement), "mousedown"), b.removeHandler(a(c.checkBoxElement), f), b.addHandler(a(c.checkBoxElement), f, function(a) {
				return b.disabled || this.treeItem.disabled || (this.treeItem.checked = !this.treeItem.checked, b.checkItem(this.treeItem.element, this.treeItem.checked, "tree"), b.hasThreeStates && b.checkItems(this.treeItem, this.treeItem)), !1
			});
			var g = a(c.titleElement);
			b.removeHandler(e),
				this.allowDrag && this._enableDragDrop ? (b.removeHandler(g, "mousedown.item"), b.removeHandler(g, "click"), b.removeHandler(g, "dblclick"), b.removeHandler(g, "mouseenter"), b.removeHandler(g, "mouseleave")) : b.removeHandler(g), b._renderHover(e, c, d);
			var h = a(c.subtreeElement);
			if(h.length > 0) {
				var i = c.isExpanded ? "block" : "none";
				h.css({
					overflow: "hidden",
					display: i
				}), h.data("timer", {})
			}
			b.addHandler(g, "selectstart", function(a) {
				return !1
			}), a.jqx.browser.opera && b.addHandler(g, "mousedown.item", function(a) {
				return !1
			}), "click" != b.toggleMode && b.addHandler(g, "click", function(a) {
				b.selectItem(c.element, "mouse"), null != b.panel && b.panel.jqxPanel({
					focused: !0
				}), g.focus(), b._raiseEvent("9", {
					element: c.element
				})
			}), b.addHandler(g, b.toggleMode, function(a) {
				if(h.length > 0 && clearTimeout(h.data("timer").hide), null != b.panel && b.panel.jqxPanel({
						focused: !0
					}), b.selectItem(c.element, "mouse"), void 0 == c.isExpanding && (c.isExpanding = !1), void 0 == c.isCollapsing && (c.isCollapsing = !1), h.length > 0) return c.isExpanded ? 0 == c.isCollapsing && (c.isCollapsing = !0, b._collapseItem(b, c, !0)) : 0 == c.isExpanding && (c.isExpanding = !0, b._expandItem(b, c)), !1
			})
		},
		isTouchDevice: function() {
			if(void 0 != this._isTouchDevice) return this._isTouchDevice;
			var b = a.jqx.mobile.isTouchDevice();
			return 1 == this.touchMode ? b = !0 : 0 == this.touchMode && (b = !1), this._isTouchDevice = b, b
		},
		createID: function() {
			return a.jqx.utilities.createId()
		},
		createTree: function(b) {
			if(null != b) {
				var c = this,
					d = a(b).find("li");
				this.items = new Array, this.itemMapping = new Array, a(b).addClass(c.toThemeProperty("jqx-tree-dropdown-root")), this.rtl && a(b).addClass(c.toThemeProperty("jqx-tree-dropdown-root-rtl")), (this.rtl || a.jqx.browser.msie && a.jqx.browser.version < 8) && (this._measureItem = a("<span style='position: relative; visibility: hidden;'></span>"), this._measureItem.addClass(this.toThemeProperty("jqx-widget")), this._measureItem.addClass(this.toThemeProperty("jqx-fill-state-normal")), this._measureItem.addClass(this.toThemeProperty("jqx-tree-item")), this._measureItem.addClass(this.toThemeProperty("jqx-item")), a(document.body).append(this._measureItem)), a.jqx.browser.msie && a.jqx.browser.version;
				for(var e = 0; e < d.length; e++) this._createItem(d[e]);
				(this.rtl || a.jqx.browser.msie && a.jqx.browser.version < 8) && this._measureItem.remove(), this._updateItemsNavigation(), this._updateCheckStates()
			}
		},
		_updateCheckLayout: function(b) {
			var c = this;
			this.checkboxes && a.each(this.items, function() {
				this.level != b && void 0 != b || c._updateCheckItemLayout(this)
			})
		},
		_updateCheckItemLayout: function(b) {
			if(this.checkboxes && "none" != a(b.titleElement).css("display")) {
				var c = a(b.checkBoxElement),
					d = a(b.titleElement).outerHeight() / 2 - 1 - parseInt(this.checkSize) / 2;
				c.css("margin-top", d), this.rtl || (a.jqx.browser.msie && a.jqx.browser.version < 8 ? b.titleElement.css("margin-left", parseInt(this.checkSize) + 25) : b.hasItems && c.css("margin-left", this.toggleIndicatorSize))
			}
		},
		_updateCheckStates: function() {
			var b = this;
			b.hasThreeStates ? a.each(this.items, function() {
				b._updateCheckState(this)
			}) : a.each(this.items, function() {
				null == this.checked && b.checkItem(this.element, !1, "tree")
			})
		},
		_updateCheckState: function(b) {
			if(null != b && void 0 != b) {
				var c = this,
					d = 0,
					e = !1,
					f = 0,
					g = a(b.element).find("li");
				f = g.length, b.checked && f > 0 && a.each(g, function(a) {
					var b = c.itemMapping["id" + this.id].item,
						d = b.element.getAttribute("item-checked");
					void 0 != d && null != d && "true" != d && 1 != d || c.checkItem(b.element, !0, "tree")
				}), a.each(g, function(a) {
					var b = c.itemMapping["id" + this.id].item;
					0 != b.checked && (null == b.checked && (e = !0), d++)
				}), f > 0 && (d == f ? this.checkItem(b.element, !0, "tree") : d > 0 ? this.checkItem(b.element, null, "tree") : this.checkItem(b.element, !1, "tree"))
			}
		},
		_updateItemsNavigation: function() {
			for(var b = this.host.find("ul:first"), c = a(b).find("li"), d = 0; d < c.length; d++) {
				var e = c[d];
				if(this.itemMapping["id" + e.id]) {
					var f = this.itemMapping["id" + e.id].item;
					if(!f) continue;
					f.prevItem = null, f.nextItem = null, d > 0 && this.itemMapping["id" + c[d - 1].id] && (f.prevItem = this.itemMapping["id" + c[d - 1].id].item), d < c.length - 1 && this.itemMapping["id" + c[d + 1].id] && (f.nextItem = this.itemMapping["id" + c[d + 1].id].item)
				}
			}
		},
		_applyTheme: function(b, c) {
			var d = this;
			this.host.removeClass("jqx-tree-" + b), this.host.removeClass("jqx-widget-" + b), this.host.removeClass("jqx-widget-content-" + b), this.host.addClass(d.toThemeProperty("jqx-tree")), this.host.addClass(d.toThemeProperty("jqx-widget"));
			var e = this.host.find("ul:first");
			a(e).removeClass(d.toThemeProperty("jqx-tree-dropdown-root-" + b)), a(e).addClass(d.toThemeProperty("jqx-tree-dropdown-root")), this.rtl && (a(e).removeClass(d.toThemeProperty("jqx-tree-dropdown-root-rtl-" + b)), a(e).addClass(d.toThemeProperty("jqx-tree-dropdown-root-rtl")));
			for(var f = a(e).find("li"), g = 0; g < f.length; g++) {
				var h = f[g];
				a(h).children().each(function() {
					if("ul" == this.tagName || "UL" == this.tagName) return a(this).removeClass(d.toThemeProperty("jqx-tree-dropdown-" + b)), a(this).addClass(d.toThemeProperty("jqx-tree-dropdown")), d.rtl && (a(this).removeClass(d.toThemeProperty("jqx-tree-dropdown-rtl-" + b)), a(this).addClass(d.toThemeProperty("jqx-tree-dropdown-rtl"))), !1
				})
			}
			a.each(this.items, function() {
				var e = this,
					f = a(e.element);
				f.removeClass(d.toThemeProperty("jqx-tree-item-li-" + b)), f.addClass(d.toThemeProperty("jqx-tree-item-li")), this.rtl && (f.removeClass(d.toThemeProperty("jqx-tree-item-li-" + b)), f.addClass(d.toThemeProperty("jqx-tree-item-li"))), a(e.titleElement).removeClass(d.toThemeProperty("jqx-tree-item-" + b)), a(e.titleElement).addClass(d.toThemeProperty("jqx-tree-item")), a(e.titleElement).removeClass("jqx-item-" + b), a(e.titleElement).addClass(d.toThemeProperty("jqx-item"));
				var g = a(e.arrow);
				g.length > 0 && d._arrowStyle(g, "", e.isExpanded), e.checkBoxElement && a(e.checkBoxElement).jqxCheckBox({
					theme: c
				}), d.enableRoundedCorners && (f.removeClass("jqx-rc-all-" + b), f.addClass(d.toThemeProperty("jqx-rc-all")))
			}), this.host.jqxPanel && this.panel.jqxPanel({
				theme: c
			})
		},
		_refreshMapping: function(b, c) {
			for(var d = this.host.find("li"), e = new Array, f = new Array, g = a.data(document.body, "treeItemsStorage"), h = this, i = 0; i < d.length; i++) {
				var j = d[i],
					k = a(j),
					l = g[j.id];
				if(null != l) {
					f[f.length] = l, void 0 != b && 1 != b || this._updateItemEvents(this, l), l.level = k.parents("li").length, l.treeInstance = this;
					var m = null,
						n = null; - 1 != l.titleElement[0].className.indexOf("jqx-fill-state-pressed") && (a(l.titleElement).removeClass(h.toThemeProperty("jqx-fill-state-pressed")), a(l.titleElement).removeClass(h.toThemeProperty("jqx-tree-item-selected")));
					k.children().each(function() {
						if("ul" == this.tagName || "UL" == this.tagName) return l.subtreeElement = this, a(this).addClass(h.toThemeProperty("jqx-tree-dropdown")), h.rtl && a(this).addClass(h.toThemeProperty("jqx-tree-dropdown-rtl")), !1
					});
					k.parents().each(function() {
						if("li" == this.tagName || "LI" == this.tagName) return n = this.id, m = this, !1
					}), l.parentElement = m, l.parentId = n, l.hasItems = a(l.element).find("li").length > 0, null != l && (e[i] = {
						element: j,
						item: l
					}, e["id" + j.id] = e[i])
				}
			}
			this.itemMapping = e, this.items = f
		},
		_createItem: function(b) {
			if(null != b && void 0 != b) {
				var c = b.id;
				c || (c = this.createID());
				var d = b,
					e = a(b);
				d.id = c;
				var f = a.data(document.body, "treeItemsStorage");
				void 0 == f && (f = new Array);
				var g = this.items.length;
				this.items[g] = new a.jqx._jqxTree.jqxTreeItem, this.treeElements[c] = this.items[g], f[d.id] = this.items[g], a.data(document.body, "treeItemsStorage", f), g = this.items.length;
				var h = 0,
					i = this,
					j = null;
				e.attr("role", "treeitem"), e.children().each(function() {
					if("ul" == this.tagName || "UL" == this.tagName) return i.items[g - 1].subtreeElement = this, a(this).addClass(i.toThemeProperty("jqx-tree-dropdown")), i.rtl && (a(this).addClass(i.toThemeProperty("jqx-tree-dropdown-rtl")), a(this).css("clear", "both")), !1
				}), e.parents().each(function() {
					if("li" == this.tagName || "LI" == this.tagName) return h = this.id, j = this, !1
				});
				var k = b.getAttribute("item-expanded");
				k = null != k && void 0 != k && ("true" == k || 1 == k), d.removeAttribute("item-expanded");
				var l = b.getAttribute("item-locked");
				l = null != l && void 0 != l && ("true" == l || 1 == l), d.removeAttribute("item-locked");
				var m = b.getAttribute("item-selected");
				m = null != m && void 0 != m && ("true" == m || 1 == m), d.removeAttribute("item-selected");
				var n = b.getAttribute("item-disabled");
				n = null != n && void 0 != n && ("true" == n || 1 == n), d.removeAttribute("item-disabled");
				var o = b.getAttribute("item-checked");
				o = null != o && void 0 != o && ("true" == o || 1 == o);
				var p = b.getAttribute("item-title");
				(null == p || void 0 == p || "true" != p && 1 != p) && (p = !1), d.removeAttribute("item-title");
				var q = b.getAttribute("item-icon"),
					r = b.getAttribute("item-iconsize"),
					s = b.getAttribute("item-label"),
					t = b.getAttribute("item-value");
				d.removeAttribute("item-icon"), d.removeAttribute("item-iconsize"), d.removeAttribute("item-label"), d.removeAttribute("item-value");
				var u = this.items[g - 1];
				u.id = c, void 0 == u.value && (this._valueList && this._valueList[c] ? u.value = this._valueList[c] : u.value = t), u.icon = q, u.iconsize = r, u.parentId = h, u.disabled = n, u.parentElement = j, u.element = b, u.locked = l, u.selected = m, u.checked = o, u.isExpanded = k, u.treeInstance = this, this.itemMapping[g - 1] = {
					element: d,
					item: u
				}, this.itemMapping["id" + d.id] = this.itemMapping[g - 1];
				if(!1, this.rtl && (a(u.element).css("float", "right"), a(u.element).css("clear", "both")), a(d.firstChild).length > 0) {
					if(u.icon) {
						var r = u.iconsize;
						r || (r = 16);
						var q = a('<img width="' + r + '" height="' + r + '" style="float: left;" class="itemicon" src="' + u.icon + '"/>');
						a(d).prepend(q), q.css("margin-right", "4px"), this.rtl && (q.css("margin-right", "0px"), q.css("margin-left", "4px"), q.css("float", "right"))
					}
					var v = d.innerHTML.indexOf("<ul");
					if(-1 == v && (v = d.innerHTML.indexOf("<UL")), -1 == v) u.originalTitle = d.innerHTML, d.innerHTML = '<div style="display: inline-block;">' + d.innerHTML + "</div>", u.titleElement = a(a(d)[0].firstChild);
					else {
						var w = d.innerHTML.substring(0, v);
						w = a.trim(w), u.originalTitle = w, w = a('<div style="display: inline-block;">' + w + "</div>");
						var x = a(d).find("ul:first");
						x.remove(), d.innerHTML = "", a(d).prepend(w), a(d).append(x), u.titleElement = w, this.rtl && (w.css("float", "right"), x.css("padding-right", "10px"))
					}
					if(a.jqx.browser.msie && a.jqx.browser.version < 8) {
						a(a(d)[0].firstChild).css("display", "inline-block");
						var y = !1;
						0 == this._measureItem.parents().length && (a(document.body).append(this._measureItem), y = !0), this._measureItem.css("min-width", "20px"), this._measureItem[0].innerHTML = a(u.titleElement).text();
						var z = this._measureItem.width();
						u.icon && (z += 20), a(a(item.titleElement).find("img")).length > 0 && (z += 20), a(a(d)[0].firstChild).css("max-width", z + "px"), y && this._measureItem.remove()
					}
				} else u.originalTitle = "Item", a(d).append(a("<span>Item</span>")), a(d.firstChild).wrap("<span/>"), u.titleElement = a(d)[0].firstChild, a.jqx.browser.msie && a.jqx.browser.version < 8 && a(d.firstChild).css("display", "inline-block");
				var A = a(u.titleElement),
					B = this.toThemeProperty("jqx-rc-all");
				if(this.allowDrag && A.addClass("draggable"), null == s || void 0 == s ? (s = u.titleElement, u.label = a.trim(A.text())) : u.label = s, a(d).addClass(this.toThemeProperty("jqx-tree-item-li")), this.rtl && a(d).addClass(this.toThemeProperty("jqx-tree-item-li-rtl")), B += " " + this.toThemeProperty("jqx-tree-item") + " " + this.toThemeProperty("jqx-item"), this.rtl && (B += " " + this.toThemeProperty("jqx-tree-item-rtl")), A[0].className = A[0].className + " " + B, u.level = a(b).parents("li").length, u.hasItems = a(b).find("li").length > 0, this.rtl && u.parentElement && this.checkboxes, this.checkboxes) {
					if(!this.host.jqxCheckBox) throw new Error("jqxTree: Missing reference to jqxcheckbox.js.");
					var C = a('<div style="overflow: visible; position: absolute; width: 18px; height: 18px;" tabIndex=0 class="chkbox"/>');
					if(C.width(parseInt(this.checkSize)), C.height(parseInt(this.checkSize)), a(d).prepend(C), this.rtl && (C.css("float", "right"), C.css("position", "static")), C.jqxCheckBox({
							hasInput: !1,
							checked: u.checked,
							boxSize: this.checkSize,
							animationShowDelay: 0,
							animationHideDelay: 0,
							disabled: n,
							theme: this.theme
						}), this.rtl) {
						u.parentElement ? C.css("margin-right", "10px") : C.css("margin-right", "5px")
					} else A.css("margin-left", parseInt(this.checkSize) + 6);
					u.checkBoxElement = C[0], C[0].treeItem = u;
					var D = A.outerHeight() / 2 - 1 - parseInt(this.checkSize) / 2;
					C.css("margin-top", D), a.jqx.browser.msie && a.jqx.browser.version < 8 ? (A.css("width", "1%"), A.css("margin-left", parseInt(this.checkSize) + 25)) : u.hasItems && (this.rtl || C.css("margin-left", this.toggleIndicatorSize))
				} else a.jqx.browser.msie && a.jqx.browser.version < 8 && A.css("width", "1%");
				n && this.disableItem(u.element), m && this.selectItem(u.element), a.jqx.browser.msie && a.jqx.browser.version < 8 && (a(d).css("margin", "0px"), a(d).css("padding", "0px"))
			}
		},
		destroy: function() {
			this.removeHandler(a(window), "resize.jqxtree" + this.element.id), this.host.removeClass(), this.isTouchDevice() && (this.removeHandler(this.panel, a.jqx.mobile.getTouchEventName("touchend") + ".touchScroll touchcancel.touchScroll"), this.removeHandler(this.panel, a.jqx.mobile.getTouchEventName("touchmove") + ".touchScroll"), this.removeHandler(this.panel, a.jqx.mobile.getTouchEventName("touchstart") + ".touchScroll"));
			var b = this,
				c = this.isTouchDevice();
			a.each(this.items, function() {
				var d = this,
					e = a(this.element),
					f = c ? a.jqx.mobile.getTouchEventName("touchend") : "click";
				b.removeHandler(a(d.checkBoxElement), f);
				var g = a(d.titleElement);
				b.removeHandler(e), b.allowDrag && b._enableDragDrop ? (b.removeHandler(g, "mousedown.item"), b.removeHandler(g, "click"), b.removeHandler(g, "dblclick"), b.removeHandler(g, "mouseenter"), b.removeHandler(g, "mouseleave")) : b.removeHandler(g), $arrowSpan = a(d.arrow), $arrowSpan.length > 0 && (b.removeHandler($arrowSpan, f), b.removeHandler($arrowSpan, "selectstart"), b.removeHandler($arrowSpan, "mouseup"), c || (b.removeHandler($arrowSpan, "mouseenter"), b.removeHandler($arrowSpan, "mouseleave")), b.removeHandler(g, "selectstart")), a.jqx.browser.opera && b.removeHandler(g, "mousedown.item"), "click" != b.toggleMode && b.removeHandler(g, "click"), b.removeHandler(g, b.toggleMode)
			}), this.panel && (this.panel.jqxPanel("destroy"), this.panel = null), this.host.remove()
		},
		_raiseEvent: function(b, c) {
			void 0 == c && (c = {
				owner: null
			});
			var d = this.events[b];
			args = c, args.owner = this;
			var e = new a.Event(d);
			return e.owner = this, e.args = args, this.host.trigger(e)
		},
		propertyChangedHandler: function(b, c, d, e) {
			if(void 0 != this.isInitialized && 0 != this.isInitialized) {
				if("submitCheckedItems" == c && b._updateInputSelection(), "disabled" == c && b._updateDisabledState(), "theme" == c && b._applyTheme(d, e), "keyboardNavigation" == c && (b.enableKeyboardNavigation = e), ("width" == c || "height" == c) && (b.refresh(), b._initialize(), b._calculateWidth(), b.host.jqxPanel)) {
					var f = "fixed";
					null != this.height && "auto" != this.height || (f = "verticalwrap"), null != this.width && "auto" != this.width || (f = "fixed" == f ? "horizontalwrap" : "wrap"), b.panel.jqxPanel({
						sizeMode: f
					})
				}
				if("touchMode" == c && (b._isTouchDevice = null, e && (b.enableHover = !1), b._render()), ("source" == c || "checkboxes" == c) && null != this.source) {
					var g = [];
					a.each(b.items, function() {
						this.isExpanded && (g[g.length] = {
							label: this.label,
							level: this.level
						})
					});
					var h = b.loadItems(b.source);
					b.host.jqxPanel ? b.panel.jqxPanel("setcontent", h) : b.element.innerHTML = h;
					var i = b.disabled,
						j = b.host.find("ul:first");
					j.length > 0 && (b.createTree(j[0]), b._render());
					var k = b,
						l = k.animationShowDuration;
					k.animationShowDuration = 0, b.disabled = !1, g.length > 0 && a.each(b.items, function() {
						for(var a = 0; a < g.length; a++)
							if(g[a].label == this.label && g[a].level == this.level) {
								var b = k.getItem(this.element);
								k._expandItem(k, b)
							}
					}), b.disabled = i, k.animationShowDuration = l
				}
				"hasThreeStates" == c && (b._render(), b._updateCheckStates()), "toggleIndicatorSize" == c && (b._updateCheckLayout(), b._render())
			}
		}
	})
}(jqxBaseFramework),
function(a) {
	a.jqx._jqxTree.jqxTreeItem = function(a, b, c) {
		return {
			label: null,
			id: a,
			parentId: b,
			parentElement: null,
			parentItem: null,
			disabled: !1,
			selected: !1,
			locked: !1,
			checked: !1,
			level: 0,
			isExpanded: !1,
			hasItems: !1,
			element: null,
			subtreeElement: null,
			checkBoxElement: null,
			titleElement: null,
			arrow: null,
			prevItem: null,
			nextItem: null
		}
	}
}(jqxBaseFramework);