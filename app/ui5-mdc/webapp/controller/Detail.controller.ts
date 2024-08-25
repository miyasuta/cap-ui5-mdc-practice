import { debug } from "@sap/cds";
import MessageToast from "sap/m/MessageToast";
import Controller from "sap/ui/core/mvc/Controller";
import Route, { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import Router, { Router$RoutePatternMatchedEvent } from "sap/ui/core/routing/Router";
import UIComponent from "sap/ui/core/UIComponent";
import ResponsiveColumnSettings from "sap/ui/mdc/table/ResponsiveColumnSettings";
import JSONModel from "sap/ui/model/json/JSONModel";

interface Order {
    ID?: String
    orderId?: Number
    description?: String
    customer_ID?: Number
    to_Items?: [{
        ID?: String
        itemNumber?: Number
        product_ID?: Number
        quantity?: Number
    }]
}

/**
 * @namespace miyasuta.ui5mdc.controller
 */
export default class Detail extends Controller {

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
        //get parameter
        const router = (this.getOwnerComponent() as UIComponent).getRouter()
        router.getRoute("RouteDetail")?.attachPatternMatched(this._objectMatched, this)

        const viewModel = {
            editMode: false,
            create: false
        }
        this.getView()?.setModel(new JSONModel(viewModel), "view")

    }

    public async onSave(): Promise<void> {
        const create = (this.getView()?.getModel("view") as JSONModel).getProperty("/create")
        const url = "/rest/order/Orders"
        const data = (this.getView()?.getModel("data") as JSONModel).getData()
        let request:Request
        if (create) {
            request = new Request(url, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "content-type": "application/json"
                }
            }) 
        } else {
            const patchData = {
                description: data.description,
                customer_ID: data.customer_ID   
            }
            request = new Request(url + `/${data.ID}`, {
                method: "PATCH",
                body: JSON.stringify(patchData),
                headers: {
                    "content-type": "application/json"
                }
            }) 
        }

        const response = await fetch(request);
        if (response.ok) {
            const data = await response.json()
            MessageToast.show(`Order ${data.orderId} has been saved`);
            (this.getView()?.getModel("view") as JSONModel).setProperty("/editMode", false);

            //reload orders from the servier
            const reloadUrl = url + "?$orderby=orderId&$expand=customer";
            (this.getOwnerComponent()?.getModel("orders") as JSONModel).loadData(reloadUrl)
        }
    }

    private _objectMatched(event:Route$PatternMatchedEvent) : void {
        const uuid = (event.getParameter("arguments") as { uuid: string })?.uuid as String;
        if (uuid) {
            this._setOrder(uuid)
        }
        else {
            this._createNewOrder()
        }
    }

    private _createNewOrder(): void {
        const order:Order = {
            description: "default",
        }
        //set view model
        this.getView()?.setModel(new JSONModel(order), "data");
        (this.getView()?.getModel("view") as JSONModel).setProperty("/editMode", true);
        (this.getView()?.getModel("view") as JSONModel).setProperty("/create", true);
    }

    private _setOrder(uuid: String): void {
        const orders = (this.getOwnerComponent()?.getModel("orders") as JSONModel).getData() as Order[]
        const order = orders.filter(data => data.ID === uuid)[0]
        this.getView()?.setModel(new JSONModel(order), "data");
        (this.getView()?.getModel("view") as JSONModel).setProperty("/editMode", false);
        (this.getView()?.getModel("view") as JSONModel).setProperty("/create", false);
    }
}