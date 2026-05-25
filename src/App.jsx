import { useEffect, useState } from "react";

const BASE_URL = "https://hospital-management-system-2lbo.onrender.com";

function App() {
  // ================= PATIENT STATES =================
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [fee, setFee] = useState("");

  const [hours, setHours] = useState("");
  const [output, setOutput] = useState("");

  // ================= DOCTORS DATA =================
  const doctors = [
    { id: "D01", name: "Sharma", specialization: "Cardiology" },
    { id: "D02", name: "Mehta", specialization: "Neurology" },
    { id: "D03", name: "Verma", specialization: "Orthopedics" },
    { id: "D04", name: "Kapoor", specialization: "Dermatology" },
    { id: "D05", name: "Iyer", specialization: "Pediatrics" }
  ];

  const [doctorId, setDoctorId] = useState("D01");
  const selectedDoctor = doctors.find((d) => d.id === doctorId);

  // ================= APPOINTMENTS =================
  const [appointments, setAppointments] = useState([]);

  // ================= FETCH APPOINTMENTS =================
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

  // ================= BOOK APPOINTMENT =================
  const bookAppointment = async () => {
    try {
      const res = await fetch(`${BASE_URL}/addPatient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: patientId,
          name: patientName,
          diagnosis,
          fee: Number(fee),
          doctorId: selectedDoctor.id,
          doctorName: selectedDoctor.name,
          specialization: selectedDoctor.specialization
        })
      });

      setOutput("✅ Appointment Booked Successfully");
      fetchAppointments();
    } catch {
      setOutput("❌ Booking failed (backend error)");
    }
  };

  // ================= DISCHARGE =================
  const dischargePatient = async (id) => {
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

  // ================= PRESCRIPTION =================
  const prescribe = (name) => {
    const med = prompt("Enter medicine:");
    if (!med) return;

    setOutput(
      `💊 PRESCRIPTION\n\nPatient: ${name}\nDoctor: ${selectedDoctor.name}\nSpecialization: ${selectedDoctor.specialization}\nMedicine: ${med}`
    );
  };

  // ================= CLEAR =================
  const clearFields = () => {
    setPatientId("");
    setPatientName("");
    setDiagnosis("");
    setFee("");
    setDoctorId("D01");
    setOutput("");
  };

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        🏥 Aetherius Hospital Management Dashboard
      </div>

      {/* STATS */}
      <div style={styles.stats}>
        <div style={styles.cardSmall}>
          Total Appointments: {appointments.length}
        </div>
        <div style={styles.cardSmall}>
          Available Slots: {5 - appointments.length}
        </div>
      </div>

      {/* BOOK SECTION */}
      <div style={styles.card}>
        <h2>Book Appointment</h2>

        <div style={styles.grid}>
          <input style={styles.input}
            placeholder="Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />

          <input style={styles.input}
            placeholder="Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />

          <input style={styles.input}
            placeholder="Diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />

          <input style={styles.input}
            placeholder="Fee Per Hour"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
          />

          {/* DOCTOR DROPDOWN */}
          <select
            style={styles.input}
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          >
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.id} - {doc.name} ({doc.specialization})
              </option>
            ))}
          </select>
        </div>

        <button onClick={bookAppointment} style={styles.btnGreen}>
          Book Appointment
        </button>

        <button onClick={clearFields} style={styles.btnRed}>
          Clear
        </button>
      </div>

      {/* DISCHARGE */}
      <div style={styles.card}>
        <h2>Discharge Patient</h2>

        <input style={styles.input}
          placeholder="Hours stayed"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />

        <p>Select patient from table below</p>
      </div>

      {/* TABLE */}
      <div style={styles.card}>
        <h2>Appointments</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Doctor</th>
              <th>Specialization</th>
              <th>Diagnosis</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((a, i) => (
              <tr key={i}>
                <td>{a.id}</td>
                <td>{a.name}</td>
                <td>{a.doctorName || "N/A"}</td>
                <td>{a.specialization || "N/A"}</td>
                <td>{a.diagnosis}</td>
                <td>
                  <button style={styles.btnBlue}
                    onClick={() => dischargePatient(a.id)}>
                    Discharge
                  </button>

                  <button style={styles.btnPurple}
                    onClick={() => prescribe(a.name)}>
                    Prescribe
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* OUTPUT */}
      <div style={styles.output}>
        <pre>{output}</pre>
      </div>
    </div>
  );
}

// ================= STYLES =================
const styles = {
  page: {
    background: "#0f172a",
    color: "white",
    minHeight: "100vh",
    padding: 20,
    fontFamily: "Arial"
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20
  },

  stats: {
    display: "flex",
    justifyContent: "center",
    gap: 20,
    marginBottom: 20
  },

  cardSmall: {
    background: "#1e293b",
    padding: 15,
    borderRadius: 10
  },

  card: {
    background: "#1e293b",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 10
  },

  input: {
    padding: 10,
    borderRadius: 8,
    border: "none",
    outline: "none"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  btnGreen: {
    background: "#22c55e",
    padding: 10,
    border: "none",
    marginRight: 10,
    color: "white",
    cursor: "pointer"
  },

  btnRed: {
    background: "#ef4444",
    padding: 10,
    border: "none",
    color: "white",
    cursor: "pointer"
  },

  btnBlue: {
    background: "#3b82f6",
    marginRight: 5,
    border: "none",
    color: "white",
    cursor: "pointer"
  },

  btnPurple: {
    background: "#a855f7",
    border: "none",
    color: "white",
    cursor: "pointer"
  },

  output: {
    background: "#111827",
    padding: 15,
    borderRadius: 10
  }
};

export default App;