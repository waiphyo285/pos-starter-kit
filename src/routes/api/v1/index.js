const express = require('express')
const router = express.Router()

// user routing
const users = require('./user')
const userRoles = require('./user-role')

// helpers
const { isD, isDA } = require('@utils/handlers/access-url')

// validation
const coreSchema = require('@models/dto/mongodb/core.schema')
const posSchema = require('@models/dto/mongodb/pos.schema')

// middleware
const isValidDto = require('@middleware/dto/is-valid-dto')
const { populateUserFields } = require('@middleware/params/index')
const { checkStoreToCreate } = require('@middleware/check-store')
const { checkStockNewCart, checkStockUpdateCart, checkStockProceedCart } = require('@middleware/check-stock')

module.exports = router

// Developer Program - Mastering Data
// const dev = require('./develop')

const cities = require('./city')
const townships = require('./township')

const banks = require('./bank')
const currencies = require('./currency')

const owners = require('./owner')
const ownerTypes = require('./owner-type')

const information = require('./information')

router
    .get('/users', users.index)
    .get('/user/:id', users.show)
    .post('/user', users.create)
    .post('/link-user', users.createUser)
    .post('/unlink-user', users.removeUser)
    .put('/user/:id', isValidDto(coreSchema.userDto), users.updateWithPass)
    .put('/edit-user/:id', users.updateWithoutPass)
    .delete('/user/:id', users.delete)

router
    .get('/cities', cities.index)
    .get('/city/:id', cities.show)
    .get('/city', cities.showBy)
    .post('/city', isValidDto(coreSchema.cityDto), cities.create)
    .put('/city/:id', isValidDto(coreSchema.cityDto), cities.update)
    .delete('/city/:id', cities.delete)

router
    .get('/townships', townships.index)
    .get('/township/:id', townships.show)
    .get('/township', townships.showBy)
    .post('/township', isValidDto(coreSchema.townshipDto), townships.create)
    .put('/township/:id', isValidDto(coreSchema.townshipDto), townships.update)
    .delete('/township/:id', townships.delete)

router
    .get('/banks', banks.index)
    .get('/bank/:id', banks.show)
    .get('/bank', banks.showBy)
    .post('/bank', isValidDto(coreSchema.bankDto), banks.create)
    .put('/bank/:id', isValidDto(coreSchema.bankDto), banks.update)
    .delete('/bank/:id', banks.delete)

router
    .get('/informations', information.index)
    .get('/information/:id', information.show)
    .get('/information', information.showBy)
    .post('/information', information.create)
    .put('/information/:id', information.update)
    .delete('/information/:id', information.delete)

router
    .get('/currencies', currencies.index)
    .get('/currency/:id', currencies.show)
    .get('/currency', currencies.showBy)
    .post('/currency', isValidDto(coreSchema.currencyDto), currencies.create)
    .put('/currency/:id', isValidDto(coreSchema.currencyDto), currencies.update)
    .delete('/currency/:id', currencies.delete)

router
    .get('/owner-types', isD, ownerTypes.index)
    .get('/owner-type/:id', ownerTypes.show)
    .get('/owner-type', ownerTypes.showBy)
    .post('/owner-type', isValidDto(posSchema.ownerTypeDto), ownerTypes.create)
    .put('/owner-type/:id', isValidDto(posSchema.ownerTypeDto), ownerTypes.update)
    .delete('/owner-type/:id', ownerTypes.delete)

router
    .get('/owners', isD, owners.index)
    .get('/owner/:id', owners.show)
    .get('/owner', owners.showBy)
    .post('/owner', isValidDto(posSchema.ownerDto), owners.create)
    .put('/owner/:id', isValidDto(posSchema.ownerDto), owners.update)
    .delete('/owner/:id', owners.delete)

// End Developer Program - Mastering Data

// Owner Program - Related owner data

const notifications = require('./notification')

const categories = require('./category')
const subCategories = require('./sub-category')
const products = require('./product')
const variants = require('./variant')

const suppliers = require('./supplier')
const supplierTypes = require('./supplier-type')

const stores = require('./store')
const storeTypes = require('./store-type')
const storeSettings = require('./store-setting')

const employees = require('./employee')
const employeeTypes = require('./employee-type')
const holidays = require('./holiday')

const customers = require('./customer')
const customerTypes = require('./customer-type')

const expenses = require('./expense')
const reportings = require('./reporting')

const couponCodes = require('./coupon-code')
const couponTypes = require('./coupon-type')

const damageTypes = require('./damage-type')

