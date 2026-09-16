import React, { useEffect, useState } from "react";
import "./Chatbot.css";

const API_URL = "https://aarogyacare-backend.onrender.com/api";

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [doctors, setDoctors] = useState([]);

    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hello! 👋 Welcome to AarogyaCare. How can I help you today?",
        },
    ]);

    // =====================================================
    // LOAD DOCTORS FROM BACKEND
    // =====================================================

    useEffect(() => {
        loadDoctors();

        const interval = setInterval(() => {
            loadDoctors();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const loadDoctors = async () => {
        try {
            const response = await fetch(`${API_URL}/doctors/`);

            if (!response.ok) {
                console.error("Doctors API error");
                return;
            }

            const data = await response.json();

            const doctorList = Array.isArray(data)
                ? data
                : data.results || [];

            setDoctors(doctorList);
        } catch (error) {
            console.error("Failed to load doctors:", error);
        }
    };

    // =====================================================
    // MEDICAL TERMS
    // =====================================================

    const medicalDepartments = {
        cardiology: [
            "heart",
            "cardiac",
            "cardiology",
            "chest pain",
            "heart pain",
            "heart problem",
            "heart disease",
            "heartbeat",
            "blood pressure",
            "bp",
            "palpitation",
            "palpitations",
            "shortness of breath",
        ],

        oncology: [
            "cancer",
            "tumor",
            "tumour",
            "oncology",
            "oncologist",
            "malignant",
            "chemotherapy",
            "chemo",
            "cancer treatment",
        ],

        neurology: [
            "brain",
            "neurology",
            "neurologist",
            "headache",
            "migraine",
            "seizure",
            "memory loss",
            "dizziness",
            "stroke",
            "nerve",
            "nerves",
        ],

        neurosurgery: [
            "neurosurgery",
            "neurosurgeon",
            "brain surgery",
            "spinal surgery",
            "spine surgery",
        ],

        orthopedics: [
            "bone",
            "bones",
            "orthopedic",
            "orthopedics",
            "orthopaedic",
            "joint",
            "joints",
            "fracture",
            "knee",
            "back pain",
            "shoulder pain",
            "arthritis",
            "muscle",
        ],

        dermatology: [
            "skin",
            "dermatology",
            "dermatologist",
            "rash",
            "acne",
            "pimples",
            "itching",
            "hair loss",
            "skin disease",
        ],

        gynecology: [
            "gynecology",
            "gynaecology",
            "gynecologist",
            "pregnancy",
            "period",
            "periods",
            "menstrual",
            "ovary",
            "ovarian",
            "uterus",
            "women health",
        ],

        pediatrics: [
            "child",
            "children",
            "baby",
            "pediatric",
            "pediatrics",
            "paediatric",
            "paediatrics",
            "kids",
        ],
    };

    // =====================================================
    // NORMALIZE TEXT
    // =====================================================

    const normalize = (value) => {
        return String(value || "")
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    };

    // =====================================================
    // FIND DEPARTMENT FROM USER MESSAGE
    // =====================================================

    const findDepartmentFromMessage = (message) => {
        const text = normalize(message);

        // First check the known medical terms
        for (const [department, terms] of Object.entries(
            medicalDepartments
        )) {
            for (const term of terms) {
                if (text.includes(term)) {
                    return department;
                }
            }
        }

        // Then check departments/specializations/keywords
        // already stored in the database
        for (const doctor of doctors) {
            const department = normalize(doctor.department);
            const specialization = normalize(doctor.specialization);
            const keywords = normalize(doctor.keywords);

            if (
                (department && text.includes(department)) ||
                (specialization && text.includes(specialization))
            ) {
                return department || specialization;
            }

            if (keywords) {
                const keywordList = keywords
                    .split(/[,;|]+/)
                    .map((item) => normalize(item))
                    .filter(Boolean);

                for (const keyword of keywordList) {
                    if (text.includes(keyword)) {
                        return department;
                    }
                }
            }
        }

        return null;
    };

    // =====================================================
    // FIND ACTUAL DOCTOR FROM DATABASE
    // =====================================================

    const findDoctor = (message, department) => {
        const text = normalize(message);

        let bestDoctor = null;
        let bestScore = 0;

        doctors.forEach((doctor) => {
            const doctorDepartment = normalize(doctor.department);
            const specialization = normalize(doctor.specialization);
            const keywords = normalize(doctor.keywords);

            let score = 0;

            // Department match
            if (
                department &&
                doctorDepartment.includes(department)
            ) {
                score += 20;
            }

            // Specialization match
            if (
                department &&
                specialization.includes(department)
            ) {
                score += 15;
            }

            // User message against specialization
            if (
                specialization &&
                text.includes(specialization)
            ) {
                score += 15;
            }

            // User message against department
            if (
                doctorDepartment &&
                text.includes(doctorDepartment)
            ) {
                score += 15;
            }

            // Doctor's manually configured keywords
            if (keywords) {
                const keywordList = keywords
                    .split(/[,;|]+/)
                    .map((item) => normalize(item))
                    .filter(Boolean);

                keywordList.forEach((keyword) => {
                    if (text.includes(keyword)) {
                        score += 10;
                    }
                });
            }

            if (score > bestScore) {
                bestScore = score;
                bestDoctor = doctor;
            }
        });

        return bestDoctor;
    };

    // =====================================================
    // DOCTOR RESPONSE
    // =====================================================

    const doctorResponse = (doctor) => {
        return (
            `👨‍⚕️ You may consult Dr. ${
                doctor.doctor_name
            }.\n\n` +
            `Specialization: ${
                doctor.specialization || "Specialist"
            }\n` +
            `Department: ${
                doctor.department || "Hospital Department"
            }\n\n` +
            `Please book an appointment for proper medical evaluation.`
        );
    };

    // =====================================================
    // MAIN REPLY
    // =====================================================

    const getReply = (text) => {
        const message = normalize(text);

        // Greeting
        if (
            message.includes("hello") ||
            message.includes("hi") ||
            message.includes("hey")
        ) {
            return "Hello! 👋 How can I help you today?";
        }

        // Show doctors
        if (
            message === "doctor" ||
            message === "doctors" ||
            message.includes("show doctors") ||
            message.includes("list doctors")
        ) {
            if (doctors.length === 0) {
                return "I couldn't load the doctors from the hospital database.";
            }

            return (
                "👨‍⚕️ Doctors available in AarogyaCare:\n\n" +
                doctors
                    .map(
                        (doctor) =>
                            `• Dr. ${doctor.doctor_name} — ${
                                doctor.specialization ||
                                "Specialist"
                            }`
                    )
                    .join("\n")
            );
        }

        // Show departments
        if (
            message === "department" ||
            message === "departments" ||
            message.includes("show departments")
        ) {
            const departments = [
                ...new Set(
                    doctors
                        .map((doctor) => doctor.department)
                        .filter(Boolean)
                ),
            ];

            if (departments.length === 0) {
                return "No departments are currently available.";
            }

            return (
                "🏥 Departments available:\n\n" +
                departments
                    .map((department) => `• ${department}`)
                    .join("\n")
            );
        }

        // Patient
        if (message.includes("patient")) {
            return "You can manage patient records from the Patients module.";
        }

        // Appointment
        if (message.includes("appointment")) {
            return "You can schedule and manage appointments from the Appointments module.";
        }

        // Admission
        if (message.includes("admission")) {
            return "You can manage hospital admissions from the Admissions module.";
        }

        // Pharmacy
        if (
            message.includes("pharmacy") ||
            message.includes("medicine")
        ) {
            return "You can manage medicines and pharmacy records from the Pharmacy module.";
        }

        // Laboratory
        if (
            message.includes("laboratory") ||
            message.includes("lab") ||
            message.includes("test")
        ) {
            return "You can manage laboratory tests and reports from the Laboratory module.";
        }

        // Billing
        if (
            message.includes("billing") ||
            message.includes("bill") ||
            message.includes("payment")
        ) {
            return "You can manage bills and payment records from the Billing module.";
        }

        // Help
        if (message.includes("help")) {
            return (
                "I can help you with Doctors, Patients, Appointments, " +
                "Admissions, Pharmacy, Laboratory and Billing.\n\n" +
                "You can also describe a health problem such as heart problems, " +
                "cancer, headache, skin problems or bone problems."
            );
        }

        // =================================================
        // MEDICAL DEPARTMENT MATCHING
        // =================================================

        const department = findDepartmentFromMessage(message);

        if (department) {
            const doctor = findDoctor(message, department);

            if (doctor) {
                return doctorResponse(doctor);
            }

            return (
                `🏥 Your description appears related to the ${
                    department
                } department.\n\n` +
                `Please check the Doctors module for available doctors.`
            );
        }

        // No match
        return (
            "I couldn't identify the appropriate department from that description.\n\n" +
            "Please try describing your problem using symptoms or medical terms.\n\n" +
            '👨‍⚕️ "Show doctors"\n' +
            '🏥 "Show departments"\n' +
            '📅 "Book an appointment"\n' +
            '👤 "Patient records"\n' +
            '💊 "Pharmacy"\n' +
            '🧪 "Laboratory"\n' +
            '💳 "Billing"'
        );
    };

    // =====================================================
    // SEND MESSAGE
    // =====================================================

    const sendMessage = () => {
        const text = input.trim();

        if (!text) {
            return;
        }

        const botReply = getReply(text);

        setMessages((previous) => [
            ...previous,
            {
                sender: "user",
                text: text,
            },
            {
                sender: "bot",
                text: botReply,
            },
        ]);

        setInput("");
    };

    // =====================================================
    // ENTER KEY
    // =====================================================

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    // =====================================================
    // UI — KEEPING YOUR EXISTING CSS
    // =====================================================

    return (
        <>
            <button
                className="chatbot-button"
                onClick={() => setIsOpen(!isOpen)}
                title="AarogyaCare Assistant"
            >
                {isOpen ? "✕" : "💬"}
            </button>

            {isOpen && (
                <div className="chatbot-window">

                    <div className="chatbot-header">

                        <div className="chatbot-title">

                            <div className="chatbot-avatar">
                                🤖
                            </div>

                            <div>
                                <h3>
                                    AarogyaCare Assistant
                                </h3>

                                <span>
                                    <i></i>
                                    Online
                                </span>
                            </div>

                        </div>

                        <button
                            className="chatbot-close"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </button>

                    </div>

                    <div className="chatbot-messages">

                        {messages.map((message, index) => (

                            <div
                                key={index}
                                className={`chat-message ${message.sender}`}
                            >

                                {message.sender === "bot" && (
                                    <div className="message-avatar">
                                        🤖
                                    </div>
                                )}

                                <div className="message-bubble">
                                    {message.text}
                                </div>

                            </div>

                        ))}

                    </div>

                    <div className="chatbot-input">

                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(event) =>
                                setInput(event.target.value)
                            }
                            onKeyDown={handleKeyDown}
                        />

                        <button
                            onClick={sendMessage}
                            title="Send message"
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