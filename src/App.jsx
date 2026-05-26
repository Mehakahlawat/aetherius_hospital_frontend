import { useEffect, useState } from "react";

// ───────────────── BACKEND URL ─────────────────
const BASE_URL =
  "https://hospital-management-system-2lbo.onrender.com";

function App() {
  // ───────────────── STATES ─────────────────
  const [appointments, setAppointments] =
    useState([]);

  const [appointmentId, setAppointmentId] =
    useState("");

  const [patientId, setPatientId] =
    useState("");

  const [patientName, setPatientName] =
    useState("");

  const [diagnosis, setDiagnosis] =
    useState("");

  const [fee, setFee] = useState("");

  const [doctorId, setDoctorId] =
    useState("D01");

  const [output, setOutput] =
    useState("");

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

  const selectedDoctor = doctors.find(
    (doctor) => doctor.id === doctorId
  );

  // ───────────────── FETCH APPOINTMENTS ─────────────────
  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/appointments`
      );

      const data = await response.json();

      setAppointments(data);
    } catch (error) {
      console.log(error);

      setOutput(
        "❌ Failed to fetch appointments"
      );
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ───────────────── BOOK APPOINTMENT ─────────────────
  const bookAppointment = async () => {
    // VALIDATION

    if (
      !appointmentId ||
      !patientId ||
      !patientName ||
      !diagnosis ||
      !fee
    ) {
      setOutput(
        "⚠️ Please fill all fields"
      );

      return;
    }

    const payload = {
      appointmentId:
        Number(appointmentId),

      patientId: patientId,

      patientName: patientName,

      doctorId: selectedDoctor.id,

      doctorName:
        selectedDoctor.name,

      specialization:
        selectedDoctor.specialization,

      slotNumber:
        appointments.length + 1,

      diagnosis: diagnosis,

      fee: Number(fee),
    };

    try {
      const response = await fetch(
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

      const message =
        await response.text();

      if (!response.ok) {
        setOutput(`❌ ${message}`);
        return;
      }

      setOutput(`
✅ APPOINTMENT BOOKED SUCCESSFULLY

Patient: ${patientName}

Doctor: ${selectedDoctor.name}

Specialization: ${selectedDoctor.specialization}

Diagnosis: ${diagnosis}

Consultation Fee: ₹${fee}
`);

      clearFields();

      fetchAppointments();
    } catch (error) {
      console.log(error);

      setOutput(
        "❌ Failed to book appointment"
      );
    }
  };

  // ───────────────── DISCHARGE PATIENT ─────────────────
  const dischargePatient = async (
    appointment
  ) => {
    const hours = prompt(
      "Enter admission hours:"
    );

    if (!hours) return;

    const admittedHours =
      Number(hours);

    const roomCharges =
      admittedHours * 500;

    const consultationFee =
      Number(appointment.fee);

    const totalBill =
      roomCharges + consultationFee;

    const confirmDischarge =
      window.confirm(`
PATIENT BILL

Patient: ${appointment.patientName}

Doctor: ${appointment.doctorName}

Diagnosis: ${appointment.diagnosis}

Consultation Fee: ₹${consultationFee}

Room Charges: ₹${roomCharges}

TOTAL BILL: ₹${totalBill}

Proceed with discharge?
`);

    if (!confirmDischarge) {
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/appointments/${appointment.appointmentId}`,
        {
          method: "DELETE",
        }
      );

      const message =
        await response.text();

      if (!response.ok) {
        setOutput(`❌ ${message}`);
        return;
      }

      setOutput(`
✅ PATIENT DISCHARGED SUCCESSFULLY

Patient: ${appointment.patientName}

Diagnosis: ${appointment.diagnosis}

Admission Hours: ${admittedHours}

Consultation Fee: ₹${consultationFee}

Room Charges: ₹${roomCharges}

TOTAL BILL: ₹${totalBill}
`);

      fetchAppointments();
    } catch (error) {
      console.log(error);

      setOutput(
        "❌ Failed to discharge patient"
      );
    }
  };

  // ───────────────── PRESCRIPTION ─────────────────
  const prescribeMedicine = (
    appointment
  ) => {
    const medicine = prompt(
      "Enter medicine name:"
    );

    if (!medicine) return;

    setOutput(`
💊 PRESCRIPTION

Patient: ${appointment.patientName}

Doctor: ${appointment.doctorName}

Specialization: ${appointment.specialization}

Diagnosis: ${appointment.diagnosis}

Medicine: ${medicine}

Instructions:
• Take medicine after meals
• Drink enough water
• Follow-up after 3 days
`);
  };

  // ───────────────── CLEAR FIELDS ─────────────────
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
    (sum, appointment) =>
      sum +
      Number(appointment.fee || 0),
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
          Smart Hospital Management
          System
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

          <p>
            {20 - appointments.length}
          </p>
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
            {doctors.map((doctor) => (
              <option
                key={doctor.id}
                value={doctor.id}
              >
                {doctor.name} —{" "}
                {
                  doctor.specialization
                }
              </option>
            ))}
          </select>
        </div>

        <div style={styles.doctorBox}>
          🩺 Selected Doctor:
          <strong>
            {" "}
            {selectedDoctor.name}
          </strong>
          {" • "}
          {
            selectedDoctor.specialization
          }
        </div>

        <div style={styles.buttonGroup}>
          <button
            style={styles.primaryButton}
            onClick={bookAppointment}
          >
            Book Appointment
          </button>

          <button
            style={styles.dangerButton}
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
              {appointments.map(
                (appointment) => (
                  <tr
                    key={
                      appointment.appointmentId
                    }
                  >
                    <td>
                      {
                        appointment.appointmentId
                      }
                    </td>

                    <td>
                      {
                        appointment.patientName
                      }
                    </td>

                    <td>
                      {
                        appointment.doctorName
                      }
                    </td>

                    <td>
                      {
                        appointment.specialization
                      }
                    </td>

                    <td>
                      {
                        appointment.diagnosis
                      }
                    </td>

                    <td>
                      ₹
                      {appointment.fee}
                    </td>

                    <td>
                      <button
                        style={
                          styles.dischargeButton
                        }
                        onClick={() =>
                          dischargePatient(
                            appointment
                          )
                        }
                      >
                        Discharge
                      </button>

                      <button
                        style={
                          styles.prescribeButton
                        }
                        onClick={() =>
                          prescribeMedicine(
                            appointment
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
      <div style={styles.outputBox}>
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
    padding: "30px",
    fontFamily: "Segoe UI",
  },

  header: {
    textAlign: "center",
    marginBottom: "30px",
  },

  heading: {
    fontSize: "42px",
    color: "#0f172a",
    margin: 0,
  },

  subheading: {
    color: "#64748b",
    marginTop: "10px",
  },

  stats: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
    marginBottom: "25px",
  },

  statCard: {
    background: "white",
    padding: "25px",
    borderRadius: "18px",
    textAlign: "center",
    boxShadow:
      "0 4px 14px rgba(0,0,0,0.08)",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "18px",
    marginBottom: "25px",
    boxShadow:
      "0 4px 14px rgba(0,0,0,0.08)",
  },

  sectionTitle: {
    textAlign: "center",
    marginBottom: "22px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(240px,1fr))",
    gap: "15px",
    marginBottom: "20px",
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
  },

  doctorBox: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "18px",
    textAlign: "center",
  },

  buttonGroup: {
    display: "flex",
    gap: "12px",
  },

  primaryButton: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  dangerButton: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  dischargeButton: {
    background: "#0ea5e9",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    marginRight: "8px",
    cursor: "pointer",
  },

  prescribeButton: {
    background: "#7c3aed",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  outputBox: {
    background: "#0f172a",
    color: "white",
    padding: "20px",
    borderRadius: "18px",
  },

  pre: {
    whiteSpace: "pre-wrap",
    lineHeight: "1.6",
  },
};

export default App;