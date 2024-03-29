

// global page reference
helpBuilder = null;

(function () {
    helpBuilder = {
        initializeLayout: initializeLayout,
        initializeTOC: initializeTOC,
        isLocalUrl: isLocalUrl,        
        expandTopic: expandTopic,        
        expandParent: expandParents,
        tocExpandAll: tocExpandAll,
        tocCollapseAll: tocCollapseAll,
        highlightCode: null, // set in aceConfig
        configureAceEditor: null // set in aceConfig
    };    

    //var tocConfig = {
    //    html: null,
    //    timestamp: new Date()
    //}    

    function initializeLayout() {
       // for old IE versions work around no FlexBox
        if (navigator.userAgent.indexOf("MSIE 9") ||
	        navigator.userAgent.indexOf("MSIE 8"))
            $(document.body).addClass("old-ie");

        // modes: none/0 - with sidebar,  1 no sidebar
        var mode = getUrlEncodedKey("mode");
        if (mode)
            mode = mode * 1;
        else
            mode = 0;

        // Legacy processing page=TopicId urls to load topic by id
        var page = getUrlEncodedKey("page");
        if (page)
            loadTopicAjax(page);

        // load internal help links via Ajax
        $(".page-content").on("click", "a", function (e) {            
            var href = $(this).attr("href");
            if (href.startsWith("_")) {
                loadTopicAjax(href);
                return false; // stop navigation
            } 
        });

        if (isLocalUrl() || mode === 1) {
            hideSidebar();
        } else {
            $.get("tableofcontents.htm", loadTableOfContents);

            // sidebar or hamburger click handler
            $(document.body).on("click", ".sidebar-toggle", toggleSidebar);
            $(document.body).on("dblclick touchend", ".splitter", toggleSidebar);
             
            $(".sidebar-left").resizable({
                handleSelector: ".splitter",
                resizeHeight: false
            });

            // handle back/forward navigation so URL updates
            window.onpopstate = function (event) {
                if (history.state.URL)
                    loadTopicAjax(history.state.URL);
            }
        }
        CreateHeaderLinks();
    }

    var sidebarTappedTwice = false;
    function toggleSidebar(e) {

        // handle double tap
        if (e.type === "touchend" && !sidebarTappedTwice) {
            sidebarTappedTwice = true;
            setTimeout(function () { sidebarTappedTwice = false; }, 300);
            return false;
        }
        var $sidebar = $(".sidebar-left");
        var oldTrans = $sidebar.css("transition");
        $sidebar.css("transition", "width 0.5s ease");

        var $sidetop = $(".sidebar-top");
        var oldTrans = $sidetop.css("transition");
        $sidetop.css("transition", "height 0.5s ease");
        if ($sidebar.width() < 300, $sidetop.height() < 40) {
            $sidebar.show();
            $sidetop.show();
            $sidetop.height(40);
            $sidebar.width(300);
        } else {
            $sidebar.width(0);
            $sidetop.height(0);
        }

        setTimeout(function () { $sidebar.css("transition", oldTrans) }, 700);
        return true;
    }

    function loadTableOfContents(html) {
        var $tocContent = $("<div>" + getBodyFromHtmlDocument(html) + "</div>").find(".toc-content");
        $("#toc").html($tocContent.html());

        showSidebar();

        // handle AJAX loading of topics        
        $(".toc").on("click", "li a", loadTopicAjax);

        initializeTOC();
        return false;
    }
    function loadTopicAjax(href) {
        var hrefPassed = true;
        if (typeof href != "string") {
            var $a = $(this);
            href = $a.attr("href");
            hrefPassed = false;
        }

        if ($(this).parent().find("i.fa").length > 0)
            expandTopic(href);

        if (href.startsWith("_")) {
            $.get(href, function (html) {
                var $html = $(html);

                var title = html.extract("<title>", "</title>");
                window.document.title = title;

                var $content = $html.find(".main-content");
                if ($content.length > 0) {
                    html = $content.html();
                    $(".main-content").html(html);

                    // update the navigation history/url in addressbar
                    if (window.history.pushState && !hrefPassed)
                        window.history.pushState({ title: '', URL: href }, "", href);
                    else
                        expandParents(href.replace(".htm", ""));

                    $(".main-content").scrollTop(0);
                } else
                    return;

                var $banner = $html.find(".banner");
                if ($banner.length > 0);
                $(".banner").html($banner.html());

                helpBuilder.highlightCode();
                CreateHeaderLinks();
            });
            return false;  // don't allow click
        }
        return true;  // pass through click
    };
    function initializeTOC() {

        // if running in frames mode link to target frame and change mode
        if (window.parent.frames["wwhelp_right"]) {
            $(".toc li a").each(function () {
                var $a = $(this);
                $a.attr("target", "wwhelp_right");
                var a = $a[0];
                a.href = a.href + "?mode=1";
            });
            $("ul.toc").css("font-size", "1em");
        }

        // Handle clicks on + and -
        $("#toc").on("click","li>i.fa",function () {            
            expandTopic($(this).find("~a").prop("id") );
        });

        expandTopic('index');

        var page = getUrlEncodedKey("page");
        if (page) {
            page = page.replace(/.htm/i, "");
            expandParents(page);
        }
        if (!page) {
            page = window.location.href.extract("/_", ".htm");
            if (page)
                expandParents("_" + page);
        }

        var topic = getUrlEncodedKey("topic");
        if (topic) {
            var id = findIdByTopic();
            if (id) {
                var link = document.getElementById(id);
                var id = link.id;
                expandTopic(id);
                expandParents(id);
            }
        }

        function searchFilterFunc(target) {
            target.each(function () {
                var $a = $(this).find(">a");
                if ($a.length > 0) {
                    var url = $a.attr('href');
                    if (!url.startsWith("file:") && !url.startsWith("http")) {
                        expandParents(url.replace(/.htm/i, ""), true);
                    }
                }
            });
        }

        $("#SearchBox").searchFilter({
            targetSelector: ".toc li",
            charCount: 3,
            onSelected: debounce(searchFilterFunc, 300)
        });
    }

    function hideSidebar() {
        var $sidebar = $(".sidebar-left");
        var $sidetop = $(".sidebar-top");
        var $toggle = $(".sidebar-toggle");
        var $splitter = $(".splitter");
        $sidebar.hide();
        $toggle.hide();
        $sidetop.hide();
        $splitter.hide();
    }
    function showSidebar() {
        var $sidebar = $(".sidebar-left");
        var $sidetop = $(".sidebar-top");
        var $toggle = $(".sidebar-toggle");
        var $splitter = $(".splitter");
        $sidebar.show();
        $sidetop.show();
        $toggle.show();
        $splitter.show();
    }
    
    function expandTopic(topicId) {        
        var $href = $("#" + topicId.replace(".htm", ""));

        var $ul = $href.next();
        $ul.toggle();

        var $button = $href.prev().prev();

        if ($ul.is(":visible"))
            $button.removeClass("fa-plus-square-o").addClass("fa-minus-square-o");
        else
            $button.removeClass("fa-minus-square-o").addClass("fa-plus-square-o");
    }

    function expandParents(id, noFocus) {
        if (!id)
            return;

        var $node = $("#" + id.toLowerCase());
        $node.parents("ul").show();

        if (noFocus)
            return;

        var node = $node[0];
        if (!node)
            return;

        //node.scrollIntoView(true);
        node.focus();
        setTimeout(function () {
            window.scrollX = 0;
        });

    }
    function findIdByTopic(topic) {
        if (!topic) {
            var query = window.location.search;
            var match = query.search("topic=");
            if (match < 0)
                return null;
            topic = query.substr(match + 6);
            topic = decodeURIComponent(topic);
        }
        var id = null;
        $("a").each(function () {
            if ($(this).text().toLowerCase() == topic.toLocaleLowerCase()) {
                id = this.id;
                return;
            }
        });
        return id;
    }
    function tocCollapseAll() {

        $("ul.toc > li ul:visible").each(function () {
            var $el = $(this);
            var $href = $el.prev();
            var id = $href[0].id;
            expandTopic(id);
        });
    }
    function tocExpandAll() {
        $("ul.toc > li ul:not(:visible)").each(function () {
            var $el = $(this);
            var $href = $el.prev();
            var id = $href[0].id;
            expandTopic(id);
        });
    }
    function isLocalUrl(href) {
        if (!href)
            href = window.location.href;

        return href.startsWith("mk:@MSITStore") ||
	           href.startsWith("file://")
    }
    function mtoParts(address, domain, query) {
        var url = "ma" + "ilto" + ":" + address + "@" + domain;
        if (query)
            url = url + "?" + query;
        return url;
    }
    function CreateHeaderLinks() {
        var $h3 = $(".content-body>h2,.content-body>h3,.content-body>h4,.content-body>h1");

        $h3.each(function () {            
            var $h3item = $(this);
            $h3item.css("cursor", "pointer");

            var tag = $h3item.text().replace(/\s+/g, "");

            var $a = $("<a />")
	            .attr({
	                name: tag,
	                href: "#" + tag
	            })
	            .addClass('link-icon')
	            .addClass('link-hidden')
                .attr('title', 'click this link and set the bookmark url in the address bar.');

            $h3item.prepend($a);

            $h3item
	            .hover(
	                function () {
	                    $a.removeClass("link-hidden");
	                },
	                function () {
	                    $a.addClass("link-hidden");
	                })
	            .click(function () {
	                window.location = $a.prop("href");
	            });


        });

    }
})();



