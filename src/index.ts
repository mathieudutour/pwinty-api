import fetchPonyfill from 'fetch-ponyfill'
const { fetch } = fetchPonyfill({})

export enum ShippingMethod {
  Budget = 'Budget',
  Standard = 'Standard',
  Express = 'Express',
  Overnight = 'Overnight',
}

export enum PaymentType {
  InvoiceMe = 'InvoiceMe',
  InvoiceRecipient = 'InvoiceRecipient',
}

export enum ResizingType {
  Crop = 'Crop',
  ShrinkToFit = 'ShrinkToFit',
  ShrinkToExactFit = 'ShrinkToExactFit',
}

type OrderStatus = 'NotYetSubmitted' | 'Submitted' | 'Complete' | 'Cancelled'
type ShipmentStatus = 'InProgress' | 'Shipped'
type ImageStatus =
  | 'AwaitingUrlOrData'
  | 'NotYetDownloaded'
  | 'Ok'
  | 'FileNotFoundAtUrl'
  | 'Invalid'
type Carrier =
  | 'RoyalMail'
  | 'RoyalMailFirstClass'
  | 'RoyalMailSecondClass'
  | 'FedEx'
  | 'FedExUK'
  | 'FedExIntl'
  | 'Interlink'
  | 'UPS'
  | 'UpsTwoDay'
  | 'UKMail'
  | 'TNT'
  | 'ParcelForce'
  | 'DHL'
  | 'UPSMI'
  | 'DpdNextDay'
  | 'EuPostal'
  | 'AuPost'
  | 'AirMail'
  | 'NotKnown'

export type PwintyWebhookPayload = {
  /** The Pwinty ID of the order. */
  orderId: number
  /** The environment from which the callback originated. */
  environment: 'LIVE' | 'SANDBOX'
  /** The time the change took place. */
  timestamp: Date
  /** The current status of the order. */
  status: OrderStatus
  /** Each shipment in the order. Note that this can be empty if the shipments have not yet been allocated, and it may change. You will receive a callback each time a new shipment is created, or a shipment status changes. */
  shipments: {
    /** An array of item IDs included in the shipment. */
    items: string[]
    /** The current status of the shipment. */
    status: ShipmentStatus
    /** Tracking number for the shipment where available. */
    trackingNumber?: string
    /** Tracking URL for the shipment where available. */
    trackingUrl?: string
  }[]
}

type Order = {
  /** The ID of the order. */
  id: number
  /** Whether the order can be cancelled (depends on fulfilment partner and status of the order). */
  canCancel: boolean
  /** Whether the order can be placed on hold (depends on fulfilment partner and status of the order). */
  canHold: boolean
  /** Whether the order shipping address/method can be udpated (depends on fulfilment partner and status of the order). */
  canUpdateShipping: boolean
  /** Whether the images in the order are updateable (depends on fulfilment partner and status of the order). */
  canUpdateImages: boolean
  /** To whom the order will be addressed. */
  recipientName: string
  /** First line of recipient address. */
  address1: string
  /** Second line of recipient address. */
  address2: string
  /** Town/city of recipient address. */
  addressTownOrCity: string
  /** State (US), county (UK) or region of recipient address. */
  stateOrCounty: string
  /** Postal/Zipcode of recipient address. */
  postalOrZipCode: string
  /** Two-letter country code of the recipient. */
  countryCode: string
  /** Recipient's phone number. */
  mobileTelephone: string
  /** How much Pwinty will charge you (in cents/pence) for this order. */
  price: number
  /** Status of order. */
  status: OrderStatus
  /**
   * Shipping object showing how the order will be shipped.
   *
   * Orders of multiple product types may be automatically split into separate sub-orders and processed individually.
   * When this is the case we will provide details of all the shipments within a shippingInfo object as an array of shipping objects.
   */
  shippingInfo: {
    /** The cost of the entire shipment. */
    price: number
    /** An array of shipment objects. */
    shipments: Shipment[]
  }
  /** Payment option for order */
  payment: PaymentType
  /** If `payment` is set to `InvoiceRecipient` then the URL the customer should be sent to to complete payment. */
  paymentUrl?: string
  /** An array of objects representing the images in the order. */
  images: Image[]
  /** Your order reference. */
  merchantOrderId: string
  /** Shipping method selected when creating an order. */
  preferredShippingMethod: ShippingMethod
  /** The time the order was created. */
  created: Date
  /** The time the order was updated for the last time. */
  lastUpdated: Date
  /** Used for orders where an invoice amount must be supplied (e.g. to Middle East). */
  invoiceAmountNet: number
  /** Used for orders where an invoice amount must be supplied (e.g. to Middle East). */
  invoiceTax: number
  /** Used for orders where an invoice amount must be supplied (e.g. to Middle East). */
  invoiceCurrency: number
}

