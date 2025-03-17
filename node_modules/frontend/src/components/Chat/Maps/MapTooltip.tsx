import { useEffect, useState } from "react";
import { MapMarker } from "./MapWidget";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { createRoot, Root } from "react-dom/client";

interface TooltipContentProps {
  title: string;
  link: string;
  date: string;
  isDarkMode?: boolean;
}

interface CustomTooltipProps {
  map: google.maps.Map;
  position: google.maps.LatLng;
  content: React.ReactNode;
  isDarkMode?: boolean;
  onClose: () => void;
}

interface MultiEventTooltipProps {
  events: MapMarker[];
  isDarkMode: boolean;
}

const decodeHtmlEntities = (text: string): string => {
  const doc = new DOMParser().parseFromString(text, 'text/html');
  return doc.body.textContent || '';
};

export const TooltipContent = ({
  title,
  link,
  date,
  isDarkMode,
}: TooltipContentProps) => {
  const formattedDate = new Date(date).toLocaleDateString();
  const formattedTime = new Date(date).toLocaleTimeString("en-UK", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="p-2 text-sm leading-tight">
      <strong>{decodeHtmlEntities(title)}</strong>
      <div className="flex justify-between mt-1 text-xs">
        <a
          href={link}
          className={
            isDarkMode
              ? "text-blue-400 hover:text-blue-300"
              : "text-blue-600 hover:text-blue-800"
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          Read more
        </a>
        <span>
          {formattedDate} {formattedTime}
        </span>
      </div>
    </div>
  );
};

export const CustomTooltip = ({
  map,
  position,
  content,
  isDarkMode = false,
  onClose,
}: CustomTooltipProps) => {
  useEffect(() => {
    class CustomOverlay extends google.maps.OverlayView {
      div: HTMLDivElement | null = null;
      root: Root | null = null;
      isDarkMode: boolean;
      onClose: () => void;
      isPositionAdjusted: boolean = false;

      constructor(
        public position: google.maps.LatLng,
        public content: React.ReactNode,
        public map: google.maps.Map,
        isDarkMode: boolean,
        onClose: () => void
      ) {
        super();
        this.isDarkMode = isDarkMode;
        this.onClose = onClose;
        this.setMap(map);
      }

      onAdd() {
        this.div = document.createElement("div");
        this.div.className = `absolute z-50 p-2 w-72 rounded shadow-lg ${
          this.isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`;

        const panes = this.getPanes();
        panes?.floatPane.appendChild(this.div);

        this.root = createRoot(this.div);
        this.root.render(this.content as React.ReactElement);

        document.addEventListener("click", this.handleClickOutside);
      }

      draw() {
        if (!this.div) return;
        const projection = this.getProjection();
        if (!projection) return;
        const pos = projection.fromLatLngToDivPixel(this.position);
        if (!pos) return;

        this.div.style.left = `${pos.x}px`;
        this.div.style.top = `${pos.y}px`;

        if (!this.isPositionAdjusted) {
          this.adjustPosition();
        }
      }

      private adjustPosition() {
        setTimeout(() => {
          if (!this.div) return;

          const mapDiv = this.map.getDiv();
          const tooltipRect = this.div.getBoundingClientRect();
          const mapRect = mapDiv.getBoundingClientRect();
          const padding = 20;

          const rightOverflow = tooltipRect.right - mapRect.right + padding;
          const bottomOverflow = tooltipRect.bottom - mapRect.bottom + padding;

          if (rightOverflow > 0 || bottomOverflow > 0) {
            this.adjustMapCenter(rightOverflow, bottomOverflow, mapRect);
          }

          this.isPositionAdjusted = true;
        }, 0);
      }

      private adjustMapCenter(
        rightOverflow: number,
        bottomOverflow: number,
        mapRect: DOMRect
      ) {
        const bounds = this.map.getBounds();
        const currentCenter = this.map.getCenter();
        if (!bounds || !currentCenter) return;

        const west = bounds.getSouthWest().lng();
        const east = bounds.getNorthEast().lng();
        const north = bounds.getNorthEast().lat();
        const south = bounds.getSouthWest().lat();

        const lngPerPixel = (east - west) / mapRect.width;
        const latPerPixel = (north - south) / mapRect.height;

        let newLat = currentCenter.lat();
        let newLng = currentCenter.lng();

        if (rightOverflow > 0) {
          newLng = currentCenter.lng() + rightOverflow * lngPerPixel;
        }

        if (bottomOverflow > 0) {
          newLat = currentCenter.lat() - bottomOverflow * latPerPixel;
        }

        this.map.panTo({ lat: newLat, lng: newLng });
      }

      onRemove() {
        if (this.root) {
          this.root.unmount();
          this.root = null;
        }
        if (this.div && this.div.parentNode) {
          this.div.parentNode.removeChild(this.div);
          this.div = null;
        }
        document.removeEventListener("click", this.handleClickOutside);
      }

      handleClickOutside = (event: MouseEvent) => {
        if (this.div && !this.div.contains(event.target as Node)) {
          this.setMap(null);
          this.onClose();
        }
      };
    }

    const overlay = new CustomOverlay(
      position,
      content,
      map,
      isDarkMode,
      onClose
    );

    return () => {
      overlay.setMap(null);
    };
  }, [map, position, content, isDarkMode]);

  return null;
};

export const MultiEventTooltip = ({
  events,
  isDarkMode,
}: MultiEventTooltipProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const eventsPerPage = 1;
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const currentEvents = events.slice(
    currentPage * eventsPerPage,
    (currentPage + 1) * eventsPerPage
  );

  return (
    <div
      className="text-sm leading-tight w-70"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="flex justify-between items-center">
        <span
          className={`text-xs ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {events.length} events at this location
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentPage((p) => Math.max(0, p - 1));
            }}
            disabled={currentPage === 0}
            className={`p-1 rounded ${
              currentPage === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
            }}
            disabled={currentPage === totalPages - 1}
            className={`p-1 rounded ${
              currentPage === totalPages - 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {currentEvents.map((event, index) => {
          const formattedDate = new Date(event.date).toLocaleDateString();
          const formattedTime = new Date(event.date).toLocaleTimeString(
            "en-UK",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          );

          return (
            <div
              key={`${event.title}-${index}`}
              className={
                index < currentEvents.length - 1
                  ? `border-b ${
                      isDarkMode ? "border-gray-700" : "border-gray-200"
                    }`
                  : ""
              }
            >
              <p className="text-xs mb-1">Incident: {event.incident_type}</p>

              <strong className="block mb-1 line-clamp-2 text-xs leading-tight">
                {decodeHtmlEntities(event.title)}
              </strong>
              <div className="flex justify-between mt-1 text-xs">
                <a
                  href={event.link}
                  className={`${
                    isDarkMode
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-800"
                  }`}
                  target="_blank"
                >
                  Read more
                </a>
                <span>
                  {formattedDate} {formattedTime}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
