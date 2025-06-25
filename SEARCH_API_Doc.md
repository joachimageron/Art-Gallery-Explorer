# Search API - Rijksmuseum Collection

The Search API allows you to query for characteristics of objects in the Rijksmuseum's collection. Results are based on the Linked Art Search specification, returning a list of Linked Open Data identifiers that can then be resolved with our other APIs, such as the Persistent Identifier Resolver, to get more information on these objects.

> **Note**: This API is in beta. While we plan to support it going forward, it is still subject to change and open to improvements. Please let us know if you have any feedback.

## Accessing the API

The API is available at the following URL. No API key is needed.

```
GET https://data.rijksmuseum.nl/search/collection
```

Requesting this URL without query parameters will return the first 100 items of the entire collection. See below for specifying search parameters.

## Query parameters

To search for specific objects based on certain characteristics, use the following query parameters. All of which are optional and can be combined with other query parameters, to perform fine-grained searches.

Either Dutch or English terms can be used and combined. For example, schilderij also matches objects with type painting.

| Parameter      | Format | Notes                                                                                                                                                                |
| -------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title          | str    | Search for a title, such as Night Watch                                                                                                                              |
| objectNumber   | str    | Search for an object number and match it with a new LOD identifier. For example, SK-C-5. Supports wildcard characters (see below).                                   |
| creator        | str    | Search for a creator, such as Rembrandt van Rijn. Can be duplicated to search for multiple creators.                                                                 |
| creationDate   | str    | Search for objects created in a specific year or period, such as 1642. Supports wildcard characters (see below). For example, to search in specific centuries: 16??. |
| type           | str    | Search for types of objects, such as painting.                                                                                                                       |
| technique      | str    | Search for objects created with a technique, such as embroidering. Can be duplicated to search for multiple techniques used on the same objects.                     |
| material       | str    | Search for objects that consist of a material, such as canvas. Can be duplicated to search for objects that consist of multiple materials.                           |
| imageAvailable | bool   | Search for objects with or without an available digital reproduction: true or false.                                                                                 |
| pageToken      | str    | The page token used for pagination.                                                                                                                                  |

### Wildcards

Query parameters are already partial keyword matches, which should usually be sufficient. For example, searching for creator Rembrandt or van Rijn both match Rembrandt van Rijn.

In case of fields objectNumber and creationDate we also support wildcard characters:

- `*` matches any number of characters. For example, `objectNumber=SK-C-5*` matches SK-C-5, SK-C-50 and SK-C-501.
- `?` matches exactly one character. For example, `creationDate=16??` matches both 1642 and 1600, but not 167.

## Response model (Linked Art Search)

The results response model is based on the Linked Art Search specification.

### Example

Querying for

```
GET https://data.rijksmuseum.nl/search/collection?type=painting&material=oil paint
```

yields the following result:

```json
{
  "@context": "https://linked.art/ns/v1/search.json",
  "id": "https://data.rijksmuseum.nl/search/collection?type=painting&material=oil%20paint",
  "type": "OrderedCollectionPage",
  "partOf": {
    "id": "https://data.rijksmuseum.nl/search/collection?type=painting&material=oil+paint",
    "type": "OrderedCollection",
    "totalItems": 4797,
    "first": {
      "id": "https://data.rijksmuseum.nl/search/collection?type=painting&material=oil+paint",
      "type": "OrderedCollectionPage"
    },
    "last": {
      "id": "https://data.rijksmuseum.nl/search/collection?type=painting&material=oil+paint&pageToken=eyJ0b2tlbiI6IDY3Nzg4MX0",
      "type": "OrderedCollectionPage"
    }
  },
  "next": {
    "id": "https://data.rijksmuseum.nl/search/collection?type=painting&material=oil+paint&pageToken=eyJ0b2tlbiI6IDYzNzU0fQ",
    "type": "OrderedCollectionPage"
  },
  "orderedItems": [
    {
      "id": "https://id.rijksmuseum.nl/200100988",
      "type": "HumanMadeObject"
    }
    // ... more results ...
  ]
}
```

The following fields are of note:

- `id` is the full search request URL for the current page of results.
- `partOf` contains information about this "collection" of objects, including the first and last pages of your search result, and the total number of results.
- `next` is used for pagination, to get the next page with 100 results. See the section on Pagination.
- `prev` shows on any page after the first, and is used to navigate back one page.
- `orderedItems` is the list of search results, in the form of Linked Open Data identifiers. These identifiers can be resolved using our other APIs, such as the Persistent Identifier Resolver, to get more information on these objects.

## Pagination

Each search result page is limited to 100 results, with next pages being referenced in the `next` field.

To navigate to the next page of a search result, simply request the URL contained in the `next.id` field. This URL consists of your search request and an automatically appended `pageToken`, which the API uses to determine the next set of results.

Similarly, first and last pages are included in the `partOf` collection, and previous pages are shown on all pages after the first, in the `prev` field.

There is no limit to how many pages can be requested, so in theory all objects in the collection can be part of the search result.
