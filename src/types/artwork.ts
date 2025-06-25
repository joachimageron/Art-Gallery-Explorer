export interface Artwork {
  id: string;
  objectNumber: string;
  title: string;
  longTitle: string;
  principalOrFirstMaker: string;
  webImage: {
    url: string;
    width: number;
    height: number;
  };
  headerImage: {
    url: string;
    width: number;
    height: number;
  };
  productionPlaces: string[];
  dating: {
    presentingDate: string;
    period: number;
    sortingDate: number;
  };
  description?: string;
  materials?: string[];
  dimensions?: Array<{
    unit: string;
    type: string;
    value: string;
  }>;
}

export interface ArtworksResponse {
  artObjects: Artwork[];
  count: number;
  countFacets: {
    hasimage: number;
    ondisplay: number;
  };
  elapsedMilliseconds: number;
  facets: Array<{
    facets: Array<{
      key: string;
      value: number;
    }>;
    name: string;
    otherTerms: number;
    prettyName: number;
  }>;
  nextPageToken?: string;
}

// Update LinkedArtSearchResponse to be more complete
export interface LinkedArtSearchResponse {
  "@context": string | string[];
  id: string;
  type: "OrderedCollectionPage";
  partOf: {
    id: string;
    type: "OrderedCollection";
    totalItems: number;
    first?: {
      id: string;
      type: "OrderedCollectionPage";
    };
    last?: {
      id: string;
      type: "OrderedCollectionPage";
    };
  };
  next?: {
    id: string;
    type: "OrderedCollectionPage";
  };
  prev?: {
    id: string;
    type: "OrderedCollectionPage";
  };
  orderedItems: Array<{
    id: string;
    type: "HumanMadeObject";
  }>;
}

export interface LinkedArtObject {
  "@context": string;
  id: string;
  type: string;
  _label?: string;
  classified_as?: Array<{
    id: string;
    type: string;
    _label: string;
  }>;
  identified_by?: Array<{
    type: string;
    content: string;
    classified_as?: Array<{
      id: string;
      type: string;
      _label: string;
    }>;
  }>;
  produced_by?: {
    type: string;
    carried_out_by?: Array<{
      id: string;
      type: string;
      _label: string;
    }>;
    timespan?: {
      type: string;
      begin_of_the_begin?: string;
      end_of_the_end?: string;
    };
  };
  representation?: Array<{
    id: string;
    type: string;
    _label?: string;
    format?: string;
  }>;
  made_of?: Array<{
    id: string;
    type: string;
    _label: string;
  }>;
  dimension?: Array<{
    type: string;
    value: number;
    unit: {
      id: string;
      type: string;
      _label: string;
    };
  }>;
}

// Update ArtworkDetailResponse to handle both formats
export interface ArtworkDetailResponse {
  artObject?: ArtworkDetail; // Legacy format
  linkedArt?: LinkedArtObject; // New Linked Art format
  artObjectPage?: {
    id: string;
    lang: string;
    objectNumber: string;
    plaqueDescription: string;
    createdOn: string;
    updatedOn: string;
  };
  elapsedMilliseconds?: number;
}

export interface ArtworkDetail extends Artwork {
  acquisition: {
    date: string;
    method: string;
  };
  catRefRPK: string[];
  colors: Array<{
    percentage: number;
    hex: string;
  }>;
  copyrightHolder: string | null;
  documentation: string[];
  exhibitions: string[];
  hasImage: boolean;
  historicalPersons: string[];
  inscriptions: string[];
  labels: Array<{
    date: string;
    description: string;
    label: string;
    makerLine: string;
    title: string;
  }>;
  links: {
    search: string;
  };
  location: string;
  makers: Array<{
    biography: string | null;
    dateOfBirth: string | null;
    dateOfDeath: string | null;
    name: string;
    nationality: string | null;
    occupation: string[];
    placeOfBirth: string | null;
    placeOfDeath: string | null;
    qualification: string | null;
    roles: string[];
  }>;
  objectCollection: string[];
  objectTypes: string[];
  physicalMedium: string;
  plaqueDescriptionEnglish: string;
  plaqueDescriptionDutch: string;
  principalMaker: string;
  showImage: boolean;
  subTitle: string;
  techniques: string[];
}
