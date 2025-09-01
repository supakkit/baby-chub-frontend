import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export function PendingPayment() {
    
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => navigate('/'), 5000);
    }, []);

    return (
        <div className="grid h-screen">
            <h2 className="pt-24 font-semibold text-3xl text-center text-primary">
                Pending Payment...
            </h2>
        </div>
    );
}