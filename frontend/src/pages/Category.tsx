
import { CrudTable } from '../components/shared/CrudTable';
import { CategoryForm } from '../components/product/CategoryForm';
import { useCategory } from '../hooks/useCategories';

const CategoryPage = () => {
    const columns = [
        { key: 'name', label: 'ឈ្មោះ' }
    ];
    const crudProps = useCategory()

    return (
        <div className="w-full">
            <CrudTable
                {...crudProps}
                columns={columns}
                renderForm={(props) => (
                    <CategoryForm
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
                    />
                )}
                title="Category"
            />
        </div>
    )

}

export default CategoryPage;