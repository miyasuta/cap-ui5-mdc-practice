import { debug } from "@sap/cds";
import MessageToast from "sap/m/MessageToast";
import Fragment from "sap/ui/core/Fragment";
import Controller from "sap/ui/core/mvc/Controller";
import Route, { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import Router, { Router$RoutePatternMatchedEvent } from "sap/ui/core/routing/Router";
import UIComponent from "sap/ui/core/UIComponent";
import Table from "sap/ui/mdc/Table";
import ResponsiveColumnSettings from "sap/ui/mdc/table/ResponsiveColumnSettings";
import JSONModel from "sap/ui/model/json/JSONModel";

interface Order {
    ID?: string
    orderId?: number
    description?: string
    customer_ID?: number
    to_Items?: [{
        ID?: string
        itemNumber?: number
        product_ID?: number
        quantity?: number
    }]
}


/**
 * @namespace miyasuta.ui5mdc.controller
 */
export default class Detail extends Controller {
    private url = "/rest/order/Orders"
    private detailUrl: string

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

    public async onAddItem(): Promise<void> {
        const dataModel = (this.getView()?.getModel("data") as JSONModel)
        let items = dataModel.getProperty("/to_Items")
        items.push({
            product_ID: undefined,
            quantity: undefined        
        })
        return (this.byId("itemTable") as Table).rebind()
    }

    public async onSave(): Promise<void> {
        const create = (this.getView()?.getModel("view") as JSONModel).getProperty("/create")
        const data = (this.getView()?.getModel("data") as JSONModel).getData() as Order
        let request:Request
        if (create) {
            request = new Request(this.url, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "content-type": "application/json"
                }
            }) 
        } else {
            const patchItems = data.to_Items?.map(item => {
                return {
                    ID: item.ID,
                    product_ID: item.product_ID,
                    quantity: item.quantity
                }
            })

            const patchData = {
                description: data.description,
                customer_ID: data.customer_ID,
                to_Items: patchItems
            }
            request = new Request(this.url + `/${data.ID}`, {
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
            MessageToast.show(`Order has been saved`);
            (this.getView()?.getModel("view") as JSONModel).setProperty("/editMode", false);
            (this.getView()?.getModel("view") as JSONModel).setProperty("/create", false);
            
            //reload detail page
            const uuid = data.ID
            this.detailUrl = this.url + "/" + uuid + "?$expand=customer&$expand=to_Items($expand=product)"
            await (this.getView()?.getModel("data") as JSONModel).loadData(this.detailUrl)

            //reload orders to show in list page
            const reloadUrl = this.url + "?$orderby=orderId&$expand=customer";
            (this.getOwnerComponent()?.getModel("orders") as JSONModel).loadData(reloadUrl);

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
            to_Items: [{
                product_ID: undefined,
                quantity: undefined  
            }]
        }
        //set view model
        this.getView()?.setModel(new JSONModel(order), "data");
        (this.getView()?.getModel("view") as JSONModel).setProperty("/editMode", true);
        (this.getView()?.getModel("view") as JSONModel).setProperty("/create", true);
    }

    private async _setOrder(uuid: String): Promise<void> {
        // //get order
        this.detailUrl = this.url + "/" + uuid + "?$expand=customer&$expand=to_Items($expand=product)"
        const dataModel = new JSONModel()
        await dataModel.loadData(this.detailUrl)
        this.getView()?.setModel(dataModel, "data");

        (this.getView()?.getModel("view") as JSONModel).setProperty("/editMode", false);
        (this.getView()?.getModel("view") as JSONModel).setProperty("/create", false);
    }
}