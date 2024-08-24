import Controller from "sap/ui/core/mvc/Controller";
import Route, { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import Router, { Router$RoutePatternMatchedEvent } from "sap/ui/core/routing/Router";
import UIComponent from "sap/ui/core/UIComponent";
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
            editMode: false
        }
        this.getView()?.setModel(new JSONModel(viewModel), "view")

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
        this.getView()?.setModel(new JSONModel(order), "data")
        const viewModel = this.getView()?.getModel("view") as JSONModel
        viewModel.setProperty("/editMode", true)
    }

    private _setOrder(uuid: String): void {
        const orders = (this.getOwnerComponent()?.getModel("orders") as JSONModel).getData() as Order[]
        const order = orders.filter(data => data.ID === uuid)[0]
        this.getView()?.setModel(new JSONModel(order), "data")
    }
}