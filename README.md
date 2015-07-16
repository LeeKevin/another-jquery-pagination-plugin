# another-jquery-pagination-plugin

Another jQuery pagination plugin (aren't these a joy?).

## Installation

Include script *after* the jQuery library (unless you are packaging scripts somehow else):

```html
<script src="/path/to/jquery.pagination.js"></script>
```

## Usage

```javascript
$('jQuery collection of items').paginate();
```

Example with options:

```javascript
$('jQuery collection of items').paginate({
    paginationContainer: $('someContainer’),
    itemsPerPage: 10
});
```

Ta *da*!

## Options

- `itemsPerPage`

   The number of items to display on each page; default: `25`.

- `paginationAttrs`

   The element attributes for the created pagination div; default:
```javascript
{
    class: 'pagination'
}
```

- `paginationContainer` 

   Specified HTML element to which to append the pagination div; default: `this.parent()`

- `pageLinkClass`

   Class for the page links; default: `'pagination'`

- `activeLinkClass`

   Class for the link of the current page; default: `'active'`

- `disabledLinkClass`

   Class for the any disabled page links; default: `'very_faded'`

- `initialPage`

   A number for the page to be loaded when the item list and pagination are rendered. This is good for when you want to update values in the list, but maintain the page for the user; default: `1`

- `pageLinksDisplayed`

   Boolean to show the numbered page links (will display 5); default: `true`

- `nextPrevDisplayed`

   Boolean to show the next/previous page links; default: `true`

- `firstLastDisplayed`

   Boolean to show the page links to navigate to the first/last pages; default: `true`

- `pageInfoDisplayed`

   Boolean to show the page info span (i.e. Page: X of X); default: `true`

- `childrenSelector`

   Common selector of the child items to paginate; default: `''`

- `beforePageClick`

   Callback function to be executed immediately before any pre-defined behaviour when a page link is clicked; default:
```javascript
function (event) {}
```

- `afterPageClick`

   Callback function to be executed after the page is loaded when a page link is clicked; default:
```javascript
function (event) {}
```

## Demo

[Ugly demo](http://leekevin.github.io/another-jquery-pagination-plugin/)
