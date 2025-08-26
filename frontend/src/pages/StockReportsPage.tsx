import { Fragment, useState } from 'react';
import { StockMovementReport } from './StockMovementReport';
import { LowStockReport } from './LowStockReport';
import { OutOfStockReport } from './OutOfStockReport';
import { DateRangePicker } from '../components/ui/date-range-picker';
import { CategorySelect } from '../components/ui/category-select';
import {
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from '@headlessui/react';
import { CountStockReport } from './CountStockReport';

const tabConfig = [
    { label: 'Stock Movement', value: 'movement' },
    { label: 'ជិតអស់', value: 'low' },
    { label: 'អស់ពីស្តុក', value: 'out' },
    { label: 'រាប់ស្តុក', value: 'count_stock' },
];

export const StockReportsPage = () => {
    const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Stock Reports</h1>

            <div className="flex flex-wrap gap-4 items-center">
                <DateRangePicker value={dateRange} onChange={setDateRange} />
                <CategorySelect value={selectedCategory} onChange={setSelectedCategory} />
            </div>

            <TabGroup selectedIndex={activeTab} onChange={setActiveTab} as={Fragment}>
                <TabList className="flex flex-wrap gap-2 border-b pb-2 mb-4">
                    {tabConfig.map((tab, index) => (
                        <Tab
                            key={tab.value}
                            className={({ selected }) =>
                                `px-4 py-2 rounded-t-md text-sm font-medium transition ${selected
                                    ? 'bg-blue-600 text-white shadow'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`
                            }
                        >
                            {tab.label}
                        </Tab>
                    ))}
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <StockMovementReport dateRange={dateRange} categoryId={selectedCategory} />
                    </TabPanel>
                    <TabPanel>
                        <LowStockReport categoryId={selectedCategory} />
                    </TabPanel>
                    <TabPanel>
                        <OutOfStockReport categoryId={selectedCategory} />
                    </TabPanel>
                    <TabPanel>
                        <CountStockReport categoryId={selectedCategory} dateRange={dateRange} />
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    );
};

