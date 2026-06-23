"use client";

import { authClient } from "@/lib/auth-client";
import { Spinner, Avatar } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaSearch, FaStethoscope, FaHospital, FaDollarSign, FaCalendarAlt, FaClock, FaStar, FaChevronRight, FaUserMd } from "react-icons/fa";

const SPECIALIZATIONS = [
  "All",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Neurologist",
  "General Physician",
  "Orthopedic",
  "Gynecologist"
];

function DoctorImage({ src, name, className }) {
  const [error, setError] = useState(!src);

  useEffect(() => {
    setError(!src);
  }, [src]);

  if (error) {
    return (
      <div className={`${className} bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-black text-xl select-none`}>
        {name?.[0]?.toUpperCase() || 'D'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={`${className} object-cover bg-teal-50`}
      onError={() => setError(true)}
    />
  );
}

export default function FindDoctorsPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("All");

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [symptoms, setSymptoms] = useState("General Consultation");
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const specQuery = specialization !== "All" ? `specialization=${specialization}` : "";
      const searchQuery = search ? `search=${search}` : "";
      const query = [specQuery, searchQuery].filter(Boolean).join("&");

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/doctors?${query}`);
      if (!response.ok) throw new Error("Failed to fetch doctors");
      const data = await response.json();
      setDoctors(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch doctors list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialization]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleOpenBooking = (doctor) => {
    if (!user) {
      toast.error("Please login to book an appointment.");
      router.push("/login");
      return;
    }
    if (user.role === "doctor") {
      toast.error("Doctors cannot book appointments. Only patients can.");
      return;
    }
    if (user.role === "admin") {
      toast.error("Admins cannot book appointments. Only patients can.");
      return;
    }
    setSelectedDoctor(doctor);
    setBookingDate("");
    setBookingTime("");
  };

  const handleBookAppointment = async () => {
    if (!user || user.role !== "patient") {
      toast.error("Only patients can book appointments.");
      return;
    }
    if (!bookingDate || !bookingTime) {
      toast.error("Please select both a date and a time slot.");
      return;
    }
    try {
      setBookingLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: user.id,
          patientName: user.name,
          patientEmail: user.email,
          doctorId: selectedDoctor.userId,
          doctorName: selectedDoctor.name,
          doctorSpecialization: selectedDoctor.specialization,
          date: bookingDate,
          timeSlot: bookingTime,
          fee: selectedDoctor.fee,
          symptoms: symptoms,
        }),
      });

      if (!response.ok) throw new Error("Failed to book appointment");

      const data = await response.json();
      const appointmentId = data.appointmentId;

      toast.success("Appointment created! Redirecting to secure Stripe checkout...");
      setSelectedDoctor(null);
      router.push(`/payment?appointmentId=${appointmentId}`);
    } catch (err) {
      console.error(err);
      toast.error("Error booking appointment. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const getAvailableSlotsForDate = (dateStr) => {
    if (!dateStr || !selectedDoctor) return [];
    const dateObj = new Date(dateStr);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const selectedDayName = dayNames[dateObj.getDay()];

    const scheduleForDay = selectedDoctor.schedules?.find(
      (s) => s.day.toLowerCase() === selectedDayName.toLowerCase()
    );
    return scheduleForDay ? scheduleForDay.timeSlots : [];
  };

  const getNextAvailableDates = () => {
    if (!selectedDoctor) return [];
    const hasSchedule = selectedDoctor.schedules && selectedDoctor.schedules.length > 0;
    const availableDays = hasSchedule ? selectedDoctor.schedules.map(s => s.day.toLowerCase()) : [];
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + i);
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayName = dayNames[futureDate.getDay()].toLowerCase();
      if (!hasSchedule || availableDays.includes(dayName)) {
        dates.push({
          value: futureDate.toISOString().split("T")[0],
          label: futureDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })
        });
      }
    }
    return dates;
  };

  const availableSlots = bookingDate ? getAvailableSlotsForDate(bookingDate) : [];

  return (
    <div className="flex-1 bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-600 text-sm font-semibold mb-4 uppercase tracking-wider">
            Premium Care
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Search & Book <span className="bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">Top Specialists</span>
          </h1>
          <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
            Find the right care at the right time. Browse verified doctors, read real patient reviews, and book online instantly.
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm mb-10">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <FaSearch />
              </span>
              <input
                type="text"
                placeholder="Search doctors by name, hospital, or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold rounded-2xl shadow-md shadow-teal-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              Search
            </button>
          </form>

          <div className="mt-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Specializations</h4>
            <div className="flex flex-wrap gap-2">
              {SPECIALIZATIONS.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSpecialization(spec)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${specialization === spec
                      ? "bg-teal-500 border-teal-500 text-white shadow-sm"
                      : "bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-600"
                    }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" color="teal" />
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
              🔍
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Doctors Found</h3>
            <p className="text-slate-500 mt-2">
              Try adjusting your search criteria or selection filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-4 items-start mb-5">
                    <DoctorImage
                      src={doctor.image}
                      name={doctor.name}
                      className="w-16 h-16 rounded-full border-2 border-teal-500/20 shrink-0"
                    />
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-lg text-slate-800 truncate">{doctor.name}</h3>
                        {doctor.verified && (
                          <span className="bg-teal-50 text-teal-600 text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider border border-teal-100 shrink-0">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-teal-600 font-semibold text-sm flex items-center gap-1.5 mt-0.5">
                        <FaStethoscope className="text-xs" /> {doctor.specialization || "General Medicine"}
                      </p>
                      <p className="text-slate-500 text-xs flex items-center gap-1.5 mt-1 truncate">
                        <FaHospital className="text-xs" /> {doctor.hospital || "Private Clinic"}
                      </p>
                    </div>
                  </div>

                  {doctor.bio && (
                    <p className="text-slate-600 text-sm line-clamp-3 mb-4 bg-slate-50 p-3 rounded-xl">
                      {doctor.bio}
                    </p>
                  )}
                  <div className="flex items-center justify-between border-y border-slate-100 py-3 mb-5 text-sm">
                    <div className="flex items-center gap-1 text-slate-700">
                      <FaStar className="text-amber-500" />
                      <span className="font-bold">{doctor.averageRating || "0.0"}</span>
                      <span className="text-slate-400">({doctor.reviewCount || 0} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-800 font-bold">
                      <FaDollarSign className="text-slate-400 text-xs -mr-1" />
                      <span>{doctor.fee} BDT</span>
                    </div>
                  </div>

                  {doctor.schedules && doctor.schedules.length > 0 ? (
                    <div className="mb-6">
                      <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Available Days</h5>
                      <div className="flex flex-wrap gap-1">
                        {doctor.schedules.map((s, idx) => (
                          <span key={idx} className="bg-teal-50 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                            {s.day}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs mb-6 italic">No schedule configured.</p>
                  )}
                </div>

                <button
                  onClick={() => handleOpenBooking(doctor)}
                  disabled={!doctor.schedules || doctor.schedules.length === 0}
                  className="w-full py-3 bg-slate-900 hover:bg-teal-600 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  Book Appointment <FaChevronRight className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-black text-xl">Book Appointment</h3>
                <p className="text-teal-50 text-sm mt-0.5">With {selectedDoctor.name}</p>
              </div>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="text-white/80 hover:text-white text-2xl font-bold bg-white/10 hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl">
                <DoctorImage
                  src={selectedDoctor.image}
                  name={selectedDoctor.name}
                  className="w-14 h-14 rounded-full border-2 border-teal-500/30 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-slate-800">{selectedDoctor.name}</h4>
                  <p className="text-slate-500 text-xs">{selectedDoctor.specialization} &bull; {selectedDoctor.hospital}</p>
                  <p className="text-teal-600 font-bold text-sm mt-1">{selectedDoctor.fee} BDT</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <FaCalendarAlt className="text-teal-500" /> Select Appointment Date
                </label>
                <select
                  value={bookingDate}
                  onChange={(e) => {
                    setBookingDate(e.target.value);
                    setBookingTime("");
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-semibold"
                >
                  <option value="">-- Choose a Date --</option>
                  {getNextAvailableDates().map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <FaClock className="text-teal-500" /> Select Time Slot
                </label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  disabled={!bookingDate || availableSlots.length === 0}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">-- Choose a Time Slot --</option>
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {bookingDate && availableSlots.length === 0 && (
                  <p className="text-xs text-rose-500 italic mt-1">This doctor has no available schedules for the selected day.</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <FaUserMd className="text-teal-500" /> Patient Problem (Symptoms)
                </label>
                <select
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm font-semibold"
                >
                  <option value="General Consultation">General Consultation / Routine Checkup</option>
                  <option value="Fever / Cold / Flu">Fever / Cold / Flu</option>
                  <option value="Body Pain / Injury">Body Pain / Injury</option>
                  <option value="Stomach Ache / Digestion Issues">Stomach Ache / Digestion Issues</option>
                  <option value="Skin Rash / Allergy">Skin Rash / Allergy</option>
                  <option value="Headache / Migraine">Headache / Migraine</option>
                  <option value="Other / Chronic Condition">Other / Chronic Condition</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3 bg-slate-50">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition cursor-pointer text-center text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleBookAppointment}
                disabled={bookingLoading || !bookingDate || !bookingTime}
                className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-md shadow-teal-500/10 transition disabled:opacity-50 disabled:cursor-not-allowed text-center text-sm"
              >
                {bookingLoading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
