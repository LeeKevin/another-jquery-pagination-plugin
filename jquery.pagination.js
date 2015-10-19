/**
 * @summary     paginate
 * @description Super fast pagination with jQuery
 * @version     1.0.0
 * @file        jquery.paginate.js
 * @author      Kevin Lee
 */

(function () {

    var Pagination;

    $.fn.paginate = function (options) {
        var args = arguments;
        var result;
        this.each(function () {
            var $this, paginate;
            $this = $(this);
            paginate = $this.data('paginate');
            if (paginate instanceof Pagination) {
                //do methods
                if (typeof options == 'string') {
                    if (options == 'refresh') {
                        if (args.length >= 2) paginate.refresh(args[1]);
                        else paginate.refresh()
                        return true;
                    } else if (options == 'destroy') return paginate.destroy();
                    else if (options == 'page') {
                        result = paginate.page();
                        return false;
                    }
                }
            } else {
                if (typeof options == 'string') throw "You must initialize the element for pagination before calling a method.";
                $this.data('paginate', new Pagination(this, options));
            }
        });

        if (typeof result == "undefined") result = this;

        return result;
    };

    $.fn.paginate.defaults = {
        itemsPerPage: '25', //number of items to show per page
        paginationAttrs: { //attributes to attach to the created pagination div
            class: 'pagination'
        },
        paginationContainer: 'parent', //the container to which the pagination div is appended
        pageLinkClass: 'pagination', //class for the page links
        activeLinkClass: 'active', //class for the current page link
        disabledLinkClass: 'very_faded', //class for disabled page links
        pageLinksDisplayed: true, //boolean to display numbered page links
        nextPrevDisplayed: true, //boolean to display next/prev page links
        firstLastDisplayed: true, //boolean to display go to first/last page links
        pageInfoDisplayed: true, //boolean to display the "Page x of x" item
        initialPage: 1, //the page number to display on initial load
        childrenSelector: '',
        beforePageClick: function (event) {
        }, //callback to be executed before a page link is clicked
        afterPageClick: function (event) {
        } //callback to be executed after a page link is clicked
    };

    Pagination = (function () {

        function Pagination(element, preferences) {

            this.settings = $.fn.paginate.defaults;
            if (preferences && typeof(preferences) == 'object') {
                this.settings = $.extend({}, this.settings, preferences);
            }

            this.parent = $(element);
            if (typeof this.settings.paginationContainer == 'string') {
                if (this.settings.paginationContainer == 'parent') {
                    this.settings.paginationContainer = this.parent.parent();
                } else {
                    this.settings.paginationContainer = $(this.settings.paginationContainer);
                }
            }

            if (!(this.parent.length && this.settings.paginationContainer instanceof $ && this.settings.paginationContainer.length)) return;

            this.setup_html();
            if (this.load(this.settings.initialPage)) this.pagination.appendTo(this.settings.paginationContainer);
            //append the pagination div to the given container

        }

        Pagination.prototype.load = function (page) {
            this.items = this.parent.children(this.settings.childrenSelector);
            this.itemCount = this.items.length;
            this.pageCount = Math.ceil(this.itemCount / this.settings.itemsPerPage);

            if (this.itemCount == 0 || this.pageCount == 1) return false;
            page = !isNaN(parseFloat(page)) && isFinite(page) ? parseInt(page) : 1;
            this.loadTable(page);

            return true;
        };

        Pagination.prototype.setup_html = function () {
            this.linklist = $("<ul />");
            this.currentPageElement = $("<input type='hidden' class='current-page'>");
            this.pagination = $("<div />")
                .attr(this.settings.paginationAttrs)
                .append(this.linklist)
                .append(this.currentPageElement);

        };

        Pagination.prototype.loadTable = function (currentPage) {
            var start = Math.max(0, this.settings.itemsPerPage * (currentPage - 1));
            var end = Math.min(this.settings.itemsPerPage * currentPage, this.itemCount);
            this.items.hide().slice(start, end).show();
            this.currentPageElement.val(currentPage);
            this.loadLinks(currentPage);
        };

        Pagination.prototype.loadLinks = function (currentPage) {
            this.linklist.find('a').unbind();

            var links = [];

            var firstPageLink = $("<a />")
                .attr({
                    class: this.settings.pageLinkClass + ' gotofirst ' + ((currentPage == 1) ? this.settings.disabledLinkClass : ''),
                    'data-page': 1
                }).text('<<');
            var prevPageLink = $("<a />")
                .attr({
                    class: this.settings.pageLinkClass + ' prev ' + ((currentPage == 1) ? this.settings.disabledLinkClass : ''),
                    'data-page': (currentPage > 1) ? currentPage - 1 : 1
                }).text('Prev');
            if (this.settings.firstLastDisplayed) links.push(firstPageLink);
            if (this.settings.nextPrevDisplayed) links.push(prevPageLink);
            if (this.settings.pageLinksDisplayed) {
                //logic for determining which pages to show. Only 5 will be shown.
                var firstDisplayedLink, lastDisplayedLink;
                if (currentPage - 2 < 1) {
                    firstDisplayedLink = 1;
                    lastDisplayedLink = Math.min(this.pageCount, 5);
                } else if (currentPage + 2 > this.pageCount) {
                    firstDisplayedLink = Math.max(1, this.pageCount - 4);
                    lastDisplayedLink = this.pageCount;
                } else {
                    firstDisplayedLink = currentPage - 2;
                    lastDisplayedLink = currentPage + 2;
                }

                for (var i = firstDisplayedLink; i <= lastDisplayedLink; i++) {
                    var activeClass = (i == currentPage) ? ' ' + this.settings.activeLinkClass : '';
                    links.push(
                        $("<a />")
                            .attr({
                                class: this.settings.pageLinkClass + activeClass,
                                'data-page': i
                            }).text(i)
                    );
                }
            }
            var nextPageLink = $("<a />")
                .attr({
                    class: this.settings.pageLinkClass + ' next ' + ((currentPage == this.pageCount) ? this.settings.disabledLinkClass : ''),
                    'data-page': (currentPage < this.pageCount) ? currentPage + 1 : this.pageCount
                }).text('Next');
            var lastPageLink = $("<a />")
                .attr({
                    class: this.settings.pageLinkClass + ' gotolast ' + ((currentPage == this.pageCount) ? this.settings.disabledLinkClass : ''),
                    'data-page': this.pageCount
                }).text('>>');
            if (this.settings.nextPrevDisplayed) links.push(nextPageLink);
            if (this.settings.firstLastDisplayed) links.push(lastPageLink);

            this.linklist.html('');
            var _this = this;
            for (var index = 0; index < links.length; index++) {
                $("<li />").append(links[index]).appendTo(this.linklist);
                links[index].bind('click', function (event) {
                    event.preventDefault();
                    _this.settings.beforePageClick.call(event);

                    var page = Number($(this).attr('data-page'));
                    _this.loadTable(page);

                    _this.settings.afterPageClick.call(event);
                });
            }
            if (this.settings.pageInfoDisplayed) $("<li />").append("<span>Page: " + currentPage + " of " + this.pageCount + "</span>").appendTo(this.linklist);
        };

        Pagination.prototype.refresh = function (page) {
            this.linklist.empty();
            this.load(page);

            return true;
        };

        Pagination.prototype.destroy = function () {
            this.items.show();
            this.pagination.remove();
        };

        Pagination.prototype.page = function () {
            return this.currentPageElement.val();
        };

        return Pagination;
    })();

})();