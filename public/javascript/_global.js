// Constant
const DVL = 'developer'
const OWN = 'owner'
const MNG = 'manager'
const EMP = 'employee'

const DATE = new Date()
const TZ_OFFSET = DATE.getTimezoneOffset()

// Sessions
const riyosha = sessionStorage.getItem('riyosha')
const riyopar = (riyosha && JSON.parse(riyosha)) || {}

const kontentsu = sessionStorage.getItem('kontentsu')
const kontenpar = (kontentsu && JSON.parse(kontentsu)) || {}

// Applications
let table, pageEntry

let _jwtMethod1 = 'eno'
let apiVersion0 = 'v0'
let apiVersion1 = 'v1'
let apiVersion2 = 'v2'

let maxCountImg = 5
let pagingLimit = 10

// Riyosha

let role = riyopar.role
let userId = riyopar._id
let userType = riyopar.user_type
let userAccount = riyopar.account_id
let storeSetting = riyopar.store_setting

let csrf = riyopar.csrf
let token = riyopar.latmat
let locale = riyopar.locale
let gmtOffset = riyopar.tz_offset

locale = locale || '!{app.LOCALES}'
gmtOffset = gmtOffset || convertGMTOffset(TZ_OFFSET)

// Locales
let content = kontenpar
