import { useEffect, useState } from "react";
import { ApplyDiscountContext } from "./ApplyDiscountContext";
import { applyDiscount } from "../services/discountService";


export function ApplyDiscountProvider({ children }) {
    const [promotionForm, setPromotionForm] = useState('');
    const [discount, setDiscount] = useState(0);
    const [promoApplyStatus, setPromoApplyStatus] = useState('');
    const [subTotalPrice, setSubTotalPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    // let totalPrice = subTotalPrice - discount;

    const applyPromotionCode = async (promoCode = '', subTotalPrice) => {
        try {
            const code = promoCode.toString().trim();
            const data = await applyDiscount(code);
            const discount = data.discount;
            let totalAmount = subTotalPrice;
            
            if (!discount) {
                setPromoApplyStatus("The promotion code may have expired");
            } else if (subTotalPrice < discount.minimumPurchaseAmount) {
                setPromoApplyStatus(`Buy at least ${discount.minimumPurchaseAmount} baht to use this discount code`);
            } else {
                totalAmount = discount.isPercent
                    ? Math.round(subTotalPrice * (1 - (discount.amount * 0.01)))
                    : Math.round(subTotalPrice - discount.amount);
                setPromoApplyStatus(data.message);
            }
            
            setDiscount(subTotalPrice - totalAmount);
            setTotalPrice(totalAmount);
        } catch (error) {
            console.error("Failed to apply discount:",error);
        }
        
    };

    const calSubTotalPrice = (products) => {
        const subTotalPrice = products.reduce((total, item) => total + item.prices[item.plan], 0);
        // console.log('subTotal:', subTotalPrice)
        setSubTotalPrice(subTotalPrice);
        return subTotalPrice;
    };

    useEffect(() => {
        setTotalPrice(subTotalPrice - discount);
    }, [subTotalPrice, discount]);

    return (
        <ApplyDiscountContext.Provider
            value={{
                promotionForm,
                setPromotionForm,
                discount,
                promoApplyStatus,
                setPromoApplyStatus,
                subTotalPrice,
                totalPrice,
                applyPromotionCode,
                calSubTotalPrice,
            }}
        >
            {children}
        </ApplyDiscountContext.Provider>
    );
}