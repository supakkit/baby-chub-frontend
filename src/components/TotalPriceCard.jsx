import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function TotalPriceCard() {
    return (
        <div className="grid gap-8 text-primary">
            <div className="flex justify-between w-full items-center gap-2">
                <Input type="text" placeholder="Input promotion code" className="w-3/5" />
                <Button type="submit" variant="outline" className="w-1/5">
                    Apply
                </Button>    
            </div>
            <div class="flex justify-between items-center h-11 ">
                <p>Subtotal</p>
                <p>99 THB</p>   
            </div>
            <div class="flex justify-between items-center h-11 border-t-2">
                <p>DIscount</p>
                <p>-20 THB</p>    
            </div>
            <div class="flex justify-between h-11 font-semibold text-3xl xl:text-4xl">
                <p>4 Items</p>
                <p>Total 386 THB</p>    
            </div>
            <Button variant="default" className="w-xs justify-self-end">
                Checkout
            </Button>
        </div>
    );
}