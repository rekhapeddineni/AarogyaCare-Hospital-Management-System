import React, { useEffect, useState } from "react";
import "./Chatbot.css";

const API_URL = "https://aarogyacare-backend.onrender.com/api";

function Chatbot() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [doctors, setDoctors] = useState([]);

    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hello! 👋 Welcome to AarogyaCare. How can I help you today?"
        }
    ]);

    // =========================================================
    // LOAD DOCTORS FROM DATABASE
    // =========================================================

    useEffect(() => {
        loadDoctors();

        // Refresh doctor data periodically so newly added doctors
        // can automatically appear in the chatbot.
        const interval = setInterval(() => {
            loadDoctors();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const loadDoctors = async () => {
        try {
            const response = await fetch(`${API_URL}/doctors/`);

            if (!response.ok) {
                throw new Error("Doctor API failed");
            }

            const data = await response.json();

            console.log("Doctors loaded from database:", data);

            if (Array.isArray(data)) {
                setDoctors(data);
            } else if (Array.isArray(data.results)) {
                setDoctors(data.results);
            } else {
                setDoctors([]);
            }
        } catch (error) {
            console.error("Doctor loading error:", error);
            setDoctors([]);
        }
    };

    // =========================================================
    // NORMALIZE TEXT
    // =========================================================

    const normalize = (text) => {
        return String(text || "")
            .toLowerCase()
            .replace(/[^\w\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    };

    // =========================================================
    // GET ALL DEPARTMENTS FROM DATABASE
    // =========================================================

    const getDepartments = () => {
        if (!Array.isArray(doctors)) {
            return [];
        }

        const departments = [];

        doctors.forEach((doctor) => {
            const department = (doctor.department || "").trim();

            if (!department) {
                return;
            }

            const alreadyExists = departments.some(
                (item) =>
                    normalize(item) === normalize(department)
            );

            if (!alreadyExists) {
                departments.push(department);
            }
        });

        return departments;
    };

    // =========================================================
    // FIND DEPARTMENT DYNAMICALLY
    // =========================================================

    const findDepartment = (userText) => {
        const text = normalize(userText);

        if (!text || !Array.isArray(doctors)) {
            return null;
        }

        const scores = {};

        doctors.forEach((doctor) => {
            const department =
                (doctor.department || "").trim();

            const specialization =
                (doctor.specialization || "").trim();

            const keywords =
                (doctor.keywords || "").trim();

            if (!department) {
                return;
            }

            const departmentKey = normalize(department);

            if (!scores[departmentKey]) {
                scores[departmentKey] = {
                    score: 0,
                    department: department
                };
            }

            // -------------------------------------------------
            // DEPARTMENT MATCH
            // -------------------------------------------------

            const departmentText = normalize(department);

            if (
                departmentText &&
                (
                    text.includes(departmentText) ||
                    departmentText.includes(text)
                )
            ) {
                scores[departmentKey].score += 30;
            }

            // -------------------------------------------------
            // SPECIALIZATION MATCH
            // -------------------------------------------------

            const specializationText =
                normalize(specialization);

            if (specializationText) {
                if (text.includes(specializationText)) {
                    scores[departmentKey].score += 30;
                }

                // Match individual specialization words
                specializationText
                    .split(" ")
                    .filter((word) => word.length > 2)
                    .forEach((word) => {
                        if (text.includes(word)) {
                            scores[departmentKey].score += 8;
                        }
                    });
            }

            // -------------------------------------------------
            // KEYWORDS FROM DATABASE
            // -------------------------------------------------

            const keywordList = keywords
                .split(",")
                .map((keyword) => normalize(keyword))
                .filter(Boolean);

            keywordList.forEach((keyword) => {
                if (text.includes(keyword)) {
                    scores[departmentKey].score += 50;
                }
            });

            // -------------------------------------------------
            // INDIVIDUAL DEPARTMENT WORDS
            // -------------------------------------------------

            departmentText
                .split(" ")
                .filter((word) => word.length > 2)
                .forEach((word) => {
                    if (text.includes(word)) {
                        scores[departmentKey].score += 10;
                    }
                });
        });

        let bestDepartment = null;
        let bestScore = 0;

        Object.values(scores).forEach((item) => {
            if (item.score > bestScore) {
                bestScore = item.score;
                bestDepartment = item.department;
            }
        });

        return bestDepartment;
    };

    // =========================================================
    // FIND DOCTOR FROM DATABASE
    // =========================================================

    const findDoctorForDepartment = (department) => {
        if (
            !department ||
            !Array.isArray(doctors) ||
            doctors.length === 0
        ) {
            return null;
        }

        const requestedDepartment =
            normalize(department);

        const doctor = doctors.find((item) => {
            const doctorDepartment =
                normalize(item.department || "");

            return (
                doctorDepartment === requestedDepartment ||
                doctorDepartment.includes(requestedDepartment) ||
                requestedDepartment.includes(doctorDepartment)
            );
        });

        return doctor || null;
    };

    // =========================================================
    // DEPARTMENT RESPONSE - FULLY DYNAMIC
    // =========================================================

    const getDepartmentReply = (department) => {
        const doctor =
            findDoctorForDepartment(department);

        let reply = `🏥 ${department}

This department is available at AarogyaCare Hospital.`;

        if (doctor) {
            reply += `

👨‍⚕️ Recommended Doctor

${doctor.doctor_name || "Doctor name unavailable"}

🩺 ${
                doctor.specialization ||
                "Specialization not specified"
            }`;

            if (
                doctor.experience !== undefined &&
                doctor.experience !== null
            ) {
                reply += ` • ${doctor.experience} years experience`;
            }

            if (doctor.doctor_id) {
                reply += `

Doctor ID: ${doctor.doctor_id}`;
            }
        } else {
            reply += `

👨‍⚕️ Recommended Doctor

No doctor is currently registered for this department.`;
        }

        reply += `

Please consult the doctor for proper evaluation and treatment. 🩺`;

        return reply;
    };

    // =========================================================
    // EMERGENCY CHECK
    // =========================================================

    const isEmergency = (text) => {
        const emergencyWords = [
            "severe chest pain",
            "crushing chest pain",
            "heavy chest pain",
            "chest pain and sweating",
            "chest pain and fainting",
            "chest pain and difficulty breathing",
            "unable to breathe",
            "not breathing",
            "unconscious",
            "unresponsive",
            "face drooping",
            "one side of body weak",
            "sudden paralysis",
            "sudden loss of vision",
            "heavy bleeding",
            "uncontrolled bleeding",
            "severe bleeding",
            "continuous seizure",
            "severe allergic reaction",
            "anaphylaxis",
            "poisoning",
            "overdose"
        ];

        return emergencyWords.some((word) =>
            text.includes(word)
        );
    };

    // =========================================================
    // EMERGENCY RESPONSE
    // =========================================================

    const getEmergencyReply = () => {
        return `🚨 EMERGENCY

Your message may describe a potentially serious medical situation.

Please seek emergency medical care immediately or contact your local emergency service.

If you are already at the hospital, inform the emergency or medical staff immediately.

Do not wait for a chatbot response if symptoms are severe, sudden or getting worse.`;
    };

    // =========================================================
    // DOCTORS LIST - DYNAMIC
    // =========================================================

    const getDoctorsReply = () => {
        if (
            !Array.isArray(doctors) ||
            doctors.length === 0
        ) {
            return `👨‍⚕️ Doctors

No doctors are currently available in the database.`;
        }

        let reply =
            "👨‍⚕️ Doctors Available in AarogyaCare\n\n";

        doctors.forEach((doctor, index) => {
            reply += `${index + 1}. ${
                doctor.doctor_name || "Doctor"
            }

Specialization: ${
                doctor.specialization ||
                "Not specified"
            }

Department: ${
                doctor.department ||
                "Not specified"
            }`;

            if (
                doctor.experience !== undefined &&
                doctor.experience !== null
            ) {
                reply += `
Experience: ${doctor.experience} years`;
            }

            if (doctor.doctor_id) {
                reply += `
Doctor ID: ${doctor.doctor_id}`;
            }

            reply += "\n\n";
        });

        return reply.trim();
    };

    // =========================================================
    // DEPARTMENT LIST - DYNAMIC
    // =========================================================

    const getDepartmentsReply = () => {
        const departments = getDepartments();

        if (departments.length === 0) {
            return `🏥 AarogyaCare Departments

No departments are currently available in the Doctors database.`;
        }

        let reply = "🏥 AarogyaCare Departments\n\n";

        departments.forEach((department, index) => {
            reply += `${index + 1}. ${department}\n`;
        });

        reply += `
You can type a department name or describe your symptoms.`;

        return reply;
    };

    // =========================================================
    // APPOINTMENTS
    // =========================================================

    const getAppointmentsReply = () => {
        return `📅 Appointments

You can book and manage appointments from the Appointments module.

You can select:

• Patient
• Doctor
• Appointment date
• Appointment time
• Appointment status`;
    };

    // =========================================================
    // PATIENTS
    // =========================================================

    const getPatientsReply = () => {
        return `👤 Patients

The Patients module allows you to:

• Add patients
• View patient records
• Edit patient information
• Delete patient records

Patient information is stored in the hospital database.`;
    };

    // =========================================================
    // ADMISSIONS
    // =========================================================

    const getAdmissionsReply = () => {
        return `🏥 Admissions

The Admissions module allows you to manage:

• Patient admissions
• Admission dates
• Room information
• Admission status
• Patient admission records`;
    };

    // =========================================================
    // PHARMACY
    // =========================================================

    const getPharmacyReply = () => {
        return `💊 Pharmacy

The Pharmacy module allows you to manage:

• Medicines
• Medicine stock
• Prices
• Manufacturers
• Batch numbers
• Expiry dates`;
    };

    // =========================================================
    // LABORATORY
    // =========================================================

    const getLaboratoryReply = () => {
        return `🧪 Laboratory

The Laboratory module allows you to manage:

• Lab tests
• Patient test records
• Test results
• Laboratory information`;
    };

    // =========================================================
    // BILLING
    // =========================================================

    const getBillingReply = () => {
        return `💳 Billing

The Billing module allows you to manage:

• Patient bills
• Consultation charges
• Hospital charges
• Payment information
• Billing records`;
    };

    // =========================================================
    // MAIN BOT RESPONSE
    // =========================================================

    const getBotReply = (userMessage) => {
        const text = normalize(userMessage);

        // -----------------------------------------------------
        // EMERGENCY
        // -----------------------------------------------------

        if (isEmergency(text)) {
            return getEmergencyReply();
        }

        // -----------------------------------------------------
        // GREETINGS
        // -----------------------------------------------------

        if (
            text === "hi" ||
            text === "hello" ||
            text === "hey" ||
            text.includes("good morning") ||
            text.includes("good afternoon") ||
            text.includes("good evening")
        ) {
            return `Hello! 👋

Welcome to AarogyaCare Hospital.

You can describe your symptoms in your own words.

You can also ask me about:

👨‍⚕️ Doctors
🏥 Departments
📅 Appointments
👤 Patients
💊 Pharmacy
🧪 Laboratory
💳 Billing`;
        }

        // -----------------------------------------------------
        // DOCTORS
        // -----------------------------------------------------

        if (
            text === "doctor" ||
            text === "doctors" ||
            text.includes("doctor list") ||
            text.includes("list of doctors") ||
            text.includes("show doctors") ||
            text.includes("available doctors") ||
            text.includes("which doctors")
        ) {
            return getDoctorsReply();
        }

        // -----------------------------------------------------
        // DEPARTMENTS
        // -----------------------------------------------------

        if (
            text === "department" ||
            text === "departments" ||
            text.includes("department list") ||
            text.includes("list of departments") ||
            text.includes("hospital departments") ||
            text.includes("show departments")
        ) {
            return getDepartmentsReply();
        }

        // -----------------------------------------------------
        // APPOINTMENTS
        // -----------------------------------------------------

        if (
            text.includes("appointment") ||
            text.includes("book doctor") ||
            text.includes("book appointment") ||
            text.includes("schedule appointment") ||
            text.includes("doctor appointment")
        ) {
            return getAppointmentsReply();
        }

        // -----------------------------------------------------
        // PATIENTS
        // -----------------------------------------------------

        if (
            text === "patient" ||
            text === "patients" ||
            text.includes("patient records") ||
            text.includes("patient record") ||
            text.includes("patient details") ||
            text.includes("patient list")
        ) {
            return getPatientsReply();
        }

        // -----------------------------------------------------
        // ADMISSIONS
        // -----------------------------------------------------

        if (
            text.includes("admission") ||
            text.includes("admissions") ||
            text.includes("admit patient") ||
            text.includes("hospital admission")
        ) {
            return getAdmissionsReply();
        }

        // -----------------------------------------------------
        // PHARMACY
        // -----------------------------------------------------

        if (
            text.includes("pharmacy") ||
            text === "medicine" ||
            text === "medicines" ||
            text.includes("medicine stock") ||
            text.includes("medical stock")
        ) {
            return getPharmacyReply();
        }

        // -----------------------------------------------------
        // LABORATORY
        // -----------------------------------------------------

        if (
            text === "lab" ||
            text.includes("laboratory") ||
            text.includes("lab test") ||
            text.includes("lab tests") ||
            text.includes("blood test") ||
            text.includes("test report") ||
            text.includes("lab report")
        ) {
            return getLaboratoryReply();
        }

        // -----------------------------------------------------
        // BILLING
        // -----------------------------------------------------

        if (
            text === "bill" ||
            text === "billing" ||
            text.includes("hospital bill") ||
            text.includes("bill details") ||
            text.includes("payment") ||
            text.includes("billing details")
        ) {
            return getBillingReply();
        }

        // -----------------------------------------------------
        // THANKS
        // -----------------------------------------------------

        if (
            text === "thanks" ||
            text === "thank you" ||
            text.includes("thanks a lot")
        ) {
            return `You're welcome! 😊

AarogyaCare is always here to help. 🏥`;
        }

        // -----------------------------------------------------
        // GOODBYE
        // -----------------------------------------------------

        if (
            text === "bye" ||
            text === "goodbye" ||
            text.includes("see you")
        ) {
            return `Goodbye! 👋

Take care and stay healthy! 🩺`;
        }

        // -----------------------------------------------------
        // DYNAMIC DEPARTMENT / SYMPTOM DETECTION
        // -----------------------------------------------------

        const department = findDepartment(text);

        if (department) {
            return getDepartmentReply(department);
        }

        // -----------------------------------------------------
        // UNKNOWN MESSAGE
        // -----------------------------------------------------

        return `I couldn't identify the appropriate department from that description.

Please try describing your problem using the symptoms or keywords configured for our doctors.

You can also ask me:

👨‍⚕️ "Show doctors"
🏥 "Show departments"
📅 "Book an appointment"
👤 "Patient records"
💊 "Pharmacy"
🧪 "Laboratory"
💳 "Billing"`;
    };

    // =========================================================
    // SEND MESSAGE
    // =========================================================

    const sendMessage = () => {
        if (!message.trim()) {
            return;
        }

        const userMessage = message.trim();

        setMessages((previous) => [
            ...previous,
            {
                sender: "user",
                text: userMessage
            }
        ]);

        setMessage("");

        setTimeout(() => {
            const reply = getBotReply(userMessage);

            setMessages((previous) => [
                ...previous,
                {
                    sender: "bot",
                    text: reply
                }
            ]);
        }, 400);
    };

    // =========================================================
    // ENTER KEY
    // =========================================================

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    // =========================================================
    // UI
    // =========================================================

    return (
        <>
            <button
                className="chatbot-button"
                onClick={() => setOpen(!open)}
            >
                💬
            </button>

            {open && (
                <div className="chatbot-window">

                    {/* HEADER */}

                    <div className="chatbot-header">

                        <div>
                            <strong>
                                AarogyaCare Assistant
                            </strong>

                            <span>
                                🏥 Hospital Support
                            </span>
                        </div>

                        <button
                            onClick={() => setOpen(false)}
                        >
                            ✕
                        </button>

                    </div>

                    {/* MESSAGES */}

                    <div className="chatbot-messages">

                        {messages.map((msg, index) => (

                            <div
                                key={index}
                                className={
                                    msg.sender === "user"
                                        ? "chat-message user"
                                        : "chat-message bot"
                                }
                            >

                                <div>

                                    {msg.text
                                        .split("\n")
                                        .map((line, i) => (

                                            <React.Fragment
                                                key={i}
                                            >
                                                {line}

                                                {i <
                                                    msg.text.split(
                                                        "\n"
                                                    ).length - 1 && (
                                                    <br />
                                                )}

                                            </React.Fragment>

                                        ))}

                                </div>

                            </div>

                        ))}

                    </div>

                    {/* INPUT */}

                    <div className="chatbot-input">

                        <input
                            type="text"
                            placeholder="Ask about symptoms, doctors..."
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                            onKeyDown={handleKeyDown}
                        />

                        <button
                            onClick={sendMessage}
                        >
                            ➤
                        </button>

                    </div>

                </div>
            )}
        </>
    );
}

export default Chatbot;