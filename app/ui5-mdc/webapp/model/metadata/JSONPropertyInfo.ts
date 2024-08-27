/**
 * @namespace miyasuta.ui5mdc.model.metadata
 */
export default [
    {
		key: "orderId",
		label: "Order ID",
		visible: true,
		path: "orderId",
		dataType: "sap.ui.model.type.Integer"        
    },
    {
		key: "description",
		label: "Description",
		visible: true,
		path: "description",
		dataType: "sap.ui.model.type.String"        
    },
    {
		key: "customer",
		label: "Customer",
		visible: true,
		path: "customer/name",
		dataType: "sap.ui.model.type.String"        
    },
    {
		key: "createdAt",
		label: "Created at",
		visible: true,
		path: "createdAt",
		dataType: "sap.ui.model.type.DateTime"        
    },
    {
		key: "createdBy",
		label: "Created by",
		visible: true,
		path: "createdBy",
		dataType: "sap.ui.model.type.String"        
    },
	{
		key: "itemNumber",
		label: "item Number",
		visible: true,
		path: "to_Items/itemNumber",
		dataType: "sap.ui.model.type.Integer"        
    },
    {
		key: "$search",
		label: "Search",
		visible: true,
		maxConditions: 1,
		dataType: "sap.ui.model.type.String"
	}
]