import { icons } from "../theme/Icons"

// Navigation screen name enum
export const navigationConfig = {
    LOGIN: 'Login',
    HOME: 'Home',
    DRIVER_SUMMARY: 'DriverSummary',
    BOTTOM_TAB_NAVIGATION: 'BottomTabNavigation',
    LOADED_ITEMS: 'LoadedItems',

    // Stops
    STOPS: 'Stops',
    STOP_RETURNS: 'StopReturns',    
    STOP_LOCATIONS: 'StopLocations',

    // Stop Delivery
    DELIVERY_CODE: 'DeliveryCode',
    STOP_CONFIRMATION: 'StopConfirmation',
    PRICE_DETAILS: 'PriceDetails',
    RETAILER_RATING: 'RetailerRating',
    STOP_SUMMARY: 'StopSummary',

    // Pickup Stop
    PICKUP_CODE: 'PickupCode',
    START_PICKUP: 'StartPickup',
    PICKUP_CONFIRMATION: 'PickupConfirmation',
    PICKUP_SUMMARY: 'PickupSummary',

    // Spot Sell
    REGISTER_RETAILER: 'RegisterRetailer',
    SPOT_CONFIRMATION: 'SpotConfirmation',
    SPOT_SELL_CODE: 'SpotSellCode',
    SPOT_PRICE_DETAILS: 'SpotPriceDetails',

    // Cash Deposit
    BANK_LOCATIONS: 'BankLocations',
    MANUAL_PAPER_SLIPS: 'ManualPaperSlips',
    DIGITAL_CASH_DEPOSIT: 'DigitalCashDeposit',
    UPLOADED_SLIPS: 'UploadedSlips',
    UPLOADED_SLIP_DETAILS: 'UploadedSlipDetails',

    // Pickup Returns Stop
    PICKUP_RETURNS_CODE: 'PickupReturnsCode',
    PICKUP_RETURNS_CONFIRMATION: 'PickupReturnsConfirmation',
    PICKUP_RETURNS_SUMMARY: 'PickupReturnsSummary',

    // First Mile
    FIRST_MILE_CODE: 'FirstMileCode',
    ORDER_ACCEPTED: 'OrderAccepted',
    ORDER_PICKUP: 'OrderPickup'
}

export const stopMenu = [
    // { id: 1, name: 'Spot Sale', navigation: navigationConfig.REGISTER_RETAILER, icon: icons.spotSale },
    { id: 2, name: 'Loaded SKUs', navigation: navigationConfig.LOADED_ITEMS, icon: icons.loadedSku },
    { id: 3, name: 'Stop Locations', navigation: navigationConfig.STOP_LOCATIONS, icon: icons.spotSale },
    { id: 4, name: 'Call Helpline', navigation: navigationConfig.LOADED_ITEMS, icon: icons.call }
]

export const cashDepositOptions = [
    {
        id: 1,
        name: 'Bank Locations',
        icon: icons.bankLocation,
        navigation: navigationConfig.BANK_LOCATIONS
    },
    {
        id: 2,
        name: 'Manual Paper Slips',
        icon: icons.paperSlips,
        navigation: navigationConfig.MANUAL_PAPER_SLIPS
    },
    {
        id: 3,
        name: 'Digital Cash Deposit',
        icon: icons.digitalCash,
        navigation: navigationConfig.DIGITAL_CASH_DEPOSIT
    },
    {
        id: 4,
        name: 'Uploaded Slips',
        icon: icons.uploadedSlips,
        navigation: navigationConfig.UPLOADED_SLIPS
    }
]