const saleOrders = require('./sale-order')
const saleHoldings = require('./sale-holding')
const subscriptionPlans = require('./subscription-plan')
const subscriptionOwners = require('./subscription-owner')

const ledgerDaily = require('./ledger-daily')
const { payable: accPayable, receivable: accReceivable } = require('./accounting')

const {
    sales: salesInvoice,
    refunds: refundInvoice,
    purchases: purchaseInvoice,
    damages: damageInvoice,
    adjusts: adjustInvoice,
} = require('./invoices')

router
    .get('/config-roles', isDA, userRoles.config)
    .get('/user-roles', isDA, userRoles.index)
    .get('/user-role/:id', userRoles.show)
    .get('/user-role', userRoles.showBy)
    .post('/user-role', isValidDto(coreSchema.userRoleDto), userRoles.create)
    .put('/user-role/:id', isValidDto(coreSchema.userRoleDto), userRoles.update)
    .delete('/user-role/:id', userRoles.delete)

router
    .get('/categories', categories.index)
    .get('/category/:id', categories.show)
    .get('/category', categories.showBy)
    .post('/category', isValidDto(posSchema.categoryDto), categories.create)
    .put('/category/:id', isValidDto(posSchema.categoryDto), categories.update)
    .delete('/category/:id', categories.delete)

router
    .get('/sub-categories', subCategories.index)
    .get('/sub-category/:id', subCategories.show)
    .get('/sub-category', subCategories.showBy)
    .post('/sub-category', isValidDto(posSchema.subCategoryDto), subCategories.create)
    .put('/sub-category/:id', isValidDto(posSchema.subCategoryDto), subCategories.update)
    .delete('/sub-category/:id', subCategories.delete)

router
    .get('/products', products.index)
    .get('/product/:id', products.show)
    .get('/product', products.showBy)
    .post('/product', isValidDto(posSchema.productDto), products.create)
    .put('/product/:id', isValidDto(posSchema.productDto), products.update)
    .delete('/product/:id', products.delete)

router
    .get('/variants', variants.index)
    .get('/variant/:id', variants.show)
    .get('/variant', variants.showBy)
    .post('/variant', isValidDto(posSchema.variantDto), variants.create)
    .put('/variant/:id', isValidDto(posSchema.variantDto), variants.update)
    .delete('/variant/:id', variants.delete)

router
    .get('/supplier-types', supplierTypes.index)
    .get('/supplier-type/:id', supplierTypes.show)
    .get('/supplier-type', supplierTypes.showBy)
    .post('/supplier-type', isValidDto(posSchema.supplierTypeDto), supplierTypes.create)
    .put('/supplier-type/:id', isValidDto(posSchema.supplierTypeDto), supplierTypes.update)
    .delete('/supplier-type/:id', supplierTypes.delete)

router
    .get('/suppliers', suppliers.index)
    .get('/supplier/:id', suppliers.show)
    .get('/supplier', suppliers.showBy)
    .post('/supplier', isValidDto(posSchema.supplierDto), suppliers.create)
    .put('/supplier/:id', isValidDto(posSchema.supplierDto), suppliers.update)
    .delete('/supplier/:id', suppliers.delete)

router
    .get('/store-types', storeTypes.index)
    .get('/store-type/:id', storeTypes.show)
    .get('/store-type', storeTypes.showBy)
    .post('/store-type', isValidDto(posSchema.storeTypeDto), storeTypes.create)
    .put('/store-type/:id', isValidDto(posSchema.storeTypeDto), storeTypes.update)
    .delete('/store-type/:id', storeTypes.delete)

router
    .get('/store-settings', storeSettings.index)
    .get('/store-setting/:id', storeSettings.show)
    .get('/store-setting', storeSettings.showBy)
    .post('/store-setting', isValidDto(posSchema.storeSettingDto), storeSettings.create)
    .put('/store-setting/:id', isValidDto(posSchema.storeSettingDto), storeSettings.update)
    .delete('/store-setting/:id', storeSettings.delete)

router
    .get('/stores', stores.index)
    .get('/store/:id', stores.show)
    .get('/store', stores.showBy)
    .post('/store', isValidDto(posSchema.storeDto), checkStoreToCreate, stores.create)
    .put('/store/:id', isValidDto(posSchema.storeDto), stores.update)
    .delete('/store/:id', stores.delete)

router
    .get('/employee-types', employeeTypes.index)
    .get('/employee-type/:id', employeeTypes.show)
    .get('/employee-type', employeeTypes.showBy)
    .post('/employee-type', isValidDto(posSchema.employeeTypeDto), employeeTypes.create)
    .put('/employee-type/:id', isValidDto(posSchema.employeeTypeDto), employeeTypes.update)
    .delete('/employee-type/:id', employeeTypes.delete)

