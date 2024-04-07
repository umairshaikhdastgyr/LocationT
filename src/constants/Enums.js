import { icons } from "../theme/Icons"

export const routeStatus = {
    PENDING: 2,
    IN_PROGRESS: 3,
    COMPLETED: 4,
    CANCELLED: 5,
    APPROVAL_PENDING: 12,
    RETURNS_PENDING: 15,
    ROUTE_PAUSED: 17,
    ROUTE_END: true
}

export const reasonType = {
    PICKUP_RETURNS: 'PICKUP RETURN REASONS',
    DELIVERY_RETURNS: 'DRIVER RETURN REASONS',
    DRIVER_FEEDBACK: 'DRIVER FEEDBACK',
    PICKUP_RETURN_STOP_REASONS: 'RETURN STOP REASONS'
}

export const storeType = {
    PICKUP: 1,
    DROPOFF: 2,
    PICKUP_RETURNS: 3
}

export const driverStatus = {
    ROUTE_START: "2"
}

export const stopStatus = {
    PENDING: 1,
    IN_PROGRESS: 2,
    IN_TRANSIT: 3,
    COMPLETED: 4,
    CANCELLED: 5,
    DELIVER_LATER: 6,
    OUT_FOR_PICKUP: 8,
    PICKED_UP: 9,
    PICKUP_SUBMIT: 10,
    OUT_FOR_RETURNS: 13,
    RETURN_SUBMITTED: 14,
    RETURNS_APPROVED: 15,
    RETURNS_REJECTED: 16,
    RETURNS_HANDSHAKE_REVOKED: 17,
    RETURNS_LATER: 19,
    ARRIVED_IN_RADIUS: 20,
	ARRIVED_OUTSIDE_RADIUS: 21,
	LOADING_STARTED: 22,
    PICKUP_LATER_REQUEST: 23,
    PICKUP_ARRIVAL_PENDING: 24,
    PICKUP_LATER_APPROVED: 25,
    PICKUP_ARRIVAL_APPROVED: 26,
    SKIP_DROPOFF_REQUEST: 28,
    SKIP_RETURN_REQUEST: 29,
    INGRESS: 30,
    EGRESS: 31
}

export const routeTitle = {
    PENDING: 'Not Started',
    IN_PROGRESS: 'Route is In Transit',
    ROUTE_END: 'Route Ended',
    APPROVAL_PENDING: 'Approval Pending'
}

export const stopType = {
    STOP: 1,
    SPOT: 2
}

export const paymentType = {
    FINJA: 'finja',
    COD: 'cod',
    BNPL: 'bnpl'
}

export const stopTabs = {
    UPCOMING: 1,
    IN_COMPLETE: 2,
    DELIVERED: 3
}

export const logsStatus = {
    START_ROUTE: 1,
    END_ROUTE: 2,
    STOP_DELIVER: 8,
    LOCATION_OFF: 9,
    PHONE_OFF: 10,
    INTERNET_OFF: 11,
    LOG_OUT: 12,
    LOG_IN: 13,
    DELIVER_SPOT: 14,
    DELIVER_SPOT_ERROR: 15,
    DELIVER_STOP_WITH_CODE: 16,
    DELIVER_STOP_WITH_CODE_ERROR: 17,
    PICKED_UP: 18,
    ARRIVED_OUTSIDE_RADIUS: 29,
	LOADING_STARTED: 30,
    GPS_OFF: 31,
    MOCK_LOCATION: 32,
    ENTER_IN_RADIUS: 34,
    EXIT_FROM_RADIUS: 35,
    LOCATION_PERMISIION: 37,
    IS_SERVICE_KILL: 38,
}

export const storageConfig = {
    BASE_URL: '@BASE_URL',
    LOGISTIC_URL: '@LOGISTIC_URL',
    STOPS_DATA: '@STOPS_DATA',
    SETTINGS_DATA: '@SETTINGS_DATA',
    SAVE_LOCATION: '@SAVE_LOCATION',
    LASTLOCATION: '@LASTLOCATION',
    SAVE_API: '@SAVE_API',
    STOP_ID: '@STOP_ID',
    ROUTE_ID: '@ROUTE_ID',
    AUTH_TOKEN: '@AUTH_TOKEN',
    ROUTE_INFO: '@ROUTE_INFO',
    FROM_ID: '@FROM_ID',
    DRIVER_STATUS: '@DRIVER_STATUS',
    STOP_INFO: '@STOP_INFO',
    NON_RETAILER: '@NON_RETAILER',
    SPOT_USER: '@SPOT_USER',
    TO_ID: '@TO_ID',
    IS_DELIVER: '@IS_DELIVER',
    WIFI_TOGGLE_INFO: '@WIFI_TOGGLE_INFO',
    LOCATION_DATA: '@LOCATION_DATA',
    REFRESH_TOKEN: '@REFRESH_TOKEN',
    UNIQUE_SPOT_ID: '@UNIQUE_SPOT_ID',
    USER_DATA: '@USER_DATA',
    APP_LOG: '@APP_LOG',
    START_ROUTE: '@START_ROUTE',
    BACKGROUND_SERVICE_STATUS: '@BACKGROUND_SERVICE_STATUS',
    LOCATION_PERMISIIONS_STATUS: '@LOCATION_PERMISIIONS_STATUS'
}

