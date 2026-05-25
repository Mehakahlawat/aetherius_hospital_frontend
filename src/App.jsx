// src/App.jsx

import { useEffect, useState } from "react";

// ───────────────── BACKEND URL ─────────────────
const BASE_URL =
  "https://hospital-management-system-2lbo.onrender.com";

function App() {
  // ───────────────── PATIENT FORM ─────────────────
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [fee, setFee] = useState("");
  const [hours, setHours] = useState("");

  // ───────────────── OUTPUT ─────────────────
  const [output, setOutput] = useState("");

  // ───────────────── APPOINTMENTS ─────────────────
  const [appointments, setAppointments] = useState([]);

  // ───────────────── DOCTORS ─────────────────
  const doctors = [
    {
      id: "D01",
      name: "Dr. Sharma",
      specialization: "Cardiology",
    },
    {
      id: "D02",
      name: "Dr. Mehta",
      specialization: "Neurology",
    },
    {
      id: "D03",
      name: "Dr. Verma",
      specialization: "Orthopedics",
    },
    {
      id: "D04",
      name: "Dr. Kapoor",
      specialization: "Dermatology",
    },
    {
      id: "D05",
      name: "Dr. Iyer",
      specialization: "Pediatrics",
    },
  ];

  const [doctorId, setDoctorId] = useState("D01");

  const selectedDoctor = doctors.find(
    (d) => d.id === doctorId
  );

  // ───────────────── FETCH APPOINTMENTS ─────────────────
  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${BASE_URL}/appointments`);

      const data = await res.json();

      setAppointments(data);
    } catch {
      setOutput("❌ Failed to fetch appointments");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ───────────────── BOOK APPOINTMENT ─────────────────
  const bookAppointment = async () => {
    if (
      !patientId ||
      !patientName ||
      !diagnosis ||
      !fee
    ) {
      setOutput("⚠️ Please fill all fields");
      return;
    }

    try {
      await fetch(`${BASE_URL}/addPatient`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id: patientId,
          name: patientName,
          diagnosis,
          fee: Number(fee),

          doctorId: selectedDoctor.id,
          doctorName: selectedDoctor.name,
          specialization:
            selectedDoctor.specialization,
        }),
      });

      setOutput("✅ Appointment booked successfully");

      clearFields();

      fetchAppointments();
    } catch {
      setOutput("❌ Booking failed");
    }
  };

  // ───────────────── DISCHARGE ─────────────────
  const dischargePatient = async (id) => {
    if (!hours) {
      setOutput("⚠️ Enter hours stayed");
      return;
    }

    try {
      const res = await fetch(
        `${BASE_URL}/discharge?patientId=${id}&hours=${hours}`
      );

      const text = await res.text();

      setOutput(text);

      fetchAppointments();
    } catch {
      setOutput("❌ Discharge failed");
    }
  };

  // ───────────────── PRESCRIPTION ─────────────────
  const prescribe = (name) => {
    const med = prompt("Enter medicine");

    if (!med) return;

    setOutput(`
💊 PRESCRIPTION

Patient: ${name}

Doctor: ${selectedDoctor.name}

Specialization: ${selectedDoctor.specialization}

Medicine: ${med}

Instructions:
- Take medicines after meals
- Drink plenty of water
- Follow up after 3 days
`);
  };

  // ───────────────── CLEAR ─────────────────
  const clearFields = () => {
    setPatientId("");
    setPatientName("");
    setDiagnosis("");
    setFee("");
    setDoctorId("D01");
  };

  // ───────────────── TOTAL REVENUE ─────────────────
  const totalRevenue = appointments.reduce(
    (sum, a) => sum + (a.fee || 0),
    0
  );

  return (
    <div style={styles.page}>
      {/* ───────── HEADER ───────── */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.heading}>
            🏥 Aetherius Hospital
          </h1>

          <p style={styles.subheading}>
            Smart Hospital Management System
          </p>
        </div>
      </header>

      {/* ───────── STATS ───────── */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <h3>Total Appointments</h3>

          <p>{appointments.length}</p>
        </div>

        <div style={styles.statCard}>
          <h3>Available Slots</h3>

          <p>{20 - appointments.length}</p>
        </div>

        <div style={styles.statCard}>
          <h3>Total Revenue</h3>

          <p>₹{totalRevenue}</p>
        </div>
      </div>

      {/* ───────── BOOK APPOINTMENT ───────── */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>
          📋 Book Appointment
        </h2>

        <div style={styles.grid}>
          <input
            style={styles.input}
            placeholder="Patient ID"
            value={patientId}
            onChange={(e) =>
              setPatientId(e.target.value)
            }
          />

          <input
            style={styles.input}
            placeholder="Patient Name"
            value={patientName}
            onChange={(e) =>
              setPatientName(e.target.value)
            }
          />

          <input
            style={styles.input}
            placeholder="Diagnosis"
            value={diagnosis}
            onChange={(e) =>
              setDiagnosis(e.target.value)
            }
          />

          <input
            style={styles.input}
            type="number"
            placeholder="Consultation Fee"
            value={fee}
            onChange={(e) =>
              setFee(e.target.value)
            }
          />

          {/* ───────── DOCTOR SELECT ───────── */}
          <select
            style={styles.input}
            value={doctorId}
            onChange={(e) =>
              setDoctorId(e.target.value)
            }
          >
            {doctors.map((doc) => (
              <option
                key={doc.id}
                value={doc.id}
              >
                {doc.name} —{" "}
                {doc.specialization}
              </option>
            ))}
          </select>
        </div>

        {/* ───────── DOCTOR PREVIEW ───────── */}
        <div style={styles.doctorPreview}>
          🩺 Selected Doctor:{" "}
          <strong>
            {selectedDoctor.name} (
            {selectedDoctor.specialization})
          </strong>
        </div>

        <div style={styles.buttonGroup}>
          <button
            style={styles.btnPrimary}
            onClick={bookAppointment}
          >
            Book Appointment
          </button>

          <button
            style={styles.btnDanger}
            onClick={clearFields}
          >
            Clear
          </button>
        </div>
      </section>

      {/* ───────── DISCHARGE ───────── */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>
          🚪 Discharge Patient
        </h2>

        <input
          style={styles.input}
          placeholder="Hours Stayed"
          type="number"
          value={hours}
          onChange={(e) =>
            setHours(e.target.value)
          }
        />

        <p style={styles.helperText}>
          Select patient from appointments
          table below
        </p>
      </section>

      {/* ───────── APPOINTMENTS TABLE ───────── */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>
          📅 Appointments
        </h2>

        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Diagnosis</th>
                <th>Fee</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((a, i) => (
                <tr key={i}>
                  <td>{a.id}</td>

                  <td>{a.name}</td>

                  <td>
                    {a.doctorName || "N/A"}
                  </td>

                  <td>
                    {a.specialization ||
                      "N/A"}
                  </td>

                  <td>{a.diagnosis}</td>

                  <td>₹{a.fee}</td>

                  <td>
                    <button
                      style={styles.btnBlue}
                      onClick={() =>
                        dischargePatient(a.id)
                      }
                    >
                      Discharge
                    </button>

                    <button
                      style={styles.btnPurple}
                      onClick={() =>
                        prescribe(a.name)
                      }
                    >
                      Prescribe
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ───────── OUTPUT ───────── */}
      <section style={styles.output}>
        <h3 style={{ marginTop: 0 }}>
          🖥 System Output
        </h3>

        <pre style={styles.pre}>
          {output}
        </pre>
      </section>
    </div>
  );
}

// ───────────────── STYLES ─────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: 30,
    fontFamily: "'Segoe UI', sans-serif",
    color: "#1e293b",
  },

  header: {
    marginBottom: 30,
  },

  heading: {
    margin: 0,
    fontSize: 34,
    color: "#0f172a",
  },

  subheading: {
    color: "#64748b",
    marginTop: 6,
  },

  statsContainer: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: 20,
    marginBottom: 30,
  },

  statCard: {
    background: "white",
    borderRadius: 16,
    padding: 22,
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.05)",
  },

  card: {
    background: "white",
    borderRadius: 16,
    padding: 24,
    marginBottom: 25,
    border: "1px solid #e2e8f0",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.05)",
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: 20,
    color: "#0f172a",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(250px,1fr))",
    gap: 15,
    marginBottom: 20,
  },

  input: {
    padding: 12,
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    fontSize: 14,
    outline: "none",
  },

  buttonGroup: {
    display: "flex",
    gap: 10,
    marginTop: 15,
  },

  btnPrimary: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "600",
  },

  btnDanger: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "600",
  },

  btnBlue: {
    background: "#0ea5e9",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
    marginRight: 8,
  },

  btnPurple: {
    background: "#7c3aed",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  helperText: {
    color: "#64748b",
    marginTop: 10,
  },

  output: {
    background: "#0f172a",
    color: "#e2e8f0",
    borderRadius: 16,
    padding: 20,
  },

  pre: {
    whiteSpace: "pre-wrap",
    margin: 0,
  },

  doctorPreview: {
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    padding: 14,
    borderRadius: 12,
    color: "#1d4ed8",
  },
};

export default App;