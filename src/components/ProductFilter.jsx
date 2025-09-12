
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { filters } from "../data/filters";

export function ProductFilter({ selectedFilters, setSelectedFilters, handleApplyFilter, clearFilter }) {

    const handleSelectFilter = (filterTopic, filterOption) => {
        const currentOptions = selectedFilters[filterTopic];
        const isSelected = JSON.stringify(currentOptions).includes(JSON.stringify(filterOption));
            
        if (isSelected) {
            setSelectedFilters({
                ...selectedFilters,
                [filterTopic]: selectedFilters[filterTopic].filter(item => JSON.stringify(item) !== JSON.stringify(filterOption))
            });
        } else {
            setSelectedFilters({
                ...selectedFilters,
                [filterTopic]: [
                    ...selectedFilters[filterTopic],
                    filterOption
                ]
            }); 
        }
    }

    const displayEachFilterOption = (filterTopic, filterOption) => {
        switch (filterTopic.toLowerCase()) {
            case 'age':
                return `Ages ${filterOption.min}${Number.isFinite(filterOption.max) ? ` to ${filterOption.max}` : `+`}`;
            case 'type':
            case 'subject':
                return filterOption;
            case 'price':
                return `${filterOption.min}${Number.isFinite(filterOption.max) ? ` - ${filterOption.max}` : `+`} THB`;
            default:
                return null;
        }
    };

    const isChecked = (filterTopic, filterOption) => {
        return selectedFilters[filterTopic].some(option => JSON.stringify(option) === JSON.stringify(filterOption));
    };

    return (
        <Card className="rounded-lg shadow-lg border-accent min-w-3xs">
            <div className="px-4 pb-4 gap-0 border-b border-accent">
                <div className="text-xl font-bold">Filters</div>
            </div>
            <CardContent className="px-4">
                <div className="flex justify-end gap-4 pb-2">
                    <Button variant="ghost" className="border-1 border-accent/50" onClick={clearFilter}>Clear</Button> 
                    <Button variant="outline" className="w-24" onClick={handleApplyFilter}>Apply</Button> 
                </div>
                <Accordion type="multiple" collapsible="true" className="w-full">
                    {Object.entries(filters).map(([filterTopic, filterOptions], index) => (
                        <AccordionItem key={index} value={filterTopic} className="border-b-1 border-accent">
                            <AccordionTrigger className="capitalize text-lg font-semibold py-2">
                                {filterTopic}
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4">
                                <div className="grid gap-2">
                                    {filterOptions.map((filterOption, index) => (
                                        <Label
                                            key={index} 
                                            htmlFor={`${filterTopic}-filter-${index}`} 
                                            className="flex items-center cursor-pointer capitalize h-12 px-2 border-1 border-accent rounded-xs hover:bg-muted/10"
                                        >
                                            <Checkbox 
                                                id={`${filterTopic}-filter-${index}`} 
                                                checked={isChecked(filterTopic, filterOption)}
                                                onCheckedChange={() => handleSelectFilter(filterTopic, filterOption)}
                                            />
                                            {displayEachFilterOption(filterTopic, filterOption)}
                                        </Label>
                                    ))}    
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}        
                </Accordion>
            </CardContent>
        </Card>
    );
}

