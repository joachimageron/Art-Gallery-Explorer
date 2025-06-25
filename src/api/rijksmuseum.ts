import {
  ArtworkDetailResponse,
  ArtworksResponse,
  LinkedArtSearchResponse,
} from "../types/artwork";

// API Base URLs - Updated based on documentation
const SEARCH_API_BASE_URL = "https://data.rijksmuseum.nl/search"; // For Linked Art Search
const RESOLVER_API_BASE_URL = "https://data.rijksmuseum.nl"; // For persistent identifier resolver

// Default parameters for the collection search
const DEFAULT_PARAMS = {
  pageToken: undefined,
  imageAvailable: true,
};

/**
 * Fetches a list of artworks from the Rijksmuseum Linked Art Search API
 * @param searchParams Optional search parameters
 * @returns Promise with artwork data
 */
export async function fetchArtworks(
  searchParams: {
    title?: string;
    objectNumber?: string;
    creator?: string | string[];
    creationDate?: string;
    type?: string;
    technique?: string | string[];
    material?: string | string[];
    imageAvailable?: boolean;
    pageToken?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<ArtworksResponse> {
  try {
    // Build the search URL - using Linked Art Search format
    const params = new URLSearchParams();

    // Basic search parameters for Linked Art format
    if (searchParams.title) params.append("q", searchParams.title);
    if (searchParams.creator) {
      if (Array.isArray(searchParams.creator)) {
        params.append("q", searchParams.creator.join(" OR "));
      } else {
        params.append("q", searchParams.creator);
      }
    }

    // Pagination parameters
    if (searchParams.page) params.append("page", searchParams.page.toString());
    if (searchParams.limit)
      params.append("limit", searchParams.limit.toString());

    // Make the API request to the search endpoint
    const searchUrl = `${SEARCH_API_BASE_URL}/collection?${params}`;
    const response = await fetch(searchUrl);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const searchData: LinkedArtSearchResponse = await response.json();

    // Process the search response to our internal format
    return processSearchResponse(searchData);
  } catch (error) {
    console.error("Error fetching artworks:", error);
    throw error;
  }
}

/**
 * Process the Linked Art Search response to our internal format
 */
function processSearchResponse(
  response: LinkedArtSearchResponse
): ArtworksResponse {
  const count = response.partOf?.totalItems || 0;

  // Extract pagination info
  const nextPageToken = response.next?.id?.split("page=")[1];

  // Convert search results to our internal format
  const artObjects = response.orderedItems.map((item) => ({
    id: item.id,
    objectNumber: item.id.split("/").pop() || "",
    title: "Loading...", // Will be populated when fetching details
    longTitle: "Loading...",
    principalOrFirstMaker: "Loading...",
    webImage: {
      url: "",
      width: 0,
      height: 0,
    },
    headerImage: {
      url: "",
      width: 0,
      height: 0,
    },
    productionPlaces: [],
    dating: {
      presentingDate: "",
      period: 0,
      sortingDate: 0,
    },
  }));

  return {
    artObjects,
    count,
    countFacets: { hasimage: 0, ondisplay: 0 },
    elapsedMilliseconds: 0,
    facets: [],
    nextPageToken,
  };
}

/**
 * Fetches detailed information about a specific artwork using the persistent identifier resolver
 * @param objectId The RWO identifier (e.g., "200100988") or full URL
 * @returns Promise with detailed artwork data
 */
export async function fetchArtworkDetail(
  objectId: string
): Promise<ArtworkDetailResponse> {
  try {
    // Handle both RWO and MDO identifiers according to the documentation
    let resolverUrl: string;

    if (objectId.startsWith("https://")) {
      resolverUrl = objectId;
    } else {
      // Start with RWO identifier, which will redirect to MDO
      resolverUrl = `https://id.rijksmuseum.nl/${objectId}`;
    }

    // First request to RWO (if not already MDO URL)
    let response = await fetch(resolverUrl);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const linkedArtData = await response.json();

    return {
      linkedArt: linkedArtData,
      elapsedMilliseconds: 0,
    };
  } catch (error) {
    console.error(`Error fetching artwork detail for ${objectId}:`, error);
    throw error;
  }
}

// Add helper function to extract readable information from Linked Art format
export function extractArtworkInfo(linkedArt: any) {
  const info: any = {
    id: linkedArt.id || "",
    title: "Unknown Title",
    creator: "Unknown Creator",
    date: "Unknown Date",
    materials: [],
    techniques: [],
    dimensions: [],
    images: [],
  };

  // Extract title
  if (linkedArt.identified_by) {
    const titleObj = linkedArt.identified_by.find((item: any) =>
      item.classified_as?.some(
        (cls: any) =>
          cls._label?.toLowerCase().includes("title") ||
          cls._label?.toLowerCase().includes("name")
      )
    );
    if (titleObj) {
      info.title = titleObj.content;
    }
  }

  // Extract creator
  if (linkedArt.produced_by?.carried_out_by) {
    const creators = linkedArt.produced_by.carried_out_by
      .map((creator: any) => creator._label)
      .filter(Boolean);
    if (creators.length > 0) {
      info.creator = creators.join(", ");
    }
  }

  // Extract date
  if (linkedArt.produced_by?.timespan) {
    const timespan = linkedArt.produced_by.timespan;
    if (timespan.begin_of_the_begin || timespan.end_of_the_end) {
      info.date =
        `${timespan.begin_of_the_begin || ""} - ${timespan.end_of_the_end || ""}`.trim();
    }
  }

  // Extract materials
  if (linkedArt.made_of) {
    info.materials = linkedArt.made_of
      .map((material: any) => material._label)
      .filter(Boolean);
  }

  // Extract images
  if (linkedArt.representation) {
    info.images = linkedArt.representation
      .filter((rep: any) => rep.type === "DigitalObject")
      .map((rep: any) => ({
        url: rep.id,
        label: rep._label,
        format: rep.format,
      }));
  }

  // Extract dimensions
  if (linkedArt.dimension) {
    info.dimensions = linkedArt.dimension.map((dim: any) => ({
      type: dim.type,
      value: dim.value,
      unit: dim.unit?._label || "unknown",
    }));
  }

  return info;
}

// Types need to be updated in the artwork.ts file to match this new structure
