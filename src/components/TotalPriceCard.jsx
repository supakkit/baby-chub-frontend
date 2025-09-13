import { useContext, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ApplyDiscountContext } from "../context/ApplyDiscountContext";

export function TotalPriceCard({ children, products }) {
    const {
        promotionForm, 
        setPromotionForm, 
        discount,
        promoApplyStatus, 
        setPromoApplyStatus,
        subTotalPrice, 
        totalPrice, 
        applyPromotionCode, 
        calSubTotalPrice
    } = useContext(ApplyDiscountContext);
    
    useEffect(() => {
        applyPromotionCode(promotionForm, calSubTotalPrice(products));
    }, [products]);

    return (
        <div className="w-full grid gap-4 text-primary">
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    applyPromotionCode(promotionForm, subTotalPrice);
                }}
            >
                <div className="flex justify-between items-start w-full gap-4">
                    <div className="w-full grid gap-1">
                        <Input 
                            type="text" 
                            placeholder="Input promotion code" 
                            name="promotionCode"
                            value={promotionForm}
                            onChange={(e) => {setPromotionForm(e.target.value);setPromoApplyStatus('') }}
                        />
                        {!(promotionForm?.length > 0) ? null
                            : discount > 0 ? <p className="pl-2 text-sm text-lime-500">{promoApplyStatus}</p>
                            : <p className="pl-2 text-sm text-red-300">{promoApplyStatus}</p>
                        }
                    </div>
                    
                    <Button type="submit" variant="outline" className="">
                        Apply
                    </Button>     
                </div>
            </form>
            <div className="flex justify-between items-center h-11 ">
                <p>Subtotal</p>
                <p>{subTotalPrice} THB</p>   
            </div>
            <div className="flex justify-between items-center h-11 border-secondary border-t-2">
                <p>Discount</p>
                <p>- {discount} THB</p>    
            </div>
            <div className="flex justify-between h-11 font-semibold text-xl xl:text-2xl">
                <p>{products.length} Items</p>
                <p>Total {totalPrice} THB</p>    
            </div>
            <Button asChild variant="default" className="w-xs justify-self-end">
                {children}
            </Button>
        </div>
    );
}