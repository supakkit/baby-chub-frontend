import { useState } from "react";
import { ApplyDiscountContext } from "./ApplyDiscountContext";
import { applyDiscount } from "../services/discountService";


export function ApplyDiscountProvider({ children }) {
    const [promotionForm, setPromotionForm] = useState('');
    const [discountInfo, setDiscountInfo] = useState();
    const [promoApplyStatus, setPromoApplyStatus] = useState('');
    const [subTotalPrice, setSubTotalPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    const checkPromotionCode = async (promoCode = '', subTotalPrice) => {
        try {
            const code = promoCode.toString().trim();
            const data = await applyDiscount(code);
            const discountInfo = data.discount;

            setDiscountInfo(discountInfo);
            applyPromotionCode(discountInfo, subTotalPrice);

        } catch (error) {
            console.error("Failed to check promotion code:",error);
        }
    };

    const applyPromotionCode = (discountInfo, subTotalPrice) => {
        try {
            let totalAmount = subTotalPrice;
            
            if (!discountInfo) {
                setPromoApplyStatus("The promotion code may have expired");
            } else if (subTotalPrice < discountInfo.minimumPurchaseAmount) {
                setPromoApplyStatus(`Buy at least ${discountInfo?.minimumPurchaseAmount} baht to use this promotion code`);
            } else {
                totalAmount = discountInfo.isPercent
                    ? Math.round(subTotalPrice * (1 - (discountInfo?.amount * 0.01)))
                    : Math.round(subTotalPrice - discountInfo?.amount);
                setPromoApplyStatus("The promotion code may have expired");
            }
            
            setTotalPrice(totalAmount);
        } catch (error) {
            console.error("Failed to apply promotion code:",error);
        }
    };

    const calSubTotalPrice = (products) => {
        const subTotalPrice = products.reduce((total, item) => total + item.prices[item.plan], 0);
        // console.log('subTotal:', subTotalPrice)
        setSubTotalPrice(subTotalPrice);
        return subTotalPrice;
    };

    return (
        <ApplyDiscountContext.Provider
            value={{
                promotionForm,
                setPromotionForm,
                promoApplyStatus,
                setPromoApplyStatus,
                subTotalPrice,
                totalPrice,
                checkPromotionCode,
                applyPromotionCode,
                calSubTotalPrice,
                discountInfo,
            }}
        >
            {children}
        </ApplyDiscountContext.Provider>
    );
}