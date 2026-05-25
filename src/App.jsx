// src/App.jsx

import { useState, useEffect, useCallback } from "react";

const BASE = "https://hospital-management-system-2lbo.onrender.com";

// ───────────────── API ─────────────────
const api = {
  get: (path) => fetch(`${BASE}${path}`).then((r) => r.json()),

  post: (path, body) =>
    fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.text()),

  put: (path, body) =>
    fetch(`${BASE}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.text()),

  del: (path) =>
    fetch(`${BASE}${path}`, {
      method: "DELETE",
    }).then((r) => r.text()),
};

// ───────────────── COLORS ─────────────────
const COLORS = {
  primary: "#2563eb",
  secondary: "#0ea5e9",
  success: "#059669",
  successLight: "#d1fae5",
  blueLight: "#dbeafe",
  offWhite: "#f8fafc",
  border: "#e2e8f0",
  text: "#1e293b",
  muted: "#64748b",
  sidebar: "#0f172a",
  white: "#ffffff",
  danger: "#dc2626",
};

// ───────────────── STYLES ─────────────────
const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: `1px solid ${COLORS.border}`,
  fontSize: 14,
  color: COLORS.text,
  background: COLORS.offWhite,
  outline: "none",
  boxSizing: "border-box",
};

const btnPrimary = {
  background: COLORS.primary,
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: 10,
  fontWeight: 600,
  cursor: "pointer",
};

const btnSecondary = {
  background: COLORS.blueLight,
  color: COLORS.primary,
  border: `1px solid ${COLORS.border}`,
  padding: "10px 18px",
  borderRadius: 10,
  fontWeight: 600,
  cursor: "pointer",
};

const btnDanger = {
  background: COLORS.danger,
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: 10,
  fontWeight: 600,
  cursor: "pointer",
};

// ───────────────── TOAST ─────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colorMap = {
    success: COLORS.success,
    error: COLORS.danger,
    info: COLORS.primary,
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        background: COLORS.white,
        borderLeft: `5px solid ${colorMap[type]}`,
        padding: "14px 18px",
        borderRadius: 10,
        boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
        zIndex: 999,
      }}
    >
      <p style={{ margin: 0, color: COLORS.text }}>{msg}</p>
    </div>
  );
}

// ───────────────── LOADING ─────────────────
function LoadingSpinner() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <div
        style={{
          width: 36,
          height: 36,
          border: `4px solid ${COLORS.border}`,
          borderTop: `4px solid ${COLORS.primary}`,
          borderRadius: "50%",
          margin: "auto",
          animation: "spin 1s linear infinite",
        }}
      />

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

// ───────────────── DASHBOARD ─────────────────
function Dashboard({ toast }) {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [docs, pats, appts] = await Promise.all([
          api.get("/doctors"),
          api.get("/patients"),
          api.get("/appointments"),
        ]);

        setStats({
          doctors: docs.length,
          patients: pats.length,
          appointments: appts.length,
          revenue: pats.reduce((sum, p) => sum + (p.fee || 0), 0),
        });
      } catch {
        toast("Failed to load dashboard", "error");
      }

      setLoading(false);
    };

    load();
  }, [toast]);

  const cards = [
    {
      title: "Doctors",
      value: stats.doctors,
      icon: "🩺",
      color: COLORS.primary,
      bg: COLORS.blueLight,
    },
    {
      title: "Patients",
      value: stats.patients,
      icon: "🏥",
      color: COLORS.success,
      bg: COLORS.successLight,
    },
    {
      title: "Appointments",
      value: stats.appointments,
      icon: "📋",
      color: COLORS.secondary,
      bg: "#e0f2fe",
    },
    {
      title: "Revenue",
      value: `₹${stats.revenue}`,
      icon: "💰",
      color: COLORS.success,
      bg: "#dcfce7",
    },
  ];

  return (
    <div>
      <h1
        style={{
          color: COLORS.text,
          marginBottom: 10,
        }}
      >
        Hospital Dashboard
      </h1>

      <p
        style={{
          color: COLORS.muted,
          marginBottom: 30,
        }}
      >
        Manage doctors, patients, and appointments.
      </p>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 20,
          }}
        >
          {cards.map((card) => (
            <div
              key={card.title}
              style={{
                background: COLORS.white,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 18,
                padding: 24,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  width: 55,
                  height: 55,
                  borderRadius: 14,
                  background: card.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  marginBottom: 14,
                }}
              >
                {card.icon}
              </div>

              <p
                style={{
                  color: COLORS.muted,
                  marginBottom: 6,
                  fontSize: 14,
                }}
              >
                {card.title}
              </p>

              <h2
                style={{
                  margin: 0,
                  color: card.color,
                  fontSize: 30,
                }}
              >
                {card.value}
              </h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ───────────────── APP ─────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [toastMsg, setToastMsg] = useState(null);

  const toast = useCallback((msg, type = "info") => {
    setToastMsg({
      msg,
      type,
      key: Date.now(),
    });
  }, []);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "doctors", label: "Doctors", icon: "🩺" },
    { id: "patients", label: "Patients", icon: "🏥" },
    { id: "appointments", label: "Appointments", icon: "📋" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.offWhite,
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: 240,
          background: COLORS.sidebar,
          padding: 20,
        }}
      >
        <h2
          style={{
            color: "#fff",
            marginBottom: 30,
          }}
        >
          🏨 MediCare HMS
        </h2>

        {tabs.map((tabItem) => (
          <button
            key={tabItem.id}
            onClick={() => setTab(tabItem.id)}
            style={{
              width: "100%",
              padding: "12px 16px",
              marginBottom: 10,
              borderRadius: 12,
              border: "none",
              background:
                tab === tabItem.id
                  ? COLORS.primary
                  : "transparent",
              color:
                tab === tabItem.id
                  ? "#fff"
                  : "#cbd5e1",
              textAlign: "left",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            {tabItem.icon} {tabItem.label}
          </button>
        ))}
      </aside>

      {/* Main */}
      <main
        style={{
          marginLeft: 240,
          padding: 35,
        }}
      >
        {tab === "dashboard" && <Dashboard toast={toast} />}

        {/* Add DoctorsPanel */}
        {/* Add PatientsPanel */}
        {/* Add AppointmentsPanel */}
      </main>

      {toastMsg && (
        <Toast
          key={toastMsg.key}
          msg={toastMsg.msg}
          type={toastMsg.type}
          onClose={() => setToastMsg(null)}
        />
      )}
    </div>
  );
}

