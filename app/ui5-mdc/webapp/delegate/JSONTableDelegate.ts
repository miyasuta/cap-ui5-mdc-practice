import TableDelegate from "sap/ui/mdc/TableDelegate"
import JSONPropertyInfo from "../model/metadata/JSONPropertyInfo"
import { default as Table, PropertyInfo as TablePropertyInfo } from "sap/ui/mdc/Table"
import Element from "sap/ui/core/Element"
import Column from "sap/ui/mdc/table/Column"
import Text from "sap/m/Text"

interface TablePayload {
    bindingPath: string
    searchKeys: string[]
}

const JSONTableDelegate = Object.assign({}, TableDelegate)

JSONTableDelegate.fetchProperties = async () => {
    return JSONPropertyInfo.filter(p => p.key !== "$search")
}

const _createColumn = (propertyInfo:TablePropertyInfo, table:Table) => {
    const name = propertyInfo.key
    const id = table.getId() + "--col-" + name
    const column = Element.getElementById(id) as Column
    return column ?? new Column(id, {
        propertyKey: name,
        header: propertyInfo.label,
        template: new Text({
            text: {
                path: "orders>" + propertyInfo.path,
                type: propertyInfo.dataType
            }
        })
    })
}

JSONTableDelegate.addItem = async (table:Table, propertyKey:string) => {
    const propertyInfo = JSONPropertyInfo.find((p) => p.key === propertyKey) as TablePropertyInfo
    return _createColumn(propertyInfo, table)
}

JSONTableDelegate.updateBindingInfo = (table, bindingInfo) => {
    TableDelegate.updateBindingInfo.call(JSONTableDelegate, table, bindingInfo)
    bindingInfo.path = (table.getPayload() as TablePayload).bindingPath
    bindingInfo.templateShareable = true
}

export default JSONTableDelegate