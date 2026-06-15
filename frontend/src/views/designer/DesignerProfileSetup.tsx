import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Loader2, AlertCircle, CheckCircle2, Sliders, MapPin, Briefcase, Award, Sparkles, Camera } from 'lucide-react';

interface DesignerProfileFields {
  bio: string;
  specialties: string[];
  experienceYears: number;
  location: string;
  baseRate: number;
  phoneNumber: string;
  profileImage: string; // Text field link fallback
}

export const DesignerProfileSetup: React.FC = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState<DesignerProfileFields>({
    bio: '',
    specialties: [],
    experienceYears: 0,
    location: '',
    baseRate: 0,
    phoneNumber: '',
    profileImage: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [specialtyInput, setSpecialtyInput] = useState<string>('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const activeToken = token || localStorage.getItem('stylora_auth_token');
        
        const response = await axios.get('http://localhost:5000/api/designers/profile/me', {
          headers: { Authorization: `Bearer ${activeToken}` }
        });

        if (response.data.success && response.data.profile) {
          const p = response.data.profile;
          
          setProfile({
            bio: p.bio || '',
            specialties: Array.isArray(p.specialties) 
              ? p.specialties 
              : p.specialization ? p.specialization.split(',').map((s: string) => s.trim()) : [],
            experienceYears: p.experience || 0,
            location: p.location || '',
            baseRate: p.baseRate || 0, 
            phoneNumber: p.phone || '',
            profileImage: p.profileImage || p.avatar || ''
          });
          if (p.profileImage || p.avatar) {
            setImagePreview(p.profileImage || p.avatar);
          }
          setHasProfile(true);
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setHasProfile(false);
        } else {
          console.error("Error reading designer studio metrics:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token]);

  // Handle image selection file changes locally
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a local object URL for instant UI preview rendering
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddSpecialty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specialtyInput.trim()) return;
    if (!profile.specialties.includes(specialtyInput.trim())) {
      setProfile(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialtyInput.trim()]
      }));
    }
    setSpecialtyInput('');
  };

  const handleRemoveSpecialty = (indexToRemove: number) => {
    setProfile(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setFeedback(null);
      const activeToken = token || localStorage.getItem('stylora_auth_token');

      let response;

      // Check if a file was selected. If so, build a FormData multi-part request.
      if (selectedFile) {
        const formData = new FormData();
        formData.append('profileImage', selectedFile);
        formData.append('bio', profile.bio);
        formData.append('location', profile.location);
        formData.append('experience', String(profile.experienceYears));
        formData.append('phone', profile.phoneNumber);
        formData.append('specialization', profile.specialties.join(', '));
        formData.append('style', profile.specialties[0] || "");
        formData.append('baseRate', String(profile.baseRate));

        const config = {
          headers: { 
            Authorization: `Bearer ${activeToken}`,
            'Content-Type': 'multipart/form-data'
          }
        };

        if (hasProfile) {
          response = await axios.put('http://localhost:5000/api/designers/profile', formData, config);
        } else {
          response = await axios.post('http://localhost:5000/api/designers/profile', formData, config);
        }
      } else {
        // Fallback standard JSON body request if no new binary image was supplied
        const backendPayload = {
          bio: profile.bio,
          location: profile.location,
          experience: profile.experienceYears,
          phone: profile.phoneNumber,
          specialization: profile.specialties.join(', '),
          style: profile.specialties[0] || "",
          baseRate: profile.baseRate,
          profileImage: profile.profileImage // Passes link value if manually inputed
        };

        const config = { headers: { Authorization: `Bearer ${activeToken}` } };

        if (hasProfile) {
          response = await axios.put('http://localhost:5000/api/designers/profile', backendPayload, config);
        } else {
          response = await axios.post('http://localhost:5000/api/designers/profile', backendPayload, config);
        }
      }

      if (response.data.success) {
        setFeedback({ type: 'success', message: 'Studio manifest and profile image synchronized successfully.' });
        setHasProfile(true);
      }
    } catch (err: any) {
      console.error("Profile mutation failure:", err);
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Transaction dropped. Verify if backend requires Multer handling for images.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 text-neutral-400 font-mono text-[11px] tracking-widest bg-[#FAFAFA] min-h-screen">
        <Loader2 className="animate-spin text-[#D4AF37]" size={24} />
        <span>READING AUTHORIZED STUDIO DOSSIERS...</span>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#FAFAFA] min-h-screen animate-fade-in max-w-5xl">
      <div className="mb-12 border-b border-neutral-200/60 pb-6">
        <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase mb-1 font-bold">
          <span>✦</span>
          <span>Atelier Identity Configuration Hub</span>
        </div>
        <h1 className="text-3xl font-luxury uppercase tracking-wider text-black">
          Profile Management
        </h1>
      </div>

      {feedback && (
        <div className={`mb-8 p-4 flex items-center gap-3 font-mono text-xs max-w-3xl ${
          feedback.type === 'success' ? 'border-l-2 border-emerald-600 bg-emerald-50/30 text-emerald-900' : 'border-l-2 border-rose-600 bg-rose-50/30 text-rose-900'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-600" /> : <AlertCircle size={16} className="text-rose-600" />}
          <span>{feedback.message.toUpperCase()}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6 bg-white border border-neutral-200/60 p-8 shadow-sm">
          <div className="border-b border-neutral-100 pb-3 mb-4 flex items-center gap-2">
            <Sliders size={14} className="text-[#D4AF37]" />
            <h2 className="text-xs font-mono tracking-widest uppercase font-bold text-black">Master Particulars</h2>
          </div>

          {/* Interactive Profile Image Node */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border border-dashed border-neutral-200 bg-[#FAFAFA] mb-6">
            <div className="relative w-24 h-24 bg-neutral-100 border border-neutral-200 flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Camera size={24} className="text-neutral-300" />
              )}
            </div>
            <div className="space-y-2 text-center sm:text-left flex-1">
              <label className="block text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-bold">
                Atelier Display Avatar Image
              </label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="text-xs font-mono text-neutral-500 file:mr-4 file:py-2 file:px-4 file:border file:border-neutral-200 file:bg-white file:text-black file:font-mono file:text-[11px] file:uppercase file:tracking-wider hover:file:bg-neutral-50 file:cursor-pointer"
              />
              <p className="text-[9px] font-mono text-neutral-400 italic">Supports JPG, PNG formats.</p>
            </div>
          </div>

          {/* Fallback Image Link String Input */}
          <div className="space-y-1">
            <label className="block text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-bold">
              Alternative Image URL Link
            </label>
            <input
              type="text"
              placeholder="e.g., https://example.com/image.jpg"
              value={profile.profileImage}
              onChange={(e) => setProfile({ ...profile, profileImage: e.target.value })}
              className="w-full bg-[#FAFAFA] border border-neutral-200 p-3 text-xs font-mono tracking-wide focus:outline-none focus:border-black transition-all text-black"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-bold">
              Operational Studio Location Base
            </label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-3.5 text-neutral-400" />
              <input
                type="text"
                required
                placeholder="e.g., Pune, India"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full bg-[#FAFAFA] border border-neutral-200 p-3 pl-9 text-xs font-mono tracking-wide focus:outline-none focus:border-black transition-all text-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-bold">
                Active Architectural Experience (Years)
              </label>
              <div className="relative">
                <Award size={14} className="absolute left-3 top-3.5 text-neutral-400" />
                <input
                  type="number"
                  required
                  min="0"
                  value={profile.experienceYears || ''}
                  onChange={(e) => setProfile({ ...profile, experienceYears: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#FAFAFA] border border-neutral-200 p-3 pl-9 text-xs font-mono tracking-wide focus:outline-none focus:border-black transition-all text-black"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-bold">
                Base Consultation Rate (₹ / Hour)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-neutral-400 font-mono text-xs">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={profile.baseRate || ''}
                  onChange={(e) => setProfile({ ...profile, baseRate: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#FAFAFA] border border-neutral-200 p-3 pl-8 text-xs font-mono tracking-wide focus:outline-none focus:border-black transition-all text-black"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-bold">
              Direct Contact Pipeline (Phone Number)
            </label>
            <div className="relative">
              <Briefcase size={14} className="absolute left-3 top-3.5 text-neutral-400" />
              <input
                type="text"
                required
                placeholder="e.g., 8975462315"
                value={profile.phoneNumber}
                onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                className="w-full bg-[#FAFAFA] border border-neutral-200 p-3 pl-9 text-xs font-mono tracking-wide focus:outline-none focus:border-black transition-all text-black"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-bold">
              Atelier Philosophy & Design Bio
            </label>
            <textarea
              rows={5}
              required
              placeholder="State your artistic approach..."
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full bg-[#FAFAFA] border border-neutral-200 p-4 text-xs font-light tracking-wide leading-relaxed focus:outline-none focus:border-black transition-all text-black resize-none"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-neutral-200/60 p-6 shadow-sm space-y-4">
            <div className="border-b border-neutral-100 pb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-[#D4AF37]" />
              <h2 className="text-xs font-mono tracking-widest uppercase font-bold text-black">Style Specializations</h2>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add style..."
                value={specialtyInput}
                onChange={(e) => setSpecialtyInput(e.target.value)}
                className="flex-1 bg-[#FAFAFA] border border-neutral-200 p-2 text-xs font-mono tracking-wide focus:outline-none focus:border-black text-black"
              />
              <button
                type="button"
                onClick={handleAddSpecialty}
                className="bg-black text-white px-3 font-mono text-xs uppercase hover:bg-neutral-900 transition-all"
              >
                +
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {profile.specialties.length === 0 ? (
                <span className="text-[10px] font-mono text-neutral-400 italic">No specialized matrices logged.</span>
              ) : (
                profile.specialties.map((spec, index) => (
                  <span key={index} className="inline-flex items-center gap-1.5 bg-[#FAFAFA] border border-neutral-200 text-black px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase">
                    <span>{spec}</span>
                    <button type="button" onClick={() => handleRemoveSpecialty(index)} className="text-neutral-400 hover:text-rose-600 font-bold ml-1 transition-all">×</button>
                  </span>
                ))
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white hover:bg-neutral-900 py-4 font-mono text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin text-[#D4AF37]" size={14} />
                <span>COMMITTING TO SCHEMA...</span>
              </>
            ) : (
              <span>{hasProfile ? "Update Studio Manifest" : "Initialize Designer Record"}</span>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};