(function ($) {

    $.fn.paginate = function (options) {
        var settings = $.extend({
            itemsPerPage: '10', //number of items to show per page
            paginationAttrs: { //attributes to attach to the created pagination div
                class: 'pagination'
            },
            paginationContainer: this.parent(), //the container to which the pagination div is appended
            pageLinkClass: 'pagination', //class for the page links
            activeLinkClass: 'active', //class for the current page link
            disabledLinkClass: 'very_faded', //class for disabled page links
            pageLinksDisplayed: true, //boolean to show numbered page links
            nextPrevDisplayed: true, // boolean to show next/prev page links
            firstLastDisplayed: true, // boolean to show go to first/last page links
            pageInfoDisplayed: true, //boolean to show page info span
            initialPage: 1, //page number to load initially
            beforePageClick: function (event) {}, //callback to be executed before a page link is clicked
            afterPageClick: function (event) {} //callback to be executed after a page link is clicked
        }, options);

        var items = this.children();
        var itemCount = items.length;
        var pageCount = Math.ceil(itemCount / settings.itemsPerPage);

        if (pageCount == 1) return;

        var linklist = $("<ul />");
        $("<div />")
            .attr(settings.paginationAttrs)
            .appendTo(settings.paginationContainer) //append the pagination div to the given container
        .append(linklist);

        //initialize the first page
        loadTable(settings.initialPage);

        function loadTable(currentPage) {
            var start = Math.max(0, settings.itemsPerPage * (currentPage - 1));
            var end = Math.min(settings.itemsPerPage * currentPage, itemCount);
            items.hide().slice(start, end).show();
            loadLinks(currentPage);
        }

        function loadLinks(currentPage) {
            linklist.find('a').unbind();

            var links = [];

            var firstPageLink = $("<a />")
                .attr({
                class: settings.pageLinkClass + ' gotofirst ' + ((currentPage == 1) ? settings.disabledLinkClass : ''),
                    'data-page': 1
            }).text('<<');
            var prevPageLink = $("<a />")
                .attr({
                class: settings.pageLinkClass + ' prev ' + ((currentPage == 1) ? settings.disabledLinkClass : ''),
                    'data-page': (currentPage > 1) ? currentPage - 1 : 1
            }).text('Prev');
            if (settings.firstLastDisplayed) links.push(firstPageLink);
            if (settings.nextPrevDisplayed) links.push(prevPageLink);

            if (settings.pageLinksDisplayed) {
                //logic for determining which pages to show. Only 5 will be shown.
                var firstDisplayedLink;
                var lastDisplayedLink;
                if (currentPage - 2 < 1) {
                    firstDisplayedLink = 1;
                    lastDisplayedLink = Math.min(pageCount, 5);
                } else if (currentPage + 2 > pageCount) {
                    firstDisplayedLink = Math.max(1, pageCount - 4);
                    lastDisplayedLink = pageCount;
                } else {
                    firstDisplayedLink = currentPage - 2;
                    lastDisplayedLink = currentPage + 2;
                }

                for (var i = firstDisplayedLink; i <= lastDisplayedLink; i++) {
                    var activeClass = (i == currentPage) ? ' ' + settings.activeLinkClass : '';
                    links.push(
                    $("<a />")
                        .attr({
                        class: settings.pageLinkClass + activeClass,
                            'data-page': i
                    }).text(i));
                }
            }

            var nextPageLink = $("<a />")
                .attr({
                class: settings.pageLinkClass + ' next ' + ((currentPage == pageCount) ? settings.disabledLinkClass : ''),
                    'data-page': (currentPage < pageCount) ? currentPage + 1 : pageCount
            }).text('Next');
            var lastPageLink = $("<a />")
                .attr({
                class: settings.pageLinkClass + ' gotolast ' + ((currentPage == pageCount) ? settings.disabledLinkClass : ''),
                    'data-page': pageCount
            }).text('>>');

            if (settings.nextPrevDisplayed) links.push(nextPageLink);
            if (settings.firstLastDisplayed) links.push(lastPageLink);

            linklist.html('');
            for (var link in links) {
                $("<li />").append(links[link]).appendTo(linklist);
                links[link].bind('click', onClick);
            }
            if (settings.pageInfoDisplayed) $("<li />").append("<span>Page: " + currentPage + " of " + pageCount + "</span>").appendTo(linklist);
        }

        function onClick(event) {
            event.preventDefault();
            settings.beforePageClick.call(event);

            var page = Number($(this).attr('data-page'));
            loadTable(page);

            settings.afterPageClick.call(event);
        }
    };
})(jQuery);