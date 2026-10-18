import streetwomen from "../assets/streetwomen.jpg";
import streetmen from "../assets/streetmen.jpg";
import gown from "../assets/gown.jpg";
import skirt from "../assets/skirt.jpg";
import dress from "../assets/dress.jpg";
import jacket from "../assets/jacket.jpg";
import track from "../assets/track.jpg";
import urban_jacket from "../assets/urban_jacket.jpg";
import hodie from "../assets/hodie.jpg";
import shirt from "../assets/shirt.jpg";
import men1 from "../assets/men1.jpg";
import men2 from "../assets/men2.jpg";
import men3 from "../assets/men3.jpg";
import kidjacket from "../assets/kidjacket.jpg";
import kidskirt from "../assets/kidskirt.jpg";
import kidstreet from "../assets/kidstreet.jpg";
import { API_BASE_URL, apiUrl } from "../config/api";

const IMAGE_BASE_URL = apiUrl("images");

const localAssetMap = {
  "streetwomen.jpg": streetwomen,
  "streetmen.jpg": streetmen,
  "gown.jpg": gown,
  "skirt.jpg": skirt,
  "dress.jpg": dress,
  "jacket.jpg": jacket,
  "track.jpg": track,
  "urban_jacket.jpg": urban_jacket,
  "hodie.jpg": hodie,
  "shirt.jpg": shirt,
  "men1.jpg": men1,
  "men2.jpg": men2,
  "men3.jpg": men3,
  "kidjacket.jpg": kidjacket,
  "kidskirt.jpg": kidskirt,
  "kidstreet.jpg": kidstreet,
};

const getBasename = (value) => {
  if (!value) return "";
  const trimmed = value.split(/[?#]/)[0].trim();
  const segments = trimmed.split("/").filter(Boolean);
  return segments.length ? segments[segments.length - 1].toLowerCase() : "";
};

export const normalizeImageUrl = (url) => {
  if (!url) return "";
  if (typeof url !== "string") return "";

  const trimmed = url.trim();
  if (/^https?:/i.test(trimmed)) {
    return trimmed.replace(
      /^https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?=\/|[?#]|$)/i,
      API_BASE_URL
    );
  }
  if (/^(data:|blob:)/i.test(trimmed)) return trimmed;

  const basename = getBasename(trimmed);

  if (basename && localAssetMap[basename]) {
    return localAssetMap[basename];
  }

  const normalized = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
  return `${IMAGE_BASE_URL}/${normalized}`;
};

export const resolveImageSource = (payload) => {
  if (!payload) return "";
  if (typeof payload === "string") return payload;

  const product = payload.product || payload;

  const candidates = [
    product?.imageUrl,
    product?.imageURL,
    product?.img,
    product?.image,
    product?.images?.[0],
    product?.thumbnail,
    product?.thumbnailUrl,
    product?.picture,
    product?.pictureUrl,
    product?.photo,
    product?.photoUrl,
    product?.image_path,
    product?.imagePath,
    product?.photo_url,
    product?.photos?.[0],
  ];

  return candidates.find((value) => typeof value === "string" && value.length > 0) || "";
};

export const getImageUrl = (payload) => normalizeImageUrl(resolveImageSource(payload));
