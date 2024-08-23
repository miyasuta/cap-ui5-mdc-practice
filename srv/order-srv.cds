using { mdc } from '../db/schema';

@protocol: 'rest'
service OrderService {
    entity Orders as projection on mdc.Orders;
    entity Items as projection on mdc.Items;
    
    @readonly entity Customers as projection on mdc.Customers;
    @readonly entity Products as projection on mdc.Products;
}