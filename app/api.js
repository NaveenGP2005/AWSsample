import axios from "axios";

// Create axios instance for future backend integration
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("adminToken");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Mock API service for testing with localStorage
const MockAPI = {
  // Events
  getEvents: () => {
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    return Promise.resolve({ data: events });
  },

  createEvent: (eventData) => {
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    const newEvent = {
      _id: Date.now().toString(),
      ...eventData,
      registrations: [],
      createdAt: new Date().toISOString(),
    };
    events.push(newEvent);
    localStorage.setItem("events", JSON.stringify(events));
    return Promise.resolve({ data: newEvent });
  },

  // Registrations
  getRegistrations: (eventId) => {
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    const event = events.find((e) => e._id === eventId);
    return Promise.resolve({ data: event?.registrations || [] });
  },

  createRegistration: (eventId, registrationData) => {
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    const eventIndex = events.findIndex((e) => e._id === eventId);

    if (eventIndex === -1) {
      return Promise.reject({
        response: { data: { message: "Event not found" } },
      });
    }

    const newRegistration = {
      _id: Date.now().toString(),
      ...registrationData,
      checkedIn: false,
      checkedOut: false,
      check_in_time: null,
      check_out_time: null,
      createdAt: new Date().toISOString(),
    };

    events[eventIndex].registrations.push(newRegistration);
    localStorage.setItem("events", JSON.stringify(events));
    return Promise.resolve({ data: newRegistration });
  },

  // OTP
  generateOTP: (eventId) => {
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    const eventIndex = events.findIndex((e) => e._id === eventId);

    if (eventIndex === -1) {
      return Promise.reject({
        response: { data: { message: "Event not found" } },
      });
    }

    const event = events[eventIndex];
    const otps = JSON.parse(localStorage.getItem("otps") || "[]");

    // Generate OTPs for all registrations
    event.registrations.forEach((reg) => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      otps.push({
        _id: Date.now().toString(),
        eventId,
        email: reg.email,
        otp,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 15 * 60000).toISOString(), // 15 minutes
        used: false,
      });
    });

    localStorage.setItem("otps", JSON.stringify(otps));
    return Promise.resolve({
      data: { message: "OTPs generated successfully" },
    });
  },

  // Checkout
  checkout: (data) => {
    const { email, otp, eventId } = data;
    const otps = JSON.parse(localStorage.getItem("otps") || "[]");
    const events = JSON.parse(localStorage.getItem("events") || "[]");

    // Find the OTP
    const otpIndex = otps.findIndex(
      (o) =>
        o.email === email &&
        o.otp === otp &&
        o.eventId === eventId &&
        !o.used &&
        new Date(o.expiresAt) > new Date()
    );

    if (otpIndex === -1) {
      return Promise.reject({
        response: { data: { message: "Invalid or expired OTP" } },
      });
    }

    // Mark OTP as used
    otps[otpIndex].used = true;
    localStorage.setItem("otps", JSON.stringify(otps));

    // Update registration status
    const eventIndex = events.findIndex((e) => e._id === eventId);
    if (eventIndex !== -1) {
      const regIndex = events[eventIndex].registrations.findIndex(
        (r) => r.email === email
      );
      if (regIndex !== -1) {
        events[eventIndex].registrations[regIndex].checkedOut = true;
        events[eventIndex].registrations[regIndex].check_out_time =
          new Date().toISOString();
        localStorage.setItem("events", JSON.stringify(events));
      }
    }

    return Promise.resolve({ data: { msg: "Successfully checked out" } });
  },

  // Check-in
  checkin: (data) => {
    const { email, otp, eventId } = data;
    const otps = JSON.parse(localStorage.getItem("otps") || "[]");
    const events = JSON.parse(localStorage.getItem("events") || "[]");

    // Find the OTP
    const otpIndex = otps.findIndex(
      (o) =>
        o.email === email &&
        o.otp === otp &&
        o.eventId === eventId &&
        !o.used &&
        new Date(o.expiresAt) > new Date()
    );

    if (otpIndex === -1) {
      return Promise.reject({
        response: { data: { message: "Invalid or expired OTP" } },
      });
    }

    // Mark OTP as used
    otps[otpIndex].used = true;
    localStorage.setItem("otps", JSON.stringify(otps));

    // Update registration status
    const eventIndex = events.findIndex((e) => e._id === eventId);
    if (eventIndex !== -1) {
      const regIndex = events[eventIndex].registrations.findIndex(
        (r) => r.email === email
      );
      if (regIndex !== -1) {
        events[eventIndex].registrations[regIndex].checkedIn = true;
        events[eventIndex].registrations[regIndex].check_in_time =
          new Date().toISOString();
        localStorage.setItem("events", JSON.stringify(events));
      }
    }

    return Promise.resolve({ data: { msg: "Successfully checked in" } });
  },

  // Update event
  updateEvent: (eventId, eventData) => {
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    const eventIndex = events.findIndex((e) => e._id === eventId);

    if (eventIndex === -1) {
      return Promise.reject({
        response: { data: { message: "Event not found" } },
      });
    }

    events[eventIndex] = {
      ...events[eventIndex],
      ...eventData,
      _id: eventId, // Preserve the original ID
    };

    localStorage.setItem("events", JSON.stringify(events));
    return Promise.resolve({ data: events[eventIndex] });
  },
};

// Use mock API for testing
const useMockAPI = true;

// Export API with mock functionality
export default {
  get: (url) => {
    if (useMockAPI) {
      if (url === "/admin/events") return MockAPI.getEvents();
      if (url.startsWith("/admin/events/") && url.endsWith("/registrations")) {
        const eventId = url.split("/")[3];
        return MockAPI.getRegistrations(eventId);
      }
      return Promise.reject({
        response: { data: { message: "Not implemented" } },
      });
    }
    return API.get(url);
  },

  post: (url, data) => {
    if (useMockAPI) {
      if (url === "/admin/events") return MockAPI.createEvent(data);
      if (url.startsWith("/admin/events/") && url.endsWith("/generate-otp")) {
        const eventId = url.split("/")[3];
        return MockAPI.generateOTP(eventId);
      }
      if (url.startsWith("/admin/events/") && url.endsWith("/register")) {
        const eventId = url.split("/")[3];
        return MockAPI.createRegistration(eventId, data);
      }
      if (url === "/checkout") return MockAPI.checkout(data);
      if (url === "/checkin") return MockAPI.checkin(data);
      return Promise.reject({
        response: { data: { message: "Not implemented" } },
      });
    }
    return API.post(url, data);
  },

  put: (url, data) => {
    if (useMockAPI) {
      if (url.startsWith("/admin/events/")) {
        const eventId = url.split("/")[3];
        return MockAPI.updateEvent(eventId, data);
      }
      return Promise.reject({
        response: { data: { message: "Not implemented" } },
      });
    }
    return API.put(url, data);
  },
};
