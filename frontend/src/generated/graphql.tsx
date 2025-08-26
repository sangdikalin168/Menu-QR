import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: number; output: number; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
  Upload: { input: any; output: any; }
};

export type AddPaymentInput = {
  amount: Scalars['Float']['input'];
  invoiceId: Scalars['Int']['input'];
  paymentMethod: PaymentMethod;
};

export type AdjustStockItemInput = {
  adjustmentType: AdjustmentType;
  changeQuantity: Scalars['Int']['input'];
  productId: Scalars['Int']['input'];
  reason: Scalars['String']['input'];
  referenceId?: InputMaybe<Scalars['Int']['input']>;
  remark?: InputMaybe<Scalars['String']['input']>;
};

export enum AdjustmentType {
  Addition = 'ADDITION',
  Subtraction = 'SUBTRACTION'
}

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type BulkStockAdjustmentResult = {
  __typename?: 'BulkStockAdjustmentResult';
  updated: Array<Stock>;
};

export type Category = {
  __typename?: 'Category';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type CreateCustomerInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type CreateInvoiceInput = {
  cashierId: Scalars['Int']['input'];
  customerId?: InputMaybe<Scalars['Int']['input']>;
  discount: Scalars['Float']['input'];
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
  fiscalPeriod: Scalars['Int']['input'];
  fiscalYear: Scalars['Int']['input'];
  items: Array<InvoiceItemInput>;
  paymentAmount?: InputMaybe<Scalars['Float']['input']>;
  paymentMethod?: InputMaybe<PaymentMethod>;
  totalAmount: Scalars['Float']['input'];
};

export type Customer = {
  __typename?: 'Customer';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type IncomeReportResult = {
  __typename?: 'IncomeReportResult';
  invoices: Array<InvoiceSummary>;
  payments: Array<Payment>;
};

export type Invoice = {
  __typename?: 'Invoice';
  cashier?: Maybe<User>;
  cashierId: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  customer?: Maybe<Customer>;
  customerId?: Maybe<Scalars['Int']['output']>;
  discount: Scalars['Float']['output'];
  dueDate?: Maybe<Scalars['DateTime']['output']>;
  fiscalPeriod: Scalars['Int']['output'];
  fiscalYear: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  invoiceItem: Array<InvoiceItem>;
  invoiceNumber: Scalars['String']['output'];
  isPaid?: Maybe<Scalars['Boolean']['output']>;
  paidAmount?: Maybe<Scalars['Float']['output']>;
  payment?: Maybe<Array<Maybe<Payment>>>;
  paymentStatus: PaymentStatus;
  refundStatus: RefundStatus;
  refundedAmount: Scalars['Float']['output'];
  refunds?: Maybe<Array<Refund>>;
  totalAmount: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type InvoiceFilterInput = {
  customerId?: InputMaybe<Scalars['Int']['input']>;
  isPaid?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  paymentStatus?: InputMaybe<PaymentStatus>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type InvoiceItem = {
  __typename?: 'InvoiceItem';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  invoiceId: Scalars['Int']['output'];
  price: Scalars['Float']['output'];
  product: Product;
  productId: Scalars['Int']['output'];
  quantity: Scalars['Int']['output'];
  total: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
  unitType?: Maybe<UnitType>;
  updatedAt: Scalars['DateTime']['output'];
};

export type InvoiceItemInput = {
  productId: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
  unitPrice: Scalars['Float']['input'];
  unitType: UnitType;
};

export type InvoiceSummary = {
  __typename?: 'InvoiceSummary';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  invoiceItem: Array<InvoiceItem>;
  invoiceNumber: Scalars['String']['output'];
  paidAmount: Scalars['Float']['output'];
  paymentStatus: Invoice_PaymentStatus;
  payments: Array<Payment>;
  totalAmount: Scalars['Float']['output'];
};

export type LowStockProduct = {
  __typename?: 'LowStockProduct';
  category?: Maybe<Category>;
  id: Scalars['ID']['output'];
  lowStockAlert: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  stock?: Maybe<Stock>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addPaymentToInvoice: Payment;
  addStockLog: StockLog;
  bulkAdjustStock: BulkStockAdjustmentResult;
  createCategory: Category;
  createCustomer: Customer;
  createInvoice: Invoice;
  createInvoiceItem: InvoiceItem;
  createProduct: Product;
  createPurchase: Purchase;
  createRefund: Refund;
  createRefundItem: RefundItem;
  createSupplier: Supplier;
  deleteCategory: Scalars['Int']['output'];
  deleteCustomer: Scalars['Int']['output'];
  deleteInvoice: Invoice;
  deleteInvoiceItem: Scalars['ID']['output'];
  deleteProduct: Scalars['ID']['output'];
  deletePurchase: Scalars['ID']['output'];
  deleteRefund: Scalars['ID']['output'];
  deleteRefundItem: Scalars['ID']['output'];
  deleteSupplier: Scalars['ID']['output'];
  login?: Maybe<AuthPayload>;
  register?: Maybe<AuthPayload>;
  updateCategory?: Maybe<Category>;
  updateCustomer?: Maybe<Customer>;
  updateInvoiceItem?: Maybe<InvoiceItem>;
  updateProduct?: Maybe<Product>;
  updatePurchase?: Maybe<Purchase>;
  updateRefund?: Maybe<Refund>;
  updateStock: Stock;
  updateSupplier?: Maybe<Supplier>;
};


export type MutationAddPaymentToInvoiceArgs = {
  input: AddPaymentInput;
};


export type MutationAddStockLogArgs = {
  changeQuantity: Scalars['Int']['input'];
  logType: StockChangeType;
  productId: Scalars['Int']['input'];
  reason: Scalars['String']['input'];
  referenceId?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationBulkAdjustStockArgs = {
  items: Array<AdjustStockItemInput>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationCreateCategoryArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateCustomerArgs = {
  data: CreateCustomerInput;
};


export type MutationCreateInvoiceArgs = {
  input: CreateInvoiceInput;
};


export type MutationCreateInvoiceItemArgs = {
  invoiceId: Scalars['Int']['input'];
  price: Scalars['Float']['input'];
  productId: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
};


export type MutationCreateProductArgs = {
  data: ProductInput;
};


export type MutationCreatePurchaseArgs = {
  costPrice: Scalars['Float']['input'];
  productId: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
  supplierId: Scalars['Int']['input'];
};


export type MutationCreateRefundArgs = {
  cashierId: Scalars['Int']['input'];
  invoiceId?: InputMaybe<Scalars['Int']['input']>;
  items: Array<RefundItemInput>;
  paymentMethod: PaymentMethod;
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateRefundItemArgs = {
  productId: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
  refundId: Scalars['Int']['input'];
  unitPrice: Scalars['Float']['input'];
};


export type MutationCreateSupplierArgs = {
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteCustomerArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteInvoiceArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteInvoiceItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeletePurchaseArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRefundArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRefundItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSupplierArgs = {
  id: Scalars['Int']['input'];
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  password: Scalars['String']['input'];
  role: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationUpdateCategoryArgs = {
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdateCustomerArgs = {
  data: CreateCustomerInput;
};


export type MutationUpdateInvoiceItemArgs = {
  id: Scalars['ID']['input'];
  price?: InputMaybe<Scalars['Float']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateProductArgs = {
  data: ProductInput;
  id: Scalars['Int']['input'];
};


export type MutationUpdatePurchaseArgs = {
  costPrice?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['ID']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateRefundArgs = {
  cashierId?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  invoiceId?: InputMaybe<Scalars['Int']['input']>;
  paymentMethod?: InputMaybe<PaymentMethod>;
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateStockArgs = {
  productId: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
};


export type MutationUpdateSupplierArgs = {
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type OutOfStockProduct = {
  __typename?: 'OutOfStockProduct';
  category?: Maybe<Category>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  stock?: Maybe<Stock>;
};

export type PaginatedProducts = {
  __typename?: 'PaginatedProducts';
  items: Array<Product>;
  totalCount: Scalars['Int']['output'];
};

export type Payment = {
  __typename?: 'Payment';
  amount: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  invoice: Invoice;
  invoiceId: Scalars['Int']['output'];
  paymentDate: Scalars['DateTime']['output'];
  paymentMethod: PaymentMethod;
  updatedAt: Scalars['DateTime']['output'];
};

export enum PaymentMethod {
  BankTransfer = 'BANK_TRANSFER',
  Cash = 'CASH',
  Credit = 'CREDIT'
}

export enum PaymentStatus {
  Paid = 'PAID',
  Partial = 'PARTIAL',
  Unpaid = 'UNPAID'
}

export type Product = {
  __typename?: 'Product';
  boxBarCode?: Maybe<Scalars['String']['output']>;
  boxRetailPrice?: Maybe<Scalars['Float']['output']>;
  boxUnitName?: Maybe<Scalars['String']['output']>;
  boxWholesalePrice?: Maybe<Scalars['Float']['output']>;
  category?: Maybe<Category>;
  categoryId: Scalars['Int']['output'];
  costPrice: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  hasBoxes: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  invoiceItems?: Maybe<Array<InvoiceItem>>;
  lowStockAlert: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  pcsPerBox: Scalars['Int']['output'];
  purchases?: Maybe<Array<Purchase>>;
  qrCode?: Maybe<Scalars['String']['output']>;
  refundItem?: Maybe<Array<RefundItem>>;
  refundItems?: Maybe<Array<RefundItem>>;
  retailPrice: Scalars['Float']['output'];
  stock?: Maybe<Stock>;
  stockLogs?: Maybe<Array<StockLog>>;
  unitBarCode?: Maybe<Scalars['String']['output']>;
  unitName: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  wholesalePrice?: Maybe<Scalars['Float']['output']>;
};

export type ProductInput = {
  boxBarCode?: InputMaybe<Scalars['String']['input']>;
  boxRetailPrice?: InputMaybe<Scalars['Float']['input']>;
  boxUnitName?: InputMaybe<Scalars['String']['input']>;
  boxWholesalePrice?: InputMaybe<Scalars['Float']['input']>;
  categoryId: Scalars['Int']['input'];
  costPrice: Scalars['Float']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  hasBoxes?: InputMaybe<Scalars['Boolean']['input']>;
  imageUrl?: InputMaybe<Scalars['Upload']['input']>;
  lowStockAlert?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  pcsPerBox?: InputMaybe<Scalars['Int']['input']>;
  qrCode?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  retailPrice: Scalars['Float']['input'];
  unitBarCode?: InputMaybe<Scalars['String']['input']>;
  unitName: Scalars['String']['input'];
  wholesalePrice?: InputMaybe<Scalars['Float']['input']>;
};

export type Purchase = {
  __typename?: 'Purchase';
  costPrice: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  productId: Scalars['Int']['output'];
  quantity: Scalars['Int']['output'];
  supplierId: Scalars['Int']['output'];
  totalPrice: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Query = {
  __typename?: 'Query';
  categories: Array<Category>;
  category?: Maybe<Category>;
  customer?: Maybe<Customer>;
  customers: Array<Customer>;
  incomeReport: IncomeReportResult;
  invoice?: Maybe<Invoice>;
  invoiceItem?: Maybe<InvoiceItem>;
  invoiceItems?: Maybe<Array<InvoiceItem>>;
  invoices: Array<Invoice>;
  /**
   * Returns products that have stock quantity less than or equal to their lowStockAlert value.
   * Optional: filter by category.
   */
  lowStockProducts: Array<LowStockProduct>;
  me?: Maybe<User>;
  outOfStockProducts: Array<OutOfStockProduct>;
  product?: Maybe<Product>;
  products: PaginatedProducts;
  purchase?: Maybe<Purchase>;
  purchases: Array<Purchase>;
  refund?: Maybe<Refund>;
  refundItem?: Maybe<RefundItem>;
  refundItems?: Maybe<Array<RefundItem>>;
  refunds: Array<Refund>;
  saleReport: Array<SaleReportItem>;
  stock?: Maybe<Stock>;
  stockLog: StockLog;
  stockLogs: Array<StockLog>;
  stockMovementReport: Array<StockLog>;
  stocks: Array<Stock>;
  supplier?: Maybe<Supplier>;
  suppliers: Array<Supplier>;
};


export type QueryCategoryArgs = {
  id: Scalars['Int']['input'];
};


export type QueryCustomerArgs = {
  id: Scalars['Int']['input'];
};


export type QueryIncomeReportArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryInvoiceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInvoiceItemArgs = {
  id: Scalars['ID']['input'];
};


export type QueryInvoiceItemsArgs = {
  invoiceId: Scalars['Int']['input'];
};


export type QueryInvoicesArgs = {
  filter?: InputMaybe<InvoiceFilterInput>;
};


export type QueryLowStockProductsArgs = {
  categoryId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryOutOfStockProductsArgs = {
  categoryId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryProductArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPurchaseArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRefundArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRefundItemArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRefundItemsArgs = {
  refundId: Scalars['Int']['input'];
};


export type QuerySaleReportArgs = {
  cashierId?: InputMaybe<Scalars['Int']['input']>;
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  customerId?: InputMaybe<Scalars['Int']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryStockArgs = {
  productId: Scalars['Int']['input'];
};


export type QueryStockLogArgs = {
  id: Scalars['Int']['input'];
};


export type QueryStockLogsArgs = {
  productId: Scalars['Int']['input'];
};


export type QueryStockMovementReportArgs = {
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QuerySupplierArgs = {
  id: Scalars['Int']['input'];
};

export type Refund = {
  __typename?: 'Refund';
  cashierId: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  invoiceId?: Maybe<Scalars['Int']['output']>;
  items?: Maybe<Array<RefundItem>>;
  paymentMethod: PaymentMethod;
  reason?: Maybe<Scalars['String']['output']>;
  refundDate: Scalars['DateTime']['output'];
  totalAmount: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type RefundItem = {
  __typename?: 'RefundItem';
  id: Scalars['ID']['output'];
  product: Product;
  productId: Scalars['Int']['output'];
  quantity: Scalars['Int']['output'];
  refund: Refund;
  refundId: Scalars['Int']['output'];
  subtotal: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
};

export type RefundItemInput = {
  productId: Scalars['Int']['input'];
  quantity: Scalars['Int']['input'];
  subtotal: Scalars['Float']['input'];
  unitPrice: Scalars['Float']['input'];
};

export enum RefundStatus {
  Full = 'FULL',
  None = 'NONE',
  Partial = 'PARTIAL'
}

export type SaleProductItem = {
  __typename?: 'SaleProductItem';
  product: Product;
  quantity: Scalars['Int']['output'];
  subtotal: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
  unitType: UnitType;
};

export type SaleReportItem = {
  __typename?: 'SaleReportItem';
  cashier?: Maybe<User>;
  createdAt: Scalars['DateTime']['output'];
  customer?: Maybe<Customer>;
  discount: Scalars['Float']['output'];
  id: Scalars['Int']['output'];
  invoiceNumber: Scalars['String']['output'];
  items: Array<SaleProductItem>;
  netAmount: Scalars['Float']['output'];
  paymentStatus: Invoice_PaymentStatus;
  payments: Array<Payment>;
  refundedAmount?: Maybe<Scalars['Float']['output']>;
  totalAmount: Scalars['Float']['output'];
};

export type Stock = {
  __typename?: 'Stock';
  expiryDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  productId: Scalars['Int']['output'];
  quantity: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum StockChangeType {
  AdjustmentIn = 'ADJUSTMENT_IN',
  AdjustmentOut = 'ADJUSTMENT_OUT',
  Sale = 'SALE',
  Broken = 'broken',
  In = 'in',
  Out = 'out'
}

export type StockLog = {
  __typename?: 'StockLog';
  changeQuantity: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  logType: StockChangeType;
  product: Product;
  productId: Scalars['Int']['output'];
  reason: Scalars['String']['output'];
  referenceId?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
  userId?: Maybe<Scalars['Int']['output']>;
};

export type Supplier = {
  __typename?: 'Supplier';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  purchases?: Maybe<Array<Purchase>>;
  updatedAt: Scalars['DateTime']['output'];
};

export enum UnitType {
  Box = 'box',
  Unit = 'unit'
}

export type User = {
  __typename?: 'User';
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  refunds?: Maybe<Array<Refund>>;
  role: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export enum Invoice_PaymentStatus {
  Paid = 'PAID',
  Partial = 'PARTIAL',
  Unpaid = 'UNPAID'
}

export enum PaymentMethod {
  BankTransfer = 'BANK_TRANSFER',
  Cash = 'CASH'
}

export type CreateCategoryMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'Category', name: string } };

export type UpdateCategoryMutationVariables = Exact<{
  updateCategoryId: Scalars['Int']['input'];
  name: Scalars['String']['input'];
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory?: { __typename?: 'Category', name: string } | null };

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory: number };

export type CreateCustomerMutationVariables = Exact<{
  data: CreateCustomerInput;
}>;


export type CreateCustomerMutation = { __typename?: 'Mutation', createCustomer: { __typename?: 'Customer', id: number, name: string, phone?: string | null } };

export type UpdateCustomerMutationVariables = Exact<{
  data: CreateCustomerInput;
}>;


export type UpdateCustomerMutation = { __typename?: 'Mutation', updateCustomer?: { __typename?: 'Customer', id: number, name: string, phone?: string | null } | null };

export type CreateInvoiceMutationVariables = Exact<{
  input: CreateInvoiceInput;
}>;


export type CreateInvoiceMutation = { __typename?: 'Mutation', createInvoice: { __typename?: 'Invoice', id: number, invoiceNumber: string, totalAmount: number, paymentStatus: PaymentStatus, customer?: { __typename?: 'Customer', id: number, name: string } | null, payment?: Array<{ __typename?: 'Payment', id: number, amount: number, paymentMethod: PaymentMethod, paymentDate: string } | null> | null } };

export type DeleteInvoiceMutationVariables = Exact<{
  deleteInvoiceId: Scalars['Int']['input'];
}>;


export type DeleteInvoiceMutation = { __typename?: 'Mutation', deleteInvoice: { __typename?: 'Invoice', invoiceNumber: string } };

export type AddPaymentMutationVariables = Exact<{
  input: AddPaymentInput;
}>;


export type AddPaymentMutation = { __typename?: 'Mutation', addPaymentToInvoice: { __typename?: 'Payment', amount: number } };

export type CreateProductMutationVariables = Exact<{
  data: ProductInput;
}>;


export type CreateProductMutation = { __typename?: 'Mutation', createProduct: { __typename?: 'Product', id: number, name: string, retailPrice: number, wholesalePrice?: number | null, boxRetailPrice?: number | null, boxWholesalePrice?: number | null, costPrice: number, unitName: string, boxUnitName?: string | null, pcsPerBox: number, hasBoxes: boolean, lowStockAlert: number, categoryId: number, imageUrl?: string | null, createdAt: string, updatedAt: string } };

export type UpdateProductMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  data: ProductInput;
}>;


export type UpdateProductMutation = { __typename?: 'Mutation', updateProduct?: { __typename?: 'Product', id: number, name: string, retailPrice: number, wholesalePrice?: number | null, boxRetailPrice?: number | null, boxWholesalePrice?: number | null, costPrice: number, unitName: string, boxUnitName?: string | null, pcsPerBox: number, hasBoxes: boolean, lowStockAlert: number, categoryId: number, imageUrl?: string | null, createdAt: string, updatedAt: string } | null };

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteProductMutation = { __typename?: 'Mutation', deleteProduct: number };

export type BulkAdjustStockMutationVariables = Exact<{
  userId?: InputMaybe<Scalars['Int']['input']>;
  items: Array<AdjustStockItemInput> | AdjustStockItemInput;
}>;


export type BulkAdjustStockMutation = { __typename?: 'Mutation', bulkAdjustStock: { __typename?: 'BulkStockAdjustmentResult', updated: Array<{ __typename?: 'Stock', productId: number, quantity: number, updatedAt: string }> } };

export type CategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', name: string, id: number }> };

export type CustomersQueryVariables = Exact<{ [key: string]: never; }>;


export type CustomersQuery = { __typename?: 'Query', customers: Array<{ __typename?: 'Customer', id: number, name: string, phone?: string | null, createdAt: string, updatedAt: string }> };

export type InvoiceItemFieldsFragment = { __typename?: 'InvoiceItem', quantity: number, product: { __typename?: 'Product', id: number, name: string, retailPrice: number, wholesalePrice?: number | null, unitName: string } };

export type PaymentFieldsFragment = { __typename?: 'Payment', id: number, amount: number, paymentMethod: PaymentMethod, paymentDate: string };

export type InvoiceFieldsFragment = { __typename?: 'Invoice', id: number, invoiceNumber: string, customerId?: number | null, totalAmount: number, paidAmount?: number | null, discount: number, isPaid?: boolean | null, dueDate?: string | null, createdAt: string, updatedAt: string, refundStatus: RefundStatus, refundedAmount: number, fiscalYear: number, fiscalPeriod: number, paymentStatus: PaymentStatus, customer?: { __typename?: 'Customer', id: number, name: string, phone?: string | null } | null, payment?: Array<{ __typename?: 'Payment', id: number, amount: number, paymentMethod: PaymentMethod, paymentDate: string } | null> | null, invoiceItem: Array<{ __typename?: 'InvoiceItem', quantity: number, product: { __typename?: 'Product', id: number, name: string, retailPrice: number, wholesalePrice?: number | null, unitName: string } }> };

export type GetInvoicesQueryVariables = Exact<{
  filter?: InputMaybe<InvoiceFilterInput>;
}>;


export type GetInvoicesQuery = { __typename?: 'Query', invoices: Array<{ __typename?: 'Invoice', id: number, invoiceNumber: string, customerId?: number | null, totalAmount: number, paidAmount?: number | null, discount: number, isPaid?: boolean | null, dueDate?: string | null, createdAt: string, updatedAt: string, refundStatus: RefundStatus, refundedAmount: number, fiscalYear: number, fiscalPeriod: number, paymentStatus: PaymentStatus, customer?: { __typename?: 'Customer', id: number, name: string, phone?: string | null } | null, payment?: Array<{ __typename?: 'Payment', id: number, amount: number, paymentMethod: PaymentMethod, paymentDate: string } | null> | null, invoiceItem: Array<{ __typename?: 'InvoiceItem', quantity: number, product: { __typename?: 'Product', id: number, name: string, retailPrice: number, wholesalePrice?: number | null, unitName: string } }> }> };

export type AddPaymentToInvoiceMutationVariables = Exact<{
  input: AddPaymentInput;
}>;


export type AddPaymentToInvoiceMutation = { __typename?: 'Mutation', addPaymentToInvoice: { __typename?: 'Payment', id: number, amount: number, paymentMethod: PaymentMethod, paymentDate: string } };

export type LoginMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: number, display_name: string, username: string, role: string } } | null };

export type GetProductsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetProductsQuery = { __typename?: 'Query', products: { __typename?: 'PaginatedProducts', totalCount: number, items: Array<{ __typename?: 'Product', id: number, name: string, retailPrice: number, wholesalePrice?: number | null, boxRetailPrice?: number | null, boxWholesalePrice?: number | null, unitName: string, boxUnitName?: string | null, pcsPerBox: number, hasBoxes: boolean, costPrice: number, imageUrl?: string | null, unitBarCode?: string | null, boxBarCode?: string | null, qrCode?: string | null, lowStockAlert: number, categoryId: number, createdAt: string, updatedAt: string, category?: { __typename?: 'Category', id: number, name: string } | null, stock?: { __typename?: 'Stock', quantity: number } | null }> } };

export type SearchProductsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SearchProductsQuery = { __typename?: 'Query', products: { __typename?: 'PaginatedProducts', items: Array<{ __typename?: 'Product', id: number, name: string, retailPrice: number, wholesalePrice?: number | null, boxRetailPrice?: number | null, boxWholesalePrice?: number | null, unitName: string, boxUnitName?: string | null, pcsPerBox: number, hasBoxes: boolean, costPrice: number, stock?: { __typename?: 'Stock', quantity: number } | null }> } };

export type LowStockProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type LowStockProductsQuery = { __typename?: 'Query', lowStockProducts: Array<{ __typename?: 'LowStockProduct', name: string, lowStockAlert: number, stock?: { __typename?: 'Stock', quantity: number } | null, category?: { __typename?: 'Category', name: string } | null }> };

export type StockMovementReportQueryVariables = Exact<{
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  categoryId?: InputMaybe<Scalars['Int']['input']>;
}>;


export type StockMovementReportQuery = { __typename?: 'Query', stockMovementReport: Array<{ __typename?: 'StockLog', id: number, productId: number, changeQuantity: number, reason: string, createdAt: string, logType: StockChangeType, product: { __typename?: 'Product', name: string } }> };

export type OutOfStockProductsQueryVariables = Exact<{
  categoryId?: InputMaybe<Scalars['Int']['input']>;
}>;


export type OutOfStockProductsQuery = { __typename?: 'Query', outOfStockProducts: Array<{ __typename?: 'OutOfStockProduct', id: number, name: string, category?: { __typename?: 'Category', id: number, name: string } | null, stock?: { __typename?: 'Stock', quantity: number } | null }> };

export const PaymentFieldsFragmentDoc = gql`
    fragment PaymentFields on Payment {
  id
  amount
  paymentMethod
  paymentDate
}
    `;
export const InvoiceItemFieldsFragmentDoc = gql`
    fragment InvoiceItemFields on InvoiceItem {
  quantity
  product {
    id
    name
    retailPrice
    wholesalePrice
    unitName
  }
}
    `;
export const InvoiceFieldsFragmentDoc = gql`
    fragment InvoiceFields on Invoice {
  id
  invoiceNumber
  customerId
  totalAmount
  paidAmount
  discount
  isPaid
  dueDate
  createdAt
  updatedAt
  refundStatus
  refundedAmount
  fiscalYear
  fiscalPeriod
  customer {
    id
    name
    phone
  }
  payment {
    ...PaymentFields
  }
  invoiceItem {
    ...InvoiceItemFields
  }
  paymentStatus
}
    ${PaymentFieldsFragmentDoc}
${InvoiceItemFieldsFragmentDoc}`;
export const CreateCategoryDocument = gql`
    mutation CreateCategory($name: String!) {
  createCategory(name: $name) {
    name
  }
}
    `;
export type CreateCategoryMutationFn = Apollo.MutationFunction<CreateCategoryMutation, CreateCategoryMutationVariables>;

/**
 * __useCreateCategoryMutation__
 *
 * To run a mutation, you first call `useCreateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCategoryMutation, { data, loading, error }] = useCreateCategoryMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateCategoryMutation, CreateCategoryMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateCategoryMutation, CreateCategoryMutationVariables>(CreateCategoryDocument, options);
}
export type CreateCategoryMutationHookResult = ReturnType<typeof useCreateCategoryMutation>;
export type CreateCategoryMutationResult = Apollo.MutationResult<CreateCategoryMutation>;
export type CreateCategoryMutationOptions = Apollo.BaseMutationOptions<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const UpdateCategoryDocument = gql`
    mutation UpdateCategory($updateCategoryId: Int!, $name: String!) {
  updateCategory(id: $updateCategoryId, name: $name) {
    name
  }
}
    `;
export type UpdateCategoryMutationFn = Apollo.MutationFunction<UpdateCategoryMutation, UpdateCategoryMutationVariables>;

/**
 * __useUpdateCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCategoryMutation, { data, loading, error }] = useUpdateCategoryMutation({
 *   variables: {
 *      updateCategoryId: // value for 'updateCategoryId'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateCategoryMutation, UpdateCategoryMutationVariables>(UpdateCategoryDocument, options);
}
export type UpdateCategoryMutationHookResult = ReturnType<typeof useUpdateCategoryMutation>;
export type UpdateCategoryMutationResult = Apollo.MutationResult<UpdateCategoryMutation>;
export type UpdateCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const DeleteCategoryDocument = gql`
    mutation DeleteCategory($id: Int!) {
  deleteCategory(id: $id)
}
    `;
export type DeleteCategoryMutationFn = Apollo.MutationFunction<DeleteCategoryMutation, DeleteCategoryMutationVariables>;

/**
 * __useDeleteCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCategoryMutation, { data, loading, error }] = useDeleteCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCategoryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteCategoryMutation, DeleteCategoryMutationVariables>(DeleteCategoryDocument, options);
}
export type DeleteCategoryMutationHookResult = ReturnType<typeof useDeleteCategoryMutation>;
export type DeleteCategoryMutationResult = Apollo.MutationResult<DeleteCategoryMutation>;
export type DeleteCategoryMutationOptions = Apollo.BaseMutationOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const CreateCustomerDocument = gql`
    mutation CreateCustomer($data: CreateCustomerInput!) {
  createCustomer(data: $data) {
    id
    name
    phone
  }
}
    `;
export type CreateCustomerMutationFn = Apollo.MutationFunction<CreateCustomerMutation, CreateCustomerMutationVariables>;

/**
 * __useCreateCustomerMutation__
 *
 * To run a mutation, you first call `useCreateCustomerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCustomerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCustomerMutation, { data, loading, error }] = useCreateCustomerMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateCustomerMutation(baseOptions?: Apollo.MutationHookOptions<CreateCustomerMutation, CreateCustomerMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateCustomerMutation, CreateCustomerMutationVariables>(CreateCustomerDocument, options);
}
export type CreateCustomerMutationHookResult = ReturnType<typeof useCreateCustomerMutation>;
export type CreateCustomerMutationResult = Apollo.MutationResult<CreateCustomerMutation>;
export type CreateCustomerMutationOptions = Apollo.BaseMutationOptions<CreateCustomerMutation, CreateCustomerMutationVariables>;
export const UpdateCustomerDocument = gql`
    mutation UpdateCustomer($data: CreateCustomerInput!) {
  updateCustomer(data: $data) {
    id
    name
    phone
  }
}
    `;
export type UpdateCustomerMutationFn = Apollo.MutationFunction<UpdateCustomerMutation, UpdateCustomerMutationVariables>;

/**
 * __useUpdateCustomerMutation__
 *
 * To run a mutation, you first call `useUpdateCustomerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCustomerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCustomerMutation, { data, loading, error }] = useUpdateCustomerMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateCustomerMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCustomerMutation, UpdateCustomerMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateCustomerMutation, UpdateCustomerMutationVariables>(UpdateCustomerDocument, options);
}
export type UpdateCustomerMutationHookResult = ReturnType<typeof useUpdateCustomerMutation>;
export type UpdateCustomerMutationResult = Apollo.MutationResult<UpdateCustomerMutation>;
export type UpdateCustomerMutationOptions = Apollo.BaseMutationOptions<UpdateCustomerMutation, UpdateCustomerMutationVariables>;
export const CreateInvoiceDocument = gql`
    mutation CreateInvoice($input: CreateInvoiceInput!) {
  createInvoice(input: $input) {
    id
    invoiceNumber
    totalAmount
    paymentStatus
    customer {
      id
      name
    }
    payment {
      id
      amount
      paymentMethod
      paymentDate
    }
  }
}
    `;
export type CreateInvoiceMutationFn = Apollo.MutationFunction<CreateInvoiceMutation, CreateInvoiceMutationVariables>;

/**
 * __useCreateInvoiceMutation__
 *
 * To run a mutation, you first call `useCreateInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInvoiceMutation, { data, loading, error }] = useCreateInvoiceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateInvoiceMutation(baseOptions?: Apollo.MutationHookOptions<CreateInvoiceMutation, CreateInvoiceMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateInvoiceMutation, CreateInvoiceMutationVariables>(CreateInvoiceDocument, options);
}
export type CreateInvoiceMutationHookResult = ReturnType<typeof useCreateInvoiceMutation>;
export type CreateInvoiceMutationResult = Apollo.MutationResult<CreateInvoiceMutation>;
export type CreateInvoiceMutationOptions = Apollo.BaseMutationOptions<CreateInvoiceMutation, CreateInvoiceMutationVariables>;
export const DeleteInvoiceDocument = gql`
    mutation DeleteInvoice($deleteInvoiceId: Int!) {
  deleteInvoice(id: $deleteInvoiceId) {
    invoiceNumber
  }
}
    `;
export type DeleteInvoiceMutationFn = Apollo.MutationFunction<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>;

/**
 * __useDeleteInvoiceMutation__
 *
 * To run a mutation, you first call `useDeleteInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteInvoiceMutation, { data, loading, error }] = useDeleteInvoiceMutation({
 *   variables: {
 *      deleteInvoiceId: // value for 'deleteInvoiceId'
 *   },
 * });
 */
export function useDeleteInvoiceMutation(baseOptions?: Apollo.MutationHookOptions<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>(DeleteInvoiceDocument, options);
}
export type DeleteInvoiceMutationHookResult = ReturnType<typeof useDeleteInvoiceMutation>;
export type DeleteInvoiceMutationResult = Apollo.MutationResult<DeleteInvoiceMutation>;
export type DeleteInvoiceMutationOptions = Apollo.BaseMutationOptions<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>;
export const AddPaymentDocument = gql`
    mutation AddPayment($input: AddPaymentInput!) {
  addPaymentToInvoice(input: $input) {
    amount
  }
}
    `;
export type AddPaymentMutationFn = Apollo.MutationFunction<AddPaymentMutation, AddPaymentMutationVariables>;

/**
 * __useAddPaymentMutation__
 *
 * To run a mutation, you first call `useAddPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPaymentMutation, { data, loading, error }] = useAddPaymentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddPaymentMutation(baseOptions?: Apollo.MutationHookOptions<AddPaymentMutation, AddPaymentMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AddPaymentMutation, AddPaymentMutationVariables>(AddPaymentDocument, options);
}
export type AddPaymentMutationHookResult = ReturnType<typeof useAddPaymentMutation>;
export type AddPaymentMutationResult = Apollo.MutationResult<AddPaymentMutation>;
export type AddPaymentMutationOptions = Apollo.BaseMutationOptions<AddPaymentMutation, AddPaymentMutationVariables>;
export const CreateProductDocument = gql`
    mutation CreateProduct($data: ProductInput!) {
  createProduct(data: $data) {
    id
    name
    retailPrice
    wholesalePrice
    boxRetailPrice
    boxWholesalePrice
    costPrice
    unitName
    boxUnitName
    pcsPerBox
    hasBoxes
    lowStockAlert
    categoryId
    imageUrl
    createdAt
    updatedAt
  }
}
    `;
export type CreateProductMutationFn = Apollo.MutationFunction<CreateProductMutation, CreateProductMutationVariables>;

/**
 * __useCreateProductMutation__
 *
 * To run a mutation, you first call `useCreateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProductMutation, { data, loading, error }] = useCreateProductMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateProductMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductMutation, CreateProductMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateProductMutation, CreateProductMutationVariables>(CreateProductDocument, options);
}
export type CreateProductMutationHookResult = ReturnType<typeof useCreateProductMutation>;
export type CreateProductMutationResult = Apollo.MutationResult<CreateProductMutation>;
export type CreateProductMutationOptions = Apollo.BaseMutationOptions<CreateProductMutation, CreateProductMutationVariables>;
export const UpdateProductDocument = gql`
    mutation UpdateProduct($id: Int!, $data: ProductInput!) {
  updateProduct(id: $id, data: $data) {
    id
    name
    retailPrice
    wholesalePrice
    boxRetailPrice
    boxWholesalePrice
    costPrice
    unitName
    boxUnitName
    pcsPerBox
    hasBoxes
    lowStockAlert
    categoryId
    imageUrl
    createdAt
    updatedAt
  }
}
    `;
export type UpdateProductMutationFn = Apollo.MutationFunction<UpdateProductMutation, UpdateProductMutationVariables>;

/**
 * __useUpdateProductMutation__
 *
 * To run a mutation, you first call `useUpdateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProductMutation, { data, loading, error }] = useUpdateProductMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateProductMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductMutation, UpdateProductMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateProductMutation, UpdateProductMutationVariables>(UpdateProductDocument, options);
}
export type UpdateProductMutationHookResult = ReturnType<typeof useUpdateProductMutation>;
export type UpdateProductMutationResult = Apollo.MutationResult<UpdateProductMutation>;
export type UpdateProductMutationOptions = Apollo.BaseMutationOptions<UpdateProductMutation, UpdateProductMutationVariables>;
export const DeleteProductDocument = gql`
    mutation DeleteProduct($id: Int!) {
  deleteProduct(id: $id)
}
    `;
export type DeleteProductMutationFn = Apollo.MutationFunction<DeleteProductMutation, DeleteProductMutationVariables>;

/**
 * __useDeleteProductMutation__
 *
 * To run a mutation, you first call `useDeleteProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProductMutation, { data, loading, error }] = useDeleteProductMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProductMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductMutation, DeleteProductMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteProductMutation, DeleteProductMutationVariables>(DeleteProductDocument, options);
}
export type DeleteProductMutationHookResult = ReturnType<typeof useDeleteProductMutation>;
export type DeleteProductMutationResult = Apollo.MutationResult<DeleteProductMutation>;
export type DeleteProductMutationOptions = Apollo.BaseMutationOptions<DeleteProductMutation, DeleteProductMutationVariables>;
export const BulkAdjustStockDocument = gql`
    mutation BulkAdjustStock($userId: Int, $items: [AdjustStockItemInput!]!) {
  bulkAdjustStock(userId: $userId, items: $items) {
    updated {
      productId
      quantity
      updatedAt
    }
  }
}
    `;
export type BulkAdjustStockMutationFn = Apollo.MutationFunction<BulkAdjustStockMutation, BulkAdjustStockMutationVariables>;

/**
 * __useBulkAdjustStockMutation__
 *
 * To run a mutation, you first call `useBulkAdjustStockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkAdjustStockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkAdjustStockMutation, { data, loading, error }] = useBulkAdjustStockMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      items: // value for 'items'
 *   },
 * });
 */
export function useBulkAdjustStockMutation(baseOptions?: Apollo.MutationHookOptions<BulkAdjustStockMutation, BulkAdjustStockMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<BulkAdjustStockMutation, BulkAdjustStockMutationVariables>(BulkAdjustStockDocument, options);
}
export type BulkAdjustStockMutationHookResult = ReturnType<typeof useBulkAdjustStockMutation>;
export type BulkAdjustStockMutationResult = Apollo.MutationResult<BulkAdjustStockMutation>;
export type BulkAdjustStockMutationOptions = Apollo.BaseMutationOptions<BulkAdjustStockMutation, BulkAdjustStockMutationVariables>;
export const CategoriesDocument = gql`
    query Categories {
  categories {
    name
    id
  }
}
    `;

/**
 * __useCategoriesQuery__
 *
 * To run a query within a React component, call `useCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
}
export function useCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
}
export function useCategoriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
}
export type CategoriesQueryHookResult = ReturnType<typeof useCategoriesQuery>;
export type CategoriesLazyQueryHookResult = ReturnType<typeof useCategoriesLazyQuery>;
export type CategoriesSuspenseQueryHookResult = ReturnType<typeof useCategoriesSuspenseQuery>;
export type CategoriesQueryResult = Apollo.QueryResult<CategoriesQuery, CategoriesQueryVariables>;
export const CustomersDocument = gql`
    query Customers {
  customers {
    id
    name
    phone
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useCustomersQuery__
 *
 * To run a query within a React component, call `useCustomersQuery` and pass it any options that fit your needs.
 * When your component renders, `useCustomersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCustomersQuery({
 *   variables: {
 *   },
 * });
 */
export function useCustomersQuery(baseOptions?: Apollo.QueryHookOptions<CustomersQuery, CustomersQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<CustomersQuery, CustomersQueryVariables>(CustomersDocument, options);
}
export function useCustomersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CustomersQuery, CustomersQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<CustomersQuery, CustomersQueryVariables>(CustomersDocument, options);
}
export function useCustomersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CustomersQuery, CustomersQueryVariables>) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<CustomersQuery, CustomersQueryVariables>(CustomersDocument, options);
}
export type CustomersQueryHookResult = ReturnType<typeof useCustomersQuery>;
export type CustomersLazyQueryHookResult = ReturnType<typeof useCustomersLazyQuery>;
export type CustomersSuspenseQueryHookResult = ReturnType<typeof useCustomersSuspenseQuery>;
export type CustomersQueryResult = Apollo.QueryResult<CustomersQuery, CustomersQueryVariables>;
export const GetInvoicesDocument = gql`
    query GetInvoices($filter: InvoiceFilterInput) {
  invoices(filter: $filter) {
    ...InvoiceFields
  }
}
    ${InvoiceFieldsFragmentDoc}`;

/**
 * __useGetInvoicesQuery__
 *
 * To run a query within a React component, call `useGetInvoicesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInvoicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInvoicesQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetInvoicesQuery(baseOptions?: Apollo.QueryHookOptions<GetInvoicesQuery, GetInvoicesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetInvoicesQuery, GetInvoicesQueryVariables>(GetInvoicesDocument, options);
}
export function useGetInvoicesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInvoicesQuery, GetInvoicesQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetInvoicesQuery, GetInvoicesQueryVariables>(GetInvoicesDocument, options);
}
export function useGetInvoicesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetInvoicesQuery, GetInvoicesQueryVariables>) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<GetInvoicesQuery, GetInvoicesQueryVariables>(GetInvoicesDocument, options);
}
export type GetInvoicesQueryHookResult = ReturnType<typeof useGetInvoicesQuery>;
export type GetInvoicesLazyQueryHookResult = ReturnType<typeof useGetInvoicesLazyQuery>;
export type GetInvoicesSuspenseQueryHookResult = ReturnType<typeof useGetInvoicesSuspenseQuery>;
export type GetInvoicesQueryResult = Apollo.QueryResult<GetInvoicesQuery, GetInvoicesQueryVariables>;
export const AddPaymentToInvoiceDocument = gql`
    mutation AddPaymentToInvoice($input: AddPaymentInput!) {
  addPaymentToInvoice(input: $input) {
    ...PaymentFields
  }
}
    ${PaymentFieldsFragmentDoc}`;
export type AddPaymentToInvoiceMutationFn = Apollo.MutationFunction<AddPaymentToInvoiceMutation, AddPaymentToInvoiceMutationVariables>;

/**
 * __useAddPaymentToInvoiceMutation__
 *
 * To run a mutation, you first call `useAddPaymentToInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPaymentToInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPaymentToInvoiceMutation, { data, loading, error }] = useAddPaymentToInvoiceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddPaymentToInvoiceMutation(baseOptions?: Apollo.MutationHookOptions<AddPaymentToInvoiceMutation, AddPaymentToInvoiceMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AddPaymentToInvoiceMutation, AddPaymentToInvoiceMutationVariables>(AddPaymentToInvoiceDocument, options);
}
export type AddPaymentToInvoiceMutationHookResult = ReturnType<typeof useAddPaymentToInvoiceMutation>;
export type AddPaymentToInvoiceMutationResult = Apollo.MutationResult<AddPaymentToInvoiceMutation>;
export type AddPaymentToInvoiceMutationOptions = Apollo.BaseMutationOptions<AddPaymentToInvoiceMutation, AddPaymentToInvoiceMutationVariables>;
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    token
    user {
      id
      display_name
      username
      role
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const GetProductsDocument = gql`
    query GetProducts($page: Int, $limit: Int) {
  products(page: $page, limit: $limit) {
    items {
      id
      name
      retailPrice
      wholesalePrice
      boxRetailPrice
      boxWholesalePrice
      unitName
      boxUnitName
      pcsPerBox
      hasBoxes
      costPrice
      imageUrl
      unitBarCode
      boxBarCode
      qrCode
      lowStockAlert
      categoryId
      category {
        id
        name
      }
      stock {
        quantity
      }
      createdAt
      updatedAt
    }
    totalCount
  }
}
    `;

/**
 * __useGetProductsQuery__
 *
 * To run a query within a React component, call `useGetProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetProductsQuery(baseOptions?: Apollo.QueryHookOptions<GetProductsQuery, GetProductsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, options);
}
export function useGetProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProductsQuery, GetProductsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, options);
}
export function useGetProductsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProductsQuery, GetProductsQueryVariables>) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, options);
}
export type GetProductsQueryHookResult = ReturnType<typeof useGetProductsQuery>;
export type GetProductsLazyQueryHookResult = ReturnType<typeof useGetProductsLazyQuery>;
export type GetProductsSuspenseQueryHookResult = ReturnType<typeof useGetProductsSuspenseQuery>;
export type GetProductsQueryResult = Apollo.QueryResult<GetProductsQuery, GetProductsQueryVariables>;
export const SearchProductsDocument = gql`
    query SearchProducts($search: String, $limit: Int) {
  products(search: $search, limit: $limit) {
    items {
      id
      name
      retailPrice
      wholesalePrice
      boxRetailPrice
      boxWholesalePrice
      unitName
      boxUnitName
      pcsPerBox
      hasBoxes
      costPrice
      stock {
        quantity
      }
    }
  }
}
    `;

/**
 * __useSearchProductsQuery__
 *
 * To run a query within a React component, call `useSearchProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchProductsQuery({
 *   variables: {
 *      search: // value for 'search'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSearchProductsQuery(baseOptions?: Apollo.QueryHookOptions<SearchProductsQuery, SearchProductsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SearchProductsQuery, SearchProductsQueryVariables>(SearchProductsDocument, options);
}
export function useSearchProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchProductsQuery, SearchProductsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SearchProductsQuery, SearchProductsQueryVariables>(SearchProductsDocument, options);
}
export function useSearchProductsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchProductsQuery, SearchProductsQueryVariables>) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<SearchProductsQuery, SearchProductsQueryVariables>(SearchProductsDocument, options);
}
export type SearchProductsQueryHookResult = ReturnType<typeof useSearchProductsQuery>;
export type SearchProductsLazyQueryHookResult = ReturnType<typeof useSearchProductsLazyQuery>;
export type SearchProductsSuspenseQueryHookResult = ReturnType<typeof useSearchProductsSuspenseQuery>;
export type SearchProductsQueryResult = Apollo.QueryResult<SearchProductsQuery, SearchProductsQueryVariables>;
export const LowStockProductsDocument = gql`
    query LowStockProducts {
  lowStockProducts {
    name
    stock {
      quantity
    }
    category {
      name
    }
    lowStockAlert
  }
}
    `;

/**
 * __useLowStockProductsQuery__
 *
 * To run a query within a React component, call `useLowStockProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLowStockProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLowStockProductsQuery({
 *   variables: {
 *   },
 * });
 */
export function useLowStockProductsQuery(baseOptions?: Apollo.QueryHookOptions<LowStockProductsQuery, LowStockProductsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<LowStockProductsQuery, LowStockProductsQueryVariables>(LowStockProductsDocument, options);
}
export function useLowStockProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LowStockProductsQuery, LowStockProductsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<LowStockProductsQuery, LowStockProductsQueryVariables>(LowStockProductsDocument, options);
}
export function useLowStockProductsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LowStockProductsQuery, LowStockProductsQueryVariables>) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<LowStockProductsQuery, LowStockProductsQueryVariables>(LowStockProductsDocument, options);
}
export type LowStockProductsQueryHookResult = ReturnType<typeof useLowStockProductsQuery>;
export type LowStockProductsLazyQueryHookResult = ReturnType<typeof useLowStockProductsLazyQuery>;
export type LowStockProductsSuspenseQueryHookResult = ReturnType<typeof useLowStockProductsSuspenseQuery>;
export type LowStockProductsQueryResult = Apollo.QueryResult<LowStockProductsQuery, LowStockProductsQueryVariables>;
export const StockMovementReportDocument = gql`
    query StockMovementReport($startDate: DateTime, $endDate: DateTime, $categoryId: Int) {
  stockMovementReport(
    startDate: $startDate
    endDate: $endDate
    categoryId: $categoryId
  ) {
    id
    productId
    changeQuantity
    reason
    createdAt
    logType
    product {
      name
    }
  }
}
    `;

/**
 * __useStockMovementReportQuery__
 *
 * To run a query within a React component, call `useStockMovementReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useStockMovementReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStockMovementReportQuery({
 *   variables: {
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *      categoryId: // value for 'categoryId'
 *   },
 * });
 */
export function useStockMovementReportQuery(baseOptions?: Apollo.QueryHookOptions<StockMovementReportQuery, StockMovementReportQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<StockMovementReportQuery, StockMovementReportQueryVariables>(StockMovementReportDocument, options);
}
export function useStockMovementReportLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StockMovementReportQuery, StockMovementReportQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<StockMovementReportQuery, StockMovementReportQueryVariables>(StockMovementReportDocument, options);
}
export function useStockMovementReportSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<StockMovementReportQuery, StockMovementReportQueryVariables>) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<StockMovementReportQuery, StockMovementReportQueryVariables>(StockMovementReportDocument, options);
}
export type StockMovementReportQueryHookResult = ReturnType<typeof useStockMovementReportQuery>;
export type StockMovementReportLazyQueryHookResult = ReturnType<typeof useStockMovementReportLazyQuery>;
export type StockMovementReportSuspenseQueryHookResult = ReturnType<typeof useStockMovementReportSuspenseQuery>;
export type StockMovementReportQueryResult = Apollo.QueryResult<StockMovementReportQuery, StockMovementReportQueryVariables>;
export const OutOfStockProductsDocument = gql`
    query OutOfStockProducts($categoryId: Int) {
  outOfStockProducts(categoryId: $categoryId) {
    id
    name
    category {
      id
      name
    }
    stock {
      quantity
    }
  }
}
    `;

/**
 * __useOutOfStockProductsQuery__
 *
 * To run a query within a React component, call `useOutOfStockProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOutOfStockProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOutOfStockProductsQuery({
 *   variables: {
 *      categoryId: // value for 'categoryId'
 *   },
 * });
 */
export function useOutOfStockProductsQuery(baseOptions?: Apollo.QueryHookOptions<OutOfStockProductsQuery, OutOfStockProductsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<OutOfStockProductsQuery, OutOfStockProductsQueryVariables>(OutOfStockProductsDocument, options);
}
export function useOutOfStockProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OutOfStockProductsQuery, OutOfStockProductsQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<OutOfStockProductsQuery, OutOfStockProductsQueryVariables>(OutOfStockProductsDocument, options);
}
export function useOutOfStockProductsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<OutOfStockProductsQuery, OutOfStockProductsQueryVariables>) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<OutOfStockProductsQuery, OutOfStockProductsQueryVariables>(OutOfStockProductsDocument, options);
}
export type OutOfStockProductsQueryHookResult = ReturnType<typeof useOutOfStockProductsQuery>;
export type OutOfStockProductsLazyQueryHookResult = ReturnType<typeof useOutOfStockProductsLazyQuery>;
export type OutOfStockProductsSuspenseQueryHookResult = ReturnType<typeof useOutOfStockProductsSuspenseQuery>;
export type OutOfStockProductsQueryResult = Apollo.QueryResult<OutOfStockProductsQuery, OutOfStockProductsQueryVariables>;