type Shipment = {
  /** The unique identifier for this shipment. `null` if order hasn't been submitted. */
  shipmentId: string | null
  /** Whether the order will be tracked. */
  isTracked: boolean
  /** Tracking number, when available. */
  trackingNumber?: string
  /** Tracking URL, when available. */
  trackingUrl?: string
  /** Estimated earliest arrival of shipment. */
  earliestEstimatedArrivalDate: Date
  /** Estimated latest arrival of shipment. */
  latestEstimatedArrivalDate: Date
  /** The shipping date. `null` if the order hasn't been shipped. */
  shippedOn: Date | null
  /** The shipping carrier used once a shipment has been dispatched. */
  carrier?: Carrier
  /** The IDs in the top-level image object. */
  photoIds: string[]
}

type Image = {
  /** Unique integer identifying the image. */
  id: number
  /** If image is to be downloaded by Pwinty, the image's URL. */
  url: string
  /** Current status of the image. */
  status: ImageStatus
  /** Number of copies of the image to include in the order. */
  copies: number
  /** How the image should be resized when printing. */
  sizing: ResizingType
  /** The amount (in cents/pence) that Pwinty will charge you for this item. */
  price: number
  /** If `payment` is set to `InvoiceRecipient` then the price (in cents/pence) you want to charge for this item. */
  priceToUser?: number
  /** The md5 hash of the image file (when available). */
  md5Hash?: string
  /** A URL to image after cropping. */
  previewUrl: string
  /** A URL that will serve up a thumbnail of the image after cropping. */
  thumbnailUrl: string
  /** An identification code of the product associated with this image. */
  sku: string
  /** An object containing all the attributes set on the object. */
  attributes: { [key: string]: string }
}

type Country = {
  /** Two-letter country code of the country. */
  countryCode: string
  /** Name of the country. */
  name: string
}

type CatalogItem = {
  /** An identification code of the product. */
  sku: string
  /** The amount (in cents/pence) that Pwinty will charge you for this product. */
  price: number
  /** Currency code in which product is priced. */
  currency: string
}

type OrderCreationParameters = {
  /** Your order reference. */
  merchantOrderId?: string
  /** To whom the order will be addressed. */
  recipientName: string
  /** First line of recipient address. */
  address1?: string
  /** Second line of recipient address. */
  address2?: string
  /** Town/city of recipient address. */
  addressTownOrCity?: string
  /** State (US), county (UK) or region of recipient address. */
  stateOrCounty?: string
  /** Postal/Zipcode of recipient address. */
  postalOrZipCode?: string
  /** Two-letter country code of the recipient. */
  countryCode: string
  /** Customer's mobile number for shipping updates and courier contact. */
  mobileTelephone?: string
  /** Customer's non-mobile phone number for shipping updates and courier contact. */
  telephone?: string
  /** Customer's email address. */
  email?: string
  /** Shipping method selected when creating an order. */
  preferredShippingMethod: ShippingMethod
  /** Payment option for order. Default `InvoiceMe` */
  payment?: PaymentType
  /**
   * URL to a packing slip file. PNG format, A4 size recommended.
   *
   * Not all production facilities support shipping notes. Please contact Pwinty to confirm availability for your typical product range.
   */
  packingSlipUrl?: string
  /** Used for orders where an invoice amount must be supplied (e.g. to Middle East). */
  invoiceAmountNet?: number
  /** Used for orders where an invoice amount must be supplied (e.g. to Middle East). */
  invoiceTax?: number
  /** Used for orders where an invoice amount must be supplied (e.g. to Middle East). */
  invoiceCurrency?: number
}

type ImageErrors =
  | 'FileCouldNotBeDownloaded'
  | 'NoImageFile'
  | 'InvalidImageFile'
  | 'ZeroCopies'
type ImageWarnings =
  | 'CroppingWillOccur'
  | 'PictureSizeTooSmall'
  | 'CouldNotValidateImageSize'
  | 'CouldNotValidateAspectRatio'
  | 'AttributeNotValid'
type GeneralErrors =
  | 'AccountBalanceInsufficient'
  | 'ItemsContainingErrors'
  | 'NoItemsInOrder'
  | 'PostalAddressNotSet'

type OrderValidation = {
  /** ID of the order */
  id: string
  /** Whether the order is valid. Submission will it succeed if you submit it. */
  isValid: boolean
  /** Invalid images in the order. */
  photos: {
    /** ID of the image. */
    id: string
    /** Array of objects containing any errors associated with this image. */
    errors: ImageErrors[]
    /** Array of objects containing any warnings associated with this image. */
    warnings: ImageWarnings[]
  }[]
  generalErrors: GeneralErrors[]
}

