namespace mdc;

using { managed } from '@sap/cds/common';

entity Orders : managed
{
    key ID : UUID @title : 'UUID';
    orderId : Integer default 0 @readonly
        @title : 'Order ID';
    description : String(200)
        @title : 'Description';
    to_Items : Composition of many Items on to_Items.to_Order = $self
        @title : 'Items';
    customer : Association to one Customers
        @title : 'Customer';
}

entity Items : managed
{
    key ID : UUID
        @title : 'UUID';
    to_Order : Association to one Orders
        @title : 'Order ID';
    itemNumber : Integer default 0
        @readonly
        @title : 'Item Number';
    product : Association to one Products
        @title : 'Product';
    quantity : Integer
        @title : 'Quantity';
}

@cds.odata.valuelist
entity Customers
{
    key ID : Integer
        @title : 'Customer ID';
    name : String(111)
        @title : 'Customer Name';
}

@cds.odata.valuelist
entity Products
{
    key ID : Integer
        @title : 'Product ID';
    name : String(111)
        @title : 'Product Name';
}