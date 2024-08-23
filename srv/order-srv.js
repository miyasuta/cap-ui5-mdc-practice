const cds = require('@sap/cds')

class OrderService extends cds.ApplicationService {
    init() {

        const { Orders, Items } = this.entities
        const LOG = cds.log('OrderService')

        this.before('CREATE', 'Orders', async (req) => {
            LOG.info(`Orders CREATE is called`)
            const { maxID } = await SELECT.one`max(orderId) as maxID`.from(Orders)
            req.data.orderId = maxID + 1

            let items = req.data.to_Items
            console.log("items:", items)
            if(items) {
                let id = 0
                items = items.map((item)=> {
                    id++
                    item.itemNumber = id
                })
            }
        })

        this.before('CREATE', 'Items', async (req) => {
            LOG.info(`Items CREATE is called`)
            const { maxID } = await SELECT.one`max(itemNumber) as maxID`
                                          .from(Items)
                                          .where`to_Order_ID = ${req.data.to_Order_ID}`
            req.data.itemNumber = maxID + 1
        })

        return super.init()
    }
}

module.exports = { OrderService }