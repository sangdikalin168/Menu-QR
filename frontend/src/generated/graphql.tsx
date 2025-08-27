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
  Upload: { input: any; output: any; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String']['output'];
  refreshToken?: Maybe<Scalars['String']['output']>;
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CategoryInput = {
  name: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCategory: Category;
  createProduct: Product;
  deleteCategory: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  login: AuthPayload;
  refreshToken: AuthPayload;
  updateCategory: Category;
  updateProduct: Product;
  uploadProductImage: Scalars['String']['output'];
};


export type MutationCreateCategoryArgs = {
  input: CategoryInput;
};


export type MutationCreateProductArgs = {
  file?: InputMaybe<Scalars['Upload']['input']>;
  input: ProductInput;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRefreshTokenArgs = {
  refreshToken?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateCategoryArgs = {
  id: Scalars['ID']['input'];
  input: CategoryInput;
};


export type MutationUpdateProductArgs = {
  file?: InputMaybe<Scalars['Upload']['input']>;
  id: Scalars['ID']['input'];
  input: ProductInput;
};


export type MutationUploadProductImageArgs = {
  file: Scalars['Upload']['input'];
};

export type Permission = {
  __typename?: 'Permission';
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type Product = {
  __typename?: 'Product';
  categories: Array<Category>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
};

export type ProductInput = {
  categories: Array<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
};

export type Query = {
  __typename?: 'Query';
  categories: Array<Category>;
  me?: Maybe<User>;
  product?: Maybe<Product>;
  products: Array<Product>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryProductArgs = {
  id: Scalars['ID']['input'];
};

export type Role = {
  __typename?: 'Role';
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  permissions: Array<Permission>;
  updatedAt: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  display_name?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  password: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  role: Role;
  updatedAt: Scalars['String']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

export type CreateCategoryMutationVariables = Exact<{
  input: CategoryInput;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'Category', id: number, name: string } };

export type CreateProductMutationVariables = Exact<{
  input: ProductInput;
  file?: InputMaybe<Scalars['Upload']['input']>;
}>;


export type CreateProductMutation = { __typename?: 'Mutation', createProduct: { __typename?: 'Product', id: number, name: string, price: number, image?: string | null, categories: Array<{ __typename?: 'Category', id: number, name: string }> } };

export type UpdateProductMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: ProductInput;
  file?: InputMaybe<Scalars['Upload']['input']>;
}>;


export type UpdateProductMutation = { __typename?: 'Mutation', updateProduct: { __typename: 'Product', id: number, name: string, price: number, image?: string | null, categories: Array<{ __typename: 'Category', id: number, name: string }> } };

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteProductMutation = { __typename?: 'Mutation', deleteProduct: boolean };

export type UploadProductImageMutationVariables = Exact<{
  file: Scalars['Upload']['input'];
}>;


export type UploadProductImageMutation = { __typename?: 'Mutation', uploadProductImage: string };

export type CategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: number, name: string }> };

export type ProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type ProductsQuery = { __typename?: 'Query', products: Array<{ __typename?: 'Product', id: number, name: string, price: number, image?: string | null, categories: Array<{ __typename?: 'Category', id: number, name: string }> }> };

export type ProductQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ProductQuery = { __typename?: 'Query', product?: { __typename?: 'Product', id: number, name: string, price: number, image?: string | null, categories: Array<{ __typename?: 'Category', id: number, name: string }> } | null };


export const CreateCategoryDocument = gql`
    mutation CreateCategory($input: CategoryInput!) {
  createCategory(input: $input) {
    id
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
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateCategoryMutation, CreateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCategoryMutation, CreateCategoryMutationVariables>(CreateCategoryDocument, options);
      }
export type CreateCategoryMutationHookResult = ReturnType<typeof useCreateCategoryMutation>;
export type CreateCategoryMutationResult = Apollo.MutationResult<CreateCategoryMutation>;
export type CreateCategoryMutationOptions = Apollo.BaseMutationOptions<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const CreateProductDocument = gql`
    mutation CreateProduct($input: ProductInput!, $file: Upload) {
  createProduct(input: $input, file: $file) {
    id
    name
    price
    categories {
      id
      name
    }
    image
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
 *      input: // value for 'input'
 *      file: // value for 'file'
 *   },
 * });
 */
export function useCreateProductMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductMutation, CreateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductMutation, CreateProductMutationVariables>(CreateProductDocument, options);
      }
