import TableDelegate from "sap/ui/mdc/TableDelegate"
import JSONPropertyInfo from "../model/metadata/JSONPropertyInfo"
import { default as Table, PropertyInfo as TablePropertyInfo } from "sap/ui/mdc/Table"
import Element from "sap/ui/core/Element"
import Column from "sap/ui/mdc/table/Column"
import Text from "sap/m/Text"
import FilterBar from "sap/ui/mdc/FilterBar"
import Filter from "sap/ui/model/Filter"
import FilterOperator from "sap/ui/model/FilterOperator"

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
    const model = (table.getPayload() as TablePayload).bindingPath.split("/")[0]
    return column ?? new Column(id, {
        propertyKey: name,
        header: propertyInfo.label,
        template: new Text({
            text: {
                path: model + propertyInfo.path,
                type: propertyInfo.dataType
            }
        })
    })
}

const _createSerachFilters = (serach:string, keys:string[]) => {
    const filters = keys.map((key) => {
            const property = JSONPropertyInfo.filter(p => p.key === key)[0]
            return new Filter({
            path: property.path,
            operator: property.dataType === "sap.ui.model.type.String" ? FilterOperator.Contains : FilterOperator.EQ,
            value1: serach
        }) 
    })
    return [new Filter(filters, false)]
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

//basic serachはここで実装する
JSONTableDelegate.getFilters = (table) => {
    const search = (Element.getElementById(table.getFilter()) as FilterBar)?.getSearch()
    const keys = (table.getPayload() as TablePayload).searchKeys
    let filters = TableDelegate.getFilters(table)
    if (search && keys) {
        filters = filters.concat(_createSerachFilters(search, keys))
    }
    return filters
}

export default JSONTableDelegate