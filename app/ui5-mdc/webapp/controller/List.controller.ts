import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import Table, { Table$RowPressEvent } from "sap/ui/mdc/Table";

/**
 * @namespace miyasuta.ui5mdc.controller
 */
export default class List extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {

    }

    public onCreate(): void {
        //open create new page
        (this.getOwnerComponent() as UIComponent).getRouter().navTo("RouteDetail")
    }

    public onRowPress(event:Table$RowPressEvent): void {
        const selectedRow = event.getParameter("bindingContext")?.getObject() as {ID: string}
        (this.getOwnerComponent() as UIComponent).getRouter().navTo("RouteDetail",{
            uuid: selectedRow.ID
        })
    }
}