export type CreateProductMutationHookResult = ReturnType<typeof useCreateProductMutation>;
export type CreateProductMutationResult = Apollo.MutationResult<CreateProductMutation>;
export type CreateProductMutationOptions = Apollo.BaseMutationOptions<CreateProductMutation, CreateProductMutationVariables>;
export const UpdateProductDocument = gql`
    mutation UpdateProduct($id: ID!, $input: ProductInput!, $file: Upload) {
  updateProduct(id: $id, input: $input, file: $file) {
    id
    name
    price
    categories {
      id
      name
      __typename
    }
    image
    __typename
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
 *      input: // value for 'input'
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUpdateProductMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProductMutation, UpdateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProductMutation, UpdateProductMutationVariables>(UpdateProductDocument, options);
      }
export type UpdateProductMutationHookResult = ReturnType<typeof useUpdateProductMutation>;
export type UpdateProductMutationResult = Apollo.MutationResult<UpdateProductMutation>;
export type UpdateProductMutationOptions = Apollo.BaseMutationOptions<UpdateProductMutation, UpdateProductMutationVariables>;
export const DeleteProductDocument = gql`
    mutation DeleteProduct($id: ID!) {
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductMutation, DeleteProductMutationVariables>(DeleteProductDocument, options);
      }
export type DeleteProductMutationHookResult = ReturnType<typeof useDeleteProductMutation>;
export type DeleteProductMutationResult = Apollo.MutationResult<DeleteProductMutation>;
export type DeleteProductMutationOptions = Apollo.BaseMutationOptions<DeleteProductMutation, DeleteProductMutationVariables>;
export const UploadProductImageDocument = gql`
    mutation UploadProductImage($file: Upload!) {
  uploadProductImage(file: $file)
}
    `;
export type UploadProductImageMutationFn = Apollo.MutationFunction<UploadProductImageMutation, UploadProductImageMutationVariables>;

/**
 * __useUploadProductImageMutation__
 *
 * To run a mutation, you first call `useUploadProductImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadProductImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadProductImageMutation, { data, loading, error }] = useUploadProductImageMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadProductImageMutation(baseOptions?: Apollo.MutationHookOptions<UploadProductImageMutation, UploadProductImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadProductImageMutation, UploadProductImageMutationVariables>(UploadProductImageDocument, options);
      }
export type UploadProductImageMutationHookResult = ReturnType<typeof useUploadProductImageMutation>;
export type UploadProductImageMutationResult = Apollo.MutationResult<UploadProductImageMutation>;
export type UploadProductImageMutationOptions = Apollo.BaseMutationOptions<UploadProductImageMutation, UploadProductImageMutationVariables>;
export const CategoriesDocument = gql`
    query Categories {
  categories {
    id
    name
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
      }
export function useCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
        }
export function useCategoriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
        }
export type CategoriesQueryHookResult = ReturnType<typeof useCategoriesQuery>;
export type CategoriesLazyQueryHookResult = ReturnType<typeof useCategoriesLazyQuery>;
export type CategoriesSuspenseQueryHookResult = ReturnType<typeof useCategoriesSuspenseQuery>;
export type CategoriesQueryResult = Apollo.QueryResult<CategoriesQuery, CategoriesQueryVariables>;
export const ProductsDocument = gql`
    query Products {
  products {
    id
    name
    price
    categories {
      id
      name
    }
    image
  }
}
    `;

/**
 * __useProductsQuery__
 *
 * To run a query within a React component, call `useProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductsQuery({
 *   variables: {
 *   },
 * });
 */
export function useProductsQuery(baseOptions?: Apollo.QueryHookOptions<ProductsQuery, ProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductsQuery, ProductsQueryVariables>(ProductsDocument, options);
      }
export function useProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductsQuery, ProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductsQuery, ProductsQueryVariables>(ProductsDocument, options);
        }
export function useProductsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProductsQuery, ProductsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ProductsQuery, ProductsQueryVariables>(ProductsDocument, options);
        }
export type ProductsQueryHookResult = ReturnType<typeof useProductsQuery>;
export type ProductsLazyQueryHookResult = ReturnType<typeof useProductsLazyQuery>;
export type ProductsSuspenseQueryHookResult = ReturnType<typeof useProductsSuspenseQuery>;
export type ProductsQueryResult = Apollo.QueryResult<ProductsQuery, ProductsQueryVariables>;
export const ProductDocument = gql`
    query Product($id: ID!) {
  product(id: $id) {
    id
    name
    price
    categories {
      id
      name
    }
    image
  }
}
    `;

/**
 * __useProductQuery__
 *
 * To run a query within a React component, call `useProductQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProductQuery(baseOptions: Apollo.QueryHookOptions<ProductQuery, ProductQueryVariables> & ({ variables: ProductQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductQuery, ProductQueryVariables>(ProductDocument, options);
      }
export function useProductLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductQuery, ProductQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductQuery, ProductQueryVariables>(ProductDocument, options);
        }
export function useProductSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProductQuery, ProductQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ProductQuery, ProductQueryVariables>(ProductDocument, options);
        }
export type ProductQueryHookResult = ReturnType<typeof useProductQuery>;
export type ProductLazyQueryHookResult = ReturnType<typeof useProductLazyQuery>;
export type ProductSuspenseQueryHookResult = ReturnType<typeof useProductSuspenseQuery>;
export type ProductQueryResult = Apollo.QueryResult<ProductQuery, ProductQueryVariables>;