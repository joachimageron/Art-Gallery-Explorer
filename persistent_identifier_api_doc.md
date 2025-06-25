# Rijksmuseum Persistent Identifier API Documentation

## Overview

The Rijksmuseum persistent identifier resolver is an HTTP based API that allows you to dereference two types of persistent identifiers (PIDs) over HTTP:

- **Real world object (RWO) identifiers** of the form `https://id.rijksmuseum.nl/<integer number>`
- **Metadata object (MDO) identifiers** of the form `https://data.rijksmuseum.nl/<integer number>`

Dereferencing in this case means getting the actual content identified by the RWO id. This naturally brings us to an important property of this API: it is unable to dereference identifiers of actual physical objects like _The Jewish Bride_, nor does it dereference identifiers of concepts, such as centimeters or the rape of the Sabine women.

To get around this, when dereferencing an RWO id, we instead redirect the client to the identifier of metadata the museum has available about the requested real world object.

## Client-Server Interaction Flow

In terms of client-server interactions, the general flow is as follows:

```
Client → Resolver API: Request for RWO http://id.rijksmuseum.nl/200107928
Resolver API → Client: Response with status code 303, redirecting to MDO http://data.rijksmuseum.nl/200107928
Client → Resolver API: Request for MDO http://data.rijksmuseum.nl/200107928
Resolver API → Client: Response with metadata
```

**Note:** If a client knows the identifier for some piece of metadata, there is no need to first dereference the associated RWO id. The client can simply dereference the MDO id directly.

## HTTP Content Negotiation

Metadata may be available in several representations. For example, _The Nightwatch_ is available in representations using:

- The Linked Art model
- The Europeana Data Model

Furthermore, each of these representations may be serialized in multiple ways, such as:

- Turtle
- RDF/XML

### Content Negotiation Process

To make known to the resolver what representation and serialization can be accepted by the client, the resolver and its client may perform content negotiation.

The resolver API implements the **Content Negotiation by Profile spec**, that is currently under development by the W3C. More specifically, it conforms to the following two functional profiles of that specification:

- `http://www.w3.org/ns/dx/connegp/profile/http` (HTTP headers)
- `http://www.w3.org/ns/dx/connegp/profile/qsa` (Query string arguments)

### Content Negotiation Flow

Content negotiation in general works as follows:

```
Client → Resolver API: Request for MDO http://data.rijksmuseum.nl/200107928
Resolver API → Client: Response including available profiles and serializations
Client → Resolver API: Request for MDO http://data.rijksmuseum.nl/200107928 with content negotiation parameters
Resolver API → Client: Response in the requested representation
```

**Note:** The first step of dereferencing the RWO id can be skipped if the client knows the MDO id already.
