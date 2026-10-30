export type ListingPhoto = {
  id: number;
  url: string;
  alt: string;
  categoryId: string;
};

export type PhotoCategory = {
  id: string;
  name: string;
  highlights: string[];
  photoIds: number[];
};

export type Amenity = {
  id: string;
  label: string;
  icon: string;
  category: string;
};

export type Review = {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  text: string;
  location?: string;
};

export type Host = {
  name: string;
  avatar: string;
  yearsHosting: number;
  isSuperhost: boolean;
  totalReviews: number;
  responseRate: string;
  responseTime: string;
  bio: string;
};

export type BookingInfo = {
  currencySymbol: string;
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
  totalForNights: number;
  nights: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  maxGuests: number;
  freeCancellationBefore: string;
  promoText: string;
};

export type ListingHighlight = {
  id: string;
  title: string;
  subtitle: string;
  icon: 'key' | 'superhost' | 'location' | 'calendar';
};

export type SleepSpace = {
  id: string;
  name: string;
  summary: string;
  photoId: number;
};

export type NearbyStay = {
  id: string;
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  currencySymbol: string;
  imageUrl: string;
  isGuestFavourite?: boolean;
};

export type Listing = {
  id: string;
  title: string;
  pageTitle: string;
  propertyType: string;
  location: string;
  country: string;
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  rating: number;
  reviewCount: number;
  isGuestFavourite: boolean;
  guestFavouriteBlurb: string;
  description: string;
  sleepSummary: string;
  sleepSpaces: SleepSpace[];
  highlights: ListingHighlight[];
  host: Host;
  booking: BookingInfo;
  amenities: Amenity[];
  photos: ListingPhoto[];
  categories: PhotoCategory[];
  heroPhotoIds: number[];
  reviews: Review[];
  reviewCategories: { label: string; score: number }[];
  houseRules: string[];
  safetyItems: string[];
  cancellationSummary: string;
  checkInTime: string;
  checkOutTime: string;
  locationBlurb: string;
  mapEmbedQuery: string;
  nearbyStays: NearbyStay[];
};

export type ListingResponse = {
  listing: Listing;
};
