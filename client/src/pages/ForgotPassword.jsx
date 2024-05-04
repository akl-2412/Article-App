import { Alert } from "flowbite-react";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/user/userSlice";
import { Link } from "react-router-dom";
import { Spinner } from "flowbite-react";

function ForgotPassword() {
    const [formData, setFormData] = useState({});
    const [emailSent, setEmailSent] = useState(false);
    const [errorMessagepass, setErrorMessagePass] = useState(null);
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.user);

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email) {
            return;
        }
        try {
            dispatch(setLoading(true));
            setErrorMessagePass(null);
            const res = await fetch("/api/auth/reset-password-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(setLoading(false));
                setErrorMessagePass(data.message);
            }
            if (res.ok) {
                toast.success("Reset Email Sent");
                setEmailSent(true);
            }
        } catch (error) {
            setErrorMessagePass(error);
            toast.error("Failed to send email for resetting password");
        }
        dispatch(setLoading(false));
    };

    return (
        <div className="mx-auto">
            {loading ? (
                <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center spinner">
                    <Spinner />
                </div>
            ) : (
                <div className="mx-auto items-center justify-center w-full sm:w-1/2 mt-[150px] mb-[50px]">
                    <h1 className="text-center">{!emailSent ? "Reset your Password" : "Check Mail"}</h1>
                    <p className="text-center">
                        {!emailSent ? "We'll email you instructions to reset your password. If you don't have access to your email we can try account recovery" : `We have sent the reset email to ${formData.email}`}
                    </p>
                    <form onSubmit={handleOnSubmit} className="mt-5">
                        {!emailSent && (
                            <label className="block text-center">
                                <p>Email address</p>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value.trim() })}
                                    placeholder="Enter email address"
                                    className="form-style w-full rounded-md text-black"
                                />
                            </label>
                        )}
                        <button className="mt-6 w-full sm:w-auto rounded-[8px] bg-fuchsia-700 py-[12px] px-[12px] font-medium text-richblack-900">
                            {!emailSent ? "Submit" : "Resend Email"}
                        </button>
                    </form>
                    {errorMessagepass && (
                        <Alert className="mt-5" color="failure">
                            {errorMessagepass}
                        </Alert>
                    )}
                    <div className="mt-6 text-center">
                        <Link to="/sign-in" className="flex items-center justify-center gap-x-2 text-richblack-5">
                            <BiArrowBack /> Back To Login
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ForgotPassword;
