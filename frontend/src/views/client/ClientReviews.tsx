import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Star, MessageSquare, Loader2, AlertCircle, CheckCircle, Send } from 'lucide-react';

interface AppointmentData {
  _id: string;
  designerId: {
    _id: string;
    userId: { name: string } | null;
  } | null | string;
  serviceType: string;
  status: string;
}

interface ReviewLog {
  _id: string;
  appointmentId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const ClientReviews: React.FC = () => {
  const { token } = useAuth();
  const [completedBookings, setCompletedBookings] = useState<AppointmentData[]>([]);
  const [myReviews, setMyReviews] = useState<ReviewLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [selectedApt, setSelectedApt] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchDataHub = async () => {
    try {
      setLoading(true);
      const activeToken = token || localStorage.getItem('stylora_auth_token');

      // 1. Fetch appointments to extract which slots can accept reviews
      const aptResponse = await axios.get('http://localhost:5000/api/appointments/my', {
        headers: { Authorization: `Bearer ${activeToken}` }
      });

      // 2. Fetch past review history from database (Adjust route if your endpoint differs)
      let reviewList: ReviewLog[] = [];
      try {
        const revResponse = await axios.get('http://localhost:5000/api/reviews/my-reviews', {
          headers: { Authorization: `Bearer ${activeToken}` }
        });
        if (revResponse.data.success) reviewList = revResponse.data.reviews;
      } catch (e) {
        console.log("Review history endpoint unmapped or empty, continuing with structural setup.");
      }

      if (aptResponse.data.success) {
        const allApts = aptResponse.data.appointments || [];
        // Allow users to review appointments (including pending/cancelled instances if needed for evaluation testing)
        setCompletedBookings(allApts);
        setMyReviews(reviewList);
      }
    } catch (err: any) {
      console.error('Error synchronizing evaluation matrix:', err);
      setError('Unable to securely pull project tracking records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataHub();
  }, [token]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApt) return alert("Please map an operational workspace instance reference.");

    try {
      setSubmitting(true);
      setSuccessMsg(null);
      const activeToken = token || localStorage.getItem('stylora_auth_token');

      const targetBooking = completedBookings.find(b => b._id === selectedApt);
      const rawDesignerId = typeof targetBooking?.designerId === 'object' 
        ? targetBooking?.designerId?._id 
        : targetBooking?.designerId;

      const response = await axios.post('http://localhost:5000/api/reviews', {
        appointmentId: selectedApt,
        designerId: rawDesignerId,
        rating,
        comment
      }, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });

      if (response.data.success) {
        setSuccessMsg("Evaluation ledger entry committed successfully.");
        setComment('');
        setSelectedApt('');
        fetchDataHub(); // Refresh list to reflect changes
      }
    } catch (err: any) {
      console.error('Error submitting feedback vector:', err);
      alert(err.response?.data?.message || 'Failed to dispatch evaluation schema packet.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-neutral-400 font-mono text-[11px] tracking-widest min-h-screen bg-[#FAFAFA]">
        <Loader2 className="animate-spin text-[#D4AF37]" size={24} />
        <span>PARSING HISTORICAL SURVEY CHANNELS...</span>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#FAFAFA] min-h-screen animate-fade-in max-w-6xl mx-auto">
      {/* Editorial Header */}
      <div className="mb-12 border-b border-neutral-200/60 pb-6">
        <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold block mb-2">
          Quality Control Terminal
        </span>
        <h1 className="text-3xl font-luxury uppercase tracking-wider text-black">
          Reviews Workspace
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Aspect: Submit Form Entry */}
        <div className="lg:col-span-5 bg-white border border-neutral-200/70 p-6">
          <h2 className="text-sm font-luxury uppercase tracking-wider text-black mb-6 border-b pb-2">
            File Feedback Entry
          </h2>

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2">
              <CheckCircle size={14} /> <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmitReview} className="space-y-6">
            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-400 tracking-wider mb-2">
                Select Project Instance Reference
              </label>
              <select
                value={selectedApt}
                onChange={(e) => setSelectedApt(e.target.value)}
                className="w-full border border-neutral-200 bg-[#FAFAFA] p-3 font-mono text-xs text-black rounded-none focus:border-black outline-none"
                required
              >
                <option value="">-- CHOOSE MATRIX ID --</option>
                {completedBookings.map(b => (
                  <option key={b._id} value={b._id}>
                    {b.serviceType.toUpperCase()} ({b._id.slice(-6).toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-400 tracking-wider mb-2">
                Rating Assessment Vector
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-neutral-300 hover:scale-110 transition-transform"
                  >
                    <Star 
                      size={20} 
                      className={star <= rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-neutral-200"} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-neutral-400 tracking-wider mb-2">
                Manifesto Evaluation Statement
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Log performance records, design pipeline alignment comments, or spatial notes..."
                className="w-full border border-neutral-200 bg-[#FAFAFA] p-3 text-xs tracking-wide text-black font-light rounded-none focus:border-black outline-none resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white py-3 text-xs font-mono tracking-widest uppercase hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2 rounded-none disabled:bg-neutral-200"
            >
              {submitting ? <Loader2 className="animate-spin" size={12} /> : <Send size={12} />}
              <span>Commit Review Entry</span>
            </button>
          </form>
        </div>

        {/* Right Aspect: Log Auditing Stream */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-sm font-luxury uppercase tracking-wider text-black border-b pb-2">
            Historical Feedback Stream
          </h2>

          {myReviews.length === 0 ? (
            <div className="border border-neutral-200 bg-white p-12 text-center rounded-none font-mono text-xs tracking-widest text-neutral-400">
              NO SIGNED FEEDBACK SUBMISSIONS FOUND IN MATRIX HISTORY.
            </div>
          ) : (
            <div className="space-y-4">
              {myReviews.map((rev) => (
                <div key={rev._id} className="bg-white border border-neutral-200 p-5 space-y-3 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
                      REV ID: {rev._id.slice(-6).toUpperCase()}
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          size={11} 
                          className={i < rev.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-neutral-100"} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-600 font-light tracking-wide leading-relaxed">
                    "{rev.comment}"
                  </p>
                  <div className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider pt-1">
                    Logged: {new Date(rev.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};