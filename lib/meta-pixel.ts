// Utility functions untuk Meta Pixel tracking

interface EventData {
  event_id?: string;
  event_source_url?: string;
  user_data?: {
    em?: string; // email (hashed)
    ph?: string; // phone (hashed)
    fn?: string; // first name (hashed)
    ln?: string; // last name (hashed)
    ct?: string; // city (hashed)
    st?: string; // state (hashed)
    zp?: string; // zip code (hashed)
    country?: string; // country code
  };
  custom_data?: {
    value?: number;
    currency?: string;
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    contents?: Array<{ id: string; quantity: number }>;
    num_items?: number;
    [key: string]: any;
  };
}

const getCookieValue = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : undefined;
};

const generateEventId = (eventName: string): string => {
  const randomSuffix = Math.random().toString(36).slice(2, 10);
  return `${eventName}_${Date.now()}_${randomSuffix}`;
};

/**
 * Track event via client-side (fbq) and server-side (CAPI)
 */
export const trackMetaPixelEvent = async (
  eventName: string,
  eventData?: EventData,
  isCustomEvent: boolean = false
) => {
  try {
    const eventId = eventData?.event_id || generateEventId(eventName);

    // Client-side tracking
    if (typeof window !== 'undefined' && (window as any).fbq) {
      const method = isCustomEvent ? 'trackCustom' : 'track';
      const customData = eventData?.custom_data;

      if (eventData?.custom_data) {
        (window as any).fbq(method, eventName, customData, { eventID: eventId });
      } else {
        (window as any).fbq(method, eventName, undefined, { eventID: eventId });
      }
    }

    // Server-side tracking via CAPI
    const eventSourceUrl =
      typeof window !== 'undefined' ? window.location.href : undefined;
    const fbp = getCookieValue('_fbp');
    const fbc = getCookieValue('_fbc');

    await fetch('/api/meta-pixel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_name: eventName,
        event_data: eventSourceUrl
          ? {
              ...eventData,
              event_id: eventId,
              event_source_url: eventSourceUrl,
              user_data: {
                ...(eventData?.user_data || {}),
                ...(fbp ? { fbp } : {}),
                ...(fbc ? { fbc } : {}),
              },
            }
          : {
              ...eventData,
              event_id: eventId,
              user_data: {
                ...(eventData?.user_data || {}),
                ...(fbp ? { fbp } : {}),
                ...(fbc ? { fbc } : {}),
              },
            },
      }),
    });
  } catch (error) {
    console.error('Error tracking Meta Pixel event:', error);
  }
};

/**
 * Track PageView event
 */
export const trackPageView = () => {
  trackMetaPixelEvent('PageView');
};

/**
 * Track ViewContent event
 */
export const trackViewContent = (data?: {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
}) => {
  trackMetaPixelEvent('ViewContent', {
    custom_data: data,
  });
};

/**
 * Track AddToCart event
 */
export const trackAddToCart = (data?: {
  content_name?: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
}) => {
  trackMetaPixelEvent('AddToCart', {
    custom_data: data,
  });
};

/**
 * Track InitiateCheckout event
 */
export const trackInitiateCheckout = (data?: {
  content_name?: string;
  content_ids?: string[];
  num_items?: number;
  value?: number;
  currency?: string;
}) => {
  trackMetaPixelEvent('InitiateCheckout', {
    custom_data: data,
  });
};

/**
 * Track Purchase event
 */
export const trackPurchase = (data: {
  value: number;
  currency: string;
  content_ids?: string[];
  content_name?: string;
  num_items?: number;
}) => {
  trackMetaPixelEvent('Purchase', {
    custom_data: data,
  });
};

/**
 * Track Lead event
 */
export const trackLead = (data?: {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
}) => {
  trackMetaPixelEvent('Lead', {
    custom_data: data,
  });
};

/**
 * Track CompleteRegistration event
 */
export const trackCompleteRegistration = (data?: {
  content_name?: string;
  value?: number;
  currency?: string;
}) => {
  trackMetaPixelEvent('CompleteRegistration', {
    custom_data: data,
  });
};

/**
 * Track Contact event (button WhatsApp, phone, dll)
 */
export const trackContact = (data?: {
  content_name?: string;
  content_category?: string;
}) => {
  trackMetaPixelEvent('Contact', {
    custom_data: data,
  });
};

/**
 * Track custom event
 */
export const trackCustomEvent = (eventName: string, data?: EventData) => {
  trackMetaPixelEvent(eventName, data, true);
};
