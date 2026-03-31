/* Character-cell layout for .site-nav .menu-inner + horizontal scroll / drag / fade */
(function () {
    var ruler = document.createElement('canvas').getContext('2d');
    var navEl = null;
    var scrollBound = false;
    var resizeTimer;

    function buildSiteNavCells() {
        document.querySelectorAll('.site-nav .menu-inner').forEach(function (el) {
            if (!el.dataset.origText) el.dataset.origText = el.textContent.trim();
            var text = el.dataset.origText;
            var menu = el.closest('.menu');
            var cs = window.getComputedStyle(menu || el);
            var fontSize = parseFloat(cs.fontSize);
            var fontWeight = cs.fontWeight;
            var fontFamily = cs.fontFamily;
            ruler.font = fontWeight + ' ' + fontSize + 'px ' + fontFamily;
            var charW = ruler.measureText('M').width;
            var cellW = Math.round(charW + fontSize * 0.28);
            el.style.setProperty('--cell-w', cellW + 'px');

            var cells = [].concat(text.split('')).map(function (ch) {
                return (
                    '<span class="char-cell" style="width:' +
                    cellW +
                    'px">' +
                    (ch === ' ' ? '' : ch) +
                    '</span>'
                );
            }).join('');

            el.innerHTML =
                '<span class="char-cell bracket-cell bracket-open">{</span>' +
                cells +
                '<span class="char-cell bracket-cell bracket-close">}</span>';
        });
    }

    function updateScrollFade() {
        if (!navEl) return;
        var list = navEl.querySelector('ul');
        if (!list) return;
        var can = list.scrollWidth > navEl.clientWidth + 2;
        navEl.classList.toggle('site-nav--overflow', can);
        var atEnd = navEl.scrollLeft + navEl.clientWidth >= list.scrollWidth - 4;
        navEl.classList.toggle('site-nav--end', atEnd);
    }

    function bindScrollNav() {
        if (scrollBound) return;
        navEl = document.querySelector('nav.site-nav');
        if (!navEl) return;
        scrollBound = true;

        var nav = navEl;
        var down = false;
        var startX = 0;
        var startScrollLeft = 0;
        var dragMoved = false;

        nav.addEventListener(
            'scroll',
            function () {
                updateScrollFade();
            },
            { passive: true }
        );

        nav.addEventListener('mousedown', function (e) {
            if (e.button !== 0) return;
            down = true;
            dragMoved = false;
            startX = e.pageX;
            startScrollLeft = nav.scrollLeft;
            nav.classList.add('site-nav--dragging');
        });

        function endDrag() {
            if (!down) return;
            down = false;
            nav.classList.remove('site-nav--dragging');
        }

        window.addEventListener('mouseup', endDrag);
        window.addEventListener('blur', endDrag);

        nav.addEventListener('mousemove', function (e) {
            if (!down) return;
            var dx = e.pageX - startX;
            if (Math.abs(dx) > 4) dragMoved = true;
            e.preventDefault();
            nav.scrollLeft = startScrollLeft - dx;
            updateScrollFade();
        });

        nav.addEventListener('mouseleave', function () {
            endDrag();
        });

        nav.addEventListener(
            'click',
            function (e) {
                if (dragMoved) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                dragMoved = false;
            },
            true
        );
    }

    function scrollToActive() {
        if (!navEl) return;
        var active = navEl.querySelector('.menu.is-current');
        if (!active) return;
        var navRect    = navEl.getBoundingClientRect();
        var activeRect = active.getBoundingClientRect();
        /* If the active item is clipped by the right-edge fade, scroll it into full view */
        var rightEdge  = activeRect.right - navRect.left + navEl.scrollLeft;
        var targetScroll = rightEdge - navEl.clientWidth;
        if (targetScroll > navEl.scrollLeft) {
            navEl.scrollLeft = targetScroll + 12; /* 12px breathing room */
        }
        updateScrollFade();
    }

    function refresh() {
        buildSiteNavCells();
        bindScrollNav();
        requestAnimationFrame(function () {
            updateScrollFade();
            scrollToActive();
        });
    }

    window.buildSiteNavCells = buildSiteNavCells;
    document.fonts.ready.then(refresh);
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(refresh, 120);
    });
})();
