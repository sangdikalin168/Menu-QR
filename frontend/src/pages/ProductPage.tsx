//src/pages/ProductPage.tsx
import { CrudTable } from '../components/shared/CrudTable';
import { useProduct } from '../hooks/useProduct';
import { useCategoriesQuery } from '../hooks/useCategories';
import { ProductForm } from '../components/product/ProductForm';
import type { Product } from '../generated/graphql';
import LoadingPage from '../components/ui/LoadingPage';


const ProductPage = () => {
    const columns = [
        { key: 'name', label: 'ឈ្មោះ' },
        {
            key: 'retailPrice',
            label: 'តម្លៃរាយ(Pcs)',
            render: (item: Product) => {
                return (
                    <>
                        {item.retailPrice ? item.retailPrice.toLocaleString() : <span className="text-gray-400">0</span>}៛
                    </>
                )
            }
        },
        {
            key: 'wholesalePrice', label: 'តម្លៃបោះដុំ(Pcs)',
            render: (item: Product) => {
                return (
                    <>
                        {item.wholesalePrice ? item.wholesalePrice.toLocaleString() : <span className="text-gray-400">0</span>}៛
                    </>
                )
            }
        },
        {
            key: 'unitName',
            label: 'ឯកតា',
            render: (item: Product) => item.unitName || '-',
        },
        {
            key: 'boxRetailPrice', label: 'តម្លៃរាយ(កេះ)',
            render: (item: Product) => {
                return (
                    <>
                        {item.boxRetailPrice ? item.boxRetailPrice.toLocaleString() : <span className="text-gray-400">0</span>}៛
                    </>
                )
            }
        },
        {
            key: 'boxWholesalePrice', label: 'តម្លៃបោះដុំ(កេះ)',
            render: (item: Product) => {
                return (
                    <>
                        {item.boxWholesalePrice ? item.boxWholesalePrice.toLocaleString() : <span className="text-gray-400">0</span>}៛
                    </>
                )
            }
        },
        { key: 'boxUnitName', label: 'ឯកតាជាកេះ' },
        {
            key: 'stock',
            label: 'ក្នុង-ស្តុក',
            render: (item: Product) => {
                const quantity = item.stock?.quantity ?? 0;
                return (
                    <>
                        {item.pcsPerBox && quantity >= item.pcsPerBox
                            ? `${Math.floor(quantity / item.pcsPerBox)} ${item.boxUnitName}`
                            : `${quantity} ${item.unitName}`}
                    </>
                );
            },
        },
        {
            key: 'category',
            label: 'ប្រភេទ',
            render: (item: Product) => item.category?.name || '-',
        },
    ];

    const crudProps = useProduct();
    const { loading, loadingCreate, loadingUpdate, loadingDelete } = crudProps;
    const categories = useCategoriesQuery();

    if (loading || categories.loading || loadingCreate || loadingUpdate || loadingDelete) {
        return <LoadingPage />;
    }

    return (
        <div className="w-full">
            <CrudTable
                {...crudProps}
                columns={columns}
                renderForm={(props) => (
                    <ProductForm
                        item={props.item}
                        onSubmit={async (values) => {
                            try {
                                props.onSubmit(values);
                                return { success: true };
                            } catch {
                                return { success: false };
                            }
                        }}
                        onClose={props.onClose}
                        categories={categories.data?.items || []}
                    />
                )}
                title="Products"
            />
        </div>
    );
};

export default ProductPage;