export const dateConfig = {
    START_DATE: 'START_DATE',
    END_DATE: 'END_DATE',
    DATE_FORMAT: 'DD-MMM-YYYY',
    DATE_FORMAT_SECOND: 'Do-MMM-YYYY',
    DATE_PRIMARY_FORMAT: 'D MMMM YYYY',
    CURRENT_DATE: new Date(),
    DATE_FORMAT_YEAR_FIRST: 'YYYY-MM-DD',
    MAX_DATE: new Date(2050, 6, 3),
    MIN_DATE: new Date(2018, 1, 1),
    DATE_FORMAT_LL: 'll',
    DATE_TIME: 'YYYY-MM-DD HH:mm:ss'
}

export const timeConfig = {
    START_TIME: '00:00:00',
    END_TIME: '23:59:59',
    LOGS_DATE: "YYYY-MM-DD HH:mm:ss"
}

export const paymentInfo = {
    ADJUSTMENT: {
        TYPE: 1,
        TITLE: 'Adjustment',
        DESCRIPTION: 'Adjusted by Dastgyr'
    },
    CASH_SUBMISSION: {
        TYPE: 2,
        TITLE: 'Cash Submission',
        DESCRIPTION: 'Submitted at Warehouse'
    },
    CASH_COLLECTED: {
        TYPE: 3,
        TITLE: 'Cash Collected',
        DESCRIPTION: 'Cash Collected by driver'
    },
    CASH_DEPOSIT: {
        TYPE: 4,
        TITLE: 'Manual Cash Deposit',
        DESCRIPTION: 'Deposited by driver'
    },
    DIGITAL_CASH: {
        TYPE: 5,
        TITLE: 'Digital Cash Deposit',
        DESCRIPTION: 'Deposited via '
    },
    CASH_DEPOSIT_MACHINES:{
        LIMIT:10,
        BANK_ALFALAH:1,
        KONNECT:2,
        RADIUS:10
    }
}

export const userConfig = {
    DASTGYR_LOGISTIC: 1
}

export const retailerRatingList = [
    {
        id: 1,
        icon: icons.veryBad
    },
    {
        id: 2,
        icon: icons.bad
    },
    {
        id: 3,
        icon: icons.normal
    },
    {
        id: 4,
        icon: icons.happy
    },
    {
        id: 5,
        icon: icons.veryHappy
    }
]

export const feedbackReason = {
    OTHER_REASON: 66
}

export const notificationConfig = {
    PICKUP_APPROVED: "1",
    PICKUP_REJECTED: "2",
    REQUEST_FOR_START_LOCATION_ACCEPTED: "3",
    REQUEST_FOR_START_LOCATION_REJECTED: "4",
    REQUEST_FOR_STOP_APPROVAL: "5",
    SELLER_HANDSHAKE_RESPONSE: "SELLER_HANDSHAKE_RESPONSE",
    SELLER_RETURN_HANDSHAKE_RESPONSE: "SELLER_RETURN_HANDSHAKE_RESPONSE",
    OPS_CANCEL_ROUTE: "OPS_CANCEL_ROUTE"
}

export const routeReturnStatus = {
    RETURNS_NOT_GENERATED: 1,
    RETURNS_GENERATED: 2,
    ZERO_RETURNS_GENERATED: 3,
    STOP_UNLOCK_IN_PROCESS: 4
}

export const itemQtyType = {
    PIECE: 1,
    KG: 0.1
}

export const locationConfig = {
    LOCATION_GRANTED: 'granted',
    LOCATION_DENIED: 'denied',
    LOCATION_BLOCKED: 'blocked'
}

export const countryInfo = {
    PAKISTAN: {
        id: 1,
        validNumber: 3
    },
    UAE: {
        id: 2,
        validNumber: 5
    },
    UK: {
        id: 3,
        validNumber: 2
    },
}

export const shipmentStatus = {
    PENDING: 1,
    PICKED: 2,
    APPROVED: 3,
    PARTIAL_RECEIVED: 4,
    CLOSED: 5,
    IN_PROGRESS: 6
}

export const approvalType = {
    PICKUP_APPROVAL: 'picking_approval',
    PICKUP_LATER: 'pick_later',
    DELIVER_LATER: 'deliver_later',
    RETURN_LATER: 'return_later'
}

export const environmentType = {
    LOCAL: 'local',
    DEV: 'dev',
    QA: 'qa',
    STAGING: 'staging',
    PRODUCTION: 'production'
}

export const currentLocation = {
    coords : null
}

export const appStateConfig = {
    ACTIVE : 'active',
    CHANGE : 'change'
}

export const dataType = {
    STRING : 'string'
}