router
    .get('/holidays', holidays.index)
    .get('/holiday/:id', holidays.show)
    .get('/holiday', holidays.showBy)
    .post('/holiday', isValidDto(posSchema.holidayDto), holidays.create)
    .put('/holiday/:id', isValidDto(posSchema.holidayDto), holidays.update)
    .delete('/holiday/:id', holidays.delete)

router
    .get('/employees', employees.index)
    .get('/employee/:id', employees.show)
    .get('/employee', employees.showBy)
    .post('/employee', isValidDto(posSchema.employeeDto), employees.create)
    .put('/employee/:id', isValidDto(posSchema.employeeDto), employees.update)
    .delete('/employee/:id', employees.delete)

router
    .get('/customer-types', customerTypes.index)
    .get('/customer-type/:id', customerTypes.show)
    .get('/customer-type', customerTypes.showBy)
    .post('/customer-type', isValidDto(posSchema.customerTypeDto), customerTypes.create)
    .put('/customer-type/:id', isValidDto(posSchema.customerTypeDto), customerTypes.update)
    .delete('/customer-type/:id', customerTypes.delete)

router
    .get('/customers', customers.index)
    .get('/customer/:id', customers.show)
    .get('/customer', customers.showBy)
    .post('/customer', isValidDto(posSchema.customerDto), customers.create)
    .put('/customer/:id', isValidDto(posSchema.customerDto), customers.update)
    .delete('/customer/:id', customers.delete)

router
    .get('/acc-payables', accPayable.index)
    .get('/acc-payable/:id', accPayable.show)
    .get('/acc-payable', accPayable.showBy)
    .post('/acc-payable', accPayable.create)
    .put('/acc-payable/:id', accPayable.update)
    .delete('/acc-payable/:id', accPayable.delete)

router
    .get('/acc-receivables', accReceivable.index)
    .get('/acc-receivable/:id', accReceivable.show)
    .get('/acc-receivable', accReceivable.showBy)
    .post('/acc-receivable', accReceivable.create)
    .put('/acc-receivable/:id', accReceivable.update)
    .delete('/acc-receivable/:id', accReceivable.delete)

router
    .get('/daily-ledgers', ledgerDaily.index)
    .get('/daily-ledger/:id', ledgerDaily.show)
    .get('/daily-ledger', ledgerDaily.showBy)
    .post('/daily-ledger', ledgerDaily.create)
    .put('/daily-ledger/:id', ledgerDaily.update)
    .delete('/daily-ledger/:id', ledgerDaily.delete)

router
    .get('/sale-holds', saleHoldings.index)
    .get('/sale-hold/:id', saleHoldings.show)
    .get('/sale-hold', saleHoldings.showBy)
    .post('/sale-hold', isValidDto(posSchema.holdOrderDto), populateUserFields, saleHoldings.create)
    .put('/sale-hold/:id', isValidDto(posSchema.holdOrderDto), saleHoldings.update)
    .delete('/sale-hold/:id', saleHoldings.delete)

router
    .get('/sale-orders', saleOrders.index)
    .get('/sale-order/:id', saleOrders.show)
    .get('/sale-order', saleOrders.showBy)
    .post('/sale-order', isValidDto(posSchema.createCartDto), checkStockNewCart, saleOrders.create)
    .put('/sale-order/:id', isValidDto(posSchema.updateCartDto), checkStockUpdateCart, saleOrders.update)
    .post('/proceed-order/:id', isValidDto(posSchema.proceedOrderDto), checkStockProceedCart, saleOrders.makePayment)
    .delete('/sale-order/:id', saleOrders.delete)

router
    .get('/sale-invoices', salesInvoice.index)
    .get('/sale-invoice/:id', salesInvoice.show)
    .get('/sale-invoice', salesInvoice.showBy)
    // .post('/sale-invoice', salesInvoice.create)
    // .put('/sale-invoice/:id', salesInvoice.update)
    .delete('/sale-invoice/:id', salesInvoice.delete)

router
    .get('/sale-refunds', refundInvoice.index)
    .get('/sale-refund/:id', refundInvoice.show)
    .get('/sale-refund', refundInvoice.showBy)
    .post('/sale-refund', refundInvoice.create)
    .put('/sale-refund/:id', refundInvoice.update)
    .delete('/sale-refund/:id', refundInvoice.delete)

