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

        this.before('UPDATE', 'Orders', async(req) => {
            console.log(`Orders UPDATE is called`)
            console.log(req.data)         
            const items = req.data.to_Items

            //get items
            const itemsdb = await SELECT .from(Items)
                        .columns (i => {i.itemNumber, i.ID}) 
                        .where`to_Order_ID = ${req.data.ID}`

            //get max itemNumber
            let { maxID } = await SELECT.one`max(itemNumber) as maxID`
                                          .from(Items)
                                          .where`to_Order_ID = ${req.data.ID}`
            items.forEach(item => {
                const itemNumber = itemsdb.filter(db => item.ID === db.ID)[0]?.itemNumber
                if(!itemNumber) {
                    maxID ++
                    item.itemNumber = maxID
                }
            })
        })

        return super.init()
    }
}

module.exports = { OrderService }