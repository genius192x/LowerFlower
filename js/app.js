(() => {
    "use strict";
    const modules_flsModules = {};
    let isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
        }
    };
    function addTouchClass() {
        if (isMobile.any()) document.documentElement.classList.add("touch");
    }
    function addLoadedClass() {
        window.addEventListener("load", (function() {
            setTimeout((function() {
                document.documentElement.classList.add("loaded");
            }), 0);
        }));
    }
    function fullVHfix() {
        const fullScreens = document.querySelectorAll("[data-fullscreen]");
        if (fullScreens.length && isMobile.any()) {
            window.addEventListener("resize", fixHeight);
            function fixHeight() {
                let vh = .01 * window.innerHeight;
                document.documentElement.style.setProperty("--vh", `${vh}px`);
            }
            fixHeight();
        }
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                        spollersBlock.addEventListener("click", setSpollerAction);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                        spollersBlock.removeEventListener("click", setSpollerAction);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
                if (spollerTitles.length) {
                    spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
                    spollerTitles.forEach((spollerTitle => {
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerTitle.classList.contains("_spoller-active")) spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            spollerTitle.nextElementSibling.hidden = false;
                        }
                    }));
                }
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("[data-spoller]")) {
                    const spollerTitle = el.closest("[data-spoller]");
                    const spollersBlock = spollerTitle.closest("[data-spollers]");
                    const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    if (!spollersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
                        spollerTitle.classList.toggle("_spoller-active");
                        _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                    }
                    e.preventDefault();
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                }
            }
            const spollersClose = document.querySelectorAll("[data-spoller-close]");
            if (spollersClose.length) document.addEventListener("click", (function(e) {
                const el = e.target;
                if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
                    const spollersBlock = spollerClose.closest("[data-spollers]");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    spollerClose.classList.remove("_spoller-active");
                    _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                }));
            }));
        }
    }
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function cartInit() {
        if (document.querySelector(".cart-icon")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".cart-icon")) {
                document.documentElement.classList.toggle("cart-open");
                if (document.querySelector(".touch")) bodyLockToggle();
            }
        }));
        if (document.querySelector(".cart-close")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".cart-close")) {
                document.documentElement.classList.toggle("cart-open");
                if (document.querySelector(".touch")) bodyLockToggle();
            }
        }));
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) ;
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Проснулся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if ("error" !== this._dataValue) {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Ой ой, не заполнен атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && 9 == e.which && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Открыл попап`);
                } else this.popupLogging(`Ой ой, такого попапа нет.Проверьте корректность ввода. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрыл попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && 0 === focusedIndex) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
    let addWindowScrollEvent = false;
    function headerScroll() {
        addWindowScrollEvent = true;
        const header = document.querySelector("header.header");
        const headerShow = header.hasAttribute("data-scroll-show");
        const headerShowTimer = header.dataset.scrollShow ? header.dataset.scrollShow : 500;
        const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
        let scrollDirection = 0;
        let timer;
        document.addEventListener("windowScroll", (function(e) {
            const scrollTop = window.scrollY;
            clearTimeout(timer);
            if (scrollTop >= startPoint) {
                !header.classList.contains("header-scroll") ? header.classList.add("header-scroll") : null;
                if (headerShow) {
                    if (scrollTop > scrollDirection) header.classList.contains("header-show") ? header.classList.remove("header-show") : null; else !header.classList.contains("header-show") ? header.classList.add("header-show") : null;
                    timer = setTimeout((() => {
                        !header.classList.contains("header-show") ? header.classList.add("header-show") : null;
                    }), headerShowTimer);
                }
            } else {
                header.classList.contains("header-scroll") ? header.classList.remove("header-scroll") : null;
                if (headerShow) header.classList.contains("header-show") ? header.classList.remove("header-show") : null;
            }
            scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
        }));
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    function DynamicAdapt(type) {
        this.type = type;
    }
    DynamicAdapt.prototype.init = function() {
        const _this = this;
        this.оbjects = [];
        this.daClassname = "_dynamic_adapt_";
        this.nodes = document.querySelectorAll("[data-da]");
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const data = node.dataset.da.trim();
            const dataArray = data.split(",");
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(dataArray[0].trim());
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
            оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        }
        this.arraySort(this.оbjects);
        this.mediaQueries = Array.prototype.map.call(this.оbjects, (function(item) {
            return "(" + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
        }), this);
        this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, (function(item, index, self) {
            return Array.prototype.indexOf.call(self, item) === index;
        }));
        for (let i = 0; i < this.mediaQueries.length; i++) {
            const media = this.mediaQueries[i];
            const mediaSplit = String.prototype.split.call(media, ",");
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];
            const оbjectsFilter = Array.prototype.filter.call(this.оbjects, (function(item) {
                return item.breakpoint === mediaBreakpoint;
            }));
            matchMedia.addListener((function() {
                _this.mediaHandler(matchMedia, оbjectsFilter);
            }));
            this.mediaHandler(matchMedia, оbjectsFilter);
        }
    };
    DynamicAdapt.prototype.mediaHandler = function(matchMedia, оbjects) {
        if (matchMedia.matches) for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination);
        } else for (let i = оbjects.length - 1; i >= 0; i--) {
            const оbject = оbjects[i];
            if (оbject.element.classList.contains(this.daClassname)) this.moveBack(оbject.parent, оbject.element, оbject.index);
        }
    };
    DynamicAdapt.prototype.moveTo = function(place, element, destination) {
        element.classList.add(this.daClassname);
        if ("last" === place || place >= destination.children.length) {
            destination.insertAdjacentElement("beforeend", element);
            return;
        }
        if ("first" === place) {
            destination.insertAdjacentElement("afterbegin", element);
            return;
        }
        destination.children[place].insertAdjacentElement("beforebegin", element);
    };
    DynamicAdapt.prototype.moveBack = function(parent, element, index) {
        element.classList.remove(this.daClassname);
        if (void 0 !== parent.children[index]) parent.children[index].insertAdjacentElement("beforebegin", element); else parent.insertAdjacentElement("beforeend", element);
    };
    DynamicAdapt.prototype.indexInParent = function(parent, element) {
        const array = Array.prototype.slice.call(parent.children);
        return Array.prototype.indexOf.call(array, element);
    };
    DynamicAdapt.prototype.arraySort = function(arr) {
        if ("min" === this.type) Array.prototype.sort.call(arr, (function(a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) return 0;
                if ("first" === a.place || "last" === b.place) return -1;
                if ("last" === a.place || "first" === b.place) return 1;
                return a.place - b.place;
            }
            return a.breakpoint - b.breakpoint;
        })); else {
            Array.prototype.sort.call(arr, (function(a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if ("first" === a.place || "last" === b.place) return 1;
                    if ("last" === a.place || "first" === b.place) return -1;
                    return b.place - a.place;
                }
                return b.breakpoint - a.breakpoint;
            }));
            return;
        }
    };
    const da = new DynamicAdapt("max");
    da.init();
    const animItems = document.querySelectorAll("._anim-items");
    if (animItems.length > 0) {
        window.addEventListener("scroll", animOnScroll);
        function animOnScroll() {
            for (let index = 0; index < animItems.length; index++) {
                const animItem = animItems[index];
                const animItemHeight = animItem.offsetHeight;
                const animItemOffset = offset(animItem).top;
                const animStart = 4;
                let animItemPoint = window.innerHeight - animItemHeight / animStart;
                if (animItemHeight > window.innerHeight) animItemPoint = window.innerHeight - window.innerHeight / animStart;
                if (pageYOffset > animItemOffset - animItemPoint && pageYOffset < animItemOffset + animItemHeight) animItem.classList.add("_active"); else if (!animItem.classList.contains("_anim-no-hide")) animItem.classList.remove("_active");
            }
        }
        function offset(el) {
            const rect = el.getBoundingClientRect(), scrollLeft = window.pageXOffset || document.documentElement.scrollLeft, scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return {
                top: rect.top + scrollTop,
                left: rect.left + scrollLeft
            };
        }
        setTimeout((() => {
            animOnScroll();
        }), 300);
    }
    window.addEventListener("click", (function(event) {
        let counter;
        let del;
        if ("plus" === event.target.dataset.action || "minus" === event.target.dataset.action || event.target.hasAttribute("data-del")) {
            const counterWrapper = event.target.closest(".cart__product");
            counter = counterWrapper.querySelector("[data-counter]");
        }
        if (event.target.hasAttribute("data-del")) {
            if (parseInt(counter.innerText) > 1) {
                const delCard = document.querySelector("[data-del]");
                del = delCard.querySelector("[data-del]");
                counter.innerText = --counter.innerText;
            } else event.target.closest(".cart__product").remove();
            calcCartPrice();
        }
        if ("plus" === event.target.dataset.action) counter.innerText = ++counter.innerText;
        if ("minus" === event.target.dataset.action) if (parseInt(counter.innerText) > 1) counter.innerText = --counter.innerText; else {
            event.target.closest(".cart__product").remove();
            calcCartPrice();
        }
        if (event.target.hasAttribute("data-action") && event.target.closest(".cart__products")) calcCartPrice();
        const cart = document.querySelector(".header__shopping-cart");
        const cartCounter = `<span>1</span>`;
        const cartQuantity = cart.querySelector("span");
        function updateCart() {
            if (event.target.hasAttribute("data-cart") || event.target.hasAttribute("data-additionallyy") || event.target.hasAttribute("data-cartCatalog")) if (!cartQuantity) cart.insertAdjacentHTML("beforeend", cartCounter); else cartQuantity.innerHTML = ++cartQuantity.innerHTML; else if (event.target.hasAttribute("data-del")) {
                const cartQuantityValue = --cartQuantity.innerHTML;
                if (cartQuantityValue) cartQuantity.innerHTML = cartQuantityValue; else cartQuantity.remove();
            } else if ("plus" === event.target.dataset.action) cartQuantity.innerHTML = ++cartQuantity.innerHTML; else if ("minus" === event.target.dataset.action) if (parseInt(cartQuantity.innerText) > 1) cartQuantity.innerHTML = --cartQuantity.innerHTML; else cartQuantity.remove();
        }
        updateCart();
        const cartWrapper = document.querySelector(".cart__products");
        const animationCart = document.querySelectorAll(".slide__cart");
        const animationCartCatalog = document.querySelectorAll(".catalog__cart");
        if (event.target.hasAttribute("data-cart")) animationCart.forEach((function(item) {
            item.classList.add("active");
            function animateRemove() {
                item.classList.remove("active");
                item.classList.add("reActive");
            }
            function animateRemoveActive() {
                item.classList.remove("reActive");
            }
            setTimeout(animateRemove, 600);
            setTimeout(animateRemoveActive, 1300);
        }));
        if (event.target.hasAttribute("data-cartCatalog")) animationCartCatalog.forEach((function(item) {
            item.classList.add("active");
            function animateRemove() {
                item.classList.remove("active");
                item.classList.add("reActive");
            }
            function animateRemoveActive() {
                item.classList.remove("reActive");
            }
            setTimeout(animateRemove, 600);
            setTimeout(animateRemoveActive, 1300);
        }));
        if (event.target.hasAttribute("data-cart")) {
            const card = event.target.closest(".popular__slide");
            const productInfo = {
                id: card.dataset.id,
                imgSrc: card.querySelector(".image__slide").getAttribute("src"),
                title: card.querySelector(".label__title").innerText,
                price: card.querySelector(".label__price").innerText
            };
            const itemInCart = cartWrapper.querySelector(`[data-id='${productInfo.id}']`);
            if (itemInCart) {
                const counterElement = itemInCart.querySelector("[data-counter]");
                counterElement.innerText = parseInt(counterElement.innerText) + 1;
            } else {
                const cartItemHTML = `<div class="cart__product" data-id="${productInfo.id}">\n\t\t\t\t\t\t\t\t<div class="product__image">\n\t\t\t\t\t\t\t\t\t<img src="${productInfo.imgSrc}" alt="">\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="product__titleCounter">\n\t\t\t\t\t\t\t\t\t<div class="product__title">${productInfo.title}</div>\n\t\t\t\t\t\t\t\t\t<div class="product__counter-wrapper">\n\t\t\t\t\t\t\t\t\t\t<div class="product__counter-control" data-action="minus">-</div>\n\t\t\t\t\t\t\t\t\t\t<div class="product__counter-current" data-counter>1</div>\n\t\t\t\t\t\t\t\t\t\t<div class="product__counter-control" data-action="plus">+</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="product__priceDel">\n\t\t\t\t\t\t\t\t\t<div class="product__price">${productInfo.price}</div>\n\t\t\t\t\t\t\t\t\t<div class="product__delete" data-del>Удалить</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>`;
                cartWrapper.insertAdjacentHTML("beforeend", cartItemHTML);
                objCart[productInfo.id] = {
                    id: [ productInfo.id ],
                    name: [ productInfo.title ],
                    price: [ productInfo.price ],
                    img: [ productInfo.image ]
                };
                console.log(objCart);
                return objCart;
            }
            calcCartPrice();
        }
        if (event.target.hasAttribute("data-additionally")) {
            console.log("работает");
            if (!cartQuantity) cart.insertAdjacentHTML("beforeend", cartCounter); else cartQuantity.innerHTML = ++cartQuantity.innerHTML;
            const card = event.target.closest(".additionally__card");
            const productInfo = {
                id: card.dataset.id,
                imgSrc: card.querySelector(".image__additionally").getAttribute("src"),
                title: card.querySelector(".additionally__name").innerText,
                price: card.querySelector(".additionally__price").innerText
            };
            const itemInCart = cartWrapper.querySelector(`[data-id='${productInfo.id}']`);
            if (itemInCart) {
                const counterElement = itemInCart.querySelector("[data-counter]");
                counterElement.innerText = parseInt(counterElement.innerText) + 1;
            } else {
                const cartItemHTML = `<div class="cart__product" data-id="${productInfo.id}">\n\t\t\t\t\t\t\t\t<div class="product__image">\n\t\t\t\t\t\t\t\t\t<img src="${productInfo.imgSrc}" alt="">\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="product__titleCounter">\n\t\t\t\t\t\t\t\t\t<div class="product__title">${productInfo.title}</div>\n\t\t\t\t\t\t\t\t\t<div class="product__counter-wrapper">\n\t\t\t\t\t\t\t\t\t\t<div class="product__counter-control" data-action="minus">-</div>\n\t\t\t\t\t\t\t\t\t\t<div class="product__counter-current" data-counter>1</div>\n\t\t\t\t\t\t\t\t\t\t<div class="product__counter-control" data-action="plus">+</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="product__priceDel">\n\t\t\t\t\t\t\t\t\t<div class="product__price">${productInfo.price}</div>\n\t\t\t\t\t\t\t\t\t<div class="product__delete" data-del>Удалить</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>`;
                cartWrapper.insertAdjacentHTML("beforeend", cartItemHTML);
            }
        }
        let objCart = {};
        if (event.target.hasAttribute("data-cartCatalog")) {
            const card = event.target.closest(".catalog__item");
            const productInfo = {
                id: card.dataset.id,
                imgSrc: card.querySelector(".image__catalog").getAttribute("src"),
                title: card.querySelector(".label__title").innerText,
                price: card.querySelector(".label__price").innerText
            };
            const itemInCart = cartWrapper.querySelector(`[data-id='${productInfo.id}']`);
            if (itemInCart) {
                const counterElement = itemInCart.querySelector("[data-counter]");
                counterElement.innerText = parseInt(counterElement.innerText) + 1;
            } else {
                const cartItemHTML = `<div class="cart__product" data-id="${productInfo.id}">\n\t\t\t\t\t\t\t\t<div class="product__image">\n\t\t\t\t\t\t\t\t\t<img src="${productInfo.imgSrc}" alt="">\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="product__titleCounter">\n\t\t\t\t\t\t\t\t\t<div class="product__title">${productInfo.title}</div>\n\t\t\t\t\t\t\t\t\t<div class="product__counter-wrapper">\n\t\t\t\t\t\t\t\t\t\t<div class="product__counter-control" data-action="minus">-</div>\n\t\t\t\t\t\t\t\t\t\t<div class="product__counter-current" data-counter>1</div>\n\t\t\t\t\t\t\t\t\t\t<div class="product__counter-control" data-action="plus">+</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="product__priceDel">\n\t\t\t\t\t\t\t\t\t<div class="product__price">${productInfo.price}</div>\n\t\t\t\t\t\t\t\t\t<div class="product__delete" data-del>Удалить</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>`;
                cartWrapper.insertAdjacentHTML("beforeend", cartItemHTML);
                objCart[productInfo.id] = {
                    id: productInfo.id,
                    name: productInfo.title,
                    price: productInfo.price,
                    img: productInfo.imgSrc
                };
            }
            calcCartPrice();
        }
        calcCartPrice();
        console.log(objCart);
    }));
    function calcCartPrice() {
        document.querySelector(".cart__products");
        const cartItems = document.querySelectorAll(".cart__product");
        const priceTotal = document.querySelector(".cart__result");
        let totalPrice = 0;
        cartItems.forEach((function(item) {
            const amountEl = item.querySelector("[data-counter]");
            const priceEl = item.querySelector(".product__price");
            const currentPrice = parseInt(amountEl.innerText) * parseInt(priceEl.innerText);
            totalPrice += currentPrice;
        }));
        priceTotal.innerText = totalPrice;
        localStorage.setItem("totalPrice", totalPrice);
    }
    function initSliders() {
        if (document.querySelector(".swiper ")) new Swiper(".swiper ", {
            observer: true,
            observeParents: true,
            slidesPerView: "auto",
            spaceBetween: 24,
            speed: 1500,
            loop: true,
            watchOverflow: true,
            loopAdditionalSlides: 5,
            preloadImages: false,
            parallax: true,
            autoplay: {
                delay: 2e3,
                disableOnInteraction: false
            },
            pagination: {
                el: ".controls-slider-main__dotts",
                clickable: true
            },
            navigation: {
                prevEl: ".swiper-button-prev",
                nextEl: ".swiper-button-next"
            },
            breakpoints: {
                320: {
                    spaceBetween: 20
                },
                530: {
                    spaceBetween: 20
                },
                992: {
                    spaceBetween: 20
                },
                1268: {
                    spaceBetween: 24
                },
                1550: {
                    spaceBetween: 24
                }
            },
            on: {}
        });
    }
    const tags = document.querySelectorAll(".tags__item");
    tags.forEach((function(item) {
        item.addEventListener("click", (function(event) {
            const xd = document.querySelector(".active__tags");
            if (!item.classList.contains("active")) {
                if (xd.childNodes.length <= 2) {
                    item.classList.add("active");
                    function addTag() {
                        const activeTag = `<div class="active__tag">\n\t\t\t\t\t\t\t<div class="active__title">${item.innerText}</div> \n\t\t\t\t\t\t\t<div class="active__del">\n\t\t\t\t\t\t\t<div class="active__delFir"></div>\n\t\t\t\t\t\t\t<div class="active__delSec"></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>`;
                        const tagWrap = document.querySelector(".active__tags");
                        tagWrap.insertAdjacentHTML("afterBegin", activeTag);
                    }
                    addTag();
                } else alert("Выбрано максимальное колличетсво тегов");
                let activeTags = document.getElementsByClassName("active__tag");
                let arrayTag = Array.from(activeTags);
                function removeTag() {
                    if (activeTags) arrayTag.forEach((item => {
                        const delTag = item.querySelectorAll(".active__del");
                        delTag.forEach((function(keydel) {
                            keydel.addEventListener("click", (() => {
                                const tagTitle = item.querySelector(".active__title");
                                tags.forEach((tag => {
                                    if (tagTitle.innerText === tag.innerText) tag.classList.remove("active");
                                }));
                                item.remove();
                            }));
                        }));
                    }));
                }
                removeTag();
            } else {
                function removeTags() {
                    let activeTags = document.getElementsByClassName("active__tag");
                    let arrayTag = Array.from(activeTags);
                    arrayTag.forEach((elem => {
                        const lowTagAct = elem.querySelectorAll(".active__title");
                        const arrLowTagAct = Array.from(lowTagAct);
                        arrLowTagAct.forEach((tag => {
                            if (item.innerText == tag.innerText) elem.remove();
                        }));
                    }));
                }
                removeTags();
                item.classList.remove("active");
            }
        }));
    }));
    const arrFlowers = [ {
        id: 1,
        name: "Весна",
        price: 200,
        rating: 5,
        img: "img/Catalog/catalog_2.png",
        typeFlower: "Розы",
        color: "Белый"
    }, {
        id: 2,
        name: "Любовь",
        price: 200,
        rating: 5,
        img: "img/Catalog/catalog_5.png",
        typeFlower: "Розы",
        color: "Розовый"
    }, {
        id: 3,
        name: "Близнецы",
        price: 200,
        rating: 5,
        img: "img/Catalog/catalog_6.png",
        typeFlower: "Mix",
        color: "Оранжевый"
    }, {
        id: 4,
        name: "Элегантность",
        price: 200,
        rating: 5,
        img: "img/Catalog/catalog_9.png",
        typeFlower: "Gladiolus",
        color: "Желтый"
    }, {
        id: 5,
        name: "Красота",
        price: 200,
        rating: 5,
        img: "img/Catalog/catalog_7.png",
        typeFlower: "Mix",
        color: "Розовый"
    }, {
        id: 6,
        name: "Инь-ЯН",
        price: 200,
        rating: 5,
        img: "img/Catalog/catalog_3.png",
        typeFlower: "Mix",
        color: "Mix"
    }, {
        id: 7,
        name: "Букет",
        price: 200,
        rating: 5,
        img: "img/Catalog/catalog_1.png",
        typeFlower: "Mix",
        color: "Оранжевый"
    }, {
        id: 8,
        name: "Зелень",
        price: 200,
        rating: 5,
        img: "img/Catalog/catalog_4.png",
        typeFlower: "Гладиолус",
        color: "Зеленый"
    }, {
        id: 9,
        name: "огонь",
        price: 200,
        rating: 5,
        img: "img/Catalog/catalog_8.png",
        typeFlower: "Лаванда",
        color: "Бордовый "
    }, {
        id: 10,
        name: "Розовые розы",
        price: 200,
        rating: 5,
        img: "img/Catalog/catalog_10.png",
        typeFlower: "Розы",
        color: "Розовый"
    }, {
        id: 11,
        name: "Желтые розы",
        price: 200,
        rating: 5,
        img: "img/Catalog/catalog_11.png",
        typeFlower: "Розы",
        color: "Желтый"
    }, {
        id: 12,
        name: "Синева",
        price: 200,
        rating: 5,
        img: "img/Catalog/catalog_12.png",
        typeFlower: "Индиго",
        color: "Синий"
    } ];
    arrFlowers.forEach((item => {
        class Product {
            constructor(item) {
                this.id = item.id;
                this.name = item.name;
                this.price = item.price;
                this.rating = item.rating;
                this.img = item.img;
            }
        }
        const newFlower = new Product(item);
        const productsWrapp = document.querySelector(".catalog__items");
        const productsCreate = `<div class="catalog__item" data-id="${newFlower.id}">\n\t\t\t\t\t\t\t<div class="catalog__image"> <img class="image__catalog" src="${newFlower.img}" alt="">\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=" content-catalog">\n\t\t\t\t\t\t\t\t<div class="catalog__label">\n\t\t\t\t\t\t\t\t\t<div class="label__content">\n\t\t\t\t\t\t\t\t\t\t<div class="label__number">${newFlower.id}</div>\n\t\t\t\t\t\t\t\t\t\t<div class="label__line"></div>\n\t\t\t\t\t\t\t\t\t\t<div class="label__price">${newFlower.price} ₽</div>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="label__title">${newFlower.name}</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="catalog__action">\n\t\t\t\t\t\t\t\t\t<div data-cartCatalog class="catalog__cart _icon-Shopping_Cart"></div>\n\t\t\t\t\t\t\t\t\t<div class="catalog__product _icon-Arrow_Left_MD"></div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>`;
        if (productsWrapp) productsWrapp.insertAdjacentHTML("beforeend", productsCreate);
    }));
    window.addEventListener("load", (function(e) {
        initSliders();
    }));
    window["FLS"] = false;
    addTouchClass();
    addLoadedClass();
    menuInit();
    cartInit();
    fullVHfix();
    spollers();
    headerScroll();
})();