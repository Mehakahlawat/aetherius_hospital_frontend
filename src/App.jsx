import { useEffect, useState } from "react";

// ───────────────── BACKEND URL ─────────────────
const BASE_URL =
  "https://hospital-management-system-2lbo.onrender.com";

function App() {
  // ───────────────── STATES ─────────────────
  const [appointments, setAppointments] = useState([]);

  const [appointmentId, setAppointmentId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [fee, setFee] = useState("");

  const [output, setOutput] = useState("");

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
      const res = await fetch(
        `${BASE_URL}/appointments`
      );

      const data = await res.json();

      setAppointments(data);
    } catch {
      setOutput("❌ Failed to load appointments");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ───────────────── BOOK APPOINTMENT ─────────────────
  const bookAppointment = async () => {
    if (
      !appointmentId ||
      !patientId ||
      !patientName ||
      !diagnosis ||
      !fee
    ) {
      setOutput("⚠️ Please fill all fields");
      return;
    }

    try {
      const payload = {
        appointmentId: Number(appointmentId),

        patientId: patientId,

        patientName: patientName,

        doctorId: selectedDoctor.id,

        doctorName: selectedDoctor.name,

        specialization:
          selectedDoctor.specialization,

        slotNumber:
          appointments.length + 1,

        diagnosis: diagnosis,

        fee: Number(fee),
      };

      const res = await fetch(
        `${BASE_URL}/appointments`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      setOutput(
        "✅ Appointment booked successfully"
      );

      clearFields();

      fetchAppointments();
    } catch {
      setOutput("❌ Booking failed");
    }
  };

  // ───────────────── DISCHARGE ─────────────────
  const dischargePatient = async (id) => {
    try {
      const res = await fetch(
        `${BASE_URL}/appointments/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      setOutput(
        "✅ Patient discharged successfully"
      );

      fetchAppointments();
    } catch {
      setOutput("❌ Discharge failed");
    }
  };

  // ───────────────── PRESCRIPTION ─────────────────
  const prescribe = (patient) => {
    const med = prompt(
      "Enter medicine name"
    );

    if (!med) return;

    setOutput(`
💊 PRESCRIPTION

Patient: ${patient.patientName}

Doctor: ${patient.doctorName}

Specialization: ${patient.specialization}

Medicine: ${med}

Instructions:
• Take after meals
• Drink enough water
• Follow-up after 3 days
`);
  };

  // ───────────────── CLEAR ─────────────────
  const clearFields = () => {
    setAppointmentId("");
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
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.heading}>
          🏥 Aetherius Hospital
        </h1>

        <p style={styles.subheading}>
          Smart Hospital Management System
        </p>
      </div>

      {/* STATS */}
      <div style={styles.stats}>
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

      {/* BOOK APPOINTMENT */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>
          📋 Book Appointment
        </h2>

        <div style={styles.grid}>
          <input
            style={styles.input}
            placeholder="Appointment ID"
            value={appointmentId}
            onChange={(e) =>
              setAppointmentId(
                e.target.value
              )
            }
          />

          <input
            style={styles.input}
            placeholder="Patient ID"
            value={patientId}
            onChange={(e) =>
              setPatientId(
                e.target.value
              )
            }
          />

          <input
            style={styles.input}
            placeholder="Patient Name"
            value={patientName}
            onChange={(e) =>
              setPatientName(
                e.target.value
              )
            }
          />

          <input
            style={styles.input}
            placeholder="Diagnosis"
            value={diagnosis}
            onChange={(e) =>
              setDiagnosis(
                e.target.value
              )
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

          <select
            style={styles.input}
            value={doctorId}
            onChange={(e) =>
              setDoctorId(
                e.target.value
              )
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

        <div style={styles.doctorPreview}>
          🩺 Selected Doctor:{" "}
          <strong>
            {selectedDoctor.name}
          </strong>{" "}
          (
          {
            selectedDoctor.specialization
          }
          )
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
      </div>

      {/* APPOINTMENTS TABLE */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>
          📅 Appointments
        </h2>

        <div
          style={{ overflowX: "auto" }}
        >
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Appointment</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Diagnosis</th>
                <th>Fee</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map(
                (a, i) => (
                  <tr key={i}>
                    <td>
                      {
                        a.appointmentId
                      }
                    </td>

                    <td>
                      {
                        a.patientName
                      }
                    </td>

                    <td>
                      {a.doctorName}
                    </td>

                    <td>
                      {
                        a.specialization
                      }
                    </td>

                    <td>
                      {a.diagnosis}
                    </td>

                    <td>
                      ₹{a.fee}
                    </td>

                    <td>
                      <button
                        style={
                          styles.btnBlue
                        }
                        onClick={() =>
                          dischargePatient(
                            a.appointmentId
                          )
                        }
                      >
                        Discharge
                      </button>

                      <button
                        style={
                          styles.btnPurple
                        }
                        onClick={() =>
                          prescribe(
                            a
                          )
                        }
                      >
                        Prescribe
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* OUTPUT */}
      <div style={styles.output}>
        <h3>🖥 System Output</h3>

        <pre style={styles.pre}>
          {output}
        </pre>
      </div>
    </div>
  );
}

// ───────────────── STYLES ─────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    padding: 30,
    fontFamily: "Segoe UI",
    color: "#0f172a",
  },

  header: {
    textAlign: "center",
    marginBottom: 30,
  },

  heading: {
    margin: 0,
    fontSize: 38,
  },

  subheading: {
    color: "#64748b",
  },

  stats: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: 20,
    marginBottom: 25,
  },

  statCard: {
    background: "white",
    borderRadius: 16,
    padding: 25,
    textAlign: "center",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.05)",
  },

  card: {
    background: "white",
    padding: 25,
    borderRadius: 16,
    marginBottom: 25,
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.05)",
  },

  sectionTitle: {
    marginBottom: 20,
    textAlign: "center",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(240px,1fr))",
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

  doctorPreview: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },

  buttonGroup: {
    display: "flex",
    gap: 10,
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
    marginRight: 8,
    cursor: "pointer",
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

  output: {
    background: "#0f172a",
    color: "white",
    padding: 20,
    borderRadius: 16,
  },

  pre: {
    whiteSpace: "pre-wrap",
  },
};

export default App;