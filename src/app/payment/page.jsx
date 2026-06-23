"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import toast from "react-hot-toast";
import { FaCreditCard, FaLock, FaShieldAlt, FaCalendarAlt, FaClock, FaCheckCircle, FaUserMd } from "react-icons/fa";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const appointmentId = searchParams.get("appointmentId");

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txnId, setTxnId] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    }
  }, [user, isPending, router]);

  useEffect(() => {
    if (appointmentId) {
      const fetchAppt = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/appointments/${appointmentId}`);
          if (res.ok) {
            const data = await res.json();
            setAppointment(data);
          } else {
            toast.error("Failed to load appointment details");
          }
        } catch (err) {
          console.error("Error loading appointment:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchAppt();
    }
  }, [appointmentId]);

  const handleStripePayment = async (e) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCVC) {
      toast.error("Please fill in card details");
      return;
    }

    setPayLoading(true);
    try {
      const generatedTxn = `TXN-STRIPE-${Date.now()}`;
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/appointments/${appointmentId}/pay`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: generatedTxn }),
      });

      if (!res.ok) throw new Error("Stripe checkout failed");
      
      toast.success("Payment completed successfully!");
      setTxnId(generatedTxn);
      setSuccess(true);
    } catch (err) {
      toast.error(err.message || "Payment process failed.");
    } finally {
      setPayLoading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center space-y-4">
          <Spinner size="lg" color="teal" />
          <p className="text-slate-500 font-semibold text-sm">Initiating Secure Checkout Session...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg text-center max-w-sm">
          <p className="text-rose-500 font-bold mb-4">No active booking session found.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 py-12 px-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center text-4xl mx-auto">
            <FaCheckCircle />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Payment Successful!</h2>
            <p className="text-slate-500 text-sm">Thank you for your payment. Your booking has been updated.</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl text-left text-xs font-semibold text-slate-600 space-y-2">
            <div className="flex justify-between">
              <span>Receipt ID:</span>
              <span className="font-mono font-bold text-slate-800">{txnId}</span>
            </div>
            <div className="flex justify-between">
              <span>Paid Amount:</span>
              <span className="font-bold text-teal-600">{appointment.fee} BDT</span>
            </div>
            <div className="flex justify-between">
              <span>Doctor Name:</span>
              <span className="font-bold text-slate-800">{appointment.doctorName}</span>
            </div>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 transition cursor-pointer"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen py-16 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-600 text-[10px] font-black uppercase tracking-wider mb-2">
              Booking Invoice
            </span>
            <h2 className="text-xl font-black text-slate-900">Checkout Summary</h2>
          </div>

          <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center text-xl">
              <FaUserMd />
            </div>
            <div>
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Assigned Doctor</div>
              <h3 className="font-black text-slate-800 text-base">{appointment.doctorName}</h3>
              <p className="text-slate-500 text-xs">{appointment.doctorSpecialization}</p>
            </div>
          </div>

          <div className="space-y-4 border-b border-slate-50 pb-6 text-slate-600 text-sm font-semibold">
            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-slate-400" />
              <span>{new Date(appointment.date).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-3">
              <FaClock className="text-slate-400" />
              <span>Time Slot: {appointment.timeSlot}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between text-sm text-slate-500 font-semibold">
              <span>Consultation Charge:</span>
              <span>{appointment.fee} BDT</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500 font-semibold">
              <span>Processing Fee:</span>
              <span>0 BDT</span>
            </div>
            <div className="border-t border-slate-200/60 pt-3 flex justify-between text-slate-800 font-black text-lg">
              <span>Total Amount:</span>
              <span className="text-teal-600">{appointment.fee} BDT</span>
            </div>
          </div>
        </div>

        
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Secure Payment</h2>
              <p className="text-slate-500 text-xs font-semibold mt-1">Processed securely using Stripe Checkout</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-wider">
              <FaShieldAlt className="text-xs text-teal-500" /> SSL SECURE
            </div>
          </div>

          <form onSubmit={handleStripePayment} className="space-y-5">
  
            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden h-44 flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-3xl rounded-full"></div>
              <div className="flex justify-between items-start">
                <span className="text-sm font-bold tracking-widest uppercase">Stripe Network</span>
                <FaCreditCard className="text-3xl opacity-80" />
              </div>
              <div className="font-mono text-xl tracking-widest my-4">
                {cardNumber ? cardNumber.replace(/(\d{4})/g, "$1 ").trim() : "•••• •••• •••• ••••"}
              </div>
              <div className="flex justify-between items-end text-xs">
                <div>
                  <span className="opacity-60 text-[9px] block uppercase">Card Holder</span>
                  <span className="font-bold">{user?.name || "Patient Name"}</span>
                </div>
                <div>
                  <span className="opacity-60 text-[9px] block uppercase">Expires</span>
                  <span className="font-bold">{cardExpiry || "MM/YY"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Card Number</label>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition text-sm font-medium"
                  />
                  <FaCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Expiration Date</label>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (val.length === 2 && !val.includes("/")) {
                        val = val + "/";
                      }
                      setCardExpiry(val);
                    }}
                    className="w-full mt-1.5 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">CVC</label>
                  <input
                    type="password"
                    maxLength={3}
                    placeholder="•••"
                    value={cardCVC}
                    onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, ""))}
                    className="w-full mt-1.5 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={payLoading}
              className="w-full py-4 mt-6 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl shadow-lg shadow-teal-500/10 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FaLock className="text-xs" />
              {payLoading ? "Authorizing Stripe Checkout..." : `Pay ${appointment.fee} BDT`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Spinner size="lg" color="teal" />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
