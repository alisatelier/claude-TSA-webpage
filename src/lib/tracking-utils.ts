export function detectCarrier(trackingNumber: string): string {
  const tn = trackingNumber.trim().toUpperCase();
  if (/^1Z/.test(tn)) return "UPS";
  if (/^(94|92|93|42)\d{18,20}$/.test(tn)) return "USPS";
  if (/^\d{12,15}$/.test(tn)) return "FedEx";
  if (/^[A-Z0-9]{13}$/.test(tn) || /^[A-Z0-9]{16}$/.test(tn)) return "Canada Post";
  return "Parcel Tracker";
}

export function getTrackingUrl(trackingNumber: string): string {
  const tn = trackingNumber.trim();
  const carrier = detectCarrier(tn);
  switch (carrier) {
    case "UPS":
      return `https://www.ups.com/track?tracknum=${encodeURIComponent(tn)}`;
    case "USPS":
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(tn)}`;
    case "FedEx":
      return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(tn)}`;
    case "Canada Post":
      return `https://www.canadapost-postescanada.ca/track-reperage/en#/search?searchFor=${encodeURIComponent(tn)}`;
    default:
      return `https://parcelsapp.com/en/tracking/${encodeURIComponent(tn)}`;
  }
}