router
    .get('/purchase-invoices', purchaseInvoice.index)
    .get('/purchase-invoice/:id', purchaseInvoice.show)
    .get('/purchase-invoice', purchaseInvoice.showBy)
    .post('/purchase-invoice/:sr?', isValidDto(posSchema.purchaseInvoiceDto), purchaseInvoice.create)
    .put('/purchase-invoice/:id', isValidDto(posSchema.purchaseInvoiceDto), purchaseInvoice.update)
    .delete('/purchase-invoice/:id', purchaseInvoice.delete)

router
    .get('/damage-invoices', damageInvoice.index)
    .get('/damage-invoice/:id', damageInvoice.show)
    .get('/damage-invoice', damageInvoice.showBy)
    .post('/damage-invoice', isValidDto(posSchema.damageInvoiceDto), damageInvoice.create)
    .put('/damage-invoice/:id', isValidDto(posSchema.damageInvoiceDto), damageInvoice.update)
    .delete('/damage-invoice/:id', damageInvoice.delete)

router
    .get('/adjust-stocks', adjustInvoice.index)
    .get('/adjust-stock/:id', adjustInvoice.show)
    .get('/adjust-stock', adjustInvoice.showBy)
    .post('/adjust-stock', isValidDto(posSchema.adjustInvoiceDto), adjustInvoice.create)
    .put('/adjust-stock/:id', isValidDto(posSchema.adjustInvoiceDto), adjustInvoice.update)
    .delete('/adjust-stock/:id', adjustInvoice.delete)

router
    .get('/expenses', expenses.index)
    .get('/expense/:id', expenses.show)
    .get('/expense', expenses.showBy)
    .post('/expense', isValidDto(posSchema.expenseDto), expenses.create)
    .put('/expense/:id', isValidDto(posSchema.expenseDto), expenses.update)
    .delete('/expense/:id', expenses.delete)

router
    .get('/coupon-types', couponTypes.index)
    .get('/coupon-type/:id', couponTypes.show)
    .get('/coupon-type', couponTypes.showBy)
    .post('/coupon-type', isValidDto(posSchema.couponTypeDto), couponTypes.create)
    .put('/coupon-type/:id', isValidDto(posSchema.couponTypeDto), couponTypes.update)
    .delete('/coupon-type/:id', couponTypes.delete)

router
    .get('/coupon-codes', couponCodes.index)
    .get('/coupon-code/:id', couponCodes.show)
    .get('/coupon-code', couponCodes.showBy)
    .post('/coupon-code', isValidDto(posSchema.couponCodeDto), couponCodes.create)
    .put('/coupon-code/:id', isValidDto(posSchema.couponCodeDto), couponCodes.update)
    .delete('/coupon-code/:id', couponCodes.delete)

router
    .get('/damage-types', damageTypes.index)
    .get('/damage-type/:id', damageTypes.show)
    .get('/damage-type', damageTypes.showBy)
    .post('/damage-type', isValidDto(posSchema.damageTypeDto), damageTypes.create)
    .put('/damage-type/:id', isValidDto(posSchema.damageTypeDto), damageTypes.update)
    .delete('/damage-type/:id', damageTypes.delete)

router
    .get('/daily-sales', reportings.listDailySales)
    .get('/weekly-sales', reportings.listWeeklySales)
    .get('/monthly-sales', reportings.listMonthlySales)

router
    .get('/config-plans', isDA, subscriptionPlans.config)
    .get('/subscription-plans', subscriptionPlans.index)
    .get('/subscription-plan/:id', subscriptionPlans.show)
    .get('/subscription-plan', subscriptionPlans.showBy)
    .post('/subscription-plan', isValidDto(posSchema.subscribePlanDto), subscriptionPlans.create)
    .put('/subscription-plan/:id', isValidDto(posSchema.subscribePlanDto), subscriptionPlans.update)
    .delete('/subscription-plan/:id', subscriptionPlans.delete)

router
    .get('/subscription-owners', subscriptionOwners.index)
    .get('/subscription-owner/:id', subscriptionOwners.show)
    .get('/subscription-owner', subscriptionOwners.showBy)
    .post('/subscription-owner', isValidDto(posSchema.subscribeOwnerDto), subscriptionOwners.create)
    .put('/subscription-owner/:id', isValidDto(posSchema.subscribeOwnerDto), subscriptionOwners.update)
    .delete('/subscription-owner/:id', subscriptionOwners.delete)

router
    .get('/notifications', notifications.index)
    .get('/notification/:id', notifications.show)
    .get('/notification', notifications.showBy)
    .post('/notification', isValidDto(posSchema.notificationDto), notifications.create)
    .put('/notification/:id', isValidDto(posSchema.notificationDto), notifications.update)
    .delete('/notification/:id', notifications.delete)

// End Owner Program - Related owner data