type ImageParameters = {
  /** An identification code of the product for this image. */
  sku: string
  /** The image's URL. */
  url: string
  /** Number of copies of the image to include in the order. */
  copies: number
  /** How the image should be resized when printing. */
  sizing: ResizingType
  /** If `payment` is set to `InvoiceRecipient` then the price (in cents/pence) you want to charge for this item. */
  priceToUser?: number
  /** The md5 hash of the image file. */
  md5Hash?: string
  /** An object with properties representing the attributes for the image. */
  attributes: { [key: string]: string }
}

export default class Pwinty {
  private baseApiEndpoint: string
  private merchantId: string
  private apiKey: string
  private request: <T>(url: string, options?: RequestInit) => Promise<T>

  orders: {
    get(orderId: string): Promise<Order>
    list(options?: {
      /** Number of orders to return. Default 100, max 250. */
      limit?: number
      /** Start position used for paginating order list. Default 0. */
      start?: number
    }): Promise<{
      has_more: boolean
      data: Order[]
    }>
    create(order: OrderCreationParameters): Promise<Order>
    update(orderId: string, order: OrderCreationParameters): Promise<Order>
    validate(orderId: string): Promise<OrderValidation>
    submit(orderId: string): Promise<void>
    cancel(orderId: string): Promise<void>
    addImage(orderId: string, image: ImageParameters): Promise<Image>
    addImages(orderId: string, images: ImageParameters[]): Promise<Image[]>
  }

  countries: {
    list(): Promise<Country[]>
  }

  catalogue: {
    prices(countryCode: string, skus: string[]): Promise<CatalogItem[]>
  }

  constructor(
    options: {
      baseApiEndpoint?: string
      merchantId?: string
      apiKey?: string
    } = {}
  ) {
    this.baseApiEndpoint =
      options.baseApiEndpoint ||
      (process.env.NODE_ENV === 'production'
        ? 'https://api.pwinty.com/v3.0'
        : 'https://sandbox.pwinty.com/v3.0')

    this.merchantId = options.merchantId || process.env.PWINTY_MERCHANT_ID
    this.apiKey = options.apiKey || process.env.PWINTY_API_KEY

    const pwinty = this

    this.request = async <T>(url: string, options: RequestInit = {}) => {
      if (!options.headers) {
        options.headers = {}
      }
      options.headers['X-Pwinty-MerchantId'] = this.merchantId
      options.headers['X-Pwinty-REST-API-Key'] = this.apiKey
      options.headers['Content-type'] = 'application/json'
      options.headers['accept'] = 'application/json'

      const res = await fetch(`${pwinty.baseApiEndpoint}${url}`, options)

      const text = await res.text()
      let data: T & { errorMessage?: string }
      try {
        data = JSON.parse(text)
      } catch (err) {}

      if (!res.ok || !data) {
        throw new Error((data && data.errorMessage) || text)
      }

      return data
    }

    this.orders = {
      get(orderId: string) {
        return pwinty.request<any>(`/v3.0/orders/${orderId}`)
      },
      list(options?: { limit?: number; start?: number }) {
        options = options || {}
        return pwinty.request<any>(
          `/v3.0/orders?limit=${options.limit || 100}&start=${options.start ||
            0}`
        )
      },
      create(order: OrderCreationParameters) {
        return pwinty.request<any>(`/v3.0/orders`, {
          method: 'POST',
          body: JSON.stringify(order),
        })
      },
      update(orderId: string, order: OrderCreationParameters) {
        return pwinty.request<any>(`/v3.0/orders/${orderId}`, {
          method: 'PUT',
          body: JSON.stringify(order),
        })
      },
      validate(orderId: string) {
        return pwinty.request<any>(`/v3.0/orders/${orderId}/SubmissionStatus`)
      },
      submit(orderId: string) {
        return pwinty.request<any>(`/v3.0/orders/${orderId}/status`, {
          method: 'POST',
          body: JSON.stringify({ status: 'Submitted' }),
        })
      },
      cancel(orderId: string) {
        return pwinty.request<any>(`/v3.0/orders/${orderId}/status`, {
          method: 'POST',
          body: JSON.stringify({ status: 'Cancelled' }),
        })
      },
      addImage(orderId: string, image: ImageParameters) {
        return pwinty.request<any>(`/v3.0/orders/${orderId}/images`, {
          method: 'POST',
          body: JSON.stringify(image),
        })
      },
      async addImages(orderId: string, images: ImageParameters[]) {
        const res = await pwinty.request<any>(
          `/v3.0/orders/${orderId}/images/batch`,
          {
            method: 'POST',
            body: JSON.stringify(images),
          }
        )

        return res.items
      },
    }

    this.countries = {
      list() {
        return pwinty.request<any>(`/v3.0/countries`)
      },
    }

    this.catalogue = {
      async prices(countryCode: string, skus: string[]) {
        const res = await pwinty.request<any>(
          `/v3.0/catalogue/prodigi%20direct/destination/${countryCode}/prices`,
          {
            method: 'POST',
            body: JSON.stringify(skus),
          }
        )

        return res.prices
      },
    }
  }
}
