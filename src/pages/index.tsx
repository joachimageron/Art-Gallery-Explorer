import { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { ThemeSwitch } from "@/components/theme-switch";
import { Button } from "@heroui/button";
import {
  fetchArtworks,
  fetchArtworkDetail,
  extractArtworkInfo,
} from "@/api/rijksmuseum";

export default function IndexPage() {
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testType, setTestType] = useState<
    "list" | "detail" | "search" | "images"
  >("list");
  const [imageData, setImageData] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useState({
    title: "",
    creator: "",
    type: "",
    material: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const testApi = async () => {
    try {
      setLoading(true);
      setError(null);
      setImageData([]);

      let responseData;
      let displayData;

      switch (testType) {
        case "list":
          // Fetch default list of artworks
          responseData = await fetchArtworks();
          displayData = responseData;
          break;

        case "detail":
          // Example object ID - you might want to make this configurable
          const objectId = searchParams.title || "200100988"; // Use title field as object ID input

          responseData = await fetchArtworkDetail(objectId);

          // If we have Linked Art data, also extract readable info
          if (responseData.linkedArt) {
            const extractedInfo = extractArtworkInfo(responseData.linkedArt);
            displayData = {
              ...responseData,
              extractedInfo,
            };
          } else {
            displayData = responseData;
          }
          break;

        case "search":
          // Build search parameters from form
          const searchFilters = Object.fromEntries(
            Object.entries(searchParams).filter(([_, value]) => value !== "")
          );
          responseData = await fetchArtworks(searchFilters);
          displayData = responseData;
          break;

        case "images":
          // Fetch artworks and then get detailed info with images
          const searchFiltersForImages = Object.fromEntries(
            Object.entries(searchParams).filter(([_, value]) => value !== "")
          );
          const artworksResponse = await fetchArtworks(searchFiltersForImages);

          // Fetch detailed info for first 6 artworks to get images
          const artworkDetails = [];
          const maxItems = Math.min(6, artworksResponse.artObjects.length);

          for (let i = 0; i < maxItems; i++) {
            try {
              const artwork = artworksResponse.artObjects[i];
              const objectId = artwork.id.split("/").pop();
              if (objectId) {
                const detail = await fetchArtworkDetail(objectId);
                if (detail.linkedArt) {
                  const extractedInfo = extractArtworkInfo(detail.linkedArt);
                  artworkDetails.push({
                    ...extractedInfo,
                    originalId: artwork.id,
                    objectId: objectId,
                  });
                }
              }
            } catch (err) {
              console.warn(`Failed to fetch detail for artwork ${i}:`, err);
            }
          }

          setImageData(artworkDetails);
          displayData = {
            message: `Fetched ${artworkDetails.length} artworks with images`,
            artworksFound: artworksResponse.count,
            displayedItems: artworkDetails.length,
          };
          break;
      }

      // Display the result as a formatted JSON string
      setApiResult(JSON.stringify(displayData, null, 2));
    } catch (err) {
      setError(
        (err as Error).message || "An error occurred while fetching data"
      );
      console.error("API test error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold">
          Art Gallery Explorer API Test Page
        </h1>

        <div className="flex flex-col gap-4 p-4 border rounded-lg">
          <div className="flex gap-4 mb-4 flex-wrap">
            <label className="flex items-center">
              <input
                type="radio"
                name="testType"
                value="list"
                checked={testType === "list"}
                onChange={() => setTestType("list")}
                className="mr-2"
              />
              Test List API
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="testType"
                value="detail"
                checked={testType === "detail"}
                onChange={() => setTestType("detail")}
                className="mr-2"
              />
              Test Detail API
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="testType"
                value="search"
                checked={testType === "search"}
                onChange={() => setTestType("search")}
                className="mr-2"
              />
              Test Search API
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="testType"
                value="images"
                checked={testType === "images"}
                onChange={() => setTestType("images")}
                className="mr-2"
              />
              Visualize Images
            </label>
          </div>

          {testType !== "list" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {testType === "detail" && (
                <div>
                  <label className="block mb-1">Object ID</label>
                  <input
                    type="text"
                    name="title"
                    value={searchParams.title}
                    onChange={handleInputChange}
                    placeholder="Enter object ID (e.g. 200100988)"
                    className="w-full p-2 border rounded"
                  />
                </div>
              )}

              {(testType === "search" || testType === "images") && (
                <>
                  <div>
                    <label className="block mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={searchParams.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Night Watch"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Creator</label>
                    <input
                      type="text"
                      name="creator"
                      value={searchParams.creator}
                      onChange={handleInputChange}
                      placeholder="e.g. Rembrandt"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Type</label>
                    <input
                      type="text"
                      name="type"
                      value={searchParams.type}
                      onChange={handleInputChange}
                      placeholder="e.g. painting"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Material</label>
                    <input
                      type="text"
                      name="material"
                      value={searchParams.material}
                      onChange={handleInputChange}
                      placeholder="e.g. canvas"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          <div className="flex gap-4 items-center">
            <Button onPress={testApi} isLoading={loading} className="px-6 py-2">
              Run Test
            </Button>
            <ThemeSwitch />
          </div>
        </div>

        {error && (
          <div className="p-4 border border-red-500 bg-red-100 text-red-700 rounded">
            Error: {error}
          </div>
        )}

        {/* Image Gallery Display */}
        {testType === "images" && imageData.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Artwork Images:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {imageData.map((artwork, index) => (
                <div
                  key={index}
                  className="border rounded-lg overflow-hidden shadow-md"
                >
                  {artwork.images && artwork.images.length > 0 ? (
                    <img
                      src={artwork.images[0].url}
                      alt={artwork.title}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OTk5OSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image Available</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {artwork.title || "Unknown Title"}
                    </h3>
                    <p className="text-gray-600 mb-1">
                      <strong>Creator:</strong> {artwork.creator || "Unknown"}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Date:</strong> {artwork.date || "Unknown"}
                    </p>
                    {artwork.materials && artwork.materials.length > 0 && (
                      <p className="text-gray-600 text-sm">
                        <strong>Materials:</strong>{" "}
                        {artwork.materials.join(", ")}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      ID: {artwork.objectId}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {apiResult && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">API Response:</h2>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded overflow-auto max-h-[500px]">
              <pre className="whitespace-pre-wrap">{apiResult}</pre>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
