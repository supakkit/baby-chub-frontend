import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";

export function ProductFilter() {
    const { filters, handleProductFilter } = useContext(ProductContext);  // for testing

    return (
        <div className="grid gap-4">
            {Object.entries(filters).map((filterBy, index) => (
                <FilterComponent key={index} filterBy={filterBy} handleProductFilter={handleProductFilter} />
            ))}
        </div>
    );
}

function FilterComponent({ filterBy, handleProductFilter }) {
    const [filterTopic, filterOptions] = filterBy;

    const filterOptionList = (filterTopic, filterOption) => {
        switch (filterTopic.toLowerCase()) {
            case 'age':
                return `Ages ${filterOption.min}${Number.isFinite(filterOption.max) ? ` to ${filterOption.max}` : `+`}`;
            case 'type':
                return filterOption;
            case 'subject':
                return filterOption;
            case 'price':
                return `${filterOption.min}${Number.isFinite(filterOption.max) ? ` - ${filterOption.max}` : `+`} THB`;
            default:
                return null;
        }
    }

    return (
        <div>
            <p className="capitalize">{filterTopic}</p>
            <div className="grid gap-2">
                {filterOptions.map((filterOption, index) => (
                    <Label key={index} htmlFor={`${filterTopic}-filter-${index}`} className="capitalize">
                        <Checkbox 
                            id={`${filterTopic}-filter-${index}`} 
                            onCheckedChange={() => handleProductFilter( filterTopic, filterOption )}
                        />
                        {filterOptionList(filterTopic, filterOption)}
                    </Label>
                ))}    
            </div>
        </div>
    );
}
