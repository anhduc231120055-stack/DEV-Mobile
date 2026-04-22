import { apiRequest } from "./api";
import type { Tour, TourStatus } from "../types/models";

type ApiTour = {
  id: number;
  title?: string;
  description?: string;
  location?: string;
  duration?: number | null;
  durationText?: string;
  price?: number | null;
  rating?: number | null;
  tagline?: string;
  status?: TourStatus;
  imageUrl?: string | null;
  highlights?: Array<{ title?: string; description?: string } | string>;
  itinerary?: Array<{ label?: string; title?: string; description?: string }>;
};

type ToursResponse = {
  tours: ApiTour[];
};

type TourResponse = {
  tour: ApiTour;
};

export type TourWritePayload = {
  title: string;
  description?: string;
  location: string;
  durationDays: number;
  price: number;
  tagline?: string;
  imageUrl?: string;
  status: TourStatus;
  highlights: string[];
  itinerary: string[];
};

function formatCurrency(value?: number | null) {
  if (value === undefined || value === null) {
    return "Lien he";
  }

  return `${new Intl.NumberFormat("vi-VN").format(value)}d`;
}

function formatDuration(tour: ApiTour) {
  if (tour.durationText) {
    return tour.durationText;
  }

  if (tour.duration) {
    const nights = Math.max(tour.duration - 1, 0);
    return `${tour.duration} ngay ${nights} dem`;
  }

  return "Dang cap nhat";
}

function normalizeHighlights(highlights?: ApiTour["highlights"]) {
  if (!highlights?.length) {
    return ["Lich trinh va thong tin dich vu dang duoc cap nhat."];
  }

  return highlights.map((item) => {
    if (typeof item === "string") {
      return item;
    }

    return item.description || item.title || "Diem nhan dang cap nhat";
  });
}

function normalizeItinerary(itinerary?: ApiTour["itinerary"]) {
  if (!itinerary?.length) {
    return [
      {
        time: "Ngay 1",
        title: "Dang cap nhat",
        description: "Noi dung lich trinh chi tiet se hien khi backend tra ve day du.",
      },
    ];
  }

  return itinerary.map((item, index) => ({
    time: item.label || `Ngay ${index + 1}`,
    title: item.title || `Lich trinh ${index + 1}`,
    description: item.description || "Dang cap nhat",
  }));
}

function mapTour(tour: ApiTour): Tour {
  const image = tour.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";

  return {
    id: String(tour.id),
    title: tour.title || "Tour dang cap nhat",
    description: tour.description || "",
    location: tour.location || "Dang cap nhat",
    duration: formatDuration(tour),
    durationDays: tour.duration ?? null,
    price: formatCurrency(tour.price),
    priceValue: tour.price ?? null,
    rating: tour.rating ? String(tour.rating) : "Moi",
    tagline: tour.tagline || "Thong tin tour dang duoc bo sung tu he thong.",
    image,
    imageUrl: tour.imageUrl ?? null,
    status: tour.status || "Active",
    gallery: [image],
    highlights: normalizeHighlights(tour.highlights),
    itinerary: normalizeItinerary(tour.itinerary),
  };
}

export async function fetchTours() {
  const payload = await apiRequest<ToursResponse>("/tours");
  return payload.tours.map(mapTour);
}

function buildWriteData(payload: TourWritePayload) {
  return {
    title: payload.title,
    description: payload.description,
    location: payload.location,
    durationDays: payload.durationDays,
    price: payload.price,
    tagline: payload.tagline,
    imageUrl: payload.imageUrl,
    status: payload.status,
    highlights: payload.highlights,
    itinerary: payload.itinerary.map((description, index) => ({
      label: `Ngay ${index + 1}`,
      title: `Lich trinh ${index + 1}`,
      description,
    })),
  };
}

export async function createTour(token: string, payload: TourWritePayload) {
  const response = await apiRequest<TourResponse>("/tours", {
    method: "POST",
    token,
    data: buildWriteData(payload),
  });

  return mapTour(response.tour);
}

export async function updateTour(token: string, tourId: string, payload: TourWritePayload) {
  const response = await apiRequest<TourResponse>(`/tours/${tourId}`, {
    method: "PUT",
    token,
    data: buildWriteData(payload),
  });

  return mapTour(response.tour);
}

export async function deleteTour(token: string, tourId: string) {
  await apiRequest<{ message: string }>(`/tours/${tourId}`, {
    method: "DELETE",
    token,
  });
}
