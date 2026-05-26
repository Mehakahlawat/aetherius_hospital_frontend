import { useEffect, useState } from "react";

// ───────────────── BACKEND URL ─────────────────
const BASE_URL =
  "https://hospital-management-system-2lbo.onrender.com";

function App() {
  // ───────────────── STATES ─────────────────
  const [appointments, setAppointments] =
    useState([]);

  const [hospitalRevenue, setHospitalRevenue] =
    useState(0);

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

      // CONSULTATION REVENUE
      const consultationRevenue =
        data.reduce(
          (sum, appointment) =>
            sum +
            Number(
              appointment.fee || 0
            ),
          0
        );

      // ROOM REVENUE
      const storedRoomRevenue =
        Number(
          localStorage.getItem(
            "roomRevenue"
          )
        ) || 0;

      setHospitalRevenue(
        consultationRevenue +
          storedRoomRevenue
      );
    } catch (error) {
      console.log(error);

      setOutput(
        " Failed to fetch appointments"
      );
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
      setOutput(
        "Please fill all fields"
      );

      return;
    }

    // APPOINTMENT PAYLOAD
    const appointmentPayload = {
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

    // PATIENT PAYLOAD
    const patientPayload = {
      id: patientId,

      name: patientName,

      diagnosis: diagnosis,

      fee: Number(fee),
    };

    // DOCTOR PAYLOAD
    const doctorPayload = {
      id: selectedDoctor.id,

      name: selectedDoctor.name,

      specialization:
        selectedDoctor.specialization,
    };

    try {
      // STORE PATIENT
      await fetch(
        `${BASE_URL}/patients`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            patientPayload
          ),
        }
      );

      // STORE DOCTOR
      await fetch(
        `${BASE_URL}/doctors`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            doctorPayload
          ),
        }
      );

      // STORE APPOINTMENT
      const response = await fetch(
        `${BASE_URL}/appointments`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            appointmentPayload
          ),
        }
      );

      const message =
        await response.text();

      if (!response.ok) {
        setOutput(` ${message}`);
        return;
      }

      setOutput(`
 APPOINTMENT BOOKED SUCCESSFULLY

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
        " Failed to book appointment"
      );
    }
  };

  // ───────────────── DISCHARGE PATIENT ─────────────────
  const dischargePatient = async (
    appointment
  ) => {
    // ASK HOURS
    const hours = prompt(
      "Enter admission hours:"
    );

    if (!hours) return;

    // ASK ROOM RATE
    const roomRate = prompt(
      "Enter room charge per hour:"
    );

    if (!roomRate) return;

    const admittedHours =
      Number(hours);

    const roomChargePerHour =
      Number(roomRate);

    // VALIDATION
    if (
      isNaN(admittedHours) ||
      isNaN(roomChargePerHour)
    ) {
      setOutput(
        " Invalid input values"
      );

      return;
    }

    // CALCULATIONS
    const roomCharges =
      admittedHours *
      roomChargePerHour;

    const consultationFee =
      Number(appointment.fee);

    const totalBill =
      roomCharges +
      consultationFee;

    // CONFIRMATION
    const confirmDischarge =
      window.confirm(`
PATIENT BILL

Patient: ${appointment.patientName}

Doctor: ${appointment.doctorName}

Diagnosis: ${appointment.diagnosis}

Admission Hours: ${admittedHours}

Room Charge Per Hour: ₹${roomChargePerHour}

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
        setOutput(` ${message}`);
        return;
      }

      // STORE ROOM REVENUE
      const previousRevenue =
        Number(
          localStorage.getItem(
            "roomRevenue"
          )
        ) || 0;

      const updatedRevenue =
        previousRevenue +
        roomCharges;

      localStorage.setItem(
        "roomRevenue",
        updatedRevenue
      );

      setOutput(`
PATIENT DISCHARGED SUCCESSFULLY

Patient: ${appointment.patientName}

Diagnosis: ${appointment.diagnosis}

Admission Hours: ${admittedHours}

Room Charge Per Hour: ₹${roomChargePerHour}

Consultation Fee: ₹${consultationFee}

Room Charges: ₹${roomCharges}

TOTAL BILL: ₹${totalBill}
`);

      fetchAppointments();
    } catch (error) {
      console.log(error);

      setOutput(
        " Failed to discharge patient"
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
 PRESCRIPTION

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

  // ───────────────── CLEAR ─────────────────
  const clearFields = () => {
    setAppointmentId("");
    setPatientId("");
    setPatientName("");
    setDiagnosis("");
    setFee("");
    setDoctorId("D01");
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.heading}>
           Aetherius Hospital
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

          <p style={styles.statNumber}>
            {appointments.length}
          </p>
        </div>

        <div style={styles.statCard}>
          <h3>Available Slots</h3>

          <p style={styles.statNumber}>
            {20 - appointments.length}
          </p>
        </div>

        <div style={styles.statCard}>
          <h3>Total Revenue</h3>

          <p style={styles.statNumber}>
            ₹{hospitalRevenue}
          </p>
        </div>
      </div>

      {/* BOOK APPOINTMENT */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>
           Book Appointment
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
            style={styles.secondaryButton}
            onClick={clearFields}
          >
            Clear
          </button>
        </div>
      </div>

      {/* APPOINTMENT TABLE */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>
           Appointments
        </h2>

        <div
          style={{ overflowX: "auto" }}
        >
          <table style={styles.table}>
            <thead>
              <tr
                style={styles.tableHeader}
              >
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
                    style={
                      styles.tableRow
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
    background:
      "linear-gradient(to bottom right, #eff6ff, #f0fdf4)",
    padding: "30px",
    fontFamily: "Segoe UI",
    color: "#1e293b",
  },

  header: {
    textAlign: "center",
    marginBottom: "35px",
  },

  heading: {
    fontSize: "46px",
    color: "#0f172a",
    margin: 0,
    fontWeight: "700",
  },

  subheading: {
    color: "#475569",
    marginTop: "10px",
    fontSize: "17px",
  },

  stats: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "22px",
    marginBottom: "30px",
  },

  statCard: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "20px",
    textAlign: "center",
    border: "1px solid #dbeafe",
    boxShadow:
      "0 6px 18px rgba(59,130,246,0.08)",
  },

  statNumber: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#2563eb",
  },

  card: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "20px",
    marginBottom: "28px",
    border: "1px solid #dcfce7",
    boxShadow:
      "0 6px 18px rgba(34,197,94,0.08)",
  },

  sectionTitle: {
    textAlign: "center",
    marginBottom: "24px",
    color: "#0f172a",
    fontSize: "26px",
    fontWeight: "700",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(240px,1fr))",
    gap: "16px",
    marginBottom: "22px",
  },

  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #bfdbfe",
    fontSize: "14px",
    background: "#f8fafc",
    color: "#0f172a",
    outline: "none",
  },

  doctorBox: {
    background:
      "linear-gradient(to right, #dbeafe, #dcfce7)",
    color: "#0f172a",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "20px",
    textAlign: "center",
    fontWeight: "600",
  },

  buttonGroup: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
  },

  primaryButton: {
    background:
      "linear-gradient(to right, #2563eb, #0ea5e9)",
    color: "white",
    border: "none",
    padding: "13px 22px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },

  secondaryButton: {
    background:
      "linear-gradient(to right, #16a34a, #22c55e)",
    color: "white",
    border: "none",
    padding: "13px 22px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
  },

  tableHeader: {
    background: "#dbeafe",
    color: "#0f172a",
    height: "50px",
  },

  tableRow: {
    textAlign: "center",
    borderBottom:
      "1px solid #e2e8f0",
    height: "60px",
  },

  dischargeButton: {
    background:
      "linear-gradient(to right, #0ea5e9, #2563eb)",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "10px",
    marginRight: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  prescribeButton: {
    background:
      "linear-gradient(to right, #16a34a, #22c55e)",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  outputBox: {
    background:
      "linear-gradient(to bottom right, #0f172a, #1e293b)",
    color: "#f8fafc",
    padding: "24px",
    borderRadius: "20px",
    boxShadow:
      "0 6px 18px rgba(15,23,42,0.25)",
  },

  pre: {
    whiteSpace: "pre-wrap",
    lineHeight: "1.8",
    color: "#e2e8f0",
    fontSize: "14px",
  },
};

export default App;