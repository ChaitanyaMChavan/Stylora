import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, User, Star, Shield, Image, Users, Bell } from 'lucide-react';

// Layout Wrappers
import { PublicLayout } from '../layouts/PublicLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Public Facing Views
import { Home } from '../views/public/Home';
import { Designers } from '../views/public/Designers';
import { DesignerProfile } from '../views/public/DesignerProfile';
import { Login } from '../views/public/Login';
import { Register } from '../views/public/Register';
import { About } from '../views/public/About';
import { Contact } from '../views/public/Contact';

// Client Dashboard Ecosystem Views
import { ClientDashboard } from '../views/client/ClientDashboard';
import { ClientAppointments } from '../views/client/ClientAppointments';
import { ClientNotifications } from '../views/client/ClientNotifications';
import { ClientReviews } from '../views/client/ClientReviews';

// Designer Atelier Engine Views
import { DesignerDashboard } from '../views/designer/DesignerDashboard';
import { DesignerPortfolio } from '../views/designer/DesignerPortfolio';
import { DesignerAppointments } from '../views/designer/DesignerAppointments';
import { DesignerProfileSetup } from '../views/designer/DesignerProfileSetup';
import { DesignerNotifications } from '../views/designer/DesignerNotifications';

// Administrative Command HQ Views
import { AdminDashboard } from '../views/admin/AdminDashboard';
import { AdminUsers } from '../views/admin/AdminUsers';
import { AdminDesigners } from '../views/admin/AdminDesigners';
import { AdminAppointments } from '../views/admin/AdminAppointments';

// Navigation configuration objects mapped to sidebars
const clientNavigation = [
  { label: 'Overview', path: '/client/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Appointments', path: '/client/appointments', icon: <Calendar size={16} /> },
  { label: 'Notifications', path: '/client/notifications', icon: <Bell size={16} /> },
  { label: 'Reviews', path: '/client/reviews', icon: <Star size={16} /> },
];

const designerNavigation = [
  { label: 'Studio Engine', path: '/designer/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Portfolio Studio', path: '/designer/portfolio', icon: <Image size={16} /> },
  { label: 'Bookings Manager', path: '/designer/appointments', icon: <Calendar size={16} /> },
  { label: 'Notifications', path: '/designer/notifications', icon: <Bell size={16} /> },
  { label: 'Profile Setup', path: '/designer/profile', icon: <User size={16} /> },
];

const adminNavigation = [
  { label: 'HQ Terminal', path: '/admin/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Users Grid', path: '/admin/users', icon: <Users size={16} /> },
  { label: 'Verified Designers', path: '/admin/designers', icon: <Shield size={16} /> },
  { label: 'System Appointments', path: '/admin/appointments', icon: <Calendar size={16} /> },
];

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Visitor Domain Container - Managed cleanly under the dynamic PublicLayout wrapper */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/designers" element={<Designers />} />
          <Route path="/designer/:id" element={<DesignerProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Client Interface Space */}
        <Route path="/client" element={<DashboardLayout role="client" menuItems={clientNavigation} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="appointments" element={<ClientAppointments />} />
          <Route path="notifications" element={<ClientNotifications />} />
          <Route path="reviews" element={<ClientReviews />} />
        </Route>

        {/* Designer Atelier Workspace */}
        <Route path="/designer" element={<DashboardLayout role="designer" menuItems={designerNavigation} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DesignerDashboard />} />
          <Route path="portfolio" element={<DesignerPortfolio />} />
          <Route path="appointments" element={<DesignerAppointments />} />
          <Route path="notifications" element={<DesignerNotifications />} />
          <Route path="profile" element={<DesignerProfileSetup />} />
        </Route>

        {/* Ecosystem Global Administration Matrix */}
        <Route path="/admin" element={<DashboardLayout role="admin" menuItems={adminNavigation} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="designers" element={<AdminDesigners />} />
          <Route path="appointments" element={<AdminAppointments />} />
        </Route>

        {/* Wildcard Fallback redirection node */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};